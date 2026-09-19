import re
import json
import logging
import requests
from app.core.config import SHOPIFY_STORES

logger = logging.getLogger("shopwise.shopify_service")

REQUEST_TIMEOUT = 8


def fetch_store_products(domain: str, limit: int = 250) -> list[dict]:
    """
    Every standard Shopify store publicly exposes /products.json — it's
    what the storefront itself uses, not a workaround. No auth, no
    scraping actor, no cost. Returns the raw Shopify product objects.
    """
    url = f"https://{domain}/products.json"
    try:
        response = requests.get(url, params={"limit": limit}, timeout=REQUEST_TIMEOUT)
        response.raise_for_status()
        return response.json().get("products", [])
    except requests.RequestException as e:
        logger.warning(f"Shopify fetch failed for {domain}: {e}")
        return []


def filter_by_keywords(products: list[dict], query: str) -> list[dict]:
    """Simple case-insensitive title match — products.json has no search param."""
    terms = [t.lower() for t in query.split() if t]
    if not terms:
        return products

    matched = []
    for p in products:
        title = (p.get("title") or "").lower()
        product_type = (p.get("product_type") or "").lower()
        haystack = f"{title} {product_type}"
        if any(term in haystack for term in terms):
            matched.append(p)
    return matched


def _extract_rating_from_html(html: str) -> tuple[float, int]:
    """
    Looks for schema.org Product structured data (a <script
    type="application/ld+json"> block) embedded in the page, which many
    review apps (Judge.me, Loox, Yotpo, etc.) inject for SEO regardless
    of which specific widget they use. Falls back to (0, 0) — meaning
    "no rating data found" — if the store doesn't have one, which is
    honest: we don't invent a rating that isn't there.
    """
    scripts = re.findall(
        r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
        html,
        re.DOTALL,
    )

    for block in scripts:
        try:
            data = json.loads(block.strip())
        except (json.JSONDecodeError, ValueError):
            continue

        candidates = data if isinstance(data, list) else [data]
        for entry in candidates:
            if not isinstance(entry, dict):
                continue
            if entry.get("@type") != "Product":
                continue
            agg = entry.get("aggregateRating")
            if agg and isinstance(agg, dict):
                try:
                    rating = float(agg.get("ratingValue", 0))
                    reviews = int(agg.get("reviewCount") or agg.get("ratingCount") or 0)
                    return rating, reviews
                except (TypeError, ValueError):
                    continue

    return 0.0, 0


def enrich_with_rating(product_url: str) -> tuple[float, int]:
    """Fetches a single product page and tries to pull a real rating from it."""
    try:
        response = requests.get(product_url, timeout=REQUEST_TIMEOUT)
        response.raise_for_status()
        return _extract_rating_from_html(response.text)
    except requests.RequestException:
        return 0.0, 0


def normalize_shopify_product(raw: dict, domain: str) -> dict | None:
    """Maps a raw Shopify product onto our internal shape (rating/reviews
    filled in separately by enrich_with_rating, defaulting to 0/0)."""
    name = raw.get("title")
    variants = raw.get("variants") or []
    handle = raw.get("handle")

    if not name or not variants or not handle:
        return None

    price = variants[0].get("price")
    if price is None:
        return None

    images = raw.get("images") or []
    image_url = images[0].get("src") if images else ""

    return {
        "name": name,
        "price": float(price),
        "rating": 0.0,
        "reviews": 0,
        "url": f"https://{domain}/products/{handle}",
        "image_url": image_url,
        "source": next((s["name"] for s in SHOPIFY_STORES if s["domain"] == domain), domain),
    }


def search_shopify_stores(
    query: str,
    stores: list[dict] | None = None,
    max_per_store: int = 8,
    enrich_ratings: bool = True,
) -> list[dict]:
    """
    Searches every configured Shopify store for the query, normalizes
    results, and (best-effort) enriches the top candidates with real
    ratings scraped from each product's page.

    Rating enrichment costs one extra HTTP request per product, so it's
    capped by max_per_store to keep response time reasonable — this is
    slower than the Apify-backed Daraz search by design.
    """
    stores = stores if stores is not None else SHOPIFY_STORES
    results = []

    for store in stores:
        raw_products = fetch_store_products(store["domain"])
        matched = filter_by_keywords(raw_products, query)[:max_per_store]

        for raw in matched:
            product = normalize_shopify_product(raw, store["domain"])
            if product is None:
                continue

            if enrich_ratings:
                rating, reviews = enrich_with_rating(product["url"])
                product["rating"] = rating
                product["reviews"] = reviews

            results.append(product)

    return results
