"""Shared test fixtures — mock ports, fake state, test settings, FastAPI test client."""

from __future__ import annotations

import uuid
from typing import Any, TypeVar
from unittest.mock import AsyncMock, MagicMock

import pytest
from fastapi.testclient import TestClient
from pydantic import BaseModel

from whattocook.domain.models import ChunkResult, GeneratedRecipe, IngredientDetection
from whattocook.ports.embedding import EmbeddingPort
from whattocook.ports.image_generation import ImageGenerationPort
from whattocook.ports.job_queue import JobQueuePort
from whattocook.ports.llm import LLMPort
from whattocook.ports.object_storage import ObjectStoragePort
from whattocook.ports.vector_search import VectorSearchPort

T = TypeVar("T", bound=BaseModel)

# ─── Fixed IDs ───────────────────────────────────────────────────────────────

USER_ID = uuid.UUID("00000000-0000-0000-0000-000000000001")
UPLOAD_ID = uuid.UUID("00000000-0000-0000-0000-000000000002")
RECIPE_ID = uuid.UUID("00000000-0000-0000-0000-000000000003")
DOC_ID = uuid.UUID("00000000-0000-0000-0000-000000000004")
CHUNK_ID = uuid.UUID("00000000-0000-0000-0000-000000000005")


# ─── Mock LLM Port ──────────────────────────────────────────────────────────


class MockLLM(LLMPort):
    """Deterministic mock LLM that returns pre-set structured outputs."""

    def __init__(self) -> None:
        self.generate_calls: list[dict] = []
        self.analyze_image_calls: list[dict] = []
        self._generate_response: Any = None
        self._analyze_image_response: Any = None

    def set_generate_response(self, response: Any) -> None:
        self._generate_response = response

    def set_analyze_image_response(self, response: Any) -> None:
        self._analyze_image_response = response

    async def generate(
        self,
        prompt: str,
        output_schema: type[T],
        *,
        system_prompt: str | None = None,
        temperature: float = 0.7,
        max_tokens: int = 4096,
    ) -> T:
        self.generate_calls.append(
            {
                "prompt": prompt,
                "output_schema": output_schema,
                "system_prompt": system_prompt,
                "temperature": temperature,
            }
        )
        if self._generate_response is not None:
            return self._generate_response  # type: ignore[return-value]
        # Build a default from the schema
        return output_schema.model_validate(output_schema.model_json_schema())  # type: ignore[return-value]

    async def analyze_image(
        self,
        image_bytes: bytes,
        prompt: str,
        output_schema: type[T],
        *,
        system_prompt: str | None = None,
        temperature: float = 0.3,
        max_tokens: int = 4096,
    ) -> T:
        self.analyze_image_calls.append(
            {
                "image_bytes_len": len(image_bytes),
                "prompt": prompt,
                "output_schema": output_schema,
            }
        )
        if self._analyze_image_response is not None:
            return self._analyze_image_response  # type: ignore[return-value]
        return output_schema.model_validate(output_schema.model_json_schema())  # type: ignore[return-value]

    async def get_model_name(self) -> str:
        return "mock-model"

    async def get_token_usage(self) -> dict[str, Any]:
        return {"total_tokens": 42}


# ─── Mock Embedding Port ────────────────────────────────────────────────────


class MockEmbedding(EmbeddingPort):
    """Returns fixed-dimension zero vectors."""

    def __init__(self, dimension: int = 768) -> None:
        self._dimension = dimension

    async def embed(self, texts: list[str]) -> list[list[float]]:
        return [[0.0] * self._dimension for _ in texts]

    async def embed_single(self, text: str) -> list[float]:
        return [0.0] * self._dimension

    def get_dimension(self) -> int:
        return self._dimension


# ─── Mock Image Generation Port ─────────────────────────────────────────────


class MockImageGeneration(ImageGenerationPort):
    """Returns a 1x1 PNG pixel."""

    TINY_PNG = (
        b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01"
        b"\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00"
        b"\x00\x00\x0cIDATx\x9cc\xf8\x0f\x00\x00\x01\x01\x00"
        b"\x05\x18\xd8N\x00\x00\x00\x00IEND\xaeB`\x82"
    )

    def __init__(self) -> None:
        self.calls: list[dict] = []

    async def generate(
        self,
        prompt: str,
        *,
        width: int = 1024,
        height: int = 1024,
        num_inference_steps: int = 50,
        guidance_scale: float = 7.5,
    ) -> bytes:
        self.calls.append({"prompt": prompt, "width": width, "height": height})
        return self.TINY_PNG


# ─── Mock Object Storage Port ───────────────────────────────────────────────


class MockObjectStorage(ObjectStoragePort):
    """In-memory object storage."""

    def __init__(self) -> None:
        self.objects: dict[str, bytes] = {}

    async def upload(
        self, key: str, data: bytes, content_type: str = "application/octet-stream"
    ) -> str:
        self.objects[key] = data
        return key

    async def download(self, key: str) -> bytes:
        if key not in self.objects:
            raise KeyError(f"Object not found: {key}")
        return self.objects[key]

    async def get_presigned_url(self, key: str, expires_in: int = 3600) -> str:
        return f"http://mock-storage/{key}?expires={expires_in}"

    async def delete(self, key: str) -> None:
        self.objects.pop(key, None)


# ─── Mock Vector Search Port ────────────────────────────────────────────────


class MockVectorSearch(VectorSearchPort):
    """Returns pre-configured chunk results."""

    def __init__(self, results: list[ChunkResult] | None = None) -> None:
        self._results = results or []

    async def search(
        self,
        query_embedding: list[float],
        top_k: int = 5,
        *,
        min_score: float = 0.0,
    ) -> list[ChunkResult]:
        return [r for r in self._results[:top_k] if r.score >= min_score]


# ─── Mock Job Queue Port ────────────────────────────────────────────────────


class MockJobQueue(JobQueuePort):
    """In-memory job queue."""

    def __init__(self) -> None:
        self.jobs: dict[str, dict] = {}
        self.queue: list[dict] = []

    async def enqueue(self, job_type: str, payload: dict[str, Any]) -> str:
        job_id = str(uuid.uuid4())
        job = {"job_id": job_id, "job_type": job_type, "payload": payload, "status": "pending"}
        self.jobs[job_id] = job
        self.queue.append(job)
        return job_id

    async def dequeue(self, timeout: int = 5) -> dict[str, Any] | None:
        if self.queue:
            job = self.queue.pop(0)
            job["status"] = "processing"
            return job
        return None

    async def complete(self, job_id: str, result: dict[str, Any] | None = None) -> None:
        if job_id in self.jobs:
            self.jobs[job_id]["status"] = "completed"
            if result is not None:
                self.jobs[job_id]["result"] = result

    async def fail(self, job_id: str, error: str) -> None:
        if job_id in self.jobs:
            self.jobs[job_id]["status"] = "failed"
            self.jobs[job_id]["error"] = error

    async def get_job_status(self, job_id: str) -> dict[str, Any] | None:
        return self.jobs.get(job_id)


# ─── Pytest Fixtures ─────────────────────────────────────────────────────────


@pytest.fixture
def mock_llm() -> MockLLM:
    return MockLLM()


@pytest.fixture
def mock_embedding() -> MockEmbedding:
    return MockEmbedding()


@pytest.fixture
def mock_image_gen() -> MockImageGeneration:
    return MockImageGeneration()


@pytest.fixture
def mock_storage() -> MockObjectStorage:
    return MockObjectStorage()


@pytest.fixture
def mock_vector_search() -> MockVectorSearch:
    return MockVectorSearch(
        results=[
            ChunkResult(
                chunk_id=str(CHUNK_ID),
                document_id=str(DOC_ID),
                text="A classic pasta dish with tomato sauce, garlic, and basil.",
                score=0.85,
                metadata={"recipe_title": "Classic Pasta"},
            ),
        ]
    )


@pytest.fixture
def mock_job_queue() -> MockJobQueue:
    return MockJobQueue()


@pytest.fixture
def sample_ingredients() -> list[IngredientDetection]:
    return [
        IngredientDetection(name="tomatoes", normalized_name="tomatoes", confidence=0.95),
        IngredientDetection(
            name="mozzarella", normalized_name="mozzarella cheese", confidence=0.88
        ),
        IngredientDetection(name="basil leaves", normalized_name="basil", confidence=0.92),
        IngredientDetection(
            name="chicken breast", normalized_name="chicken breast", confidence=0.90
        ),
    ]


@pytest.fixture
def sample_recipe() -> GeneratedRecipe:
    return GeneratedRecipe(
        title="Caprese Chicken",
        description="Pan-seared chicken breast topped with fresh mozzarella, tomatoes, and basil.",
        ingredients=[
            {"name": "chicken breast", "amount": "2", "unit": "pieces"},
            {"name": "tomatoes", "amount": "2", "unit": "medium"},
            {"name": "mozzarella cheese", "amount": "150", "unit": "g"},
            {"name": "basil", "amount": "10", "unit": "leaves"},
            {"name": "olive oil", "amount": "2", "unit": "tbsp"},
            {"name": "salt", "amount": "1", "unit": "tsp"},
        ],
        instructions=[
            "Season chicken breasts with salt and pepper.",
            "Heat olive oil in a skillet over medium-high heat.",
            "Cook chicken for 6 minutes per side until golden.",
            "Top with sliced tomatoes and mozzarella.",
            "Cover and cook 2 minutes until cheese melts.",
            "Garnish with fresh basil leaves and serve.",
        ],
        prep_time_minutes=10,
        cook_time_minutes=15,
        servings=2,
        cuisine="Italian",
        difficulty="easy",
    )


@pytest.fixture
def sample_agent_state(
    sample_ingredients: list[IngredientDetection],
    sample_recipe: GeneratedRecipe,
    mock_vector_search: MockVectorSearch,
) -> dict:
    """A fully populated agent state for testing later pipeline stages."""
    return {
        "upload_id": str(UPLOAD_ID),
        "user_id": str(USER_ID),
        "image_bytes": b"fake-image-bytes",
        "raw_ingredients": sample_ingredients,
        "normalized_ingredients": ["tomatoes", "mozzarella cheese", "basil", "chicken breast"],
        "retrieved_context": mock_vector_search._results,
        "recipe": sample_recipe,
        "image_prompt": "A beautiful Caprese Chicken dish on a rustic wooden table.",
        "image_key": None,
        "errors": [],
    }
