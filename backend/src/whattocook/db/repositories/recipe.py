"""Recipe repository — data access for recipes and related tables."""

from __future__ import annotations

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from whattocook.db.models import Recipe, RecipeImage, RecipeReference


class RecipeRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(
        self,
        user_id: uuid.UUID,
        upload_id: uuid.UUID,
        title: str,
        description: str,
        ingredients_json: list,
        instructions_json: list,
        prep_time_minutes: int = 0,
        cook_time_minutes: int = 0,
        servings: int = 2,
        cuisine: str = "",
        difficulty: str = "medium",
    ) -> Recipe:
        recipe = Recipe(
            user_id=user_id,
            upload_id=upload_id,
            title=title,
            description=description,
            ingredients_json=ingredients_json,
            instructions_json=instructions_json,
            prep_time_minutes=prep_time_minutes,
            cook_time_minutes=cook_time_minutes,
            servings=servings,
            cuisine=cuisine,
            difficulty=difficulty,
        )
        self.session.add(recipe)
        await self.session.flush()
        return recipe

    async def get_by_id(self, recipe_id: uuid.UUID) -> Recipe | None:
        stmt = (
            select(Recipe)
            .where(Recipe.id == recipe_id)
            .options(
                selectinload(Recipe.references),
                selectinload(Recipe.images),
            )
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def list_by_user(
        self, user_id: uuid.UUID, limit: int = 20, offset: int = 0
    ) -> list[Recipe]:
        stmt = (
            select(Recipe)
            .where(Recipe.user_id == user_id)
            .options(selectinload(Recipe.images))
            .order_by(Recipe.created_at.desc())
            .limit(limit)
            .offset(offset)
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def add_reference(
        self,
        recipe_id: uuid.UUID,
        source_document_id: uuid.UUID,
        source_chunk_id: uuid.UUID,
        relevance_score: float,
        snippet: str,
    ) -> RecipeReference:
        ref = RecipeReference(
            recipe_id=recipe_id,
            source_document_id=source_document_id,
            source_chunk_id=source_chunk_id,
            relevance_score=relevance_score,
            snippet=snippet,
        )
        self.session.add(ref)
        await self.session.flush()
        return ref

    async def add_image(
        self,
        recipe_id: uuid.UUID,
        image_key: str,
        prompt_used: str,
        model_version: str = "flux-dev",
    ) -> RecipeImage:
        image = RecipeImage(
            recipe_id=recipe_id,
            image_key=image_key,
            prompt_used=prompt_used,
            model_version=model_version,
        )
        self.session.add(image)
        await self.session.flush()
        return image
