"""VectorSearchPort — abstract interface for vector similarity search."""

from __future__ import annotations

from abc import ABC, abstractmethod

from whattocook.domain.models import ChunkResult


class VectorSearchPort(ABC):
    """Port for vector similarity search over embedding chunks."""

    @abstractmethod
    async def search(
        self,
        query_embedding: list[float],
        top_k: int = 5,
        *,
        min_score: float = 0.0,
    ) -> list[ChunkResult]:
        """Search for the most similar chunks to a query embedding.

        Args:
            query_embedding: The query vector.
            top_k: Maximum number of results to return.
            min_score: Minimum similarity score threshold.

        Returns:
            List of ChunkResult sorted by descending similarity score.
        """
        ...
