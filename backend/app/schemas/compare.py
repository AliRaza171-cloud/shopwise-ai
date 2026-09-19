from pydantic import BaseModel


class CompareProductIn(BaseModel):
    name: str
    price: float
    rating: float
    reviews: int
    url: str = ""
    trust_score: float = 0.0


class CompareRequest(BaseModel):
    products: list[CompareProductIn]


class CompareResponse(BaseModel):
    summary: str
