import os
import json
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI   
from langchain_core.prompts import PromptTemplate
load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    api_key=os.getenv("GEMINI_API_KEY")
)


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



food_prompt = PromptTemplate(
    input_variables=["food_name"],
    template="""
You are a food safety expert working in India.

Food item: {food_name}

Estimate safe consumption window (in minutes) at normal room temperature.

Guidelines:
- Dry foods last longer (120–180 min)
- Rice meals medium (90–130 min)
- Curry/gravy medium-low (70–110 min)
- Dairy / sweets high risk (40–80 min)
- Raw salad low (50–90 min)

Return ONLY valid JSON.

Example format:
{{
"base_safe_time": <number>
}}
"""
    )

def resolve_food_metadata(food_name: str):

    key = food_name.lower().replace(" ", "_")

    if key in BASE_SAFE_TIME_MAP:
        return {
            "base_safe_time": BASE_SAFE_TIME_MAP[key],
            "source": "rule_base"
        }

    prompt_text = food_prompt.format(food_name=food_name)

    try:
        response = llm.invoke(prompt_text)

        text = response.content.strip()
        text = text.replace("```json", "").replace("```", "").strip()

        import json
        data = json.loads(text)

        data["source"] = "llm"
        return data

    except Exception as e:
        print("LLM error:", e)
        return {
            "base_safe_time": 90,
            "source": "fallback"
        }

print(resolve_food_metadata("cheese paratha"))