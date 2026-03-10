"""LLMPort — abstract interface for language model interactions."""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any, TypeVar

from pydantic import BaseModel

T = TypeVar("T", bound=BaseModel)


class LLMPort(ABC):
    """Port for all LLM interactions (text generation + vision)."""

    @abstractmethod
    async def generate(
        self,
        prompt: str,
        output_schema: type[T],
        *,
        system_prompt: str | None = None,
        temperature: float = 0.7,
        max_tokens: int = 4096,
    ) -> T:
        """Generate structured output from a text prompt.

        Args:
            prompt: The user prompt.
            output_schema: A Pydantic model class defining the expected output structure.
            system_prompt: Optional system prompt.
            temperature: Sampling temperature.
            max_tokens: Maximum tokens in the response.

        Returns:
            An instance of output_schema populated with the LLM response.
        """
        ...

    @abstractmethod
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
        """Analyze an image and return structured output.

        Args:
            image_bytes: Raw image bytes (JPEG/PNG).
            prompt: The prompt describing what to analyze.
            output_schema: A Pydantic model class for the expected output.
            system_prompt: Optional system prompt.
            temperature: Sampling temperature (lower for more deterministic).
            max_tokens: Maximum tokens in the response.

        Returns:
            An instance of output_schema populated with the analysis result.
        """
        ...

    @abstractmethod
    async def get_model_name(self) -> str:
        """Return the name/identifier of the current model."""
        ...

    @abstractmethod
    async def get_token_usage(self) -> dict[str, Any]:
        """Return token usage statistics from the last call, if available."""
        ...
