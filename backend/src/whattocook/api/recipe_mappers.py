"""Shared mappers for recipe API responses."""

from __future__ import annotations

from whattocook.api.schemas import (
    NutritionResponse,
    RecipeDetailResponse,
    RecipeImageResponse,
    RecipeResponse,
    ReferenceResponse,
)
from whattocook.db.models import Recipe


def _as_optional_float(value: object) -> float | None:
    if isinstance(value, int | float):
        return float(value)
    return None


def _as_tags(value: object) -> list[str]:
    if not isinstance(value, list):
        return []
    return [tag for tag in value if isinstance(tag, str)]


def map_nutrition(recipe: Recipe) -> NutritionResponse:
    return NutritionResponse(
        calories=_as_optional_float(getattr(recipe, "calories", None)),
        protein=_as_optional_float(getattr(recipe, "protein", None)),
        carbs=_as_optional_float(getattr(recipe, "carbs", None)),
        fat=_as_optional_float(getattr(recipe, "fat", None)),
    )


def map_recipe_summary(recipe: Recipe) -> RecipeResponse:
    image_url = recipe.images[0].image_key if recipe.images else None
    return RecipeResponse(
        id=recipe.id,
        title=recipe.title,
        description=recipe.description,
        cuisine=recipe.cuisine,
        difficulty=recipe.difficulty,
        prep_time_minutes=recipe.prep_time_minutes,
        cook_time_minutes=recipe.cook_time_minutes,
        servings=recipe.servings,
        created_at=recipe.created_at,
        image_url=image_url,
        tags=_as_tags(getattr(recipe, "tags_json", [])),
    )


def map_recipe_detail(recipe: Recipe) -> RecipeDetailResponse:
    references = [
        ReferenceResponse(
            relevance_score=ref.relevance_score,
            snippet=ref.snippet,
        )
        for ref in recipe.references
    ]

    images = [
        RecipeImageResponse(
            image_key=img.image_key,
            prompt_used=img.prompt_used,
            model_version=img.model_version,
        )
        for img in recipe.images
    ]

    return RecipeDetailResponse(
        id=recipe.id,
        title=recipe.title,
        description=recipe.description,
        ingredients_json=recipe.ingredients_json,
        instructions_json=recipe.instructions_json,
        cuisine=recipe.cuisine,
        difficulty=recipe.difficulty,
        prep_time_minutes=recipe.prep_time_minutes,
        cook_time_minutes=recipe.cook_time_minutes,
        servings=recipe.servings,
        created_at=recipe.created_at,
        references=references,
        images=images,
        nutrition=map_nutrition(recipe),
        tags=_as_tags(getattr(recipe, "tags_json", [])),
    )
