from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.jwt import decode_access_token
from app.models.user import User

# Reads the "Authorization: Bearer <token>" header automatically and
# raises a 403 for us if it's missing entirely.
bearer_scheme = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    """
    Drop this into any route that requires login:

        @router.get("/me")
        def me(current_user: User = Depends(get_current_user)):
            return current_user

    FastAPI runs this before the route body, so the route only ever
    executes for a valid, logged-in user.
    """
    token = credentials.credentials
    payload = decode_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == int(user_id)).first()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User no longer exists",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Checked here (not just at login) so a deactivation by an admin takes
    # effect immediately, even against a token issued before the change.
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated",
        )

    return user


def get_current_admin_user(current_user: User = Depends(get_current_user)) -> User:
    """
    Drop this into any admin-only route instead of get_current_user:

        @router.get("/admin/users")
        def list_users(admin: User = Depends(get_current_admin_user)):
            ...

    Runs get_current_user first (so login is still required), then
    additionally checks the admin flag.
    """
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user
