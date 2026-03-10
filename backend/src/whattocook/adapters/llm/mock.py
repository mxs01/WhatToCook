"""Mock LLM adapter — returns deterministic responses for end-to-end testing."""

from __future__ import annotations

import logging
from typing import Any, TypeVar

from pydantic import BaseModel

from whattocook.ports.llm import LLMPort

T = TypeVar("T", bound=BaseModel)

logger = logging.getLogger(__name__)

# ── Schema name → fixed response data ──────────────────────────────────────

_MOCK_RESPONSES: dict[str, dict[str, Any]] = {
    "ImageAnalysisResult": {
        "ingredients": [
            {"name": "eggs", "confidence": 0.95},
            {"name": "milk", "confidence": 0.92},
            {"name": "cheddar cheese", "confidence": 0.90},
            {"name": "tomatoes", "confidence": 0.88},
            {"name": "lettuce", "confidence": 0.85},
            {"name": "chicken breast", "confidence": 0.82},
        ]
    },
    "NormalizedIngredients": {
        "ingredients": [
            "eggs",
            "milk",
            "cheddar cheese",
            "tomatoes",
            "romaine lettuce",
            "chicken breast",
        ]
    },
    "GeneratedRecipeOutput": {
        "title": "Cheesy Tomato & Chicken Omelette",
        "description": (
            "A fluffy omelette loaded with sautéed chicken, fresh tomatoes, "
            "and melted cheddar cheese, served with a crisp lettuce side salad."
        ),
        "ingredients": [
            {"name": "eggs", "amount": "3", "unit": "large"},
            {"name": "chicken breast", "amount": "100", "unit": "g"},
            {"name": "cheddar cheese", "amount": "50", "unit": "g"},
            {"name": "tomatoes", "amount": "1", "unit": "medium"},
            {"name": "milk", "amount": "2", "unit": "tbsp"},
            {"name": "romaine lettuce", "amount": "2", "unit": "leaves"},
            {"name": "olive oil", "amount": "1", "unit": "tbsp"},
            {"name": "salt", "amount": "1", "unit": "pinch"},
            {"name": "black pepper", "amount": "1", "unit": "pinch"},
        ],
        "instructions": [
            "Dice the chicken breast into small cubes and season with salt and pepper.",
            (
                "Heat olive oil in a non-stick skillet over medium-high heat "
                "and cook the chicken until golden, about 5 minutes. Set aside."
            ),
            "Dice the tomato and grate the cheddar cheese.",
            "Whisk the eggs with milk, salt, and pepper until frothy.",
            "Pour the egg mixture into the same skillet over medium heat.",
            (
                "When the edges begin to set, add the cooked chicken, "
                "diced tomatoes, and grated cheese to one half."
            ),
            "Fold the omelette in half and cook for another minute until the cheese melts.",
            "Slide onto a plate and serve with fresh romaine lettuce leaves on the side.",
        ],
        "prep_time_minutes": 10,
        "cook_time_minutes": 12,
        "servings": 1,
        "cuisine": "American",
        "difficulty": "easy",
    },
    "ImagePromptOutput": {
        "prompt": (
            "Professional food photography of a golden fluffy omelette on a white ceramic plate, "
            "filled with melted cheddar cheese, diced tomatoes, and sautéed chicken pieces. "
            "Garnished with fresh romaine lettuce on the side. Warm natural window light, "
            "shallow depth of field, top-down 45-degree angle, rustic wooden table background, "
            "soft shadows, appetizing and vibrant colors."
        )
    },
}


class MockLLMAdapter(LLMPort):
    """Mock LLM that returns fixed, deterministic responses.

    Maps the ``output_schema`` class name to a pre-built dict and
    instantiates the Pydantic model from it.  No network calls are made.
    """

    def __init__(self) -> None:
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
        return self._resolve(output_schema, prompt)

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
        return self._resolve(output_schema, prompt)

    async def get_model_name(self) -> str:
        return "mock"

    async def get_token_usage(self) -> dict[str, Any]:
        return self._last_usage

    # ── internals ───────────────────────────────────────────────────────

    def _resolve(self, output_schema: type[T], prompt: str) -> T:
        schema_name = output_schema.__name__
        data = _MOCK_RESPONSES.get(schema_name)
        if data is None:
            raise ValueError(
                f"MockLLMAdapter has no canned response for schema '{schema_name}'. "
                f"Known schemas: {list(_MOCK_RESPONSES.keys())}"
            )
        logger.info("MockLLM returning canned response for %s", schema_name)
        self._last_usage = {"model": "mock", "schema": schema_name}
        return output_schema.model_validate(data)
