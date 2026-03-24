import math
from datetime import datetime

def compute_ngo_priority_score(ngo):
    """
    ngo -> dict / ORM object having required fields
    returns priority score between 0 and 1
    """

    total_claims = max(ngo["total_claims"], 1)


    success_rate = ngo["successful_distributions"] / total_claims


    avg_response_time = ngo["total_response_time"] / total_claims
    response_score = math.exp(-avg_response_time / 10)

    avg_pickup_delay = ngo["total_pickup_delay"] / total_claims
    pickup_score = math.exp(-avg_pickup_delay / 30)

    if ngo["total_ratings"] > 0:
        avg_rating = ngo["rating_sum"] / ngo["total_ratings"]
        rating_score = avg_rating / 5
    else:
        rating_score = 0.5   # neutral default

    days_inactive = (datetime.utcnow() - ngo["last_active_at"]).days
    activity_score = math.exp(-days_inactive / 15)


    impact_score = math.log1p(ngo["total_people_served"]) / 10
    impact_score = min(impact_score, 1)


    storage_score = ngo["storage_facility_score"]

    priority_score = (
        0.25 * success_rate +
        0.15 * response_score +
        0.15 * pickup_score +
        0.10 * rating_score +
        0.10 * activity_score +
        0.15 * impact_score +
        0.10 * storage_score
    )

    return round(priority_score, 4)