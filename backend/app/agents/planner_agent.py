import json
from openai import OpenAI
from app.core.config import OPENAI_API_KEY, OPENAI_MODEL
from app.prompts.shopping_prompts import PLANNER_SYSTEM_PROMPT

client = OpenAI(api_key=OPENAI_API_KEY)


def parse_query(query: str) -> dict:
    """
    Turns "gaming laptop under 150000" into:
    {"search_keywords": "gaming laptop", "min_price": None, "max_price": 150000,
     "notes": "", "category": "general"}

    "category" decides which source search_agent hits: "general" -> Daraz,
    "fashion" -> the configured Shopify stores (clothing/perfume).
    """
    response = client.chat.completions.create(
        model=OPENAI_MODEL,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": PLANNER_SYSTEM_PROMPT},
            {"role": "user", "content": query},
        ],
        temperature=0,
    )

    raw = response.choices[0].message.content
    parsed = json.loads(raw)

    category = parsed.get("category", "general")
    if category not in ("general", "fashion"):
        category = "general"

    return {
        "search_keywords": parsed.get("search_keywords") or query,
        "min_price": parsed.get("min_price"),
        "max_price": parsed.get("max_price"),
        "notes": parsed.get("notes", ""),
        "category": category,
    }
