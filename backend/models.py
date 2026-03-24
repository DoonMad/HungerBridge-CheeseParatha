from __future__ import annotations

from database import Base 
from sqlalchemy import Column, Integer, String , Float, ForeignKey, DateTime, Text, Boolean
from sqlalchemy.orm import relationship

from datetime import datetime

from utils import getuuid 



class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True, default=getuuid)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    name  = Column(String, index=True)
    role = Column(String, index=True) # comma-separated list

    @property
    def roles(self):
        return self.role.split(',') if self.role else []
    
    @roles.setter
    def roles(self, role_list):
        self.role = ",".join(role_list) if role_list else ""

    joined_at = Column(DateTime, default= datetime.utcnow)

    listings = relationship("Listing", back_populates="donor", 
                            foreign_keys="Listing.donor_id")
    
    latitude= Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    is_active = Column(Integer, default=0) # 1 only for volunteer


    total_claims = Column(Integer, default=0)
    successful_distributions = Column(Integer, default=0)
    failed_cases = Column(Integer, default=0)

   
    total_response_time = Column(Float, default=0.0)
    total_pickup_delay = Column(Float, default=0.0)

   
    beneficiary_rating = Column(Float, default=0.0)
    total_ratings = Column(Integer, default=0)

   
    storage_facility_score = Column(Float, default=0.0)
    primary_service_radius_km = Column(Float, default=5.0)

   
    last_active_at = Column(DateTime, default=datetime.utcnow)

   
    total_people_served = Column(Integer, default=0)

  
    hotspot_zone_score = Column(Float, default=0.0)


class Listing(Base):
    __tablename__ = "listings"

    id = Column(String, primary_key=True, index=True, default=getuuid)

    donor_id = Column(String, ForeignKey("users.id"), nullable=False)

    food_name = Column(String, nullable=False)
    food_desc = Column(String, nullable=True)
    food_qty = Column(Integer, nullable=False)
    food_type = Column(String, nullable=False) 
    food_is_veg = Column(Boolean, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    created_at = Column(DateTime, default= datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)  

    pickup_location = Column(String, server_default="Unknown Location")
    dropoff_location = Column(String, nullable=True)
    dropoff_lat = Column(Float, nullable=True)
    dropoff_lng = Column(Float, nullable=True)
    image_url = Column(String, nullable=True)

    status = Column(String, default="available") # available, claimed, expired    
    claimed_by = Column(String, ForeignKey("users.id"), nullable=True)
    base_time = Column(Integer, default=0) 
    package_type = Column(String, nullable=True) 
    donor = relationship("User",foreign_keys=[donor_id], back_populates="listings")

    volunteer_id = Column(String, ForeignKey("users.id"), nullable=True)
    volunteer = relationship("User", foreign_keys=[volunteer_id])
    refrigeration  = Column(Boolean, default=False)
    time_since_cooking = Column(Integer, default=0) 

    priority_score = Column(Float, nullable=True)
    is_escalated = Column(Integer, default=0)
    assigned_at = Column(DateTime, nullable=True)
    picked_up_at = Column(DateTime, nullable=True)


class Rating(Base):
    __tablename__ = "ratings"

    id = Column(String, primary_key=True, index=True, default=getuuid)

    from_user_id = Column(String, ForeignKey("users.id"), nullable=False)
    to_user_id = Column(String, ForeignKey("users.id"),nullable=False)

    listing_id = Column(String, ForeignKey("listings.id"), nullable=False)

    rating = Column(Integer,) # 1 to 5
    comment = Column(Text, nullable=True)

    created_at = Column(DateTime, default= datetime.utcnow)


class NgoApplication(Base):
    __tablename__ = "ngo_applications"

    id = Column(String, primary_key=True, index=True, default=getuuid)

    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    ngo_name = Column(String, nullable=False)
    ngo_desc = Column(Text, nullable=True)

    status = Column(String, default="pending") # pending, approved, rejected
    applied_at = Column(DateTime, default= datetime.utcnow)

    user = relationship("User", foreign_keys=[user_id])



