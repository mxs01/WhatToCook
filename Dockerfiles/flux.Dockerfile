FROM python:3.12-slim

WORKDIR /app

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Copy project files
COPY flux-worker/pyproject.toml flux-worker/uv.lock* ./

# Install dependencies (includes torch + diffusers)
RUN uv sync --frozen --no-dev 2>/dev/null || uv sync --no-dev

# Copy application code
COPY flux-worker/src ./src

ENV PYTHONPATH=/app/src
ENV PYTHONUNBUFFERED=1

EXPOSE 8100

CMD ["uvicorn", "flux_worker.main:app", "--host", "0.0.0.0", "--port", "8100"]
