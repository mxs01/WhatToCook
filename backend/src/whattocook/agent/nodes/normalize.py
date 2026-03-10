"""Agent node: Normalize ingredient names — step 4 of the pipeline."""

from __future__ import annotations

from pydantic import BaseModel, Field

from whattocook.agent.state import AgentState
from whattocook.ports.llm import LLMPort

SYSTEM_PROMPT = """You are a culinary ingredient normalization expert. Given a list of
ingredient names as detected from a fridge image, normalize each one to a standard
culinary name. For example:
- "romaine" -> "romaine lettuce"
- "2% milk" -> "milk"
- "cheddar block" -> "cheddar cheese"
- "baby carrots" -> "carrots"
Preserve specificity where it matters for cooking (e.g., keep "greek yogurt" vs just "yogurt")."""


class NormalizedIngredients(BaseModel):
    """Structured output for normalized ingredient names."""

    ingredients: list[str] = Field(
        description="List of normalized ingredient names in standard culinary terms"
    )


async def normalize_ingredients(state: AgentState, llm: LLMPort) -> dict:
    """Normalize raw ingredient names to standard culinary terms."""
    raw_ingredients = state["raw_ingredients"]

    ingredient_names = [ing.name for ing in raw_ingredients]

    prompt = (
        f"Normalize these ingredient names to standard culinary terms:\n\n"
        f"{', '.join(ingredient_names)}\n\n"
        f"Return exactly {len(ingredient_names)} normalized names in the same order."
    )

    result = await llm.generate(
        prompt=prompt,
        output_schema=NormalizedIngredients,
        system_prompt=SYSTEM_PROMPT,
        temperature=0.1,
    )

    # Update raw_ingredients with normalized names
    for i, ingredient in enumerate(raw_ingredients):
        if i < len(result.ingredients):
            ingredient.normalized_name = result.ingredients[i]
        else:
            ingredient.normalized_name = ingredient.name.lower().strip()

    normalized = [ing.normalized_name for ing in raw_ingredients]

    return {
        "raw_ingredients": raw_ingredients,
        "normalized_ingredients": normalized,
    }
