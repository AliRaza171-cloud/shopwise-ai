from fastapi import APIRouter, Depends, HTTPException
from openai import OpenAI

from app.core.config import OPENAI_API_KEY, OPENAI_MODEL
from app.prompts.shopping_prompts import COMPARISON_SYSTEM_PROMPT
from app.schemas.compare import CompareRequest, CompareResponse
from app.auth.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/compare", tags=["compare"])
client = OpenAI(api_key=OPENAI_API_KEY)


@router.post("", response_model=CompareResponse)
def compare(payload: CompareRequest, current_user: User = Depends(get_current_user)):
    if len(payload.products) < 2:
        raise HTTPException(status_code=422, detail="Pick at least 2 products to compare")
    if len(payload.products) > 4:
        raise HTTPException(status_code=422, detail="Compare at most 4 products at a time")

    products_text = "\n".join(
        f"- {p.name} | Rs. {p.price:,.0f} | {p.rating}★ ({p.reviews} reviews) | "
        f"trust_score={p.trust_score}"
        for p in payload.products
    )

    response = client.chat.completions.create(
        model=OPENAI_MODEL,
        messages=[
            {"role": "system", "content": COMPARISON_SYSTEM_PROMPT},
            {"role": "user", "content": f"Products to compare:\n{products_text}"},
        ],
        temperature=0.4,
    )

    return CompareResponse(summary=response.choices[0].message.content.strip())
