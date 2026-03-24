import os
import json
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")

BASE_SAFE_TIME_MAP = {
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

def resolve_food_metadata(food_name: str):

    key = food_name.lower().replace(" ", "_")

    if key in BASE_SAFE_TIME_MAP:
        return {
            "base_safe_time": BASE_SAFE_TIME_MAP[key],
            "source": "rule_base"
        }

    prompt = f"""
    You are a food safety assistant.

    For the food item: "{food_name}"

    Estimate safe consumption window in minutes if kept at room temperature in India.

    Respond ONLY JSON:
    {{
        "base_safe_time": 90
    }}
    """

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        json_start = text.find("{")
        json_data = json.loads(text[json_start:])
        json_data["source"] = "llm"
        return json_data

    except Exception:
        return {
            "base_safe_time": 90,
            "source": "fallback"
        }

print(resolve_food_metadata("cheese paratha"))