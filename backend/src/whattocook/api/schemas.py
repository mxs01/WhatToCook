"""Pydantic schemas for API request/response models."""

from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field

# ─── Auth ────────────────────────────────────────────────────────────────────


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    display_name: str | None = Field(None, max_length=100)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: uuid.UUID
    email: str
    display_name: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


# ─── Uploads ─────────────────────────────────────────────────────────────────


class UploadResponse(BaseModel):
    id: uuid.UUID
    status: str
    image_key: str
    created_at: datetime

    model_config = {"from_attributes": True}


class UploadDetailResponse(BaseModel):
    id: uuid.UUID
    status: str
    image_key: str
    created_at: datetime
    ingredients: list[IngredientResponse]
    recipe_id: uuid.UUID | None = None

    model_config = {"from_attributes": True}


class IngredientResponse(BaseModel):
    name: str
    normalized_name: str
    confidence: float

    model_config = {"from_attributes": True}


# ─── Recipes ─────────────────────────────────────────────────────────────────


class RecipeResponse(BaseModel):
    id: uuid.UUID
    title: str
    description: str
    cuisine: str
    difficulty: str
    prep_time_minutes: int
    cook_time_minutes: int
    servings: int
    created_at: datetime
    image_url: str | None = None
    tags: list[str] = Field(default_factory=list)

    model_config = {"from_attributes": True}


class RecipeDetailResponse(BaseModel):
    id: uuid.UUID
    title: str
    description: str
    ingredients_json: list
    instructions_json: list
    cuisine: str
    difficulty: str
    prep_time_minutes: int
    cook_time_minutes: int
    servings: int
    created_at: datetime
    references: list[ReferenceResponse]
    images: list[RecipeImageResponse]
    nutrition: NutritionResponse
    tags: list[str] = Field(default_factory=list)

    model_config = {"from_attributes": True}


class ReferenceResponse(BaseModel):
    relevance_score: float
    snippet: str

    model_config = {"from_attributes": True}


class RecipeImageResponse(BaseModel):
    image_key: str
    prompt_used: str
    model_version: str

    model_config = {"from_attributes": True}


class NutritionResponse(BaseModel):
    calories: float | None = None
    protein: float | None = None
    carbs: float | None = None
    fat: float | None = None


class GenerateRecipeRequest(BaseModel):
    prompt: str = Field(min_length=1, max_length=4000)
    preferences: dict = Field(default_factory=dict)


class UserPreferencesResponse(BaseModel):
    preferences: dict = Field(default_factory=dict)


class UpdateUserPreferencesRequest(BaseModel):
    preferences: dict = Field(default_factory=dict)


class JobResultResponse(BaseModel):
    recipe_id: str | None = None


# ─── Jobs ────────────────────────────────────────────────────────────────────


class JobResponse(BaseModel):
    job_id: str
    upload_id: str | None = None
    status: str


class JobStatusResponse(BaseModel):
    job_id: str
    status: str
    created_at: str | None = None
    started_at: str | None = None
    completed_at: str | None = None
    error: str | None = None
    result: JobResultResponse | None = None
