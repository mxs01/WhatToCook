"""OpenTelemetry setup and instrumentation for backend services."""

from __future__ import annotations

from typing import Any

from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.httpx import HTTPXClientInstrumentor
from opentelemetry.instrumentation.redis import RedisInstrumentor
from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from sqlalchemy.ext.asyncio import AsyncEngine

from whattocook.config import Settings

_initialized = False
_sqlalchemy_instrumented = False


def setup_telemetry(
    settings: Settings, app: Any | None = None, engine: AsyncEngine | None = None
) -> None:
    """Initialize OpenTelemetry provider and optional app/engine instrumentation."""
    global _initialized, _sqlalchemy_instrumented

    if not settings.otel_enabled:
        return

    if not _initialized:
        resource = Resource.create({"service.name": settings.otel_service_name})
        provider = TracerProvider(resource=resource)
        exporter = OTLPSpanExporter(
            endpoint=settings.otel_exporter_otlp_endpoint,
            insecure=True,
        )
        provider.add_span_processor(BatchSpanProcessor(exporter))
        trace.set_tracer_provider(provider)
        HTTPXClientInstrumentor().instrument()
        RedisInstrumentor().instrument()
        _initialized = True

    if app is not None:
        FastAPIInstrumentor.instrument_app(app)

    if engine is not None and not _sqlalchemy_instrumented:
        SQLAlchemyInstrumentor().instrument(engine=engine.sync_engine)
        _sqlalchemy_instrumented = True
