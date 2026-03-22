"""Upload repository — data access for fridge_uploads and ingredient_detections."""

from __future__ import annotations

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from whattocook.db.models import FridgeUpload, IngredientDetection


class UploadRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(self, user_id: uuid.UUID, image_key: str) -> FridgeUpload:
        upload = FridgeUpload(user_id=user_id, image_key=image_key)
        self.session.add(upload)
        await self.session.flush()
        return upload

    async def get_by_id(self, upload_id: uuid.UUID) -> FridgeUpload | None:
        stmt = (
            select(FridgeUpload)
            .where(FridgeUpload.id == upload_id)
            .options(
                selectinload(FridgeUpload.ingredient_detections),
                selectinload(FridgeUpload.recipes),
            )
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def update_status(self, upload_id: uuid.UUID, status: str) -> None:
        upload = await self.session.get(FridgeUpload, upload_id)
        if upload:
            upload.status = status
            await self.session.flush()

    async def add_ingredient_detection(
        self,
        upload_id: uuid.UUID,
        name: str,
        normalized_name: str,
        confidence: float,
        bbox: dict | None = None,
    ) -> IngredientDetection:
        detection = IngredientDetection(
            upload_id=upload_id,
            name=name,
            normalized_name=normalized_name,
            confidence=confidence,
            bbox_json=bbox,
        )
        self.session.add(detection)
        await self.session.flush()
        return detection
