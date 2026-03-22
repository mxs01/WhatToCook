#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# debug-backend.sh — Start backend + worker without local infra containers
# =============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Ensure uv is on PATH
export PATH="$HOME/.local/bin:$HOME/.cargo/bin:$PATH"

if ! command -v uv &>/dev/null; then
    echo "uv not found. Run ./setup.sh first."
    exit 1
fi

# Ensure .env exists
if [ ! -f "$SCRIPT_DIR/.env" ]; then
    cp "$SCRIPT_DIR/.env.example" "$SCRIPT_DIR/.env"
    echo "Created .env from .env.example — edit it with your remote service URLs."
fi

# Load environment from .env (DATABASE_URL/REDIS_URL/S3_* should point to server)
set -a
# shellcheck source=/dev/null
source "$SCRIPT_DIR/.env"
set +a

require_secure_jwt_secret() {
    local secret="${JWT_SECRET_KEY:-}"

    if [ -z "$secret" ]; then
        echo "[security] JWT_SECRET_KEY is missing in .env"
        echo "[security] Refusing to start backend with insecure auth configuration."
        echo "[security] Set JWT_SECRET_KEY to a long random value."
        exit 1
    fi

    if [[ "$secret" == *"CHANGE_ME"* ]] || [[ "$secret" == "dev-only-insecure-secret-do-not-use-in-prod" ]]; then
        echo "[security] JWT_SECRET_KEY appears to be a placeholder/insecure value: $secret"
        echo "[security] Refusing to start backend with insecure auth configuration."
        echo "[security] Generate one with: python -c \"import secrets; print(secrets.token_urlsafe(64))\""
        exit 1
    fi

    if [ "${#secret}" -lt 32 ]; then
        echo "[security] JWT_SECRET_KEY is too short (minimum 32 characters)."
        echo "[security] Refusing to start backend with insecure auth configuration."
        exit 1
    fi
}

require_secure_jwt_secret

# Python 3.13 on macOS: ensure src is importable across subprocesses
export PYTHONPATH="$SCRIPT_DIR/backend/src${PYTHONPATH:+:$PYTHONPATH}"

BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[0;33m'
RESET='\033[0m'

prefix_output() {
    local label="$1" color="$2"
    while IFS= read -r line; do
        printf "${color}[%s]${RESET} %s\n" "$label" "$line"
    done
}

# Free backend port if occupied
pids=$(lsof -ti :8080 2>/dev/null || true)
if [ -n "$pids" ]; then
    echo -e "${YELLOW}[backend]${RESET} Killing stale process(es) on port 8080..."
    echo "$pids" | xargs kill -9 2>/dev/null || true
    sleep 0.5
fi

# Defaults for local dev convenience (can be overridden in .env)
export ENVIRONMENT="${ENVIRONMENT:-development}"
export DEBUG="${DEBUG:-true}"
export JWT_SECRET_KEY="${JWT_SECRET_KEY:-}"
export JWT_ALGORITHM="${JWT_ALGORITHM:-HS256}"
export JWT_ACCESS_TOKEN_EXPIRE_MINUTES="${JWT_ACCESS_TOKEN_EXPIRE_MINUTES:-120}"
export JWT_REFRESH_TOKEN_EXPIRE_DAYS="${JWT_REFRESH_TOKEN_EXPIRE_DAYS:-30}"
export LLM_PROVIDER="${LLM_PROVIDER:-mock}"
export EMBEDDING_PROVIDER="${EMBEDDING_PROVIDER:-mock}"

PIDS=()

cleanup() {
    echo ""
    echo "Shutting down..."
    for pid in "${PIDS[@]}"; do
        kill "$pid" 2>/dev/null || true
    done
    wait 2>/dev/null || true
    echo "Done."
}

trap cleanup EXIT INT TERM

if [ "${SKIP_MIGRATIONS:-false}" != "true" ]; then
    echo -e "${BLUE}[backend]${RESET} Running database migrations..."
    (cd "$SCRIPT_DIR/backend" && uv run alembic upgrade head) 2>&1 | prefix_output "migrate" "$CYAN"
else
    echo -e "${YELLOW}[backend]${RESET} Skipping migrations (SKIP_MIGRATIONS=true)."
fi

echo -e "${BLUE}[backend]${RESET} Starting on :8080 (auto-reload)..."
(cd "$SCRIPT_DIR/backend" && uv run uvicorn whattocook.main:app \
    --host 0.0.0.0 \
    --port 8080 \
    --reload \
    --reload-dir src \
    --log-level debug) 2>&1 | prefix_output "backend" "$BLUE" &
PIDS+=($!)

echo -e "${CYAN}[worker]${RESET} Starting background worker..."
(cd "$SCRIPT_DIR/backend" && uv run python -m whattocook.worker) 2>&1 | prefix_output "worker" "$CYAN" &
PIDS+=($!)

(
    until curl -sf http://localhost:8080/api/health >/dev/null 2>&1; do sleep 0.5; done
    echo ""
    echo -e "  ${BLUE}Backend API:${RESET}  http://localhost:8080"
    echo -e "  ${BLUE}Swagger UI:${RESET}  http://localhost:8080/docs"
    echo ""
    echo "  Using remote infra from .env (DATABASE_URL, REDIS_URL, S3_*)."
    echo "  Press Ctrl+C to stop backend + worker."
    echo ""
) &

wait
