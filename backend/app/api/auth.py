from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.user import User
from app.schemas.auth import SignupRequest, LoginRequest, GoogleAuthRequest, TokenResponse
from app.schemas.user import UserOut
from app.auth.hashing import hash_password, verify_password
from app.auth.jwt import create_access_token
from app.auth.oauth import verify_google_token
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def signup(payload: SignupRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists")

    user = User(
        name=payload.name,
        email=payload.email,
        hashed_password=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(user.id)
    return TokenResponse(access_token=token, user=UserOut.model_validate(user))


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()

    # Same error for "no such user" and "wrong password" — don't leak
    # which one it was, that helps attackers enumerate valid emails.
    invalid_credentials = HTTPException(status_code=401, detail="Incorrect email or password")

    if not user or not user.hashed_password:
        raise invalid_credentials
    if not verify_password(payload.password, user.hashed_password):
        raise invalid_credentials

    if not user.is_active:
        raise HTTPException(status_code=403, detail="This account has been deactivated")

    token = create_access_token(user.id)
    return TokenResponse(access_token=token, user=UserOut.model_validate(user))


@router.post("/google", response_model=TokenResponse)
def google_auth(payload: GoogleAuthRequest, db: Session = Depends(get_db)):
    try:
        idinfo = verify_google_token(payload.id_token)
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid Google token")

    google_id = idinfo["sub"]
    email = idinfo["email"]
    name = idinfo.get("name", email.split("@")[0])

    user = db.query(User).filter(User.google_id == google_id).first()

    if not user:
        # If someone already signed up with this email via password, link
        # the Google account to that same user instead of creating a duplicate.
        user = db.query(User).filter(User.email == email).first()
        if user:
            user.google_id = google_id
        else:
            user = User(name=name, email=email, google_id=google_id)
            db.add(user)
        db.commit()
        db.refresh(user)

    if not user.is_active:
        raise HTTPException(status_code=403, detail="This account has been deactivated")

    token = create_access_token(user.id)
    return TokenResponse(access_token=token, user=UserOut.model_validate(user))


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return current_user
