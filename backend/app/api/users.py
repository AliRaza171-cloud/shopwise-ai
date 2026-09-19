from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User
from app.schemas.user import UserOut, UserUpdate, ChangePasswordRequest
from app.auth.dependencies import get_current_user
from app.auth.hashing import hash_password, verify_password

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserOut)
def get_my_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch("/me", response_model=UserOut)
def update_my_profile(
    payload: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Only touch fields the user actually sent — PATCH means partial update,
    # so leaving a field out of the request should leave it unchanged.
    if payload.name is not None:
        current_user.name = payload.name

    if payload.email is not None and payload.email != current_user.email:
        existing = db.query(User).filter(User.email == payload.email).first()
        if existing:
            raise HTTPException(status_code=400, detail="That email is already in use")
        current_user.email = payload.email

    if payload.email_notifications is not None:
        current_user.email_notifications = payload.email_notifications

    db.commit()
    db.refresh(current_user)
    return current_user


@router.post("/me/change-password", status_code=204)
def change_password(
    payload: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not current_user.hashed_password:
        raise HTTPException(
            status_code=400,
            detail="This account signed up with Google and has no password to change",
        )

    if not verify_password(payload.current_password, current_user.hashed_password):
        raise HTTPException(status_code=401, detail="Current password is incorrect")

    current_user.hashed_password = hash_password(payload.new_password)
    db.commit()
