from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests as google_requests
from app.core.config import GOOGLE_CLIENT_ID


def verify_google_token(token: str) -> dict:
    idinfo = google_id_token.verify_oauth2_token(
        token, google_requests.Request(), GOOGLE_CLIENT_ID
    )
    if idinfo.get("iss") not in ("accounts.google.com", "https://accounts.google.com"):
        raise ValueError("Invalid token issuer")
    return idinfo
