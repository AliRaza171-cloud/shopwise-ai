import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.base import Base
from app.database.connection import engine
from app.api import auth as auth_router
from app.api import users as users_router
from app.api import search as search_router
from app.api import compare as compare_router
from app.api import wishlist as wishlist_router
from app.api import history as history_router
from app.api import admin as admin_router
from app.core.config import DATABASE_URL, ALLOWED_ORIGINS

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(name)s: %(message)s")

# Masks the password when logging so it's safe to look at, but still shows
# enough to tell whether .env actually loaded or we fell back to the
# hardcoded default in config.py.
_masked_url = DATABASE_URL
if "@" in _masked_url and "//" in _masked_url:
    prefix, rest = _masked_url.split("//", 1)
    creds, host_part = rest.split("@", 1)
    user = creds.split(":")[0]
    _masked_url = f"{prefix}//{user}:****@{host_part}"
logging.getLogger("shopwise.startup").info(f"Using DATABASE_URL: {_masked_url}")

# Creates tables from your models if they don't exist yet.
# Fine for early development — once you're past Phase 1, switch to
# Alembic migrations (backend/alembic/) instead of this, so schema
# changes are tracked and reversible.
Base.metadata.create_all(bind=engine)

app = FastAPI(title="ShopWise AI", version="0.1.0")

# Allows the Next.js frontend to call this API. In development this is
# just localhost:3000 (config.py's default); in production, set
# ALLOWED_ORIGINS in your environment to your real Vercel URL.
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(users_router.router)
app.include_router(search_router.router)
app.include_router(compare_router.router)
app.include_router(wishlist_router.router)
app.include_router(history_router.router)
app.include_router(admin_router.router)


@app.get("/")
def root():
    return {"status": "ShopWise AI backend is running"}
