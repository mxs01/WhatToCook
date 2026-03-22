"""User repository — data access for users table."""

from __future__ import annotations

from datetime import datetime
import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from whattocook.db.models import PaymentDuration, PricingPlan, User, UserSession


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
        stmt = (
            select(User)
            .where(User.id == user_id)
            .options(selectinload(User.pricing_plan), selectinload(User.payment_duration))
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

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

    async def list_active_sessions(self, user_id: uuid.UUID, limit: int = 20) -> list[UserSession]:
        stmt = (
            select(UserSession)
            .where(UserSession.user_id == user_id, UserSession.is_active.is_(True))
            .order_by(UserSession.last_active_at.desc())
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def create_session(
        self,
        user_id: uuid.UUID,
        session_key: str,
        user_agent: str,
    ) -> UserSession:
        now = datetime.utcnow()
        session = UserSession(
            user_id=user_id,
            session_key=session_key,
            user_agent=user_agent,
            is_active=True,
            created_at=now,
            last_active_at=now,
        )
        self.session.add(session)
        await self.session.flush()
        return session

    async def get_pricing_plan_by_name(self, name: str) -> PricingPlan | None:
        stmt = select(PricingPlan).where(PricingPlan.name == name)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_payment_duration_by_value(self, duration: str) -> PaymentDuration | None:
        stmt = select(PaymentDuration).where(PaymentDuration.duration == duration)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def update_user_billing(
        self,
        user_id: uuid.UUID,
        *,
        pricing_plan_id: uuid.UUID | None,
        payment_duration_id: uuid.UUID | None,
    ) -> User | None:
        user = await self.get_by_id(user_id)
        if user is None:
            return None

        user.pricing_plan_id = pricing_plan_id
        user.payment_duration_id = payment_duration_id
        await self.session.flush()
        return user
