"""Embedding repository — data access for embedding_documents and embedding_chunks."""

from __future__ import annotations

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from whattocook.db.models import EmbeddingChunk, EmbeddingDocument


class EmbeddingRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create_document(
        self, title: str, source_url: str = "", content_hash: str = ""
    ) -> EmbeddingDocument:
        doc = EmbeddingDocument(
            title=title,
            source_url=source_url,
            content_hash=content_hash,
        )
        self.session.add(doc)
        await self.session.flush()
        return doc

    async def create_chunk(
        self,
        document_id: uuid.UUID,
        chunk_index: int,
        text: str,
        embedding: list[float] | None = None,
        metadata_json: dict | None = None,
    ) -> EmbeddingChunk:
        chunk = EmbeddingChunk(
            document_id=document_id,
            chunk_index=chunk_index,
            text=text,
            embedding=embedding,
            metadata_json=metadata_json,
        )
        self.session.add(chunk)
        await self.session.flush()
        return chunk

    async def get_document_by_hash(self, content_hash: str) -> EmbeddingDocument | None:
        stmt = select(EmbeddingDocument).where(
            EmbeddingDocument.content_hash == content_hash
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_chunk_by_id(self, chunk_id: uuid.UUID) -> EmbeddingChunk | None:
        return await self.session.get(EmbeddingChunk, chunk_id)
