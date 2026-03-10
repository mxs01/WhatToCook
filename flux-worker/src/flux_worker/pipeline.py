"""FLUX dev pipeline wrapper around diffusers."""

from __future__ import annotations

import logging

import torch
from diffusers import FluxPipeline as DiffusersFluxPipeline
from PIL import Image

logger = logging.getLogger(__name__)


class FluxPipeline:
    """Wrapper around the diffusers FLUX dev pipeline."""

    def __init__(self, model_id: str = "black-forest-labs/FLUX.1-dev") -> None:
        self._model_id = model_id
        self._device = "cuda" if torch.cuda.is_available() else "cpu"
        self._dtype = torch.float16 if self._device == "cuda" else torch.float32

        logger.info(f"Loading FLUX model {model_id} on {self._device}...")
        self._pipe = DiffusersFluxPipeline.from_pretrained(
            model_id,
            torch_dtype=self._dtype,
        )
        self._pipe.to(self._device)

        # Enable memory optimizations if on GPU
        if self._device == "cuda":
            self._pipe.enable_model_cpu_offload()

        logger.info("FLUX pipeline ready.")

    def generate(
        self,
        prompt: str,
        width: int = 1024,
        height: int = 1024,
        num_inference_steps: int = 30,
        guidance_scale: float = 7.5,
    ) -> Image.Image:
        """Generate an image from a text prompt.

        Args:
            prompt: Text description of the image to generate.
            width: Image width in pixels.
            height: Image height in pixels.
            num_inference_steps: Number of denoising steps.
            guidance_scale: Classifier-free guidance scale.

        Returns:
            A PIL Image.
        """
        result = self._pipe(
            prompt=prompt,
            width=width,
            height=height,
            num_inference_steps=num_inference_steps,
            guidance_scale=guidance_scale,
        )
        return result.images[0]
