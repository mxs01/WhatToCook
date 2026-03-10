"""Recipe API endpoints — list and detail views."""

from __future__ import annotations

import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from whattocook.api.auth import get_current_user_id
from whattocook.api.schemas import (
    RecipeDetailResponse,
    RecipeImageResponse,
    RecipeResponse,
    ReferenceResponse,
)
from whattocook.db.repositories.recipe import RecipeRepository
from whattocook.db.session import get_session

router = APIRouter(prefix="/recipes", tags=["recipes"])


@router.get("", response_model=list[RecipeResponse])
async def list_recipes(
    user_id: Annotated[uuid.UUID, Depends(get_current_user_id)],
    session: AsyncSession = Depends(get_session),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
) -> list[RecipeResponse]:
    """List all recipes for the current user."""
    repo = RecipeRepository(session)
    recipes = await repo.list_by_user(user_id, limit=limit, offset=offset)

    result = []
    for recipe in recipes:
        image_url = None
        if recipe.images:
            image_url = recipe.images[0].image_key
        result.append(
            RecipeResponse(
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
            )
        )

    return result


@router.get("/{recipe_id}", response_model=RecipeDetailResponse)
async def get_recipe(
    recipe_id: uuid.UUID,
    user_id: Annotated[uuid.UUID, Depends(get_current_user_id)],
    session: AsyncSession = Depends(get_session),
) -> RecipeDetailResponse:
    """Get a recipe with full details, references, and images."""
    repo = RecipeRepository(session)
    recipe = await repo.get_by_id(recipe_id)

    if not recipe or recipe.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found",
        )

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
    )
