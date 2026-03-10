"""Integration test — runs the full LangGraph pipeline with mocked ports."""

from __future__ import annotations

import uuid
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from whattocook.agent.graph import build_recipe_graph
from whattocook.agent.nodes.analyze_image import (
    DetectedIngredient,
    ImageAnalysisResult,
)
from whattocook.agent.nodes.generate_image_prompt import ImagePromptOutput
from whattocook.agent.nodes.generate_recipe import (
    GeneratedRecipeOutput,
    RecipeIngredient,
)
from whattocook.agent.nodes.normalize import NormalizedIngredients
from whattocook.domain.models import ChunkResult

from tests.conftest import (
    CHUNK_ID,
    DOC_ID,
    UPLOAD_ID,
    USER_ID,
    MockEmbedding,
    MockImageGeneration,
    MockLLM,
    MockObjectStorage,
    MockVectorSearch,
)


@pytest.mark.asyncio
async def test_full_pipeline_end_to_end(
    mock_llm: MockLLM,
    mock_embedding: MockEmbedding,
    mock_image_gen: MockImageGeneration,
    mock_storage: MockObjectStorage,
    mock_vector_search: MockVectorSearch,
) -> None:
    """Run the complete 7-node pipeline and verify the final state."""

    # Configure LLM responses in call order:
    # 1. analyze_image -> ImageAnalysisResult
    # 2. normalize -> NormalizedIngredients
    # 3. generate_recipe -> GeneratedRecipeOutput
    # 4. generate_image_prompt -> ImagePromptOutput

    analyze_response = ImageAnalysisResult(
        ingredients=[
            DetectedIngredient(name="chicken breast", confidence=0.95),
            DetectedIngredient(name="tomatoes", confidence=0.90),
            DetectedIngredient(name="basil", confidence=0.88),
        ]
    )

    normalize_response = NormalizedIngredients(
        ingredients=["chicken breast", "tomatoes", "basil"]
    )

    recipe_response = GeneratedRecipeOutput(
        title="Chicken Caprese",
        description="Pan-seared chicken with tomatoes and basil.",
        ingredients=[
            RecipeIngredient(name="chicken breast", amount="2", unit="pieces"),
            RecipeIngredient(name="tomatoes", amount="3", unit="medium"),
            RecipeIngredient(name="basil", amount="8", unit="leaves"),
        ],
        instructions=[
            "Season and sear the chicken.",
            "Add sliced tomatoes.",
            "Top with fresh basil.",
        ],
        prep_time_minutes=10,
        cook_time_minutes=15,
        servings=2,
        cuisine="Italian",
        difficulty="easy",
    )

    image_prompt_response = ImagePromptOutput(
        prompt="A rustic plate of Chicken Caprese, warm studio lighting, overhead angle."
    )

    # The mock LLM needs to return different responses for different calls.
    # We use side_effect to return them in sequence.
    call_count = 0
    original_analyze = mock_llm.analyze_image
    original_generate = mock_llm.generate

    async def sequenced_analyze(image_bytes, prompt, output_schema, **kwargs):
        mock_llm.set_analyze_image_response(analyze_response)
        return await original_analyze(image_bytes, prompt, output_schema, **kwargs)

    generate_responses = [normalize_response, recipe_response, image_prompt_response]
    gen_idx = 0

    async def sequenced_generate(prompt, output_schema, **kwargs):
        nonlocal gen_idx
        resp = generate_responses[gen_idx]
        gen_idx += 1
        mock_llm.set_generate_response(resp)
        return await original_generate(prompt, output_schema, **kwargs)

    mock_llm.analyze_image = sequenced_analyze  # type: ignore[assignment]
    mock_llm.generate = sequenced_generate  # type: ignore[assignment]

    # Set up the initial analyze_image response
    mock_llm.set_analyze_image_response(analyze_response)

    # Mock the persist node's DB session
    mock_session = AsyncMock()
    mock_session.flush = AsyncMock()
    mock_session.commit = AsyncMock()
    mock_session.add = MagicMock()

    mock_recipe_obj = MagicMock()
    mock_recipe_obj.id = uuid.uuid4()

    with patch(
        "whattocook.agent.nodes.persist.RecipeRepository"
    ) as MockRecipeRepo, patch(
        "whattocook.agent.nodes.persist.UploadRepository"
    ) as MockUploadRepo:
        MockRecipeRepo.return_value.create = AsyncMock(return_value=mock_recipe_obj)
        MockRecipeRepo.return_value.add_reference = AsyncMock()
        MockRecipeRepo.return_value.add_image = AsyncMock()
        MockUploadRepo.return_value.add_ingredient_detection = AsyncMock()
        MockUploadRepo.return_value.update_status = AsyncMock()

        # Build and run the full pipeline
        graph = build_recipe_graph(
            llm=mock_llm,
            embedding=mock_embedding,
            vector_search=mock_vector_search,
            image_gen=mock_image_gen,
            storage=mock_storage,
            db_session=mock_session,
        )

        initial_state = {
            "upload_id": str(UPLOAD_ID),
            "user_id": str(USER_ID),
            "image_bytes": b"fake-fridge-image-bytes",
            "errors": [],
        }

        final_state = await graph.ainvoke(initial_state)

    # ─── Assertions on final state ───────────────────────────────────────

    # Ingredients were detected
    assert len(final_state["raw_ingredients"]) == 3
    assert final_state["raw_ingredients"][0].name == "chicken breast"

    # Ingredients were normalized
    assert final_state["normalized_ingredients"] == [
        "chicken breast", "tomatoes", "basil"
    ]

    # Context was retrieved
    assert "retrieved_context" in final_state

    # Recipe was generated
    assert final_state["recipe"].title == "Chicken Caprese"
    assert final_state["recipe"].cuisine == "Italian"

    # Image prompt was generated
    assert "Chicken Caprese" in final_state["image_prompt"]

    # Image was generated and stored
    assert final_state["image_key"] is not None
    assert final_state["image_key"].startswith(f"recipe-images/{UPLOAD_ID}/")

    # Image was actually stored in mock storage
    assert final_state["image_key"] in mock_storage.objects

    # Persist node completed (session committed)
    mock_session.commit.assert_called_once()

    # Upload status updated
    MockUploadRepo.return_value.update_status.assert_called_once_with(
        UPLOAD_ID, "completed"
    )


@pytest.mark.asyncio
async def test_pipeline_handles_image_generation_failure(
    mock_llm: MockLLM,
    mock_embedding: MockEmbedding,
    mock_storage: MockObjectStorage,
    mock_vector_search: MockVectorSearch,
) -> None:
    """Pipeline should complete even if image generation fails."""

    analyze_response = ImageAnalysisResult(
        ingredients=[DetectedIngredient(name="rice", confidence=0.9)]
    )
    normalize_response = NormalizedIngredients(ingredients=["rice"])
    recipe_response = GeneratedRecipeOutput(
        title="Simple Rice",
        description="Basic steamed rice.",
        ingredients=[RecipeIngredient(name="rice", amount="1", unit="cup")],
        instructions=["Rinse rice.", "Cook."],
        prep_time_minutes=5,
        cook_time_minutes=20,
        servings=2,
        cuisine="Asian",
        difficulty="easy",
    )
    image_prompt_response = ImagePromptOutput(prompt="A bowl of steamed rice.")

    mock_llm.set_analyze_image_response(analyze_response)

    gen_responses = [normalize_response, recipe_response, image_prompt_response]
    gen_idx = 0
    original_generate = mock_llm.generate

    async def sequenced_generate(prompt, output_schema, **kwargs):
        nonlocal gen_idx
        resp = gen_responses[gen_idx]
        gen_idx += 1
        mock_llm.set_generate_response(resp)
        return await original_generate(prompt, output_schema, **kwargs)

    mock_llm.generate = sequenced_generate  # type: ignore[assignment]

    # Failing image generation
    failing_image_gen = MockImageGeneration()
    failing_image_gen.generate = AsyncMock(side_effect=RuntimeError("GPU unavailable"))  # type: ignore[method-assign]

    mock_session = AsyncMock()
    mock_session.flush = AsyncMock()
    mock_session.commit = AsyncMock()
    mock_session.add = MagicMock()

    mock_recipe_obj = MagicMock()
    mock_recipe_obj.id = uuid.uuid4()

    with patch(
        "whattocook.agent.nodes.persist.RecipeRepository"
    ) as MockRecipeRepo, patch(
        "whattocook.agent.nodes.persist.UploadRepository"
    ) as MockUploadRepo:
        MockRecipeRepo.return_value.create = AsyncMock(return_value=mock_recipe_obj)
        MockRecipeRepo.return_value.add_reference = AsyncMock()
        MockRecipeRepo.return_value.add_image = AsyncMock()
        MockUploadRepo.return_value.add_ingredient_detection = AsyncMock()
        MockUploadRepo.return_value.update_status = AsyncMock()

        graph = build_recipe_graph(
            llm=mock_llm,
            embedding=mock_embedding,
            vector_search=mock_vector_search,
            image_gen=failing_image_gen,
            storage=mock_storage,
            db_session=mock_session,
        )

        initial_state = {
            "upload_id": str(UPLOAD_ID),
            "user_id": str(USER_ID),
            "image_bytes": b"fake-fridge",
            "errors": [],
        }

        final_state = await graph.ainvoke(initial_state)

    # Pipeline completed despite image failure
    assert final_state["recipe"].title == "Simple Rice"
    assert final_state["image_key"] is None
    assert len(final_state["errors"]) >= 1
    assert "GPU unavailable" in final_state["errors"][0]

    # Recipe was still persisted
    mock_session.commit.assert_called_once()

    # No image was saved
    MockRecipeRepo.return_value.add_image.assert_not_called()
