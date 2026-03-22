"""Auth API endpoints — register, login, refresh."""

from __future__ import annotations

import inspect
import uuid

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from whattocook.api.auth import (
    create_access_token,
    create_refresh_token,
    hash_password,
    verify_password,
)
from whattocook.api.schemas import (
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    UserResponse,
)
from whattocook.config import Settings, get_settings
from whattocook.db.repositories.user import UserRepository
from whattocook.db.session import get_session

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    body: RegisterRequest,
    session: AsyncSession = Depends(get_session),
) -> UserResponse:
    """Register a new user."""
    repo = UserRepository(session)

    existing = await repo.get_by_email(body.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    hashed = hash_password(body.password)
    user = await repo.create(
        email=body.email,
        hashed_password=hashed,
        display_name=body.display_name,
    )
    await session.commit()

    return UserResponse.model_validate(user)


@router.post("/login", response_model=TokenResponse)
async def login(
    body: LoginRequest,
    request: Request,
    session: AsyncSession = Depends(get_session),
    settings: Settings = Depends(get_settings),
) -> TokenResponse:
    """Authenticate and receive JWT tokens."""
    repo = UserRepository(session)
    user = await repo.get_by_email(body.email)

    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    access_token = create_access_token(user.id, settings)
    refresh_token = create_refresh_token(user.id, settings)
    create_session_result = repo.create_session(
        user_id=user.id,
        session_key=str(uuid.uuid4()),
        user_agent=request.headers.get("user-agent", "unknown"),
    )
    if inspect.isawaitable(create_session_result):
        await create_session_result
    await session.commit()

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
    )
