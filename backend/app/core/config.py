import os
from dotenv import load_dotenv

load_dotenv()

# --- Database ---
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg://postgres:postgres@localhost:5432/shopwise_db")

# --- JWT ---
JWT_SECRET = os.getenv("JWT_SECRET", "change-this-secret-in-production")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# --- Google OAuth ---
# Get this from Google Cloud Console > APIs & Services > Credentials
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")

# --- OpenAI (powers the shopping agents) ---
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

# --- Apify (real Daraz product data) ---
APIFY_API_TOKEN = os.getenv("APIFY_API_TOKEN", "")
APIFY_ACTOR_ID = os.getenv("APIFY_ACTOR_ID", "")

# --- Fashion/perfume sources (Shopify stores, public products.json) ---
# Add more real Pakistani Shopify stores here as you verify them —
# each just needs to be a real, live Shopify domain.
SHOPIFY_STORES = [
    {"name": "Limelight", "domain": "www.limelight.pk"},
    {"name": "J.", "domain": "www.junaidjamshed.com"},
    # Sapphire (pk.sapphireonline.pk) removed — confirmed via browser that
    # /products.json returns 404 there. This is very likely a deliberate
    # block on Sapphire's end (some Shopify merchants disable this
    # endpoint specifically to stop competitor/dropshipping scraper
    # tools), not a bug in our code. Add it back if they ever change that.
]

# --- CORS ---
# Comma-separated list of allowed frontend origins. Defaults to local dev;
# set this in production (e.g. Render's environment variables) to your
# real Vercel URL, like: https://your-app.vercel.app
ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
    if origin.strip()
]
