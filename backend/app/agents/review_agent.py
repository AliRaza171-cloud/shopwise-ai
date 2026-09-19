import math


def score_trust(products: list[dict]) -> list[dict]:
    """
    rating * log10(reviews + 10) — rewards both a high rating and a large
    review count, with diminishing returns on review count. Products with
    0 rating/0 reviews (e.g. Shopify stores with no review app) correctly
    score 0 here — they're not penalized as "bad", just unranked by trust,
    and recommendation_agent's prompt is told to describe this honestly
    rather than imply something negative.
    """
    for p in products:
        rating = p.get("rating", 0)
        reviews = p.get("reviews", 0)
        p["trust_score"] = round(rating * math.log10(reviews + 10), 3)

    return products
