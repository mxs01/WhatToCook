"""Recipe API endpoints — list and detail views."""

from __future__ import annotations

import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from whattocook.api.auth import get_current_user_id
from whattocook.api.recipe_mappers import map_recipe_detail, map_recipe_summary
from whattocook.api.schemas import RecipeDetailResponse, RecipeResponse
from whattocook.db.repositories.recipe import RecipeRepository
from whattocook.db.session import get_session

router = APIRouter(prefix="/recipes", tags=["recipes"])


@router.get("", response_model=list[RecipeResponse])
async def list_recipes(
    user_id: Annotated[uuid.UUID, Depends(get_current_user_id)],
    session: AsyncSession = Depends(get_session),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    search: str | None = Query(None, min_length=1, max_length=200),
    cuisine: str | None = Query(None, min_length=1, max_length=100),
    tags: str | None = Query(None, description="Comma-separated tags"),
) -> list[RecipeResponse]:
    """List all recipes for the current user."""
    repo = RecipeRepository(session)
    parsed_tags = [tag.strip() for tag in (tags or "").split(",") if tag.strip()]
    recipes = await repo.list_by_user(
        user_id,
        limit=limit,
        offset=offset,
        search=search,
        cuisine=cuisine,
        tags=parsed_tags,
    )
    return [map_recipe_summary(recipe) for recipe in recipes]


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

    return map_recipe_detail(recipe)
