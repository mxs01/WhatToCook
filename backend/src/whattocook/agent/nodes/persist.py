"""Agent node: Persist recipe — step 10 of the pipeline."""

from __future__ import annotations

import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from whattocook.agent.state import AgentState
from whattocook.db.repositories.recipe import RecipeRepository
from whattocook.db.repositories.upload import UploadRepository


async def persist(state: AgentState, session: AsyncSession) -> dict:
    """Persist the generated recipe, references, and image to the database."""
    recipe_data = state["recipe"]
    upload_id = uuid.UUID(state["upload_id"])
    user_id = uuid.UUID(state["user_id"])
    retrieved_context = state.get("retrieved_context", [])
    image_key = state.get("image_key")
    image_prompt = state.get("image_prompt", "")

    recipe_repo = RecipeRepository(session)
    upload_repo = UploadRepository(session)

    # Convert plain-string instructions to {step, text} dicts for the frontend
    instructions = [
        {"step": i + 1, "text": text}
        for i, text in enumerate(recipe_data.instructions)
    ]

    # Create recipe
    recipe = await recipe_repo.create(
        user_id=user_id,
        upload_id=upload_id,
        title=recipe_data.title,
        description=recipe_data.description,
        ingredients_json=recipe_data.ingredients,
        instructions_json=instructions,
        prep_time_minutes=recipe_data.prep_time_minutes,
        cook_time_minutes=recipe_data.cook_time_minutes,
        servings=recipe_data.servings,
        cuisine=recipe_data.cuisine,
        difficulty=recipe_data.difficulty,
    )

    # Save ingredient detections
    raw_ingredients = state.get("raw_ingredients", [])
    for ingredient in raw_ingredients:
        await upload_repo.add_ingredient_detection(
            upload_id=upload_id,
            name=ingredient.name,
            normalized_name=ingredient.normalized_name,
            confidence=ingredient.confidence,
            bbox=ingredient.bbox,
        )

    # Save references from retrieved context
    for chunk in retrieved_context:
        await recipe_repo.add_reference(
            recipe_id=recipe.id,
            source_document_id=uuid.UUID(chunk.document_id),
            source_chunk_id=uuid.UUID(chunk.chunk_id),
            relevance_score=chunk.score,
            snippet=chunk.text[:500],
        )

    # Save recipe image if generated
    if image_key:
        await recipe_repo.add_image(
            recipe_id=recipe.id,
            image_key=image_key,
            prompt_used=image_prompt,
            model_version="flux-dev",
        )

    # Update upload status
    await upload_repo.update_status(upload_id, "completed")

    await session.commit()

    return {"recipe_id": str(recipe.id)}
