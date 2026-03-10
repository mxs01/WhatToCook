"""Agent node: Create recipe image — step 9 of the pipeline."""

from __future__ import annotations

import uuid

from whattocook.agent.state import AgentState
from whattocook.ports.image_generation import ImageGenerationPort
from whattocook.ports.object_storage import ObjectStoragePort


async def create_image(
    state: AgentState,
    image_gen: ImageGenerationPort,
    storage: ObjectStoragePort,
) -> dict:
    """Generate a recipe image using FLUX dev and store it in object storage."""
    image_prompt = state["image_prompt"]
    upload_id = state["upload_id"]

    try:
        # Generate image
        image_bytes = await image_gen.generate(
            prompt=image_prompt,
            width=1024,
            height=1024,
            num_inference_steps=30,
            guidance_scale=7.5,
        )

        # Store in object storage
        image_key = f"recipe-images/{upload_id}/{uuid.uuid4()}.png"
        await storage.upload(
            key=image_key,
            data=image_bytes,
            content_type="image/png",
        )

        return {"image_key": image_key}
    except Exception as e:
        # Image generation is non-critical — recipe still valid without it
        errors = state.get("errors", [])
        errors.append(f"Image generation failed: {e}")
        return {"image_key": None, "errors": errors}
