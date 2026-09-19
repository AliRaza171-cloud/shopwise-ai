# Frontend Dockerfile — Next.js app, run from repo root:
#   docker build -f docker/frontend.Dockerfile -t shopwise-frontend ./frontend
#
# NOTE ON DEPLOYMENT: if deploying to Vercel, Vercel does NOT use this
# file — it builds Next.js directly with its own optimized pipeline.
# This Dockerfile exists for local dev parity (docker-compose) and for
# deploying the frontend anywhere else that runs plain containers
# (Render, Fly.io, your own server), demonstrating the containerization
# practice even where the chosen host doesn't require it.

# ---- deps: install dependencies ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install

# ---- builder: build the app ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY frontend/ .
RUN npm run build

# ---- runner: minimal production image ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
