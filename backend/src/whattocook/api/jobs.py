"""Job polling endpoints."""

from __future__ import annotations

import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from whattocook.api.auth import get_current_user_id
from whattocook.api.schemas import JobResultResponse, JobStatusResponse
from whattocook.dependencies import get_job_queue
from whattocook.ports.job_queue import JobQueuePort

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.get("/{job_id}", response_model=JobStatusResponse)
async def get_job_status(
    job_id: str,
    user_id: Annotated[uuid.UUID, Depends(get_current_user_id)],
    job_queue: JobQueuePort = Depends(get_job_queue),
) -> JobStatusResponse:
    status_data = await job_queue.get_job_status(job_id)
    if not status_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found",
        )

    payload = status_data.get("payload", {})
    owner = payload.get("user_id")
    if owner and owner != str(user_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found",
        )

    result = status_data.get("result")
    return JobStatusResponse(
        job_id=status_data["job_id"],
        status=status_data["status"],
        created_at=status_data.get("created_at"),
        started_at=status_data.get("started_at"),
        completed_at=status_data.get("completed_at"),
        error=status_data.get("error"),
        result=JobResultResponse.model_validate(result) if result else None,
    )
