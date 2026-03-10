"""API router — aggregates all endpoint routers."""

from fastapi import APIRouter

from whattocook.api.recipes import router as recipes_router
from whattocook.api.uploads import router as uploads_router
from whattocook.api.users import router as users_router

api_router = APIRouter(prefix="/api")

api_router.include_router(users_router)
api_router.include_router(uploads_router)
api_router.include_router(recipes_router)


@api_router.get("/health")
async def health_check() -> dict:
    """Health check endpoint."""
    return {"status": "ok"}
