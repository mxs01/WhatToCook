"""OpenTelemetry setup for the FLUX worker API."""

from __future__ import annotations

from typing import Any

from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

_initialized = False


def setup_telemetry(
    *,
    enabled: bool,
    service_name: str,
    otlp_endpoint: str,
    app: Any,
) -> None:
    """Initialize telemetry and instrument FastAPI app when enabled."""
    global _initialized

    if not enabled:
        return

    if not _initialized:
        provider = TracerProvider(resource=Resource.create({"service.name": service_name}))
        exporter = OTLPSpanExporter(endpoint=otlp_endpoint, insecure=True)
        provider.add_span_processor(BatchSpanProcessor(exporter))
        trace.set_tracer_provider(provider)
        _initialized = True

    FastAPIInstrumentor.instrument_app(app)
