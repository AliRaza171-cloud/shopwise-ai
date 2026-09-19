def score_and_filter_by_price(
    products: list[dict],
    min_price: float | None,
    max_price: float | None,
) -> list[dict]:
    if min_price is None and max_price is None:
        for p in products:
            p["price_score"] = 0.5
        return products

    filtered = []
    for p in products:
        price = p["price"]

        if max_price is not None and price > max_price:
            continue
        if min_price is not None and price < min_price:
            continue

        if max_price is not None:
            p["price_score"] = round(price / max_price, 3)
        else:
            p["price_score"] = 0.5

        filtered.append(p)

    return filtered
