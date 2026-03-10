"""LocalVLLM adapter — LLM port implementation for local vLLM server (OpenAI-compatible)."""

from __future__ import annotations

import base64
import hashlib
import time
from typing import Any, TypeVar

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI
from pydantic import BaseModel

from whattocook.config import Settings
from whattocook.ports.llm import LLMPort

T = TypeVar("T", bound=BaseModel)


class LocalVLLMAdapter(LLMPort):
    """LLM adapter using a local vLLM server with OpenAI-compatible API."""

    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._model_name = settings.vllm_model_name
        self._client = ChatOpenAI(
            base_url=settings.vllm_base_url,
            api_key=settings.vllm_api_key,
            model=settings.vllm_model_name,
        )
        self._last_usage: dict[str, Any] = {}

    async def generate(
        self,
        prompt: str,
        output_schema: type[T],
        *,
        system_prompt: str | None = None,
        temperature: float = 0.7,
        max_tokens: int = 4096,
    ) -> T:
        structured_llm = self._client.with_structured_output(output_schema)

        messages = []
        if system_prompt:
            messages.append(SystemMessage(content=system_prompt))
        messages.append(HumanMessage(content=prompt))

        start = time.monotonic()
        result = await structured_llm.ainvoke(
            messages,
            config={"configurable": {"temperature": temperature, "max_tokens": max_tokens}},
        )
        latency_ms = int((time.monotonic() - start) * 1000)

        self._last_usage = {
            "latency_ms": latency_ms,
            "prompt_hash": hashlib.sha256(prompt.encode()).hexdigest()[:16],
        }

        return result  # type: ignore[return-value]

    async def analyze_image(
        self,
        image_bytes: bytes,
        prompt: str,
        output_schema: type[T],
        *,
        system_prompt: str | None = None,
        temperature: float = 0.3,
        max_tokens: int = 4096,
    ) -> T:
        structured_llm = self._client.with_structured_output(output_schema)

        image_b64 = base64.b64encode(image_bytes).decode("utf-8")

        messages = []
        if system_prompt:
            messages.append(SystemMessage(content=system_prompt))

        messages.append(
            HumanMessage(
                content=[
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/jpeg;base64,{image_b64}"},
                    },
                    {"type": "text", "text": prompt},
                ]
            )
        )

        start = time.monotonic()
        result = await structured_llm.ainvoke(
            messages,
            config={"configurable": {"temperature": temperature, "max_tokens": max_tokens}},
        )
        latency_ms = int((time.monotonic() - start) * 1000)

        self._last_usage = {
            "latency_ms": latency_ms,
            "prompt_hash": hashlib.sha256(prompt.encode()).hexdigest()[:16],
        }

        return result  # type: ignore[return-value]

    async def get_model_name(self) -> str:
        return self._model_name

    async def get_token_usage(self) -> dict[str, Any]:
        return self._last_usage
