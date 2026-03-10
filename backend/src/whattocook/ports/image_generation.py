"""ImageGenerationPort — abstract interface for image generation."""

from __future__ import annotations

from abc import ABC, abstractmethod


class ImageGenerationPort(ABC):
    """Port for generating images from text prompts."""

    @abstractmethod
    async def generate(
        self,
        prompt: str,
        *,
        width: int = 1024,
        height: int = 1024,
        num_inference_steps: int = 50,
        guidance_scale: float = 7.5,
    ) -> bytes:
        """Generate an image from a text prompt.

        Args:
            prompt: Text description of the image to generate.
            width: Image width in pixels.
            height: Image height in pixels.
            num_inference_steps: Number of denoising steps.
            guidance_scale: Classifier-free guidance scale.

        Returns:
            Raw image bytes (PNG format).
        """
        ...
