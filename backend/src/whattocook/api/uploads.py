"""Upload API endpoints — fridge image upload and status."""

from __future__ import annotations

import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from whattocook.api.auth import get_current_user_id
from whattocook.api.schemas import (
    IngredientResponse,
    JobResponse,
    UploadDetailResponse,
)
from whattocook.db.repositories.upload import UploadRepository
from whattocook.db.session import get_session
from whattocook.dependencies import get_job_queue, get_object_storage
from whattocook.ports.job_queue import JobQueuePort
from whattocook.ports.object_storage import ObjectStoragePort

router = APIRouter(prefix="/uploads", tags=["uploads"])


@router.post("/fridge", response_model=JobResponse, status_code=status.HTTP_202_ACCEPTED)
async def upload_fridge_image(
    file: UploadFile,
    user_id: Annotated[uuid.UUID, Depends(get_current_user_id)],
    session: AsyncSession = Depends(get_session),
    storage: ObjectStoragePort = Depends(get_object_storage),
    job_queue: JobQueuePort = Depends(get_job_queue),
) -> JobResponse:
    """Upload a fridge image and trigger recipe generation."""
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be an image (JPEG, PNG)",
        )

    # Read file content
    image_bytes = await file.read()
    if len(image_bytes) > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="Image size must be under 10MB",
        )

    # Upload to object storage
    image_key = f"fridge-uploads/{user_id}/{uuid.uuid4()}.jpg"
    await storage.upload(key=image_key, data=image_bytes, content_type=file.content_type)

    # Create upload record
    repo = UploadRepository(session)
    upload = await repo.create(user_id=user_id, image_key=image_key)
    await session.commit()

    # Enqueue background job
    job_id = await job_queue.enqueue(
        job_type="process_fridge_upload",
        payload={
            "upload_id": str(upload.id),
            "user_id": str(user_id),
            "image_key": image_key,
        },
    )

    return JobResponse(job_id=job_id, upload_id=str(upload.id), status="pending")


@router.get("/{upload_id}", response_model=UploadDetailResponse)
async def get_upload(
    upload_id: uuid.UUID,
    user_id: Annotated[uuid.UUID, Depends(get_current_user_id)],
    session: AsyncSession = Depends(get_session),
) -> UploadDetailResponse:
    """Get upload status and detected ingredients."""
    repo = UploadRepository(session)
    upload = await repo.get_by_id(upload_id)

    if not upload or upload.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Upload not found",
        )

    ingredients = [
        IngredientResponse(
            name=det.name,
            normalized_name=det.normalized_name,
            confidence=det.confidence,
        )
        for det in upload.ingredient_detections
    ]

    recipe_id = upload.recipes[0].id if upload.recipes else None

    return UploadDetailResponse(
        id=upload.id,
        status=upload.status,
        image_key=upload.image_key,
        created_at=upload.created_at,
        ingredients=ingredients,
        recipe_id=recipe_id,
    )
