from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class UserOut(BaseModel):
    """
    Public-facing shape of a User. Deliberately excludes hashed_password
    and google_id — never send those to the frontend.
    """
    id: int
    name: str
    email: EmailStr
    is_admin: bool
    is_active: bool
    email_notifications: bool

    class Config:
        from_attributes = True  # lets this be built directly from a SQLAlchemy User object


class UserUpdate(BaseModel):
    """Fields a user is allowed to edit about themselves via PATCH /users/me."""
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    email_notifications: Optional[bool] = None


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8, max_length=128)
