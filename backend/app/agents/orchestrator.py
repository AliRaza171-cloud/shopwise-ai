import logging
from sqlalchemy.orm import Session
from app.agents import planner_agent, search_agent, price_agent, review_agent
from app.agents import recommendation_agent, memory_agent

logger = logging.getLogger("shopwise.orchestrator")


def run_shopping_search(query: str, user_id: int, db: Session) -> dict:
    parsed = planner_agent.parse_query(query)
    logger.info(f"[1/6] Planner parsed: {parsed}")

    candidates = search_agent.find_candidates(parsed)
    logger.info(f"[2/6] Search agent found {len(candidates)} normalized candidates "
                f"(category={parsed['category']})")

    priced = price_agent.score_and_filter_by_price(
        candidates, parsed["min_price"], parsed["max_price"]
    )
    logger.info(f"[3/6] Price agent kept {len(priced)} after budget filter "
                f"(min={parsed['min_price']}, max={parsed['max_price']})")

    reviewed = review_agent.score_trust(priced)
    logger.info(f"[4/6] Review agent scored {len(reviewed)} products")

    ranked = recommendation_agent.rank_products(reviewed)
    logger.info(f"[5/6] Ranked {len(ranked)} products")

    explanation = recommendation_agent.explain_top_pick(ranked, query)
    logger.info(f"[6/6] Explanation generated ({len(explanation)} chars)")

    memory_agent.record_interaction(db, user_id, query, parsed, len(ranked))

    return {
        "query": query,
        "parsed": parsed,
        "products": ranked,
        "recommendation": explanation,
    }
