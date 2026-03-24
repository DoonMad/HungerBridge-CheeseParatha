from fastapi import FastAPI, Depends, HTTPException, UploadFile, File
from fastapi.staticfiles import StaticFiles
import uuid
import shutil
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models, schemas
from routers import auth, users

import os
import sys

import joblib

import pandas as pd
from pydantic import BaseModel
import urllib.request
import json

from datetime import datetime, timezone

# Add parent directory to sys.path to import AI_Pipeline
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from AI_Pipeline.food_safe_time_prediction.llm_food_resolver import resolve_food_metadata
import google.generativeai as genai
import json

from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AI_DIR = os.path.join(BASE_DIR, "AI_Pipeline", "food_safe_time_prediction")

# Add AI_Pipeline parent to python path so we can import from it
sys.path.insert(0, BASE_DIR)

# Gracefully load AI model and LLM resolver
model = None
encoders = None
resolve_food_metadata = None
try:
    import joblib
    model = joblib.load(os.path.join(AI_DIR, "spoilage_lightgbm.pkl"))
    encoders = joblib.load(os.path.join(AI_DIR, "label_encoders.pkl"))
    print("✅ AI spoilage model loaded successfully.")
except Exception as e:
    print(f"⚠️ AI model not loaded (server will still run): {e}")

try:
    from AI_Pipeline.food_safe_time_prediction.llm_food_resolver import resolve_food_metadata
    print("✅ LLM food resolver loaded successfully.")
except Exception as e:
    print(f"⚠️ LLM food resolver not available: {e}")


models.Base.metadata.create_all(bind=engine)

app = FastAPI()

UPLOAD_DIR = os.path.join(BASE_DIR, "backend", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def ensure_utc(listings):
    for l in listings:
        if l.expires_at and l.expires_at.tzinfo is None:
            l.expires_at = l.expires_at.replace(tzinfo=timezone.utc)
        if hasattr(l, 'created_at') and l.created_at and l.created_at.tzinfo is None:
            l.created_at = l.created_at.replace(tzinfo=timezone.utc)
    return listings

@app.get("/api/listings", response_model=list[schemas.ListingResponse])
def get_listings(db: Session = Depends(get_db)):
    return ensure_utc(db.query(models.Listing).filter(models.Listing.status == "available").all())

@app.get("/api/listings/donor/{donor_id}", response_model=list[schemas.ListingResponse])
def get_donor_listings(donor_id: str, db: Session = Depends(get_db)):
    return ensure_utc(db.query(models.Listing).filter(models.Listing.donor_id == donor_id).order_by(models.Listing.created_at.desc()).all())

@app.get("/api/listings/ngo/{ngo_id}", response_model=list[schemas.ListingResponse])
def get_ngo_listings(ngo_id: str, db: Session = Depends(get_db)):
    return ensure_utc(db.query(models.Listing).filter(models.Listing.claimed_by == ngo_id).order_by(models.Listing.created_at.desc()).all())

@app.get("/api/listings/volunteer/available", response_model=list[schemas.ListingResponse])
def get_volunteer_available_listings(db: Session = Depends(get_db)):
    # available for volunteer means the NGO has claimed it, but no volunteer accepts it yet
    return ensure_utc(db.query(models.Listing).filter(models.Listing.status == "claimed").order_by(models.Listing.created_at.desc()).all())

@app.get("/api/listings/volunteer/{volunteer_id}", response_model=list[schemas.ListingResponse])
def get_volunteer_listings(volunteer_id: str, db: Session = Depends(get_db)):
    return ensure_utc(db.query(models.Listing).filter(models.Listing.volunteer_id == volunteer_id).order_by(models.Listing.created_at.desc()).all())

@app.post("/api/upload")
async def upload_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    ext = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {"image_url": f"/uploads/{filename}"}

@app.post("/api/listings", response_model=schemas.ListingResponse)
def create_listing(listing: schemas.ListingCreate, db: Session = Depends(get_db)):
    # Auto-create donor user if they don't exist (for mock auth flow)
    existing_user = db.query(models.User).filter(models.User.id == listing.donor_id).first()
    if not existing_user:
        new_user = models.User(id=listing.donor_id, name="Donor", role="donor")
        db.add(new_user)
        db.commit()

    try:
        db_listing = models.Listing(**listing.model_dump())
        db.add(db_listing)
        db.commit()
        db.refresh(db_listing)
        return db_listing
    except Exception as e:
        db.rollback()
        print(f"Error creating listing: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/listings/{listing_id}/ngo-claim")
def ngo_claim_listing(listing_id: str, ngo_id: str, self_pickup: bool = False, dropoff_location: str = None, db: Session = Depends(get_db)):
    listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    if listing.status != "available":
        raise HTTPException(status_code=400, detail="Listing already claimed or expired")
    
    listing.status = "completed" if self_pickup else "claimed"
    listing.claimed_by = ngo_id
    if dropoff_location:
        listing.dropoff_location = dropoff_location
    db.commit()
    db.refresh(listing)
    return {"message": "Listing claimed by NGO", "listing": listing.id}

@app.post("/api/listings/{listing_id}/volunteer-accept")
def volunteer_accept_listing(listing_id: str, volunteer_id: str, db: Session = Depends(get_db)):
    listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    if listing.status != "claimed":
        raise HTTPException(status_code=400, detail="Listing is not awaiting volunteer")
    
    listing.status = "volunteer_assigned"
    listing.volunteer_id = volunteer_id
    db.commit()
    db.refresh(listing)
    return {"message": "Listing accepted by volunteer", "listing": listing.id}

@app.post("/api/listings/{listing_id}/complete")
def complete_listing(listing_id: str, db: Session = Depends(get_db)):
    listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    listing.status = "completed"
    db.commit()
    return {"message": "Listing marked complete", "listing": listing.id}





def get_risk_label(minutes):
    if minutes > 90:
        return "LOW"
    elif minutes > 45:
        return "MEDIUM"
    else:
        return "HIGH"

@app.post("/predict-spoilage")
def predict_spoilage(data: schemas.SpoilageRequest):
    if model is None or encoders is None:
        raise HTTPException(status_code=503, detail="AI model not available. Install lightgbm and restart.")

    # Use LLM resolver if available, otherwise use the base_safe_time from the request
    base_time = data.base_safe_time
    meta_source = "request_default"
    if resolve_food_metadata is not None:
        try:
            meta = resolve_food_metadata(data.food_type)
            base_time = meta["base_safe_time"]
            meta_source = meta.get("source", "llm")
        except Exception as e:
            print(f"LLM resolver failed, using default base_safe_time: {e}")

    df = pd.DataFrame([data.model_dump()])
    df["base_safe_time"] = base_time

    for col, le in encoders.items():
        if col in df.columns:
            val = df[col].iloc[0]
            if val not in le.classes_:
                matched = False
                for cls in le.classes_:
                    if str(cls).lower() == str(val).lower():
                        df.loc[0, col] = cls
                        matched = True
                        break
                if not matched:
                    df.loc[0, col] = le.classes_[0]
            df[col] = le.transform(df[col])

    print(f"🔍 ML Input features: {df.to_dict(orient='records')[0]}")
    pred = model.predict(df)[0]
    print(f"🔍 ML Prediction: {pred} minutes | Risk: {get_risk_label(pred)}")

    return {
        "predicted_safe_minutes": round(float(pred), 2),
        "risk_level": get_risk_label(pred),
        "base_time_used": base_time,
        "base_time_source": meta_source
    }

def get_weather_and_sun(lat: float, lon: float):
    # Using the standard metric API endpoint
    api_key = os.getenv("OPENWEATHER_API_KEY")
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric"
    
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            
            temp_c = data["main"]["temp"]
            humidity = data["main"]["humidity"]
            clouds = data["clouds"]["all"]
            dt = data["dt"]
            sunrise = data["sys"]["sunrise"]
            sunset = data["sys"]["sunset"]
            
            # Simple algorithmic Sun Exposure rating
            if dt < sunrise or dt > sunset:
                sun_exposure = "None"
            elif clouds > 75:
                sun_exposure = "Low"
            elif clouds > 25:
                sun_exposure = "Medium"
            else:
                sun_exposure = "High"
                
            return {
                "temperature_c": temp_c,
                "humidity_percent": humidity,
                "sun_exposure": sun_exposure,
                "source": "live_api"
            }
    except Exception as e:
        print("Weather API error:", e)
        # Fallback values if API key is not set
        return {
            "temperature_c": 25.0,
            "humidity_percent": 60,
            "sun_exposure": "Medium",
            "source": "fallback"
        }

@app.get("/api/weather-context")
def weather_context_endpoint(lat: float, lon: float):
    return get_weather_and_sun(lat, lon)

