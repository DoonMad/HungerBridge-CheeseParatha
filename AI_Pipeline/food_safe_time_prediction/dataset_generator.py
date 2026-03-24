import random
import pandas as pd
import numpy as np

N_SAMPLES = 8000

food_base_time = {
    "rice_meal": 120,
    "biryani": 115,
    "fried_rice": 125,
    "dry_food_roti": 180,
    "bread_items": 170,
    "fried_snacks": 140,
    "samosa_kachori": 135,
    "curry_gravy": 100,
    "dal": 110,
    "paneer_dish": 95,
    "chicken_curry": 90,
    "fish_curry": 80,
    "noodles": 110,
    "pasta": 105,
    "dairy_sweets": 60,
    "milk_based_dessert": 55,
    "salad_cut_fruits": 70,
    "raw_vegetable_salad": 75,
    "bakery_cake": 85,
    "pizza": 95
}

packaging_penalty_range = {
    "sealed": (5, 10),
    "semi_covered": (15, 25),
    "open": (30, 45)
}

sun_exposure_temp_bonus = {
    "indoor_ac": (-4, -1),
    "indoor_no_ac": (0, 2),
    "outdoor_shaded": (2, 5),
    "outdoor_direct_sun": (5, 9)
}

data_rows = []

for _ in range(N_SAMPLES):

    food_type = random.choice(list(food_base_time.keys()))
    base_time = food_base_time[food_type]

    # environmental conditions
    temperature = round(random.uniform(24, 42), 1)
    humidity = round(random.uniform(35, 95), 1)

    time_since_cooked = random.randint(5, 150)

    packaging = random.choice(list(packaging_penalty_range.keys()))
    sun_exposure = random.choice(list(sun_exposure_temp_bonus.keys()))

    quantity_kg = round(random.uniform(3, 25), 1)

    # -----------------------------
    # EFFECTIVE TEMPERATURE
    # -----------------------------
    temp_bonus = random.uniform(*sun_exposure_temp_bonus[sun_exposure])
    effective_temp = temperature + temp_bonus

    # -----------------------------
    # DECAY COMPONENTS
    # -----------------------------
    temp_penalty = max(0, (effective_temp - 25)) * random.uniform(1.2, 2.2)
    humidity_penalty = max(0, (humidity - 50)) * random.uniform(0.3, 0.9)

    packaging_penalty = random.uniform(*packaging_penalty_range[packaging])

    # thermal mass effect (large quantity retains heat → more spoilage)
    quantity_penalty = quantity_kg * random.uniform(0.4, 0.9)

    # food risk adjustment
    high_risk_foods = ["fish_curry", "dairy_sweets", "milk_based_dessert"]
    if food_type in high_risk_foods:
        food_risk_penalty = random.uniform(8, 18)
    else:
        food_risk_penalty = random.uniform(0, 8)

    # -----------------------------
    # SAFE TIME CALCULATION
    # -----------------------------
    safe_remaining = (
        base_time
        - temp_penalty
        - humidity_penalty
        - packaging_penalty
        - quantity_penalty
        - food_risk_penalty
        - time_since_cooked
    )

    # add real-world noise
    noise = random.uniform(-8, 8)
    safe_remaining = safe_remaining + noise

    safe_remaining = max(0, round(safe_remaining, 1))

    data_rows.append([
        food_type,
        base_time,
        temperature,
        humidity,
        time_since_cooked,
        packaging,
        sun_exposure,
        quantity_kg,
        safe_remaining
    ])

columns = [
    "food_type",
    "base_safe_time",
    "temperature_c",
    "humidity_percent",
    "time_since_cooked_min",
    "packaging_type",
    "sun_exposure",
    "quantity_kg",
    "safe_minutes_remaining"
]

df = pd.DataFrame(data_rows, columns=columns)

df.to_csv("food_spoilage_dataset.csv", index=False)
