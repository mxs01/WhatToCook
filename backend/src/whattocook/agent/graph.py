"""LangGraph pipeline — recipe generation graph definition and compilation."""

from __future__ import annotations

from typing import Any

from langgraph.graph import END, StateGraph

from whattocook.agent.nodes.analyze_image import analyze_image
from whattocook.agent.nodes.create_image import create_image
from whattocook.agent.nodes.generate_image_prompt import generate_image_prompt
from whattocook.agent.nodes.generate_recipe import generate_recipe
from whattocook.agent.nodes.normalize import normalize_ingredients
from whattocook.agent.nodes.persist import persist
from whattocook.agent.nodes.retrieve import retrieve_context
from whattocook.agent.state import AgentState
from whattocook.ports.embedding import EmbeddingPort
from whattocook.ports.image_generation import ImageGenerationPort
from whattocook.ports.llm import LLMPort
from whattocook.ports.object_storage import ObjectStoragePort
from whattocook.ports.vector_search import VectorSearchPort


def build_recipe_graph(
    llm: LLMPort,
    embedding: EmbeddingPort,
    vector_search: VectorSearchPort,
    image_gen: ImageGenerationPort,
    storage: ObjectStoragePort,
    db_session: Any,
) -> StateGraph:
    """Build and compile the recipe generation LangGraph pipeline.

    The pipeline is a deterministic linear graph:
    analyze_image -> normalize -> retrieve -> generate_recipe ->
    generate_image_prompt -> create_image -> persist

    Args:
        llm: LLM port for text/vision generation.
        embedding: Embedding port for query vectorization.
        vector_search: Vector search port for RAG retrieval.
        image_gen: Image generation port for FLUX.
        storage: Object storage port for saving images.
        db_session: SQLAlchemy async session for persistence.

    Returns:
        A compiled LangGraph StateGraph ready to invoke.
    """

    # Create node functions that close over the dependencies
    async def node_analyze_image(state: AgentState) -> dict:
        return await analyze_image(state, llm)

    async def node_normalize(state: AgentState) -> dict:
        return await normalize_ingredients(state, llm)

    async def node_retrieve(state: AgentState) -> dict:
        return await retrieve_context(state, embedding, vector_search)

    async def node_generate_recipe(state: AgentState) -> dict:
        return await generate_recipe(state, llm)

    async def node_generate_image_prompt(state: AgentState) -> dict:
        return await generate_image_prompt(state, llm)

    async def node_create_image(state: AgentState) -> dict:
        return await create_image(state, image_gen, storage)

    async def node_persist(state: AgentState) -> dict:
        return await persist(state, db_session)

    # Build the graph
    graph = StateGraph(AgentState)

    # Add nodes
    graph.add_node("analyze_image", node_analyze_image)
    graph.add_node("normalize", node_normalize)
    graph.add_node("retrieve", node_retrieve)
    graph.add_node("generate_recipe", node_generate_recipe)
    graph.add_node("generate_image_prompt", node_generate_image_prompt)
    graph.add_node("create_image", node_create_image)
    graph.add_node("persist", node_persist)

    # Define edges (deterministic linear pipeline)
    graph.set_entry_point("analyze_image")
    graph.add_edge("analyze_image", "normalize")
    graph.add_edge("normalize", "retrieve")
    graph.add_edge("retrieve", "generate_recipe")
    graph.add_edge("generate_recipe", "generate_image_prompt")
    graph.add_edge("generate_image_prompt", "create_image")
    graph.add_edge("create_image", "persist")
    graph.add_edge("persist", END)

    return graph.compile()
