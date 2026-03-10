# WhatToCook

Snap a photo of your fridge and get instant AI-generated recipes from the ingredients you already have. The system detects ingredients from the image using a vision model, retrieves relevant recipe knowledge via RAG (pgvector), generates personalized recipes with an LLM, and creates dish images using FLUX dev.

## Architecture

Clean Architecture with Ports and Adapters pattern. All external services (LLM, embedding, image generation, storage, vector search, job queue) are accessed through abstract port interfaces, with swappable adapter implementations.

```
analyze_image → normalize_ingredients → retrieve_context → generate_recipe → generate_image_prompt → create_image → persist
```

### Tech Stack

| Layer | Technology |
|---|---|
| Backend API | FastAPI |
| Agent orchestration | LangChain + LangGraph (7-node linear pipeline) |
| LLM (dev) | vLLM (OpenAI-compatible, gpt-oss-120b) |
| LLM (prod) | Gemini 2.5 Pro / Flash |
| Image generation | FLUX dev via custom FastAPI wrapper |
| RAG / Vector search | PostgreSQL + pgvector |
| Object storage | MinIO (dev) / S3 (prod) |
| Job queue | Redis |
| Database | PostgreSQL with Alembic migrations |
| Frontend | React + Vite + TypeScript + Tailwind CSS |
| Auth | JWT (bcrypt + python-jose) |

### Project Structure

```
WhatToCook/
├── backend/
│   ├── src/whattocook/
│   │   ├── main.py                 # FastAPI entrypoint
│   │   ├── config.py               # Pydantic settings
│   │   ├── dependencies.py         # DI wiring (ports → adapters)
│   │   ├── domain/                 # Domain models & exceptions
│   │   ├── ports/                  # 6 abstract interfaces (ABCs)
│   │   ├── adapters/               # Concrete implementations
│   │   │   ├── llm/                # LocalVLLM, Gemini
│   │   │   ├── embedding/          # LocalVLLM, Gemini
│   │   │   ├── image_generation/   # FluxDev
│   │   │   ├── storage/            # S3Compatible (MinIO/S3)
│   │   │   ├── vector_search/      # PgVector
│   │   │   └── job_queue/          # Redis
│   │   ├── agent/                  # LangGraph pipeline (7 nodes)
│   │   ├── api/                    # FastAPI routers & schemas
│   │   ├── db/                     # SQLAlchemy models, session, repositories
│   │   └── worker/                 # Background job processor
│   ├── alembic/                    # Database migrations
│   ├── scripts/                    # Seed script for RAG data
│   └── tests/                      # Unit + integration tests
├── flux-worker/                    # Separate FLUX image generation service
│   └── src/flux_worker/
├── frontend/                       # React dev UI
│   └── src/
├── Dockerfiles/                    # backend, worker, frontend, flux
├── docker-compose.yml
├── .env.example
└── .dockerignore
```

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose v2
- [uv](https://docs.astral.sh/uv/) (for local backend development outside Docker)
- [Node.js 22+](https://nodejs.org/) (for local frontend development outside Docker)
- A running vLLM instance (dev) or Gemini API key (prod) for LLM inference
- (Optional) NVIDIA GPU + drivers for FLUX image generation

## Quick Start

### 1. Clone and configure

```bash
git clone <repo-url> && cd WhatToCook
cp .env.example .env
```

Edit `.env` and set at minimum:

- `JWT_SECRET_KEY` — generate with `python -c "import secrets; print(secrets.token_urlsafe(32))"`
- `LLM_PROVIDER` / `EMBEDDING_PROVIDER` — `local_vllm` (default) or `gemini`
- If using Gemini: set `GEMINI_API_KEY`
- If using local vLLM: ensure `VLLM_BASE_URL` points to your vLLM server

### 2. Start services

```bash
# Core services (no GPU required)
docker compose up -d

# With FLUX image generation (requires NVIDIA GPU)
docker compose --profile gpu up -d
```

This starts:

| Service | Port | Description |
|---|---|---|
| `backend` | 8080 | FastAPI API (auto-runs Alembic migrations) |
| `worker` | — | Background job processor (Redis polling) |
| `frontend` | 3000 | React dev UI (Vite with HMR) |
| `postgres` | 5432 | PostgreSQL + pgvector |
| `redis` | 6379 | Job queue |
| `minio` | 9000 / 9001 | Object storage (API / Console) |
| `flux-worker` | 8100 | FLUX image generation (GPU profile only) |

### 3. Seed the RAG database

Load sample recipes into pgvector for retrieval-augmented generation:

```bash
docker compose exec backend python -m scripts.seed_recipes
```

### 4. Use the app

- **Frontend**: http://localhost:3000
- **API docs**: http://localhost:8080/docs (Swagger, dev only)
- **MinIO console**: http://localhost:9001 (login: `minioadmin` / `minioadmin`)

#### Workflow

1. Register an account and log in
2. Upload a photo of your fridge
3. The system detects ingredients, retrieves recipe context via RAG, and generates personalized recipes with AI-created dish images
4. Browse your generated recipes

## Local Development (without Docker)

### Backend

```bash
cd backend
uv sync                    # Install dependencies
uv run alembic upgrade head  # Run migrations (requires running Postgres)
uv run uvicorn whattocook.main:app --host 0.0.0.0 --port 8080 --reload
```

### Worker

```bash
cd backend
uv run python -m whattocook.worker
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Infrastructure only

Start just the databases/services without the application containers:

```bash
docker compose up -d postgres redis minio minio-init
```

## Testing

```bash
cd backend
uv sync --dev              # Install dev dependencies
uv run pytest              # Run all tests
uv run pytest tests/unit   # Unit tests only
uv run pytest tests/integration  # Integration tests only
uv run pytest --cov=whattocook   # With coverage
```

Tests use mock implementations of all 6 ports — no running LLM, database, or external services required.

## Database Migrations

```bash
cd backend

# Create a new migration after changing db/models.py
uv run alembic revision --autogenerate -m "description"

# Apply pending migrations
uv run alembic upgrade head

# Rollback one migration
uv run alembic downgrade -1
```

## Environment Variables

See `.env.example` for the full list. Key variables:

| Variable | Default | Description |
|---|---|---|
| `ENVIRONMENT` | `development` | `development` / `staging` / `production` |
| `DATABASE_URL` | `...localhost:5432/whattocook` | PostgreSQL connection string |
| `REDIS_URL` | `redis://localhost:6379/0` | Redis connection string |
| `JWT_SECRET_KEY` | `CHANGE_ME...` | Secret for JWT signing |
| `LLM_PROVIDER` | `local_vllm` | `local_vllm` or `gemini` |
| `EMBEDDING_PROVIDER` | `local_vllm` | `local_vllm` or `gemini` |
| `GEMINI_API_KEY` | — | Required if using Gemini provider |
| `FLUX_WORKER_URL` | `http://localhost:8100` | FLUX image generation endpoint |
| `S3_ENDPOINT_URL` | `http://localhost:9000` | MinIO/S3 endpoint |

## Production Deployment

The application is designed to run on a single VPS with Docker Compose and Caddy as a reverse proxy:

```bash
# On your VPS
docker compose up -d
# Configure Caddy to reverse proxy ports 8080 (API) and 3000 (frontend)
```

Set `ENVIRONMENT=production` in `.env` to disable Swagger docs and enable production settings.
