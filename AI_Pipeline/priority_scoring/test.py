from AI_Pipeline.priority_scoring.ngo_priority import compute_ngo_priority_score
from datetime import datetime

sample_ngo = {
    "total_claims": 120,
    "successful_distributions": 100,
    "failed_cases": 20,
    "total_response_time": 420,
    "total_pickup_delay": 1500,
    "rating_sum": 180,
    "total_ratings": 40,
    "storage_facility_score": 0.7,
    "primary_service_radius_km": 8,
    "last_active_at": datetime(2026, 3, 20),
    "total_people_served": 5200
}

score = compute_ngo_priority_score(sample_ngo)
print("NGO Priority Score:", score)


sample_listing = {
    "safe_minutes_remaining": 40,
    "quantity_people_estimate": 60,
    "distance_km_from_ngo": 4.5,
    "packaging_type": "semi_covered",
    "time_since_posted_min": 10,
    "donor_reliability_score": 0.75
}

score = compute_listing_priority_score(sample_listing)

print("Listing Priority Score:", score)