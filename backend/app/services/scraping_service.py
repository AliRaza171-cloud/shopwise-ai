import requests
from app.core.config import APIFY_API_TOKEN, APIFY_ACTOR_ID


class ScrapingError(Exception):
    pass


def search_products(query: str, max_products: int = 30) -> list[dict]:
    """
    Calls the itclan-bd/daraz-product-scraper Apify actor synchronously
    and returns raw product dicts exactly as it outputs them.

    Confirmed real input schema:
      - country_domain (required): "bd" | "pk" | "np" | "mm" | "lk"
      - search_keywords (required): an ARRAY of strings
      - limitType / maxProducts: caps how many results come back
      - includeOutOfStock: whether to include sold-out listings
    """
    if not APIFY_API_TOKEN or not APIFY_ACTOR_ID:
        raise ScrapingError("APIFY_API_TOKEN or APIFY_ACTOR_ID is not set in .env")

    url = f"https://api.apify.com/v2/actors/{APIFY_ACTOR_ID}/run-sync-get-dataset-items"

    payload = {
        "country_domain": "pk",
        "search_keywords": [query],
        "includeOutOfStock": True,
        "limitType": "maxProducts",
        "maxProducts": max_products,
    }

    try:
        response = requests.post(
            url,
            params={"token": APIFY_API_TOKEN},
            json=payload,
            timeout=120,
        )
        if not response.ok:
            raise ScrapingError(f"Apify returned {response.status_code}: {response.text}")
    except requests.RequestException as e:
        raise ScrapingError(f"Apify request failed: {e}") from e

    data = response.json()

    if isinstance(data, dict) and data.get("status") == "NO_RESULTS":
        return []

    return data


def normalize_product(raw: dict) -> dict | None:
    """
    Confirmed real output fields: title, price (numeric, already the
    current/discounted price), rating, reviewCount, productUrl, imageUrl.
    """
    name = raw.get("title")
    price = raw.get("price")

    if not name or price is None:
        return None

    rating = raw.get("rating") or 0
    reviews = raw.get("reviewCount") or 0
    url = raw.get("productUrl") or ""
    image_url = raw.get("imageUrl") or ""

    return {
        "name": name,
        "price": float(price),
        "rating": float(rating),
        "reviews": int(reviews),
        "url": url,
        "image_url": image_url,
        "source": "Daraz",
    }
