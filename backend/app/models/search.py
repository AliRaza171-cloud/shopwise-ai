from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database.base import Base


class SearchHistoryEntry(Base):
    __tablename__ = "search_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    query = Column(String, nullable=False)
    search_keywords = Column(String, default="")
    min_price = Column(Float, nullable=True)
    max_price = Column(Float, nullable=True)
    result_count = Column(Integer, default=0)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
