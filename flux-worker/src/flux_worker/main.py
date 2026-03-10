"""FLUX dev worker — FastAPI service wrapping the diffusers pipeline."""

from __future__ import annotations

import io
import logging

from fastapi import FastAPI, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel, Field

from flux_worker.pipeline import FluxPipeline

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="FLUX Dev Worker", version="0.1.0")

# Pipeline is loaded lazily on first request
_pipeline: FluxPipeline | None = None


def get_pipeline() -> FluxPipeline:
    global _pipeline
    if _pipeline is None:
        logger.info("Loading FLUX dev pipeline...")
        _pipeline = FluxPipeline()
        logger.info("FLUX dev pipeline loaded.")
    return _pipeline


class GenerateRequest(BaseModel):
    prompt: str = Field(description="Text prompt for image generation")
    width: int = Field(default=1024, ge=256, le=2048)
    height: int = Field(default=1024, ge=256, le=2048)
    num_inference_steps: int = Field(default=30, ge=1, le=100)
    guidance_scale: float = Field(default=7.5, ge=0.0, le=20.0)


@app.post("/generate")
async def generate(request: GenerateRequest) -> Response:
    """Generate an image from a text prompt using FLUX dev."""
    try:
        pipeline = get_pipeline()
        image = pipeline.generate(
            prompt=request.prompt,
            width=request.width,
            height=request.height,
            num_inference_steps=request.num_inference_steps,
            guidance_scale=request.guidance_scale,
        )

        # Convert PIL Image to PNG bytes
        buffer = io.BytesIO()
        image.save(buffer, format="PNG")
        buffer.seek(0)

        return Response(content=buffer.read(), media_type="image/png")
    except Exception as e:
        logger.exception(f"Image generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e)) from e


@app.get("/health")
async def health() -> dict:
    return {"status": "ok", "model": "flux-dev"}
