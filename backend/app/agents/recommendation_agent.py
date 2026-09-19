from openai import OpenAI
from app.core.config import OPENAI_API_KEY, OPENAI_MODEL
from app.prompts.shopping_prompts import RECOMMENDATION_SYSTEM_PROMPT

client = OpenAI(api_key=OPENAI_API_KEY)


def rank_products(products: list[dict]) -> list[dict]:
    for p in products:
        p["overall_score"] = round(
            0.65 * p.get("trust_score", 0) + 0.35 * p.get("price_score", 0), 3
        )
    return sorted(products, key=lambda p: p["overall_score"], reverse=True)


def explain_top_pick(ranked_products: list[dict], original_query: str) -> str:
    if not ranked_products:
        return "No matching products were found for this search."

    shortlist = ranked_products[:3]
    shortlist_text = "\n".join(
        f"- {p['name']} | Rs. {p['price']:,.0f} | {p['rating']}★ "
        f"({p['reviews']} reviews) | trust_score={p['trust_score']}"
        for p in shortlist
    )

    user_message = (
        f"User's request: \"{original_query}\"\n\n"
        f"Shortlist (already ranked, best first):\n{shortlist_text}"
    )

    response = client.chat.completions.create(
        model=OPENAI_MODEL,
        messages=[
            {"role": "system", "content": RECOMMENDATION_SYSTEM_PROMPT},
            {"role": "user", "content": user_message},
        ],
        temperature=0.4,
    )

    return response.choices[0].message.content.strip()
