"""Agent node: Generate recipe — steps 6 & 7 of the pipeline."""

from __future__ import annotations

from pydantic import BaseModel, Field

from whattocook.agent.state import AgentState
from whattocook.domain.models import GeneratedRecipe
from whattocook.ports.llm import LLMPort

SYSTEM_PROMPT = """You are a world-class chef and recipe creator. Given a list of available
ingredients and some recipe context for inspiration, create an original, delicious recipe.
The recipe should:
- Primarily use the available ingredients (you may assume common pantry staples are available)
- Be practical and achievable for a home cook
- Include precise measurements and clear instructions
- Be creative but realistic

If recipe context is provided, use it as inspiration but create an original recipe —
do not copy recipes verbatim."""


class RecipeIngredient(BaseModel):
    name: str = Field(description="Ingredient name")
    amount: str = Field(description="Amount (e.g., '2', '1/2', '200g')")
    unit: str = Field(description="Unit (e.g., 'cups', 'tbsp', 'pieces', '')")


class GeneratedRecipeOutput(BaseModel):
    """Structured output for a generated recipe."""

    title: str = Field(description="Creative, descriptive recipe title")
    description: str = Field(description="Brief 1-2 sentence description of the dish")
    ingredients: list[RecipeIngredient] = Field(description="List of ingredients with amounts")
    instructions: list[str] = Field(description="Step-by-step cooking instructions")
    prep_time_minutes: int = Field(description="Preparation time in minutes", ge=0)
    cook_time_minutes: int = Field(description="Cooking time in minutes", ge=0)
    servings: int = Field(description="Number of servings", ge=1)
    cuisine: str = Field(description="Cuisine type (e.g., Italian, Asian, Mexican)")
    difficulty: str = Field(description="Difficulty: easy, medium, or hard")


async def generate_recipe(state: AgentState, llm: LLMPort) -> dict:
    """Generate a recipe using available ingredients and retrieved context."""
    normalized_ingredients = state["normalized_ingredients"]
    retrieved_context = state.get("retrieved_context", [])

    # Build context from retrieved chunks
    context_text = ""
    if retrieved_context:
        context_snippets = [f"- {chunk.text[:500]}" for chunk in retrieved_context[:5]]
        context_text = (
            "\n\nRecipe inspiration and context:\n" + "\n".join(context_snippets)
        )

    prompt = (
        f"Available ingredients from the fridge:\n"
        f"{', '.join(normalized_ingredients)}\n"
        f"{context_text}\n\n"
        f"Create a delicious recipe using primarily these ingredients. "
        f"You may assume common pantry staples (salt, pepper, oil, etc.) are available."
    )

    result = await llm.generate(
        prompt=prompt,
        output_schema=GeneratedRecipeOutput,
        system_prompt=SYSTEM_PROMPT,
        temperature=0.8,
    )

    recipe = GeneratedRecipe(
        title=result.title,
        description=result.description,
        ingredients=[ing.model_dump() for ing in result.ingredients],
        instructions=result.instructions,
        prep_time_minutes=result.prep_time_minutes,
        cook_time_minutes=result.cook_time_minutes,
        servings=result.servings,
        cuisine=result.cuisine,
        difficulty=result.difficulty,
    )

    return {"recipe": recipe}
