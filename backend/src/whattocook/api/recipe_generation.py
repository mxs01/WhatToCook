"""Text-to-recipe generation endpoints."""

from __future__ import annotations

import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, status

from whattocook.api.auth import get_current_user_id
from whattocook.api.schemas import GenerateRecipeRequest, JobResponse
from whattocook.dependencies import get_job_queue
from whattocook.ports.job_queue import JobQueuePort

router = APIRouter(prefix="/recipes", tags=["recipes"])


@router.post("/generate", response_model=JobResponse, status_code=status.HTTP_202_ACCEPTED)
async def generate_recipe_from_text(
    body: GenerateRecipeRequest,
    user_id: Annotated[uuid.UUID, Depends(get_current_user_id)],
    job_queue: JobQueuePort = Depends(get_job_queue),
) -> JobResponse:
    """Start async text-based recipe generation."""
    job_id = await job_queue.enqueue(
        job_type="process_text_recipe_generation",
        payload={
            "user_id": str(user_id),
            "prompt": body.prompt,
            "preferences": body.preferences,
        },
    )
    return JobResponse(job_id=job_id, upload_id=None, status="pending")
