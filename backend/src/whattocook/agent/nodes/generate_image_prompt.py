"""Agent node: Generate image prompt — step 8 of the pipeline."""

from __future__ import annotations

from pydantic import BaseModel, Field

from whattocook.agent.state import AgentState
from whattocook.ports.llm import LLMPort

SYSTEM_PROMPT = """You are an expert at writing prompts for AI image generation models.
Given a recipe, create a vivid, detailed prompt that will generate an appetizing
food photography image of the finished dish. The prompt should describe:
- The plated dish in detail
- Lighting (warm, natural, studio-quality food photography)
- Composition and angle
- Background and setting
- Food styling details
Keep it concise but descriptive. Do NOT include any text or watermarks in the prompt."""


class ImagePromptOutput(BaseModel):
    """Structured output for an image generation prompt."""

    prompt: str = Field(
        description="A detailed image generation prompt for the finished recipe dish"
    )


async def generate_image_prompt(state: AgentState, llm: LLMPort) -> dict:
    """Generate a FLUX-optimized image prompt for the recipe."""
    recipe = state["recipe"]

    ingredients_text = ", ".join(
        ing["name"] if isinstance(ing, dict) else ing.name for ing in recipe.ingredients
    )

    prompt = (
        f"Create an AI image generation prompt for this dish:\n\n"
        f"Title: {recipe.title}\n"
        f"Description: {recipe.description}\n"
        f"Key ingredients: {ingredients_text}\n"
        f"Cuisine: {recipe.cuisine}\n\n"
        f"The prompt should produce a professional food photography image."
    )

    result = await llm.generate(
        prompt=prompt,
        output_schema=ImagePromptOutput,
        system_prompt=SYSTEM_PROMPT,
        temperature=0.7,
    )

    return {"image_prompt": result.prompt}
