# dostavka.tj (MVP scaffold)

This repository is a **monorepo**:
- `apps/web` — Next.js (App Router) + Tailwind (PWA-ready UI)
- `apps/api` — FastAPI + PostgreSQL + Redis (OTP, rate-limit, order status)
- `infra/docker-compose.yml` — local dev stack (Postgres + Redis)

## Quick start (local)
### 1) Requirements
- Node.js 20+
- Python 3.11+
- Docker

### 2) Run DB/Redis
```bash
cd infra
docker compose up -d
```

### 3) API
```bash
cd apps/api
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

### 4) Web
```bash
cd apps/web
npm install
cp .env.example .env.local
npm run dev
```

Open:
- Web: http://localhost:3000
- API: http://localhost:8000/docs

## Deploy (recommended MVP)
- Web: Vercel (connect GitHub)
- API + Postgres: Render
- Redis: Upstash (or Render)

## Notes
UI layouts are based on provided PDF screens (restaurants list, restaurant menu, product, cart, order status, profile, orders). 
