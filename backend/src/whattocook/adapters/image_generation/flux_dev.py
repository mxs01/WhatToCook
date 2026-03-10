"""FLUX dev image generation adapter — calls the custom FLUX FastAPI worker."""

from __future__ import annotations

import httpx

from whattocook.config import Settings
from whattocook.domain.exceptions import ImageGenerationError
from whattocook.ports.image_generation import ImageGenerationPort


class FluxDevImageAdapter(ImageGenerationPort):
    """Image generation adapter using a custom FLUX dev FastAPI worker."""

    def __init__(self, settings: Settings) -> None:
        self._base_url = settings.flux_worker_url
        self._client = httpx.AsyncClient(timeout=120.0)

    async def generate(
        self,
        prompt: str,
        *,
        width: int = 1024,
        height: int = 1024,
        num_inference_steps: int = 50,
        guidance_scale: float = 7.5,
    ) -> bytes:
        try:
            response = await self._client.post(
                f"{self._base_url}/generate",
                json={
                    "prompt": prompt,
                    "width": width,
                    "height": height,
                    "num_inference_steps": num_inference_steps,
                    "guidance_scale": guidance_scale,
                },
            )
            response.raise_for_status()
            return response.content
        except httpx.HTTPStatusError as e:
            raise ImageGenerationError(
                f"FLUX worker returned {e.response.status_code}: {e.response.text}"
            ) from e
        except httpx.RequestError as e:
            raise ImageGenerationError(
                f"Failed to connect to FLUX worker at {self._base_url}: {e}"
            ) from e
