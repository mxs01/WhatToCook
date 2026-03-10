"""Agent node: Analyze fridge image — steps 2 & 3 of the pipeline."""

from __future__ import annotations

from pydantic import BaseModel, Field

from whattocook.agent.state import AgentState
from whattocook.domain.models import IngredientDetection
from whattocook.ports.llm import LLMPort

SYSTEM_PROMPT = """You are a food ingredient detection expert. You analyze images of refrigerators
and identify all visible food ingredients. For each ingredient, provide:
- The name of the ingredient as seen
- A confidence score between 0 and 1
Be thorough but only list items you can actually see in the image."""

USER_PROMPT = """Analyze this fridge image and list all visible food ingredients.
For each ingredient, provide the name and your confidence score (0-1).
Only list actual food items, not containers, shelves, or non-food items."""


class DetectedIngredient(BaseModel):
    """A single detected ingredient."""

    name: str = Field(description="Name of the ingredient as visible in the image")
    confidence: float = Field(
        description="Confidence score between 0 and 1", ge=0.0, le=1.0
    )


class ImageAnalysisResult(BaseModel):
    """Structured output from fridge image analysis."""

    ingredients: list[DetectedIngredient] = Field(
        description="List of detected food ingredients"
    )


async def analyze_image(state: AgentState, llm: LLMPort) -> dict:
    """Analyze fridge image and extract ingredient list with confidence scores."""
    image_bytes = state["image_bytes"]

    result = await llm.analyze_image(
        image_bytes=image_bytes,
        prompt=USER_PROMPT,
        output_schema=ImageAnalysisResult,
        system_prompt=SYSTEM_PROMPT,
        temperature=0.2,
    )

    raw_ingredients = [
        IngredientDetection(
            name=ing.name,
            confidence=ing.confidence,
        )
        for ing in result.ingredients
    ]

    return {"raw_ingredients": raw_ingredients}
