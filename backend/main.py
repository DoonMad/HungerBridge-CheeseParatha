from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models, schemas

import os
import joblib
import pandas as pd
from pydantic import BaseModel

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AI_DIR = os.path.join(BASE_DIR, "AI_Pipeline", "food_safe_time_prediction")

model = joblib.load(os.path.join(AI_DIR, "spoilage_lightgbm.pkl"))
encoders = joblib.load(os.path.join(AI_DIR, "label_encoders.pkl"))

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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
    db_listing = models.Listing(**listing.model_dump())
    db.add(db_listing)
    db.commit()
    db.refresh(db_listing)
    return db_listing

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
def predict_spoilage(data: SpoilageRequest):
    df = pd.DataFrame([data.model_dump()])
    for col, le in encoders.items():
        df[col] = le.transform(df[col])
    pred = model.predict(df)[0]
    return {
        "predicted_safe_minutes": round(float(pred), 2),
        "risk_level": get_risk_label(pred)
    }

