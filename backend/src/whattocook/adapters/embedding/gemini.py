"""Gemini embedding adapter — uses Google's text embedding models."""

from __future__ import annotations

from langchain_google_genai import GoogleGenerativeAIEmbeddings

from whattocook.config import Settings
from whattocook.ports.embedding import EmbeddingPort


class GeminiEmbeddingAdapter(EmbeddingPort):
    """Embedding adapter using Google Gemini embedding models."""

    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._dimension = 768
        self._client = GoogleGenerativeAIEmbeddings(
            model=f"models/{settings.gemini_embedding_model_name}",
            google_api_key=settings.gemini_api_key,
        )

    async def embed(self, texts: list[str]) -> list[list[float]]:
        return await self._client.aembed_documents(texts)

    async def embed_single(self, text: str) -> list[float]:
        return await self._client.aembed_query(text)

    def get_dimension(self) -> int:
        return self._dimension
