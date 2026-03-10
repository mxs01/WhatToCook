"""Seed script — populate the recipe knowledge base with sample recipes for RAG.

Usage:
    python -m scripts.seed_recipes

Requires a running PostgreSQL with pgvector and an embedding provider.
"""

from __future__ import annotations

import asyncio
import hashlib
import logging

from whattocook.config import get_settings
from whattocook.db.repositories.embedding import EmbeddingRepository
from whattocook.db.session import async_session_factory
from whattocook.dependencies import get_embedding

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Sample recipe corpus for seeding the knowledge base
SAMPLE_RECIPES = [
    {
        "title": "Classic Tomato Basil Pasta",
        "content": (
            "A simple Italian pasta dish. Cook spaghetti al dente. In a pan, sauté garlic in "
            "olive oil, add crushed tomatoes, salt, pepper, and red pepper flakes. Simmer for "
            "15 minutes. Toss with pasta and fresh basil leaves. Finish with grated Parmesan. "
            "Best with San Marzano tomatoes and fresh basil from the garden."
        ),
    },
    {
        "title": "Chicken Stir-Fry with Vegetables",
        "content": (
            "A quick Asian-inspired stir-fry. Slice chicken breast into strips, marinate in soy "
            "sauce, sesame oil, and cornstarch. Stir-fry bell peppers, broccoli, snap peas, and "
            "carrots in a hot wok. Add chicken and cook until done. Finish with a sauce of soy "
            "sauce, oyster sauce, ginger, and garlic. Serve over steamed rice."
        ),
    },
    {
        "title": "Greek Salad",
        "content": (
            "A refreshing Mediterranean salad. Combine chopped cucumber, tomatoes, red onion, "
            "and Kalamata olives. Add cubed feta cheese. Dress with extra virgin olive oil, "
            "red wine vinegar, dried oregano, salt, and pepper. Let sit for 10 minutes before "
            "serving to let flavors meld. Serve with warm pita bread."
        ),
    },
    {
        "title": "Beef Tacos with Fresh Salsa",
        "content": (
            "Season ground beef with cumin, chili powder, paprika, garlic powder, and oregano. "
            "Cook until browned. Make fresh salsa with diced tomatoes, onion, jalapeño, cilantro, "
            "and lime juice. Warm corn tortillas. Serve beef in tortillas topped with salsa, "
            "shredded lettuce, sour cream, and shredded cheese."
        ),
    },
    {
        "title": "Creamy Mushroom Risotto",
        "content": (
            "An Italian classic. Sauté sliced mushrooms in butter until golden. In another pan, "
            "toast Arborio rice, then gradually add warm chicken broth, stirring constantly. "
            "After 18-20 minutes, rice should be creamy. Fold in mushrooms, Parmesan cheese, "
            "and a knob of butter. Season with salt, pepper, and fresh thyme."
        ),
    },
    {
        "title": "Honey Garlic Salmon",
        "content": (
            "Mix honey, soy sauce, minced garlic, and lemon juice for the glaze. Place salmon "
            "fillets skin-side down on a lined baking sheet. Brush generously with glaze. "
            "Bake at 400°F for 12-15 minutes. Broil for the last 2 minutes for caramelization. "
            "Serve with steamed broccoli and rice."
        ),
    },
    {
        "title": "Vegetable Curry",
        "content": (
            "Sauté onion, garlic, and ginger in oil. Add curry powder, turmeric, cumin, and "
            "garam masala. Add diced potatoes, chickpeas, cauliflower florets, and coconut milk. "
            "Simmer for 25 minutes until potatoes are tender. Stir in spinach and lime juice. "
            "Serve over basmati rice with naan bread and cilantro."
        ),
    },
    {
        "title": "Caesar Salad with Grilled Chicken",
        "content": (
            "Grill seasoned chicken breasts until cooked through, let rest and slice. "
            "Make dressing: blend anchovy paste, garlic, lemon juice, Dijon mustard, egg yolk, "
            "Worcestershire sauce, olive oil, and Parmesan. Toss romaine lettuce with dressing "
            "and croutons. Top with chicken and shaved Parmesan."
        ),
    },
    {
        "title": "Banana Pancakes",
        "content": (
            "Mash ripe bananas and mix with eggs, flour, baking powder, milk, and vanilla extract. "
            "Cook on a buttered griddle until bubbles form, then flip. Serve stacked with maple "
            "syrup, sliced bananas, and a sprinkle of cinnamon. Add blueberries to the batter "
            "for extra flavor."
        ),
    },
    {
        "title": "Caprese Sandwich",
        "content": (
            "Slice fresh mozzarella and ripe tomatoes. Layer on ciabatta bread with fresh basil "
            "leaves. Drizzle with balsamic glaze and extra virgin olive oil. Season with salt "
            "and pepper. Press on a panini grill until bread is crispy and cheese melts. "
            "Great for lunch with a side of mixed greens."
        ),
    },
    {
        "title": "Egg Fried Rice",
        "content": (
            "Use day-old cold rice for best results. Heat oil in a wok, scramble eggs and set "
            "aside. Stir-fry diced carrots, peas, and corn. Add rice, soy sauce, sesame oil, "
            "and white pepper. Toss in scrambled eggs and sliced green onions. "
            "Add shrimp or chicken for protein."
        ),
    },
    {
        "title": "Minestrone Soup",
        "content": (
            "Sauté onion, celery, and carrots in olive oil. Add garlic, diced tomatoes, "
            "chicken broth, cannellini beans, ditalini pasta, zucchini, and green beans. "
            "Season with Italian herbs, salt, and pepper. Simmer until pasta is cooked. "
            "Serve with crusty bread and a drizzle of olive oil. Top with Parmesan."
        ),
    },
]


def chunk_text(text: str, chunk_size: int = 300, overlap: int = 50) -> list[str]:
    """Split text into overlapping chunks."""
    if len(text) <= chunk_size:
        return [text]
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start = end - overlap
    return chunks


async def seed() -> None:
    """Seed the database with sample recipe data."""
    settings = get_settings()
    embedding_port = get_embedding(settings)

    async with async_session_factory() as session:
        repo = EmbeddingRepository(session)

        for recipe in SAMPLE_RECIPES:
            content = f"{recipe['title']}. {recipe['content']}"
            content_hash = hashlib.sha256(content.encode()).hexdigest()

            # Skip if already seeded
            existing = await repo.get_document_by_hash(content_hash)
            if existing:
                logger.info(f"Skipping (already exists): {recipe['title']}")
                continue

            logger.info(f"Seeding: {recipe['title']}")

            # Create document
            doc = await repo.create_document(
                title=recipe["title"],
                source_url="seed_data",
                content_hash=content_hash,
            )

            # Chunk and embed
            chunks = chunk_text(content)
            embeddings = await embedding_port.embed(chunks)

            for i, (chunk_text_val, embedding) in enumerate(zip(chunks, embeddings)):
                await repo.create_chunk(
                    document_id=doc.id,
                    chunk_index=i,
                    text=chunk_text_val,
                    embedding=embedding,
                    metadata_json={"title": recipe["title"]},
                )

        await session.commit()
        logger.info(f"Seeded {len(SAMPLE_RECIPES)} recipes.")


if __name__ == "__main__":
    asyncio.run(seed())
