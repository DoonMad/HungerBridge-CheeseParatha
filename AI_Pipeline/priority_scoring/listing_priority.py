import math

def compute_listing_priority_score(listing):
    """
    listing -> dict having required listing & donor fields
    returns priority score between 0 and 1
    """

    # =========================
    # 1️⃣ URGENCY SCORE
    # =========================
    safe_time = listing["safe_minutes_remaining"]

    if safe_time <= 0:
        urgency_score = 0
    else:
        # exponential urgency rise when safe time is low
        urgency_score = math.exp(-safe_time / 60)

    # =========================
    # 2️⃣ SOCIAL IMPACT SCORE
    # log scaling on people served
    # =========================
    people = listing["quantity_people_estimate"]
    impact_score = math.log1p(people) / 5
    impact_score = min(impact_score, 1)

    # =========================
    # 3️⃣ LOGISTICS FEASIBILITY
    # =========================
    distance = listing["distance_km_from_ngo"]

    # closer listings better
    distance_score = math.exp(-distance / 8)

    packaging = listing["packaging_type"]

    packaging_map = {
        "sealed": 1.0,
        "semi_covered": 0.7,
        "open": 0.4
    }

    packaging_score = packaging_map.get(packaging, 0.6)

    feasibility_score = 0.6 * distance_score + 0.4 * packaging_score

    # =========================
    # 4️⃣ DONOR TRUST SCORE
    # assumed already scaled 0–1
    # =========================
    donor_score = listing["donor_reliability_score"]

    # =========================
    # FINAL WEIGHTED SCORE
    # =========================
    priority_score = (
        0.35 * urgency_score +
        0.25 * impact_score +
        0.20 * feasibility_score +
        0.20 * donor_score
    )

    return round(priority_score, 4)