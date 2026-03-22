"""User repository — data access for users table."""

from __future__ import annotations

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from whattocook.db.models import User


class UserRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(
        self, email: str, hashed_password: str, display_name: str | None = None
    ) -> User:
        user = User(
            email=email,
            hashed_password=hashed_password,
            display_name=display_name,
        )
        self.session.add(user)
        await self.session.flush()
        return user

    async def get_by_id(self, user_id: uuid.UUID) -> User | None:
        return await self.session.get(User, user_id)

    async def get_by_email(self, email: str) -> User | None:
        stmt = select(User).where(User.email == email)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_preferences(self, user_id: uuid.UUID) -> dict:
        user = await self.get_by_id(user_id)
        if user is None:
            return {}
        return user.preferences_json or {}

    async def update_preferences(self, user_id: uuid.UUID, preferences: dict) -> dict:
        user = await self.get_by_id(user_id)
        if user is None:
            return {}
        user.preferences_json = preferences
        await self.session.flush()
        return user.preferences_json
