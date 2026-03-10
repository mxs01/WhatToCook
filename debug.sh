#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# debug.sh — Start infrastructure + backend + frontend for local development
# =============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ─── Ensure uv is on PATH ───────────────────────────────────────────────────

export PATH="$HOME/.local/bin:$HOME/.cargo/bin:$PATH"

if ! command -v uv &>/dev/null; then
    echo "uv not found. Run ./setup.sh first."
    exit 1
fi

# ─── Ensure .env exists ─────────────────────────────────────────────────────

if [ ! -f "$SCRIPT_DIR/.env" ]; then
    cp "$SCRIPT_DIR/.env.example" "$SCRIPT_DIR/.env"
    echo "Created .env from .env.example — edit it if needed."
fi

# ─── Colors for log prefixes ────────────────────────────────────────────────

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
RESET='\033[0m'

prefix_output() {
    local label="$1" color="$2"
    while IFS= read -r line; do
        printf "${color}[%s]${RESET} %s\n" "$label" "$line"
    done
}

# ─── Free ports 8080 and 3000 if occupied ────────────────────────────────────

for port in 8080 3000; do
    pids=$(lsof -ti :"$port" 2>/dev/null || true)
    if [ -n "$pids" ]; then
        echo -e "${YELLOW}[infra]${RESET} Killing stale process(es) on port $port..."
        echo "$pids" | xargs kill -9 2>/dev/null || true
        sleep 0.5
    fi
done

# ─── Start infrastructure containers ────────────────────────────────────────

echo -e "${YELLOW}[infra]${RESET} Starting Docker infrastructure (postgres, redis, minio)..."
docker compose -f "$SCRIPT_DIR/docker-compose.yml" up -d postgres redis minio minio-init

echo -e "${YELLOW}[infra]${RESET} Waiting for services to be healthy..."
until docker compose -f "$SCRIPT_DIR/docker-compose.yml" exec -T postgres pg_isready -U whattocook -q 2>/dev/null; do
    sleep 1
done
echo -e "${YELLOW}[infra]${RESET} Postgres ready."

until docker compose -f "$SCRIPT_DIR/docker-compose.yml" exec -T redis redis-cli ping 2>/dev/null | grep -q PONG; do
    sleep 1
done
echo -e "${YELLOW}[infra]${RESET} Redis ready."

echo -e "${YELLOW}[infra]${RESET} Infrastructure ready."

# ─── Environment ─────────────────────────────────────────────────────────────

export ENVIRONMENT=development
export DEBUG=true

# Database (assumes Docker Compose postgres on default port)
export DATABASE_URL="postgresql+asyncpg://whattocook:whattocook_dev@localhost:5432/whattocook"

# Redis
export REDIS_URL="redis://localhost:6379/0"

# JWT — generate a stable dev secret so tokens survive restarts
export JWT_SECRET_KEY="dev-only-insecure-secret-do-not-use-in-prod"
export JWT_ALGORITHM="HS256"
export JWT_ACCESS_TOKEN_EXPIRE_MINUTES=120
export JWT_REFRESH_TOKEN_EXPIRE_DAYS=30

# LLM — use mock provider for local dev (no GPU / real LLM needed)
export LLM_PROVIDER="mock"
export VLLM_BASE_URL="http://localhost:8000/v1"
export VLLM_MODEL_NAME="gpt-oss-120b"
export VLLM_API_KEY="not-needed"

# Embedding — use mock provider for local dev
export EMBEDDING_PROVIDER="mock"
export VLLM_EMBEDDING_MODEL_NAME="text-embedding-model"
export VLLM_EMBEDDING_BASE_URL="http://localhost:8000/v1"

# Image generation
export FLUX_WORKER_URL="http://localhost:8100"

# Object storage (MinIO)
export S3_ENDPOINT_URL="http://localhost:9000"
export S3_ACCESS_KEY_ID="minioadmin"
export S3_SECRET_ACCESS_KEY="minioadmin"
export S3_BUCKET_NAME="whattocook"
export S3_REGION="us-east-1"
export S3_USE_PATH_STYLE="true"

# ─── Cleanup on exit ────────────────────────────────────────────────────────

PIDS=()

cleanup() {
    echo ""
    echo "Shutting down..."
    for pid in "${PIDS[@]}"; do
        kill "$pid" 2>/dev/null || true
    done
    wait 2>/dev/null || true
    echo "Stopping Docker infrastructure..."
    docker compose -f "$SCRIPT_DIR/docker-compose.yml" stop postgres redis minio
    echo "Done."
}

trap cleanup EXIT INT TERM

# ─── Fix Python 3.13 .pth hidden-flag issue (macOS) ─────────────────────────
# Python 3.13 skips .pth files with the macOS UF_HIDDEN flag, which uv/hatchling
# sets on editable-install .pth files. Export PYTHONPATH so the package is
# importable in all subprocesses (uvicorn reloader, worker, alembic).

export PYTHONPATH="$SCRIPT_DIR/backend/src${PYTHONPATH:+:$PYTHONPATH}"

# ─── Run migrations ─────────────────────────────────────────────────────────

echo -e "${BLUE}[backend]${RESET} Running database migrations..."
(cd "$SCRIPT_DIR/backend" && uv run alembic upgrade head) 2>&1 | prefix_output "migrate" "$CYAN"

# ─── Start backend ──────────────────────────────────────────────────────────

echo -e "${BLUE}[backend]${RESET} Starting on :8080 (auto-reload)..."
(cd "$SCRIPT_DIR/backend" && uv run uvicorn whattocook.main:app \
    --host 0.0.0.0 \
    --port 8080 \
    --reload \
    --reload-dir src \
    --log-level debug) 2>&1 | prefix_output "backend" "$BLUE" &
PIDS+=($!)

# ─── Start worker ───────────────────────────────────────────────────────────

echo -e "${CYAN}[worker]${RESET} Starting background worker..."
(cd "$SCRIPT_DIR/backend" && uv run python -m whattocook.worker) 2>&1 | prefix_output "worker" "$CYAN" &
PIDS+=($!)

# ─── Start frontend ─────────────────────────────────────────────────────────

echo -e "${GREEN}[frontend]${RESET} Starting on :3000 (HMR)..."
(cd "$SCRIPT_DIR/frontend" && npm run dev) 2>&1 | prefix_output "frontend" "$GREEN" &
PIDS+=($!)

# ─── Wait for servers to be reachable, then print URLs ──────────────────────

(
    until curl -sf http://localhost:8080/api/health >/dev/null 2>&1; do sleep 0.5; done
    until curl -sf http://localhost:3000 >/dev/null 2>&1; do sleep 0.5; done

    echo ""
    echo -e "  ${BLUE}Backend API:${RESET}  http://localhost:8080"
    echo -e "  ${BLUE}Swagger UI:${RESET}  http://localhost:8080/docs"
    echo -e "  ${GREEN}Frontend:${RESET}    http://localhost:3000"
    echo -e "  ${YELLOW}MinIO:${RESET}       http://localhost:9001"
    echo ""
    echo "  Press Ctrl+C to stop all services."
    echo ""
) &

wait
