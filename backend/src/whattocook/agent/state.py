"""Agent state definition for the LangGraph recipe generation pipeline."""

from __future__ import annotations

from typing import TypedDict

from whattocook.domain.models import ChunkResult, GeneratedRecipe, IngredientDetection


class AgentState(TypedDict, total=False):
    """State passed through the LangGraph pipeline.

    All fields are optional (total=False) so nodes can incrementally
    populate the state as they execute.
    """

    # Input
    upload_id: str
    user_id: str
    image_bytes: bytes

    # After analyze_image
    raw_ingredients: list[IngredientDetection]

    # After normalize
    normalized_ingredients: list[str]

    # After retrieve
    retrieved_context: list[ChunkResult]

    # After generate_recipe
    recipe: GeneratedRecipe

    # After generate_image_prompt
    image_prompt: str

    # After create_image
    image_key: str | None

    # Metadata
    agent_run_id: str
    errors: list[str]
