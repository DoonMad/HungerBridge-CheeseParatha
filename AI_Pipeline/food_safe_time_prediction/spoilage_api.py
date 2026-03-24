from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd

# =========================
# LOAD MODEL + ENCODERS
# =========================
model = joblib.load("spoilage_lightgbm.pkl")
encoders = joblib.load("label_encoders.pkl")

# =========================
# FASTAPI APP
# =========================
app = FastAPI(
    title="HungerBridge Spoilage Prediction API",
    version="1.0"
)

# =========================
# REQUEST SCHEMA
# =========================
class SpoilageRequest(BaseModel):
    food_type: str
    base_safe_time: float
    temperature_c: float
    humidity_percent: float
    time_since_cooked_min: float
    packaging_type: str
    sun_exposure: str
    quantity_kg: float

# =========================
# RISK CLASS FUNCTION
# =========================
def get_risk_label(minutes):
    if minutes > 90:
        return "LOW"
    elif minutes > 45:
        return "MEDIUM"
    else:
        return "HIGH"

# =========================
# PREDICTION ENDPOINT
# =========================
@app.post("/predict-spoilage")
def predict_spoilage(data: SpoilageRequest):

    df = pd.DataFrame([data.dict()])

    # apply same encoders
    for col, le in encoders.items():
        df[col] = le.transform(df[col])

    pred = model.predict(df)[0]
    risk = get_risk_label(pred)

    return {
        "predicted_safe_minutes": round(float(pred), 2),
        "risk_level": risk
    }