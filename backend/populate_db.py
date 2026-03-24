from database import SessionLocal, engine, Base
import models
from datetime import datetime, timedelta

Base.metadata.create_all(bind=engine)

db = SessionLocal()

existing_user = db.query(models.User).first()
if not existing_user:
    donor = models.User(
        name="Spice Route Hotel",
        role="donor",
        latitude=12.9716,
        longitude=77.5946,
        is_active=1
    )
    volunteer = models.User(
        name="John Volunteer",
        role="volunteer",
        latitude=12.9720,
        longitude=77.5950,
        is_active=1
    )
    db.add(donor)
    db.add(volunteer)
    db.commit()
    db.refresh(donor)
    db.refresh(volunteer)

    listing1 = models.Listing(
        donor_id=donor.id,
        food_name="Veg Biryani & Mix Raita",
        food_desc="Delicious vegetarian biryani",
        food_qty=5,
        food_type="biryani",
        food_is_veg=True,
        latitude=12.9716,
        longitude=77.5946,
        expires_at=datetime.utcnow() + timedelta(hours=2),
        status="available",
        package_type="sealed",
        refrigeration=False,
        time_since_cooking=120
    )
    listing2 = models.Listing(
        donor_id=donor.id,
        food_name="Chicken Curry & Rice Combo",
        food_desc="Spicy chicken curry",
        food_qty=10,
        food_type="chicken_curry",
        food_is_veg=False,
        latitude=12.9716,
        longitude=77.5946,
        expires_at=datetime.utcnow() + timedelta(hours=1),
        status="available",
        package_type="semi_covered",
        refrigeration=True,
        time_since_cooking=60
    )
    db.add(listing1)
    db.add(listing2)
    db.commit()
    print("Dummy data populated successfully.")
else:
    print("Database already populated.")

db.close()
