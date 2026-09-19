from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.search import SearchHistoryEntry
from app.models.user import User
from app.schemas.search import SearchHistoryOut
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/history", tags=["history"])


@router.get("", response_model=list[SearchHistoryOut])
def list_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(SearchHistoryEntry)
        .filter(SearchHistoryEntry.user_id == current_user.id)
        .order_by(SearchHistoryEntry.created_at.desc())
        .limit(50)
        .all()
    )
