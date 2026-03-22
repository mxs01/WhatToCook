"""Billing repository for pricing plans and payment durations."""

from __future__ import annotations

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from whattocook.db.models import PaymentDuration, PricingPlan


class BillingRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def list_pricing_plans(self) -> list[PricingPlan]:
        stmt = select(PricingPlan).order_by(PricingPlan.price.asc(), PricingPlan.name.asc())
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def get_pricing_plan_by_id(self, pricing_plan_id: uuid.UUID) -> PricingPlan | None:
        return await self.session.get(PricingPlan, pricing_plan_id)

    async def create_pricing_plan(
        self,
        name: str,
        price: float,
        llm_generations_per_week: int,
    ) -> PricingPlan:
        pricing_plan = PricingPlan(
            name=name,
            price=price,
            llm_generations_per_week=llm_generations_per_week,
        )
        self.session.add(pricing_plan)
        await self.session.flush()
        return pricing_plan

    async def update_pricing_plan(
        self,
        pricing_plan_id: uuid.UUID,
        *,
        name: str | None,
        price: float | None,
        llm_generations_per_week: int | None,
    ) -> PricingPlan | None:
        pricing_plan = await self.get_pricing_plan_by_id(pricing_plan_id)
        if pricing_plan is None:
            return None

        if name is not None:
            pricing_plan.name = name
        if price is not None:
            pricing_plan.price = price
        if llm_generations_per_week is not None:
            pricing_plan.llm_generations_per_week = llm_generations_per_week

        await self.session.flush()
        return pricing_plan

    async def delete_pricing_plan(self, pricing_plan_id: uuid.UUID) -> bool:
        pricing_plan = await self.get_pricing_plan_by_id(pricing_plan_id)
        if pricing_plan is None:
            return False

        await self.session.delete(pricing_plan)
        await self.session.flush()
        return True

    async def list_payment_durations(self) -> list[PaymentDuration]:
        stmt = select(PaymentDuration).order_by(PaymentDuration.duration.asc())
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def get_payment_duration_by_id(
        self, payment_duration_id: uuid.UUID
    ) -> PaymentDuration | None:
        return await self.session.get(PaymentDuration, payment_duration_id)

    async def create_payment_duration(self, duration: str) -> PaymentDuration:
        payment_duration = PaymentDuration(duration=duration)
        self.session.add(payment_duration)
        await self.session.flush()
        return payment_duration

    async def update_payment_duration(
        self,
        payment_duration_id: uuid.UUID,
        *,
        duration: str,
    ) -> PaymentDuration | None:
        payment_duration = await self.get_payment_duration_by_id(payment_duration_id)
        if payment_duration is None:
            return None

        payment_duration.duration = duration
        await self.session.flush()
        return payment_duration

    async def delete_payment_duration(self, payment_duration_id: uuid.UUID) -> bool:
        payment_duration = await self.get_payment_duration_by_id(payment_duration_id)
        if payment_duration is None:
            return False

        await self.session.delete(payment_duration)
        await self.session.flush()
        return True
