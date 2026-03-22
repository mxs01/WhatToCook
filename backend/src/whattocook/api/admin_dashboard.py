"""Admin dashboard CRUD endpoints for billing entities."""

from __future__ import annotations

import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from whattocook.api.auth import require_admin_api_key
from whattocook.api.schemas import (
    AdminAssignUserBillingRequest,
    AdminCreatePaymentDurationRequest,
    AdminCreatePricingPlanRequest,
    AdminUpdatePaymentDurationRequest,
    AdminUpdatePricingPlanRequest,
    PaymentDurationResponse,
    PricingPlanResponse,
)
from whattocook.db.repositories.billing import BillingRepository
from whattocook.db.repositories.user import UserRepository
from whattocook.db.session import get_session

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get(
    "/pricing-plans",
    response_model=list[PricingPlanResponse],
    dependencies=[Depends(require_admin_api_key)],
)
async def list_pricing_plans(
    session: AsyncSession = Depends(get_session),
) -> list[PricingPlanResponse]:
    repo = BillingRepository(session)
    plans = await repo.list_pricing_plans()
    return [
        PricingPlanResponse(
            id=plan.id,
            name=plan.name,
            price=plan.price,
            llm_generations_per_week=plan.llm_generations_per_week,
        )
        for plan in plans
    ]


@router.post(
    "/pricing-plans",
    response_model=PricingPlanResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_admin_api_key)],
)
async def create_pricing_plan(
    body: AdminCreatePricingPlanRequest,
    session: AsyncSession = Depends(get_session),
) -> PricingPlanResponse:
    repo = BillingRepository(session)
    plan = await repo.create_pricing_plan(
        name=body.name,
        price=body.price,
        llm_generations_per_week=body.llm_generations_per_week,
    )
    await session.commit()
    return PricingPlanResponse(
        id=plan.id,
        name=plan.name,
        price=plan.price,
        llm_generations_per_week=plan.llm_generations_per_week,
    )


@router.patch(
    "/pricing-plans/{pricing_plan_id}",
    response_model=PricingPlanResponse,
    dependencies=[Depends(require_admin_api_key)],
)
async def update_pricing_plan(
    pricing_plan_id: uuid.UUID,
    body: AdminUpdatePricingPlanRequest,
    session: AsyncSession = Depends(get_session),
) -> PricingPlanResponse:
    repo = BillingRepository(session)
    plan = await repo.update_pricing_plan(
        pricing_plan_id,
        name=body.name,
        price=body.price,
        llm_generations_per_week=body.llm_generations_per_week,
    )
    if plan is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pricing plan not found")

    await session.commit()
    return PricingPlanResponse(
        id=plan.id,
        name=plan.name,
        price=plan.price,
        llm_generations_per_week=plan.llm_generations_per_week,
    )


@router.delete(
    "/pricing-plans/{pricing_plan_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_admin_api_key)],
)
async def delete_pricing_plan(
    pricing_plan_id: uuid.UUID,
    session: AsyncSession = Depends(get_session),
) -> None:
    repo = BillingRepository(session)
    deleted = await repo.delete_pricing_plan(pricing_plan_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pricing plan not found")

    await session.commit()


@router.get(
    "/payment-durations",
    response_model=list[PaymentDurationResponse],
    dependencies=[Depends(require_admin_api_key)],
)
async def list_payment_durations(
    session: AsyncSession = Depends(get_session),
) -> list[PaymentDurationResponse]:
    repo = BillingRepository(session)
    durations = await repo.list_payment_durations()
    return [PaymentDurationResponse(id=item.id, duration=item.duration) for item in durations]


@router.post(
    "/payment-durations",
    response_model=PaymentDurationResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_admin_api_key)],
)
async def create_payment_duration(
    body: AdminCreatePaymentDurationRequest,
    session: AsyncSession = Depends(get_session),
) -> PaymentDurationResponse:
    repo = BillingRepository(session)
    duration = await repo.create_payment_duration(body.duration)
    await session.commit()
    return PaymentDurationResponse(id=duration.id, duration=duration.duration)


@router.patch(
    "/payment-durations/{payment_duration_id}",
    response_model=PaymentDurationResponse,
    dependencies=[Depends(require_admin_api_key)],
)
async def update_payment_duration(
    payment_duration_id: uuid.UUID,
    body: AdminUpdatePaymentDurationRequest,
    session: AsyncSession = Depends(get_session),
) -> PaymentDurationResponse:
    repo = BillingRepository(session)
    duration = await repo.update_payment_duration(payment_duration_id, duration=body.duration)
    if duration is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Payment duration not found"
        )

    await session.commit()
    return PaymentDurationResponse(id=duration.id, duration=duration.duration)


@router.delete(
    "/payment-durations/{payment_duration_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_admin_api_key)],
)
async def delete_payment_duration(
    payment_duration_id: uuid.UUID,
    session: AsyncSession = Depends(get_session),
) -> None:
    repo = BillingRepository(session)
    deleted = await repo.delete_payment_duration(payment_duration_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Payment duration not found"
        )

    await session.commit()


@router.patch(
    "/users/{user_id}/billing",
    response_model=dict,
    dependencies=[Depends(require_admin_api_key)],
)
async def assign_user_billing(
    user_id: uuid.UUID,
    body: AdminAssignUserBillingRequest,
    session: AsyncSession = Depends(get_session),
) -> dict:
    billing_repo = BillingRepository(session)
    user_repo = UserRepository(session)

    if body.pricing_plan_id is not None:
        pricing_plan = await billing_repo.get_pricing_plan_by_id(body.pricing_plan_id)
        if pricing_plan is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Pricing plan not found"
            )

    if body.payment_duration_id is not None:
        payment_duration = await billing_repo.get_payment_duration_by_id(body.payment_duration_id)
        if payment_duration is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment duration not found",
            )

    user = await user_repo.update_user_billing(
        user_id,
        pricing_plan_id=body.pricing_plan_id,
        payment_duration_id=body.payment_duration_id,
    )
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    await session.commit()
    return {
        "user_id": str(user.id),
        "pricing_plan_id": str(user.pricing_plan_id) if user.pricing_plan_id else None,
        "payment_duration_id": str(user.payment_duration_id) if user.payment_duration_id else None,
    }
