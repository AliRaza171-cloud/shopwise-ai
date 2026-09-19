from app.services.scraping_service import search_products, normalize_product
from app.services.shopify_service import search_shopify_stores


def find_candidates(parsed_query: dict, max_products: int = 30) -> list[dict]:
    """
    Fetches Daraz candidates always, and ALSO checks the configured
    Shopify boutique brands when the category is "fashion" — merging
    both rather than routing exclusively to one or the other.

    Why merge instead of routing exclusively: a boutique brand
    (Limelight, Sapphire, J.) sells at its own brand pricing, which is
    often higher than Daraz's many third-party sellers for the same
    category (e.g. budget perfumes). Sending fashion/perfume queries
    ONLY to boutique brands meant cheap, perfectly valid Daraz listings
    never got a chance to compete in the ranking. Both paths return the
    same normalized shape, so nothing downstream (price_agent,
    review_agent, recommendation_agent) needs to know which source a
    product came from.
    """
    daraz_raw = search_products(parsed_query["search_keywords"], max_products=max_products)
    daraz_products = []
    for raw in daraz_raw:
        product = normalize_product(raw)
        if product is not None:
            daraz_products.append(product)

    if parsed_query.get("category") == "fashion":
        shopify_products = search_shopify_stores(parsed_query["search_keywords"])
        return daraz_products + shopify_products

    return daraz_products
