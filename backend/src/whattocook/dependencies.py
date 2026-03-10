"""FastAPI dependency injection — wires ports to adapter implementations."""

from __future__ import annotations

from functools import lru_cache

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from whattocook.config import Settings, get_settings
from whattocook.db.session import get_session
from whattocook.ports.embedding import EmbeddingPort
from whattocook.ports.image_generation import ImageGenerationPort
from whattocook.ports.job_queue import JobQueuePort
from whattocook.ports.llm import LLMPort
from whattocook.ports.object_storage import ObjectStoragePort
from whattocook.ports.vector_search import VectorSearchPort


@lru_cache
def _get_settings() -> Settings:
    return get_settings()


def get_llm(settings: Settings = Depends(_get_settings)) -> LLMPort:
    """Resolve LLM adapter based on configuration."""
    if settings.llm_provider == "mock":
        from whattocook.adapters.llm.mock import MockLLMAdapter

        return MockLLMAdapter()
    if settings.llm_provider == "gemini":
        from whattocook.adapters.llm.gemini import GeminiAdapter

        return GeminiAdapter(settings)
    from whattocook.adapters.llm.local_vllm import LocalVLLMAdapter

    return LocalVLLMAdapter(settings)


def get_embedding(settings: Settings = Depends(_get_settings)) -> EmbeddingPort:
    """Resolve Embedding adapter based on configuration."""
    if settings.embedding_provider == "mock":
        from whattocook.adapters.embedding.mock import MockEmbeddingAdapter

        return MockEmbeddingAdapter()
    if settings.embedding_provider == "gemini":
        from whattocook.adapters.embedding.gemini import GeminiEmbeddingAdapter

        return GeminiEmbeddingAdapter(settings)
    from whattocook.adapters.embedding.local_vllm import LocalVLLMEmbeddingAdapter

    return LocalVLLMEmbeddingAdapter(settings)


def get_image_generation(settings: Settings = Depends(_get_settings)) -> ImageGenerationPort:
    """Resolve Image Generation adapter."""
    if settings.llm_provider == "mock":
        from whattocook.adapters.image_generation.mock import MockImageGenerationAdapter

        return MockImageGenerationAdapter()
    from whattocook.adapters.image_generation.flux_dev import FluxDevImageAdapter

    return FluxDevImageAdapter(settings)


def get_object_storage(settings: Settings = Depends(_get_settings)) -> ObjectStoragePort:
    """Resolve Object Storage adapter."""
    from whattocook.adapters.storage.s3_compatible import S3CompatibleStorageAdapter

    return S3CompatibleStorageAdapter(settings)


def get_vector_search(session: AsyncSession = Depends(get_session)) -> VectorSearchPort:
    """Resolve Vector Search adapter."""
    from whattocook.adapters.vector_search.pgvector import PgVectorAdapter

    return PgVectorAdapter(session)


def get_job_queue(settings: Settings = Depends(_get_settings)) -> JobQueuePort:
    """Resolve Job Queue adapter."""
    from whattocook.adapters.job_queue.redis_queue import RedisQueueAdapter

    return RedisQueueAdapter(settings)
