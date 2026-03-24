import math
from datetime import datetime

def compute_donor_reliability_score(donor):

    total_listings = max(donor["total_listings_posted"], 1)

    success_rate = donor["successful_pickups"] / total_listings
    cancellation_rate = donor["failed_or_cancelled_listings"] / total_listings

    # rating
    if donor["total_ratings"] > 0:
        avg_rating = donor["rating_sum"] / donor["total_ratings"]
        rating_score = avg_rating / 5
    else:
        rating_score = 0.6   # neutral default

    quantity_accuracy = donor["avg_quantity_accuracy_score"]

    days_inactive = (datetime.utcnow() - donor["last_active_at"]).days
    activity_score = math.exp(-days_inactive / 20)

    donor_score = (
        0.35 * success_rate +
        0.20 * rating_score +
        0.15 * quantity_accuracy +
        0.15 * activity_score +
        0.15 * (1 - cancellation_rate)
    )

    return round(donor_score, 4)