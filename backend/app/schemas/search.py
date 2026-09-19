from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class SearchRequest(BaseModel):
    query: str


class ParsedQueryOut(BaseModel):
    search_keywords: str
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    notes: str = ""
    category: str = "general"  # "general" (routes to Daraz) or "fashion" (routes to Shopify stores)


class ProductResult(BaseModel):
    name: str
    price: float
    rating: float
    reviews: int
    url: str
    image_url: str
    price_score: float
    trust_score: float
    overall_score: float
    source: str = "Daraz"


class SearchResponse(BaseModel):
    query: str
    parsed: ParsedQueryOut
    products: list[ProductResult]
    recommendation: str


class SearchHistoryOut(BaseModel):
    id: int
    query: str
    search_keywords: str
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    result_count: int
    created_at: datetime

    class Config:
        from_attributes = True
