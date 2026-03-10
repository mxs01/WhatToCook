"""Mock embedding adapter — returns zero vectors for end-to-end testing."""

from __future__ import annotations

import logging

from whattocook.ports.embedding import EmbeddingPort

logger = logging.getLogger(__name__)

# Use 768-d to match the dimension used by the local vLLM embedding adapter.
_DIMENSION = 768


class MockEmbeddingAdapter(EmbeddingPort):
    """Embedding adapter that returns deterministic zero vectors.

    Useful for running the full pipeline without a real embedding model.
    Vector search will still work (returning whatever is in pgvector),
    but similarity scores will be meaningless.
    """

    async def embed(self, texts: list[str]) -> list[list[float]]:
        logger.info("MockEmbedding: embedding %d texts (zero vectors)", len(texts))
        return [[0.0] * _DIMENSION for _ in texts]

    async def embed_single(self, text: str) -> list[float]:
        logger.info("MockEmbedding: embedding single text (zero vector)")
        return [0.0] * _DIMENSION

    def get_dimension(self) -> int:
        return _DIMENSION
