"""API router — aggregates all endpoint routers."""

from fastapi import APIRouter

from whattocook.api.admin_dashboard import router as admin_dashboard_router
from whattocook.api.jobs import router as jobs_router
from whattocook.api.recipe_generation import router as recipe_generation_router
from whattocook.api.recipe_nutrition import router as recipe_nutrition_router
from whattocook.api.recipes import router as recipes_router
from whattocook.api.uploads import router as uploads_router
from whattocook.api.user_profile import router as user_profile_router
from whattocook.api.user_preferences import router as user_preferences_router
from whattocook.api.users import router as users_router

api_router = APIRouter(prefix="/api")

api_router.include_router(users_router)
api_router.include_router(user_preferences_router)
api_router.include_router(user_profile_router)
api_router.include_router(admin_dashboard_router)
api_router.include_router(uploads_router)
api_router.include_router(recipes_router)
api_router.include_router(recipe_generation_router)
api_router.include_router(recipe_nutrition_router)
api_router.include_router(jobs_router)


@api_router.get("/health")
async def health_check() -> dict:
    """Health check endpoint."""
    return {"status": "ok"}
