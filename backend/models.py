from __future__ import annotations

from database import Base 
from sqlalchemy import Column, Integer, String , Float, ForeignKey, DateTime, Text, Boolean
from sqlalchemy.orm import relationship

from datetime import datetime

from utils import getuuid 



class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True, default=getuuid)
    name  = Column(String, index=True)
    role = Column(String, index=True) # donot ya ngo ya volunteer

    joined_at = Column(DateTime, default= datetime.utcnow)

    listings = relationship("Listing", back_populates="donor", 
                            foreign_keys="Listing.donor_id")
    
    latitude= Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    is_active = Column(Integer, default=0) # 1 only for volunteer

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

    status = Column(String, default="available") # available, claimed, expired    
    claimed_by = Column(String, ForeignKey("users.id"), nullable=True)
    base_time = Column(Integer, default=0) 
    package_type = Column(String, nullable=True) 
    donor = relationship("User",foreign_keys=[donor_id], back_populates="listings")

    volunteer_id = Column(String, ForeignKey("users.id"), nullable=True)
    volunteer = relationship("User", foreign_keys=[volunteer_id])

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



