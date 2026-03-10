"""Agent node: Retrieve recipe context — step 5 of the pipeline."""

from __future__ import annotations

from whattocook.agent.state import AgentState
from whattocook.ports.embedding import EmbeddingPort
from whattocook.ports.vector_search import VectorSearchPort


async def retrieve_context(
    state: AgentState,
    embedding: EmbeddingPort,
    vector_search: VectorSearchPort,
) -> dict:
    """Retrieve relevant recipe context using pgvector similarity search.

    Embeds the normalized ingredients as a query and retrieves
    the most similar recipe chunks from the knowledge base.
    """
    normalized_ingredients = state["normalized_ingredients"]

    # Create a single query from all ingredients
    query_text = "Recipe using: " + ", ".join(normalized_ingredients)

    # Generate embedding for the query
    query_embedding = await embedding.embed_single(query_text)

    # Search for similar recipe chunks
    results = await vector_search.search(
        query_embedding=query_embedding,
        top_k=5,
        min_score=0.3,
    )

    return {"retrieved_context": results}
