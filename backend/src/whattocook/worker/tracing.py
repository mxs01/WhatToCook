"""Trace context helpers for queue payload propagation."""

from __future__ import annotations

from collections.abc import MutableMapping
from typing import Any

from opentelemetry.propagate import extract, inject


def inject_trace_context(payload: MutableMapping[str, Any]) -> None:
    """Inject current trace context into payload under a reserved key."""
    carrier: dict[str, str] = {}
    inject(carrier)
    if carrier:
        payload["trace_context"] = carrier


def extract_trace_context(payload: dict[str, Any]) -> Any:
    """Extract trace context from payload carrier when present."""
    carrier = payload.get("trace_context")
    if isinstance(carrier, dict):
        return extract(carrier)
    return extract({})
