from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.wishlist import WishlistItem
from app.models.user import User
from app.schemas.wishlist import WishlistItemIn, WishlistItemOut
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/wishlist", tags=["wishlist"])


@router.get("", response_model=list[WishlistItemOut])
def list_wishlist(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(WishlistItem)
        .filter(WishlistItem.user_id == current_user.id)
        .order_by(WishlistItem.created_at.desc())
        .all()
    )


@router.post("", response_model=WishlistItemOut, status_code=201)
def add_to_wishlist(
    payload: WishlistItemIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    existing = (
        db.query(WishlistItem)
        .filter(WishlistItem.user_id == current_user.id, WishlistItem.url == payload.url)
        .first()
    )
    if existing:
        return existing

    item = WishlistItem(user_id=current_user.id, **payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}", status_code=204)
def remove_from_wishlist(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = (
        db.query(WishlistItem)
        .filter(WishlistItem.id == item_id, WishlistItem.user_id == current_user.id)
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="Wishlist item not found")

    db.delete(item)
    db.commit()
