"""User profile endpoint with sessions, pricing, and recipes by span."""

from __future__ import annotations

import re
import uuid
from datetime import datetime, timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from whattocook.api.auth import get_current_user_id
from whattocook.api.recipe_mappers import map_recipe_summary
from whattocook.api.schemas import (
    ActiveSessionResponse,
    PaymentDurationResponse,
    PricingPlanResponse,
    RecipeResponse,
    UserProfileDashboardResponse,
    UserPricingResponse,
    UserResponse,
)
from whattocook.db.repositories.recipe import RecipeRepository
from whattocook.db.repositories.user import UserRepository
from whattocook.db.session import get_session

router = APIRouter(prefix="/users", tags=["users"])

_SPAN_PATTERN = re.compile(r"^\s*(\d+)\s*(h|hr|hour|hours|d|day|days)\s*$", re.IGNORECASE)


def _parse_recipe_span_to_since(span: str) -> datetime:
    match = _SPAN_PATTERN.match(span)
    if match is None:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid recipe span. Use values like '12h', '7days', or '30 days'.",
        )

    amount = int(match.group(1))
    unit = match.group(2).lower()

    if amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Recipe span must be greater than 0.",
        )

    if unit in {"h", "hr", "hour", "hours"}:
        return datetime.utcnow() - timedelta(hours=amount)

    return datetime.utcnow() - timedelta(days=amount)


@router.get("/me/profile", response_model=UserProfileDashboardResponse)
async def get_my_profile_dashboard(
    user_id: Annotated[uuid.UUID, Depends(get_current_user_id)],
    session: AsyncSession = Depends(get_session),
    recipe_span: str = Query("7days", description="Examples: 12h, 7days, 30 days"),
) -> UserProfileDashboardResponse:
    user_repo = UserRepository(session)
    recipe_repo = RecipeRepository(session)

    user = await user_repo.get_by_id(user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    since = _parse_recipe_span_to_since(recipe_span)
    sessions = await user_repo.list_active_sessions(user_id=user_id, limit=20)
    recipes = await recipe_repo.list_by_user_since(user_id=user_id, since=since, limit=50)

    pricing_plan, payment_duration = _build_pricing_payload(user)

    return UserProfileDashboardResponse(
        user=UserResponse.model_validate(user),
        pricing_plan=pricing_plan,
        payment_duration=payment_duration,
        active_sessions=[
            ActiveSessionResponse(
                session_id=user_session.id,
                user_agent=user_session.user_agent,
                created_at=user_session.created_at,
                last_active_at=user_session.last_active_at,
            )
            for user_session in sessions
        ],
        recipes=[map_recipe_summary(recipe) for recipe in recipes],
    )


def _build_pricing_payload(
    user: object,
) -> tuple[PricingPlanResponse | None, PaymentDurationResponse | None]:
    pricing_plan = None
    user_pricing_plan = getattr(user, "pricing_plan", None)
    if user_pricing_plan is not None:
        pricing_plan = PricingPlanResponse(
            id=user_pricing_plan.id,
            name=user_pricing_plan.name,
            price=user_pricing_plan.price,
            llm_generations_per_week=user_pricing_plan.llm_generations_per_week,
        )

    payment_duration = None
    user_payment_duration = getattr(user, "payment_duration", None)
    if user_payment_duration is not None:
        payment_duration = PaymentDurationResponse(
            id=user_payment_duration.id,
            duration=user_payment_duration.duration,
        )

    return pricing_plan, payment_duration


@router.get("/me/sessions", response_model=list[ActiveSessionResponse])
async def get_my_active_sessions(
    user_id: Annotated[uuid.UUID, Depends(get_current_user_id)],
    session: AsyncSession = Depends(get_session),
) -> list[ActiveSessionResponse]:
    user_repo = UserRepository(session)
    sessions = await user_repo.list_active_sessions(user_id=user_id, limit=20)
    return [
        ActiveSessionResponse(
            session_id=user_session.id,
            user_agent=user_session.user_agent,
            created_at=user_session.created_at,
            last_active_at=user_session.last_active_at,
        )
        for user_session in sessions
    ]


@router.get("/me/pricing", response_model=UserPricingResponse)
async def get_my_pricing(
    user_id: Annotated[uuid.UUID, Depends(get_current_user_id)],
    session: AsyncSession = Depends(get_session),
) -> UserPricingResponse:
    user_repo = UserRepository(session)
    user = await user_repo.get_by_id(user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    pricing_plan, payment_duration = _build_pricing_payload(user)
    return UserPricingResponse(pricing_plan=pricing_plan, payment_duration=payment_duration)


@router.get("/me/recipes", response_model=list[RecipeResponse])
async def get_my_recipes_by_span(
    user_id: Annotated[uuid.UUID, Depends(get_current_user_id)],
    session: AsyncSession = Depends(get_session),
    recipe_span: str = Query("7days", description="Examples: 12h, 7days, 30 days"),
) -> list[RecipeResponse]:
    recipe_repo = RecipeRepository(session)
    since = _parse_recipe_span_to_since(recipe_span)
    recipes = await recipe_repo.list_by_user_since(user_id=user_id, since=since, limit=50)
    return [map_recipe_summary(recipe) for recipe in recipes]
