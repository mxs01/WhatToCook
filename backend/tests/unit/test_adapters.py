"""Unit tests for adapter implementations (mock external dependencies)."""

from __future__ import annotations

import json
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from whattocook.domain.exceptions import ImageGenerationError, StorageError

from tests.conftest import (
    MockEmbedding,
    MockImageGeneration,
    MockJobQueue,
    MockObjectStorage,
    MockVectorSearch,
)


# ─── MockObjectStorage tests ────────────────────────────────────────────────


class TestMockObjectStorage:
    """Validate our MockObjectStorage behaves correctly (meta-test for the mock)."""

    @pytest.mark.asyncio
    async def test_upload_and_download(self, mock_storage: MockObjectStorage) -> None:
        key = await mock_storage.upload("test/file.png", b"image-data", "image/png")
        assert key == "test/file.png"

        data = await mock_storage.download("test/file.png")
        assert data == b"image-data"

    @pytest.mark.asyncio
    async def test_download_nonexistent_raises(self, mock_storage: MockObjectStorage) -> None:
        with pytest.raises(KeyError, match="Object not found"):
            await mock_storage.download("nonexistent/key")

    @pytest.mark.asyncio
    async def test_delete(self, mock_storage: MockObjectStorage) -> None:
        await mock_storage.upload("to-delete.txt", b"data")
        await mock_storage.delete("to-delete.txt")

        with pytest.raises(KeyError):
            await mock_storage.download("to-delete.txt")

    @pytest.mark.asyncio
    async def test_presigned_url(self, mock_storage: MockObjectStorage) -> None:
        url = await mock_storage.get_presigned_url("my/key.png", expires_in=600)
        assert "my/key.png" in url
        assert "600" in url


# ─── MockEmbedding tests ────────────────────────────────────────────────────


class TestMockEmbedding:
    @pytest.mark.asyncio
    async def test_embed_single_returns_correct_dimension(
        self, mock_embedding: MockEmbedding
    ) -> None:
        vec = await mock_embedding.embed_single("test text")
        assert len(vec) == 768
        assert all(v == 0.0 for v in vec)

    @pytest.mark.asyncio
    async def test_embed_batch(self, mock_embedding: MockEmbedding) -> None:
        vecs = await mock_embedding.embed(["text 1", "text 2", "text 3"])
        assert len(vecs) == 3
        for vec in vecs:
            assert len(vec) == 768

    def test_get_dimension(self, mock_embedding: MockEmbedding) -> None:
        assert mock_embedding.get_dimension() == 768


# ─── MockVectorSearch tests ─────────────────────────────────────────────────


class TestMockVectorSearch:
    @pytest.mark.asyncio
    async def test_returns_configured_results(
        self, mock_vector_search: MockVectorSearch
    ) -> None:
        results = await mock_vector_search.search(
            query_embedding=[0.0] * 768,
            top_k=10,
            min_score=0.0,
        )
        assert len(results) == 1
        assert results[0].score == 0.85

    @pytest.mark.asyncio
    async def test_filters_by_min_score(self) -> None:
        from whattocook.domain.models import ChunkResult

        search = MockVectorSearch(results=[
            ChunkResult(chunk_id="1", document_id="1", text="low", score=0.1),
            ChunkResult(chunk_id="2", document_id="2", text="high", score=0.9),
        ])
        results = await search.search([0.0] * 768, top_k=10, min_score=0.5)
        assert len(results) == 1
        assert results[0].text == "high"

    @pytest.mark.asyncio
    async def test_respects_top_k(self) -> None:
        from whattocook.domain.models import ChunkResult

        search = MockVectorSearch(results=[
            ChunkResult(chunk_id=str(i), document_id="1", text=f"result {i}", score=0.9)
            for i in range(10)
        ])
        results = await search.search([0.0] * 768, top_k=3)
        assert len(results) == 3


# ─── MockJobQueue tests ─────────────────────────────────────────────────────


class TestMockJobQueue:
    @pytest.mark.asyncio
    async def test_enqueue_and_dequeue(self, mock_job_queue: MockJobQueue) -> None:
        job_id = await mock_job_queue.enqueue(
            "process_fridge_upload",
            {"upload_id": "123"},
        )
        assert job_id is not None

        job = await mock_job_queue.dequeue()
        assert job is not None
        assert job["job_type"] == "process_fridge_upload"
        assert job["payload"]["upload_id"] == "123"
        assert job["status"] == "processing"

    @pytest.mark.asyncio
    async def test_dequeue_empty_returns_none(self, mock_job_queue: MockJobQueue) -> None:
        job = await mock_job_queue.dequeue()
        assert job is None

    @pytest.mark.asyncio
    async def test_complete_marks_status(self, mock_job_queue: MockJobQueue) -> None:
        job_id = await mock_job_queue.enqueue("test", {})
        await mock_job_queue.complete(job_id)
        assert mock_job_queue.jobs[job_id]["status"] == "completed"

    @pytest.mark.asyncio
    async def test_fail_marks_status_with_error(self, mock_job_queue: MockJobQueue) -> None:
        job_id = await mock_job_queue.enqueue("test", {})
        await mock_job_queue.fail(job_id, "Something went wrong")
        assert mock_job_queue.jobs[job_id]["status"] == "failed"
        assert mock_job_queue.jobs[job_id]["error"] == "Something went wrong"


# ─── MockImageGeneration tests ──────────────────────────────────────────────


class TestMockImageGeneration:
    @pytest.mark.asyncio
    async def test_returns_png_bytes(self, mock_image_gen: MockImageGeneration) -> None:
        result = await mock_image_gen.generate("A photo of pasta")
        assert result.startswith(b"\x89PNG")
        assert len(mock_image_gen.calls) == 1
        assert mock_image_gen.calls[0]["prompt"] == "A photo of pasta"

    @pytest.mark.asyncio
    async def test_records_dimensions(self, mock_image_gen: MockImageGeneration) -> None:
        await mock_image_gen.generate("test", width=512, height=512)
        assert mock_image_gen.calls[0]["width"] == 512
        assert mock_image_gen.calls[0]["height"] == 512


# ─── FluxDevImageAdapter (mocked httpx) ─────────────────────────────────────


class TestFluxDevImageAdapter:
    @pytest.mark.asyncio
    async def test_calls_flux_worker(self) -> None:
        from whattocook.adapters.image_generation.flux_dev import FluxDevImageAdapter

        mock_settings = MagicMock()
        mock_settings.flux_worker_url = "http://localhost:8100"

        adapter = FluxDevImageAdapter(mock_settings)

        mock_response = MagicMock()
        mock_response.content = b"\x89PNG-fake-image"
        mock_response.raise_for_status = MagicMock()

        with patch.object(adapter._client, "post", new=AsyncMock(return_value=mock_response)):
            result = await adapter.generate("A pasta dish", width=512, height=512)

        assert result == b"\x89PNG-fake-image"

    @pytest.mark.asyncio
    async def test_raises_on_http_error(self) -> None:
        import httpx
        from whattocook.adapters.image_generation.flux_dev import FluxDevImageAdapter

        mock_settings = MagicMock()
        mock_settings.flux_worker_url = "http://localhost:8100"

        adapter = FluxDevImageAdapter(mock_settings)

        mock_response = MagicMock()
        mock_response.status_code = 500
        mock_response.text = "Internal Server Error"
        error = httpx.HTTPStatusError(
            "Server Error", request=MagicMock(), response=mock_response
        )

        with patch.object(adapter._client, "post", new=AsyncMock(side_effect=error)):
            with pytest.raises(ImageGenerationError, match="500"):
                await adapter.generate("test prompt")


# ─── Auth helpers ────────────────────────────────────────────────────────────


class TestAuthHelpers:
    def test_hash_and_verify_password(self) -> None:
        from whattocook.api.auth import hash_password, verify_password

        hashed = hash_password("my_secure_password")
        assert hashed != "my_secure_password"
        assert verify_password("my_secure_password", hashed)
        assert not verify_password("wrong_password", hashed)

    def test_create_access_token_is_decodable(self) -> None:
        import uuid
        from jose import jwt
        from whattocook.api.auth import create_access_token

        mock_settings = MagicMock()
        mock_settings.jwt_secret_key = "test-secret-key"
        mock_settings.jwt_algorithm = "HS256"
        mock_settings.jwt_access_token_expire_minutes = 30

        user_id = uuid.uuid4()
        token = create_access_token(user_id, mock_settings)

        payload = jwt.decode(token, "test-secret-key", algorithms=["HS256"])
        assert payload["sub"] == str(user_id)
        assert payload["type"] == "access"

    def test_create_refresh_token_is_decodable(self) -> None:
        import uuid
        from jose import jwt
        from whattocook.api.auth import create_refresh_token

        mock_settings = MagicMock()
        mock_settings.jwt_secret_key = "test-secret-key"
        mock_settings.jwt_algorithm = "HS256"
        mock_settings.jwt_refresh_token_expire_days = 7

        user_id = uuid.uuid4()
        token = create_refresh_token(user_id, mock_settings)

        payload = jwt.decode(token, "test-secret-key", algorithms=["HS256"])
        assert payload["sub"] == str(user_id)
        assert payload["type"] == "refresh"
