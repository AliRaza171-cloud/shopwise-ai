from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.sql import func
from app.database.base import Base


class WishlistItem(Base):
    __tablename__ = "wishlist_items"
    __table_args__ = (UniqueConstraint("user_id", "url", name="uq_user_wishlist_url"),)

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    rating = Column(Float, default=0)
    reviews = Column(Integer, default=0)
    url = Column(String, nullable=False)
    image_url = Column(String, default="")

    created_at = Column(DateTime(timezone=True), server_default=func.now())
