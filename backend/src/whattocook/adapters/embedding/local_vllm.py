"""Local vLLM embedding adapter — uses vLLM's OpenAI-compatible embeddings endpoint."""

from __future__ import annotations

from langchain_openai import OpenAIEmbeddings

from whattocook.config import Settings
from whattocook.ports.embedding import EmbeddingPort


class LocalVLLMEmbeddingAdapter(EmbeddingPort):
    """Embedding adapter using a local vLLM server's OpenAI-compatible API."""

    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._dimension = 768
        self._client = OpenAIEmbeddings(
            base_url=settings.vllm_embedding_base_url,
            api_key=settings.vllm_api_key,
            model=settings.vllm_embedding_model_name,
        )

    async def embed(self, texts: list[str]) -> list[list[float]]:
        return await self._client.aembed_documents(texts)

    async def embed_single(self, text: str) -> list[float]:
        return await self._client.aembed_query(text)

    def get_dimension(self) -> int:
        return self._dimension
