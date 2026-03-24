from pydantic import BaseModel, Field , ConfigDict
from datetime import datetime
from typing import Optional


class SpoilageRequest(BaseModel):
    food_type: str
    base_safe_time: float
    temperature_c: float
    humidity_percent: float
    time_since_cooked_min: float
    packaging_type: str
    sun_exposure: str
    quantity_kg: float

class UserBase(BaseModel): 
    model_config = ConfigDict(from_attributes=True)

    email: str
    name: str
    roles: list[str]
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_active: int = 0

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    reputation_score: Optional[float] = 0.0




class ListingBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    
    donor_id: str
    food_name: str
    food_desc: Optional[str] = None
    food_qty: int
    food_type: str
    food_is_veg: bool
    refrigeration: bool = False

    latitude: float
    longitude: float
    expires_at: datetime

class ListingCreate(ListingBase):
    pass

class ListingResponse(ListingBase):
    model_config = ConfigDict(from_attributes=True)
    id: str
    status: str
    claimed_by: Optional[str] = None
    volunteer_id: Optional[str] = None
    created_at: datetime


class RatingCreate(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    from_user_id: str
    to_user_id: str
    listing_id: str
    rating: int = Field(..., ge=1, le=5) # rating between 1 and 5
    comment: Optional[str] = None

class RatingResponse(RatingCreate):
    model_config = ConfigDict(from_attributes=True)
    id: str
    created_at: datetime

class NgoApplicationCreate(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    user_id: str
    ngo_name: str
    ngo_desc : Optional[str] = None

class NgoApplicationResponse(NgoApplicationCreate):
    model_config = ConfigDict(from_attributes=True)
    id : str
    status: str
    applied_at: datetime

