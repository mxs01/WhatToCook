"""Background worker — processes jobs from the Redis queue."""

from __future__ import annotations

import logging

from whattocook.agent.graph import build_recipe_graph
from whattocook.config import get_settings
from whattocook.db.session import async_session_factory
from whattocook.dependencies import (
    get_embedding,
    get_image_generation,
    get_llm,
    get_object_storage,
)
from whattocook.worker.text_generation import generate_recipe_from_text

logger = logging.getLogger(__name__)


async def process_fridge_upload(payload: dict) -> None:
    """Process a fridge upload job — runs the full LangGraph pipeline."""
    settings = get_settings()
    upload_id = payload["upload_id"]
    user_id = payload["user_id"]
    image_key = payload["image_key"]

    # Create adapter instances
    llm = get_llm(settings)
    embedding = get_embedding(settings)
    image_gen = get_image_generation(settings)
    storage = get_object_storage(settings)

    async with async_session_factory() as session:
        from whattocook.adapters.vector_search.pgvector import PgVectorAdapter

        vector_search = PgVectorAdapter(session)

        # Download image from storage
        image_bytes = await storage.download(image_key)

        # Build and run the pipeline
        graph = build_recipe_graph(
            llm=llm,
            embedding=embedding,
            vector_search=vector_search,
            image_gen=image_gen,
            storage=storage,
            db_session=session,
        )

        initial_state = {
            "upload_id": upload_id,
            "user_id": user_id,
            "image_bytes": image_bytes,
            "errors": [],
        }

        await graph.ainvoke(initial_state)


async def process_text_recipe_generation(payload: dict) -> str:
    """Process text-to-recipe generation job."""
    settings = get_settings()
    user_id = payload["user_id"]
    prompt = payload["prompt"]
    preferences = payload.get("preferences", {})

    llm = get_llm(settings)
    embedding = get_embedding(settings)

    async with async_session_factory() as session:
        from whattocook.adapters.vector_search.pgvector import PgVectorAdapter

        vector_search = PgVectorAdapter(session)
        return await generate_recipe_from_text(
            user_id=user_id,
            prompt=prompt,
            preferences=preferences,
            session=session,
            llm=llm,
            embedding=embedding,
            vector_search=vector_search,
        )


JOB_HANDLERS = {
    "process_fridge_upload": process_fridge_upload,
    "process_text_recipe_generation": process_text_recipe_generation,
}
