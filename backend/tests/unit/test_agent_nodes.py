"""Unit tests for all 7 LangGraph agent nodes."""

from __future__ import annotations

import uuid
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from whattocook.agent.nodes.analyze_image import (
    ImageAnalysisResult,
    DetectedIngredient,
    analyze_image,
)
from whattocook.agent.nodes.normalize import NormalizedIngredients, normalize_ingredients
from whattocook.agent.nodes.retrieve import retrieve_context
from whattocook.agent.nodes.generate_recipe import (
    GeneratedRecipeOutput,
    RecipeIngredient,
    generate_recipe,
)
from whattocook.agent.nodes.generate_image_prompt import (
    ImagePromptOutput,
    generate_image_prompt,
)
from whattocook.agent.nodes.create_image import create_image
from whattocook.agent.nodes.persist import persist
from whattocook.domain.models import (
    ChunkResult,
    GeneratedRecipe,
    IngredientDetection,
)

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


# ─── analyze_image ──────────────────────────────────────────────────────────


class TestAnalyzeImage:
    @pytest.mark.asyncio
    async def test_returns_ingredient_detections(self, mock_llm: MockLLM) -> None:
        mock_llm.set_analyze_image_response(
            ImageAnalysisResult(
                ingredients=[
                    DetectedIngredient(name="milk", confidence=0.95),
                    DetectedIngredient(name="eggs", confidence=0.88),
                    DetectedIngredient(name="butter", confidence=0.75),
                ]
            )
        )

        state = {"image_bytes": b"fake-jpeg-data"}
        result = await analyze_image(state, mock_llm)  # type: ignore[arg-type]

        assert "raw_ingredients" in result
        assert len(result["raw_ingredients"]) == 3
        assert result["raw_ingredients"][0].name == "milk"
        assert result["raw_ingredients"][0].confidence == 0.95

    @pytest.mark.asyncio
    async def test_calls_analyze_image_on_llm(self, mock_llm: MockLLM) -> None:
        mock_llm.set_analyze_image_response(
            ImageAnalysisResult(ingredients=[DetectedIngredient(name="apple", confidence=0.9)])
        )

        state = {"image_bytes": b"image-data"}
        await analyze_image(state, mock_llm)  # type: ignore[arg-type]

        assert len(mock_llm.analyze_image_calls) == 1
        assert mock_llm.analyze_image_calls[0]["image_bytes_len"] == len(b"image-data")
        assert mock_llm.analyze_image_calls[0]["output_schema"] is ImageAnalysisResult

    @pytest.mark.asyncio
    async def test_empty_fridge(self, mock_llm: MockLLM) -> None:
        mock_llm.set_analyze_image_response(ImageAnalysisResult(ingredients=[]))

        state = {"image_bytes": b"empty-fridge"}
        result = await analyze_image(state, mock_llm)  # type: ignore[arg-type]

        assert result["raw_ingredients"] == []


# ─── normalize_ingredients ──────────────────────────────────────────────────


class TestNormalizeIngredients:
    @pytest.mark.asyncio
    async def test_normalizes_all_ingredients(self, mock_llm: MockLLM) -> None:
        mock_llm.set_generate_response(
            NormalizedIngredients(ingredients=["milk", "eggs", "butter"])
        )

        state = {
            "raw_ingredients": [
                IngredientDetection(name="2% Milk", confidence=0.9),
                IngredientDetection(name="Free Range Eggs", confidence=0.85),
                IngredientDetection(name="Unsalted Butter", confidence=0.8),
            ]
        }

        result = await normalize_ingredients(state, mock_llm)  # type: ignore[arg-type]

        assert result["normalized_ingredients"] == ["milk", "eggs", "butter"]
        assert result["raw_ingredients"][0].normalized_name == "milk"
        assert result["raw_ingredients"][1].normalized_name == "eggs"

    @pytest.mark.asyncio
    async def test_fallback_when_llm_returns_fewer(self, mock_llm: MockLLM) -> None:
        # LLM returns fewer items than input — should fall back to lowered name
        mock_llm.set_generate_response(
            NormalizedIngredients(ingredients=["tomatoes"])
        )

        state = {
            "raw_ingredients": [
                IngredientDetection(name="Tomatoes", confidence=0.9),
                IngredientDetection(name="Basil Leaves", confidence=0.8),
            ]
        }

        result = await normalize_ingredients(state, mock_llm)  # type: ignore[arg-type]

        assert result["raw_ingredients"][0].normalized_name == "tomatoes"
        # Second ingredient should fall back to lowered name
        assert result["raw_ingredients"][1].normalized_name == "basil leaves"

    @pytest.mark.asyncio
    async def test_uses_generate_not_analyze_image(self, mock_llm: MockLLM) -> None:
        mock_llm.set_generate_response(NormalizedIngredients(ingredients=["apple"]))

        state = {
            "raw_ingredients": [IngredientDetection(name="Apple", confidence=0.9)]
        }

        await normalize_ingredients(state, mock_llm)  # type: ignore[arg-type]

        assert len(mock_llm.generate_calls) == 1
        assert len(mock_llm.analyze_image_calls) == 0
        assert mock_llm.generate_calls[0]["output_schema"] is NormalizedIngredients


# ─── retrieve_context ───────────────────────────────────────────────────────


class TestRetrieveContext:
    @pytest.mark.asyncio
    async def test_returns_retrieved_chunks(
        self,
        mock_embedding: MockEmbedding,
        mock_vector_search: MockVectorSearch,
    ) -> None:
        state = {"normalized_ingredients": ["tomatoes", "basil", "mozzarella"]}

        result = await retrieve_context(state, mock_embedding, mock_vector_search)

        assert "retrieved_context" in result
        assert len(result["retrieved_context"]) == 1
        assert result["retrieved_context"][0].score == 0.85

    @pytest.mark.asyncio
    async def test_empty_ingredients_still_works(
        self,
        mock_embedding: MockEmbedding,
    ) -> None:
        empty_search = MockVectorSearch(results=[])
        state = {"normalized_ingredients": []}

        result = await retrieve_context(state, mock_embedding, empty_search)

        assert result["retrieved_context"] == []

    @pytest.mark.asyncio
    async def test_respects_min_score(
        self,
        mock_embedding: MockEmbedding,
    ) -> None:
        low_score_search = MockVectorSearch(results=[
            ChunkResult(
                chunk_id=str(CHUNK_ID),
                document_id=str(DOC_ID),
                text="Low relevance text",
                score=0.2,
            )
        ])

        state = {"normalized_ingredients": ["chicken"]}
        result = await retrieve_context(state, mock_embedding, low_score_search)

        # The retrieve node calls with min_score=0.3, so this should be filtered
        assert len(result["retrieved_context"]) == 0


# ─── generate_recipe ────────────────────────────────────────────────────────


class TestGenerateRecipe:
    @pytest.mark.asyncio
    async def test_generates_recipe_from_ingredients(self, mock_llm: MockLLM) -> None:
        mock_llm.set_generate_response(
            GeneratedRecipeOutput(
                title="Tomato Basil Pasta",
                description="A simple and delicious pasta.",
                ingredients=[
                    RecipeIngredient(name="pasta", amount="200", unit="g"),
                    RecipeIngredient(name="tomatoes", amount="3", unit="medium"),
                ],
                instructions=["Boil pasta.", "Make sauce.", "Combine."],
                prep_time_minutes=5,
                cook_time_minutes=15,
                servings=2,
                cuisine="Italian",
                difficulty="easy",
            )
        )

        state = {
            "normalized_ingredients": ["tomatoes", "basil", "pasta"],
            "retrieved_context": [],
        }

        result = await generate_recipe(state, mock_llm)  # type: ignore[arg-type]

        assert "recipe" in result
        recipe = result["recipe"]
        assert isinstance(recipe, GeneratedRecipe)
        assert recipe.title == "Tomato Basil Pasta"
        assert recipe.servings == 2
        assert len(recipe.ingredients) == 2
        assert len(recipe.instructions) == 3

    @pytest.mark.asyncio
    async def test_includes_context_in_prompt(self, mock_llm: MockLLM) -> None:
        mock_llm.set_generate_response(
            GeneratedRecipeOutput(
                title="Test",
                description="Test",
                ingredients=[RecipeIngredient(name="x", amount="1", unit="")],
                instructions=["Step 1"],
                prep_time_minutes=0,
                cook_time_minutes=0,
                servings=1,
                cuisine="Other",
                difficulty="easy",
            )
        )

        context_chunk = ChunkResult(
            chunk_id=str(CHUNK_ID),
            document_id=str(DOC_ID),
            text="Classic Italian recipe for pasta alla norma.",
            score=0.9,
        )

        state = {
            "normalized_ingredients": ["eggplant", "pasta"],
            "retrieved_context": [context_chunk],
        }

        await generate_recipe(state, mock_llm)  # type: ignore[arg-type]

        prompt = mock_llm.generate_calls[0]["prompt"]
        assert "eggplant" in prompt
        assert "Classic Italian recipe" in prompt


# ─── generate_image_prompt ──────────────────────────────────────────────────


class TestGenerateImagePrompt:
    @pytest.mark.asyncio
    async def test_returns_image_prompt(
        self,
        mock_llm: MockLLM,
        sample_recipe: GeneratedRecipe,
    ) -> None:
        mock_llm.set_generate_response(
            ImagePromptOutput(
                prompt="A beautiful plate of Caprese Chicken, warm lighting, overhead shot."
            )
        )

        state = {"recipe": sample_recipe}
        result = await generate_image_prompt(state, mock_llm)  # type: ignore[arg-type]

        assert "image_prompt" in result
        assert "Caprese Chicken" in result["image_prompt"]

    @pytest.mark.asyncio
    async def test_prompt_includes_recipe_details(
        self,
        mock_llm: MockLLM,
        sample_recipe: GeneratedRecipe,
    ) -> None:
        mock_llm.set_generate_response(
            ImagePromptOutput(prompt="A dish photo.")
        )

        state = {"recipe": sample_recipe}
        await generate_image_prompt(state, mock_llm)  # type: ignore[arg-type]

        call_prompt = mock_llm.generate_calls[0]["prompt"]
        assert sample_recipe.title in call_prompt
        assert sample_recipe.cuisine in call_prompt


# ─── create_image ───────────────────────────────────────────────────────────


class TestCreateImage:
    @pytest.mark.asyncio
    async def test_generates_and_stores_image(
        self,
        mock_image_gen: MockImageGeneration,
        mock_storage: MockObjectStorage,
    ) -> None:
        state = {
            "image_prompt": "A delicious pasta dish, studio lighting.",
            "upload_id": str(UPLOAD_ID),
        }

        result = await create_image(state, mock_image_gen, mock_storage)

        assert result["image_key"] is not None
        assert result["image_key"].startswith(f"recipe-images/{UPLOAD_ID}/")
        # Verify image was stored
        stored_data = mock_storage.objects[result["image_key"]]
        assert stored_data == MockImageGeneration.TINY_PNG

    @pytest.mark.asyncio
    async def test_handles_generation_failure_gracefully(
        self,
        mock_storage: MockObjectStorage,
    ) -> None:
        failing_gen = MockImageGeneration()
        failing_gen.generate = AsyncMock(side_effect=RuntimeError("GPU OOM"))  # type: ignore[method-assign]

        state = {
            "image_prompt": "A dish.",
            "upload_id": str(UPLOAD_ID),
            "errors": [],
        }

        result = await create_image(state, failing_gen, mock_storage)

        assert result["image_key"] is None
        assert len(result["errors"]) == 1
        assert "GPU OOM" in result["errors"][0]


# ─── persist ────────────────────────────────────────────────────────────────


class TestPersist:
    @pytest.mark.asyncio
    async def test_persist_creates_recipe_and_updates_upload(
        self,
        sample_agent_state: dict,
    ) -> None:
        mock_session = AsyncMock()
        mock_session.flush = AsyncMock()
        mock_session.commit = AsyncMock()
        mock_session.get = AsyncMock()
        mock_session.add = MagicMock()

        # Mock the Recipe returned by flush (needs an id)
        mock_recipe = MagicMock()
        mock_recipe.id = uuid.uuid4()

        # We need to patch the repositories
        with patch(
            "whattocook.agent.nodes.persist.RecipeRepository"
        ) as MockRecipeRepo, patch(
            "whattocook.agent.nodes.persist.UploadRepository"
        ) as MockUploadRepo:
            repo_instance = MockRecipeRepo.return_value
            repo_instance.create = AsyncMock(return_value=mock_recipe)
            repo_instance.add_reference = AsyncMock()
            repo_instance.add_image = AsyncMock()

            upload_repo_instance = MockUploadRepo.return_value
            upload_repo_instance.add_ingredient_detection = AsyncMock()
            upload_repo_instance.update_status = AsyncMock()

            result = await persist(sample_agent_state, mock_session)

            # Recipe was created
            repo_instance.create.assert_called_once()
            create_kwargs = repo_instance.create.call_args
            assert create_kwargs.kwargs["title"] == "Caprese Chicken"
            assert create_kwargs.kwargs["user_id"] == USER_ID

            # Ingredient detections were saved
            assert upload_repo_instance.add_ingredient_detection.call_count == 4

            # Upload status was updated to completed
            upload_repo_instance.update_status.assert_called_once_with(
                UPLOAD_ID, "completed"
            )

            # Session was committed
            mock_session.commit.assert_called_once()

    @pytest.mark.asyncio
    async def test_persist_saves_image_when_present(
        self,
        sample_agent_state: dict,
    ) -> None:
        sample_agent_state["image_key"] = "recipe-images/test/image.png"
        mock_session = AsyncMock()
        mock_session.flush = AsyncMock()
        mock_session.commit = AsyncMock()
        mock_session.add = MagicMock()

        mock_recipe = MagicMock()
        mock_recipe.id = uuid.uuid4()

        with patch(
            "whattocook.agent.nodes.persist.RecipeRepository"
        ) as MockRecipeRepo, patch(
            "whattocook.agent.nodes.persist.UploadRepository"
        ) as MockUploadRepo:
            MockRecipeRepo.return_value.create = AsyncMock(return_value=mock_recipe)
            MockRecipeRepo.return_value.add_reference = AsyncMock()
            MockRecipeRepo.return_value.add_image = AsyncMock()
            MockUploadRepo.return_value.add_ingredient_detection = AsyncMock()
            MockUploadRepo.return_value.update_status = AsyncMock()

            await persist(sample_agent_state, mock_session)

            MockRecipeRepo.return_value.add_image.assert_called_once()
            call_kwargs = MockRecipeRepo.return_value.add_image.call_args.kwargs
            assert call_kwargs["image_key"] == "recipe-images/test/image.png"
            assert call_kwargs["model_version"] == "flux-dev"

    @pytest.mark.asyncio
    async def test_persist_skips_image_when_none(
        self,
        sample_agent_state: dict,
    ) -> None:
        sample_agent_state["image_key"] = None
        mock_session = AsyncMock()
        mock_session.flush = AsyncMock()
        mock_session.commit = AsyncMock()
        mock_session.add = MagicMock()

        mock_recipe = MagicMock()
        mock_recipe.id = uuid.uuid4()

        with patch(
            "whattocook.agent.nodes.persist.RecipeRepository"
        ) as MockRecipeRepo, patch(
            "whattocook.agent.nodes.persist.UploadRepository"
        ) as MockUploadRepo:
            MockRecipeRepo.return_value.create = AsyncMock(return_value=mock_recipe)
            MockRecipeRepo.return_value.add_reference = AsyncMock()
            MockRecipeRepo.return_value.add_image = AsyncMock()
            MockUploadRepo.return_value.add_ingredient_detection = AsyncMock()
            MockUploadRepo.return_value.update_status = AsyncMock()

            await persist(sample_agent_state, mock_session)

            MockRecipeRepo.return_value.add_image.assert_not_called()
