from pydantic import BaseModel
from datetime import datetime


class WishlistItemIn(BaseModel):
    name: str
    price: float
    rating: float = 0
    reviews: int = 0
    url: str
    image_url: str = ""


class WishlistItemOut(BaseModel):
    id: int
    name: str
    price: float
    rating: float
    reviews: int
    url: str
    image_url: str
    created_at: datetime

    class Config:
        from_attributes = True
