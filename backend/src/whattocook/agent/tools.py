"""LangChain tool definitions for the recipe generation agent."""

from __future__ import annotations

from langchain_core.tools import tool


@tool
def search_recipes(query: str) -> str:
    """Search the recipe knowledge base for relevant recipes.

    Args:
        query: A search query describing ingredients or recipe type.

    Returns:
        Relevant recipe snippets from the knowledge base.
    """
    # This tool is used within the LangGraph pipeline via the retrieve node.
    # It serves as a declarative definition for potential agentic use.
    return f"Searching for recipes matching: {query}"


@tool
def normalize_ingredient(name: str) -> str:
    """Normalize an ingredient name to its standard culinary form.

    Args:
        name: Raw ingredient name as detected.

    Returns:
        Normalized ingredient name.
    """
    return name.lower().strip()
