from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class AdminUserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    is_admin: bool
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class AdminUserUpdate(BaseModel):
    """Only the fields an admin is allowed to change about another user."""
    is_admin: Optional[bool] = None
    is_active: Optional[bool] = None


class AdminStatsOut(BaseModel):
    total_users: int
    total_searches: int
    total_wishlist_items: int
    admin_count: int


class AdminSearchOut(BaseModel):
    id: int
    user_id: int
    user_email: EmailStr
    query: str
    result_count: int
    created_at: datetime

    class Config:
        from_attributes = True
