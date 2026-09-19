from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
from app.database.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)

    # nullable because Google-signup users won't have a local password
    hashed_password = Column(String, nullable=True)

    # set only for users who signed up via "Continue with Google"
    google_id = Column(String, unique=True, nullable=True, index=True)

    is_admin = Column(Boolean, default=False, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    # Stored preference only — there's no email-sending system built yet,
    # so this doesn't cause any emails to go out. It's here so that piece
    # can be wired up later without another schema change.
    email_notifications = Column(Boolean, default=True, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
