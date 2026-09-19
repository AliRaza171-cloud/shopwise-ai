from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User
from app.models.search import SearchHistoryEntry
from app.models.wishlist import WishlistItem
from app.schemas.admin import AdminUserOut, AdminUserUpdate, AdminStatsOut, AdminSearchOut
from app.auth.dependencies import get_current_admin_user

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/users", response_model=list[AdminUserOut])
def list_users(
    admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    return db.query(User).order_by(User.created_at.desc()).all()


@router.patch("/users/{user_id}", response_model=AdminUserOut)
def update_user(
    user_id: int,
    payload: AdminUserUpdate,
    admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    if user_id == admin.id and (payload.is_admin is False or payload.is_active is False):
        raise HTTPException(
            status_code=400,
            detail="You can't remove your own admin access or deactivate your own account",
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if payload.is_admin is not None:
        user.is_admin = payload.is_admin
    if payload.is_active is not None:
        user.is_active = payload.is_active

    db.commit()
    db.refresh(user)
    return user


@router.get("/stats", response_model=AdminStatsOut)
def get_stats(
    admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    return AdminStatsOut(
        total_users=db.query(User).count(),
        total_searches=db.query(SearchHistoryEntry).count(),
        total_wishlist_items=db.query(WishlistItem).count(),
        admin_count=db.query(User).filter(User.is_admin == True).count(),  # noqa: E712
    )


@router.get("/searches", response_model=list[AdminSearchOut])
def list_all_searches(
    admin: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db),
):
    rows = (
        db.query(SearchHistoryEntry, User.email)
        .join(User, User.id == SearchHistoryEntry.user_id)
        .order_by(SearchHistoryEntry.created_at.desc())
        .limit(100)
        .all()
    )

    return [
        AdminSearchOut(
            id=entry.id,
            user_id=entry.user_id,
            user_email=email,
            query=entry.query,
            result_count=entry.result_count,
            created_at=entry.created_at,
        )
        for entry, email in rows
    ]
