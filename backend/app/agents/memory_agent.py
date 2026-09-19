import logging
from sqlalchemy.orm import Session
from app.models.search import SearchHistoryEntry

logger = logging.getLogger("shopwise.memory_agent")


def record_interaction(
    db: Session,
    user_id: int,
    query: str,
    parsed: dict,
    product_count: int,
) -> None:
    entry = SearchHistoryEntry(
        user_id=user_id,
        query=query,
        search_keywords=parsed.get("search_keywords", ""),
        min_price=parsed.get("min_price"),
        max_price=parsed.get("max_price"),
        result_count=product_count,
    )
    db.add(entry)
    db.commit()

    logger.info(f"user_id={user_id} searched '{query}' — {product_count} results returned")
