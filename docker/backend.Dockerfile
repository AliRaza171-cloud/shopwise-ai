# Backend Dockerfile — FastAPI app, run from repo root:
#   docker build -f docker/backend.Dockerfile -t shopwise-backend ./backend

FROM python:3.12-slim

WORKDIR /app

# Install dependencies first (separate layer) so Docker can cache this
# step and skip reinstalling when only app code changes, not requirements.
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/app ./app

# Render (and most PaaS platforms) inject the actual port via $PORT —
# default to 8000 for local/docker-compose use.
ENV PORT=8000
EXPOSE 8000

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT}"]
