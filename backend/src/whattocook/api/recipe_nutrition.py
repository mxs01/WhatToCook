"""Recipe nutrition endpoint."""

from __future__ import annotations

import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from whattocook.api.auth import get_current_user_id
from whattocook.api.recipe_mappers import map_nutrition
from whattocook.api.schemas import NutritionResponse
from whattocook.db.repositories.recipe import RecipeRepository
from whattocook.db.session import get_session

router = APIRouter(prefix="/recipes", tags=["recipes"])


@router.get("/{recipe_id}/nutrition", response_model=NutritionResponse)
async def get_recipe_nutrition(
    recipe_id: uuid.UUID,
    user_id: Annotated[uuid.UUID, Depends(get_current_user_id)],
    session: AsyncSession = Depends(get_session),
) -> NutritionResponse:
    repo = RecipeRepository(session)
    recipe = await repo.get_by_id(recipe_id)

    if not recipe or recipe.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found",
        )

    return map_nutrition(recipe)
