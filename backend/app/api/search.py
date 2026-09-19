from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas.search import SearchRequest, SearchResponse
from app.auth.dependencies import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.agents.orchestrator import run_shopping_search
from app.services.scraping_service import ScrapingError

router = APIRouter(prefix="/search", tags=["search"])


@router.post("", response_model=SearchResponse)
def search(
    payload: SearchRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not payload.query.strip():
        raise HTTPException(status_code=422, detail="Query cannot be empty")

    try:
        result = run_shopping_search(payload.query, current_user.id, db)
    except ScrapingError as e:
        raise HTTPException(status_code=502, detail=str(e))

    return result
