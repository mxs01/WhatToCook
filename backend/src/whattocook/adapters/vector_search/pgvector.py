"""PgVector adapter — vector similarity search using PostgreSQL + pgvector."""

from __future__ import annotations

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from whattocook.domain.models import ChunkResult
from whattocook.ports.vector_search import VectorSearchPort


class PgVectorAdapter(VectorSearchPort):
    """Vector search adapter using pgvector cosine similarity."""

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def search(
        self,
        query_embedding: list[float],
        top_k: int = 5,
        *,
        min_score: float = 0.0,
    ) -> list[ChunkResult]:
        # pgvector cosine distance: 1 - (a <=> b) gives cosine similarity
        embedding_str = "[" + ",".join(str(x) for x in query_embedding) + "]"

        query = text("""
            SELECT
                ec.id::text AS chunk_id,
                ec.document_id::text AS document_id,
                ec.text,
                1 - (ec.embedding <=> CAST(:embedding AS vector)) AS score,
                ec.metadata_json
            FROM embedding_chunks ec
            WHERE ec.embedding IS NOT NULL
            ORDER BY ec.embedding <=> CAST(:embedding AS vector)
            LIMIT :top_k
        """)

        result = await self._session.execute(
            query,
            {"embedding": embedding_str, "top_k": top_k},
        )

        chunks = []
        for row in result.mappings():
            score = float(row["score"])
            if score < min_score:
                continue
            chunks.append(
                ChunkResult(
                    chunk_id=row["chunk_id"],
                    document_id=row["document_id"],
                    text=row["text"],
                    score=score,
                    metadata=row["metadata_json"] or {},
                )
            )

        return chunks
