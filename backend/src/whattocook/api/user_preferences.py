"""User preferences endpoints."""

from __future__ import annotations

import uuid
from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from whattocook.api.auth import get_current_user_id
from whattocook.api.schemas import UpdateUserPreferencesRequest, UserPreferencesResponse
from whattocook.db.repositories.user import UserRepository
from whattocook.db.session import get_session

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me/preferences", response_model=UserPreferencesResponse)
async def get_my_preferences(
    user_id: Annotated[uuid.UUID, Depends(get_current_user_id)],
    session: AsyncSession = Depends(get_session),
) -> UserPreferencesResponse:
    repo = UserRepository(session)
    preferences = await repo.get_preferences(user_id)
    return UserPreferencesResponse(preferences=preferences)


@router.put("/me/preferences", response_model=UserPreferencesResponse)
async def update_my_preferences(
    body: UpdateUserPreferencesRequest,
    user_id: Annotated[uuid.UUID, Depends(get_current_user_id)],
    session: AsyncSession = Depends(get_session),
) -> UserPreferencesResponse:
    repo = UserRepository(session)
    preferences = await repo.update_preferences(user_id, body.preferences)
    await session.commit()
    return UserPreferencesResponse(preferences=preferences)
