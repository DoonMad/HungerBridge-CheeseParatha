from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models, schemas

import os
import joblib
import pandas as pd
from pydantic import BaseModel
import urllib.request
import json
from datetime import datetime, timezone
from AI_Pipeline.food_safe_time_prediction.llm_food_resolver import resolve_food_metadata
import google.generativeai as genai
import json
from dotenv import load_dotenv
import os
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AI_DIR = os.path.join(BASE_DIR, "AI_Pipeline", "food_safe_time_prediction")

model = joblib.load(os.path.join(AI_DIR, "spoilage_lightgbm.pkl"))
encoders = joblib.load(os.path.join(AI_DIR, "label_encoders.pkl"))

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/api/listings", response_model=list[schemas.ListingResponse])
def get_listings(db: Session = Depends(get_db)):
    return db.query(models.Listing).filter(models.Listing.status == "available").all()

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

@app.post("/api/listings/{listing_id}/claim")
def claim_listing(listing_id: str, volunteer_id: str, db: Session = Depends(get_db)):
    listing = db.query(models.Listing).filter(models.Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    if listing.status != "available":
        raise HTTPException(status_code=400, detail="Listing already claimed or expired")
    
    listing.status = "claimed"
    listing.claimed_by = volunteer_id
    listing.volunteer_id = volunteer_id
    db.commit()
    db.refresh(listing)
    return {"message": "Listing claimed successfully", "listing": listing.id}





def get_risk_label(minutes):
    if minutes > 90:
        return "LOW"
    elif minutes > 45:
        return "MEDIUM"
    else:
        return "HIGH"

@app.post("/predict-spoilage")
def predict_spoilage(data: schemas.SpoilageRequest):

    meta = resolve_food_metadata(data.food_type)

    base_time = meta["base_safe_time"]

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

   
    pred = model.predict(df)[0]

    return {
        "predicted_safe_minutes": round(float(pred), 2),
        "risk_level": get_risk_label(pred),
        "base_time_used": base_time,
        "base_time_source": meta["source"]
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

