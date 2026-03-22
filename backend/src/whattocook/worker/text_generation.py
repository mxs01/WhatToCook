"""Helpers for async text-based recipe generation jobs."""

from __future__ import annotations

import uuid

from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from whattocook.db.repositories.recipe import RecipeRepository
from whattocook.domain.models import GeneratedRecipe
from whattocook.ports.embedding import EmbeddingPort
from whattocook.ports.llm import LLMPort
from whattocook.ports.vector_search import VectorSearchPort

SYSTEM_PROMPT = """You are a world-class chef and nutrition assistant.
Create an original recipe from a free-form user prompt and optional preferences.
Always return a complete recipe and a practical nutrition estimate for one serving.
If preferences include dietary restrictions, respect them strictly."""


class RecipeIngredient(BaseModel):
    name: str = Field(description="Ingredient name")
    amount: str = Field(description="Amount")
    unit: str = Field(description="Unit")


class GeneratedTextRecipeOutput(BaseModel):
    title: str
    description: str
    ingredients: list[RecipeIngredient]
    instructions: list[str]
    prep_time_minutes: int = Field(ge=0)
    cook_time_minutes: int = Field(ge=0)
    servings: int = Field(ge=1)
    cuisine: str
    difficulty: str
    calories: float | None = None
    protein: float | None = None
    carbs: float | None = None
    fat: float | None = None
    tags: list[str] = Field(default_factory=list)


async def _retrieve_context(
    prompt: str,
    embedding: EmbeddingPort,
    vector_search: VectorSearchPort,
) -> list[str]:
    query_embedding = await embedding.embed_single(prompt)
    chunks = await vector_search.search(query_embedding=query_embedding, top_k=5, min_score=0.3)
    return [chunk.text[:500] for chunk in chunks]


def _build_prompt(prompt: str, preferences: dict, context_snippets: list[str]) -> str:
    context_block = ""
    if context_snippets:
        context_block = "\n\nRecipe inspiration and context:\n" + "\n".join(
            f"- {snippet}" for snippet in context_snippets
        )

    return (
        f"User request:\n{prompt}\n\n"
        f"Preferences JSON:\n{preferences}\n"
        f"{context_block}\n\n"
        f"Return a practical home-cooking recipe and nutrition estimate."
    )


def _normalize_recipe(result: GeneratedTextRecipeOutput) -> GeneratedRecipe:
    return GeneratedRecipe(
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


async def generate_recipe_from_text(
    *,
    user_id: str,
    prompt: str,
    preferences: dict,
    session: AsyncSession,
    llm: LLMPort,
    embedding: EmbeddingPort,
    vector_search: VectorSearchPort,
) -> str:
    context_snippets = await _retrieve_context(prompt, embedding, vector_search)
    llm_prompt = _build_prompt(prompt, preferences, context_snippets)

    result = await llm.generate(
        prompt=llm_prompt,
        output_schema=GeneratedTextRecipeOutput,
        system_prompt=SYSTEM_PROMPT,
        temperature=0.8,
    )

    recipe_data = _normalize_recipe(result)
    recipe_repo = RecipeRepository(session)

    instructions = [
        {"step": idx + 1, "text": text} for idx, text in enumerate(recipe_data.instructions)
    ]

    recipe = await recipe_repo.create(
        user_id=uuid.UUID(user_id),
        upload_id=None,
        title=recipe_data.title,
        description=recipe_data.description,
        ingredients_json=recipe_data.ingredients,
        instructions_json=instructions,
        prep_time_minutes=recipe_data.prep_time_minutes,
        cook_time_minutes=recipe_data.cook_time_minutes,
        servings=recipe_data.servings,
        cuisine=recipe_data.cuisine,
        difficulty=recipe_data.difficulty,
        calories=result.calories,
        protein=result.protein,
        carbs=result.carbs,
        fat=result.fat,
        tags_json=result.tags,
    )

    await session.commit()
    return str(recipe.id)
