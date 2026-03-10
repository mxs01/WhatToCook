#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# setup.sh — Install dependencies and create virtual environments
# =============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=== WhatToCook Setup ==="
echo ""

# ─── Install uv ─────────────────────────────────────────────────────────────

if command -v uv &>/dev/null; then
    echo "uv already installed: $(uv --version)"
else
    echo "Installing uv..."
    curl -LsSf https://astral.sh/uv/install.sh | sh
    # Add to PATH for rest of this script
    export PATH="$HOME/.local/bin:$HOME/.cargo/bin:$PATH"
    echo "uv installed: $(uv --version)"
fi

# ─── Ensure .env exists ─────────────────────────────────────────────────────

if [ ! -f "$SCRIPT_DIR/.env" ]; then
    cp "$SCRIPT_DIR/.env.example" "$SCRIPT_DIR/.env"
    echo "Created .env from .env.example"
fi

# ─── Backend: create .venv and install dependencies ─────────────────────────

echo ""
echo "Setting up backend..."
(
    cd "$SCRIPT_DIR/backend"
    uv venv
    uv sync --dev
    echo "Backend ready: $(uv run python --version)"
)

# ─── Frontend: install node dependencies ────────────────────────────────────

echo ""
echo "Setting up frontend..."
(
    cd "$SCRIPT_DIR/frontend"
    npm install
)

# ─── Done ────────────────────────────────────────────────────────────────────

echo ""
echo "=== Setup complete ==="
echo ""
echo "  Backend venv:  backend/.venv"
echo "  Node modules:  frontend/node_modules"
echo ""
echo "  Run ./debug.sh to start developing."
echo ""
