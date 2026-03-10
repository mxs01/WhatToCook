"""Integration test — full API flow: register -> login -> upload -> list recipes."""

from __future__ import annotations

import uuid
from datetime import datetime
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from fastapi.testclient import TestClient

from whattocook.api.auth import create_access_token, hash_password
from whattocook.main import create_app

from tests.conftest import (
    RECIPE_ID,
    UPLOAD_ID,
    USER_ID,
    MockJobQueue,
    MockObjectStorage,
)


# ─── Fixtures ────────────────────────────────────────────────────────────────


@pytest.fixture
def settings() -> MagicMock:
    s = MagicMock()
    s.environment = "development"
    s.debug = False
    s.jwt_secret_key = "integration-test-secret"
    s.jwt_algorithm = "HS256"
    s.jwt_access_token_expire_minutes = 30
    s.jwt_refresh_token_expire_days = 7
    s.database_url = "postgresql+asyncpg://test:test@localhost/test"
    s.redis_url = "redis://localhost:6379/0"
    s.llm_provider = "local_vllm"
    s.embedding_provider = "local_vllm"
    return s


@pytest.fixture
def client(settings: MagicMock) -> TestClient:
    with patch("whattocook.main.get_settings", return_value=settings), \
         patch("whattocook.db.session.get_settings", return_value=settings), \
         patch("whattocook.main.engine"):
        app = create_app()
    return TestClient(app, raise_server_exceptions=False)


@pytest.fixture
def mock_session() -> AsyncMock:
    session = AsyncMock()
    session.commit = AsyncMock()
    session.flush = AsyncMock()
    session.add = MagicMock()
    session.get = AsyncMock(return_value=None)
    return session


# ─── Full flow: Register -> Login -> Upload -> List Recipes ──────────────────


class TestFullAPIFlow:
    def test_register_login_upload_flow(
        self,
        client: TestClient,
        settings: MagicMock,
        mock_session: AsyncMock,
    ) -> None:
        """Simulates the full user journey through the API."""
        app = client.app
        from whattocook.db.session import get_session
        from whattocook.config import get_settings as config_get_settings
        from whattocook.dependencies import get_object_storage, get_job_queue

        async def fake_session():
            yield mock_session

        app.dependency_overrides[get_session] = fake_session  # type: ignore[union-attr]
        app.dependency_overrides[config_get_settings] = lambda: settings  # type: ignore[union-attr]

        # ─── Step 1: Register ────────────────────────────────────────────

        mock_user = MagicMock()
        mock_user.id = USER_ID
        mock_user.email = "chef@example.com"
        mock_user.display_name = "Chef Max"
        mock_user.created_at = datetime(2025, 1, 1)
        mock_user.hashed_password = hash_password("my_password_123")

        with patch("whattocook.api.users.UserRepository") as MockUserRepo:
            MockUserRepo.return_value.get_by_email = AsyncMock(return_value=None)
            MockUserRepo.return_value.create = AsyncMock(return_value=mock_user)

            reg_response = client.post(
                "/api/auth/register",
                json={
                    "email": "chef@example.com",
                    "password": "my_password_123",
                    "display_name": "Chef Max",
                },
            )

        assert reg_response.status_code == 201
        assert reg_response.json()["email"] == "chef@example.com"

        # ─── Step 2: Login ───────────────────────────────────────────────

        with patch("whattocook.api.users.UserRepository") as MockUserRepo:
            MockUserRepo.return_value.get_by_email = AsyncMock(return_value=mock_user)

            login_response = client.post(
                "/api/auth/login",
                json={
                    "email": "chef@example.com",
                    "password": "my_password_123",
                },
            )

        assert login_response.status_code == 200
        tokens = login_response.json()
        assert "access_token" in tokens
        access_token = tokens["access_token"]

        # ─── Step 3: Upload fridge image ─────────────────────────────────

        mock_storage = MockObjectStorage()
        mock_queue = MockJobQueue()

        mock_upload = MagicMock()
        mock_upload.id = UPLOAD_ID

        app.dependency_overrides[get_object_storage] = lambda: mock_storage  # type: ignore[union-attr]
        app.dependency_overrides[get_job_queue] = lambda: mock_queue  # type: ignore[union-attr]

        with patch("whattocook.api.uploads.UploadRepository") as MockUploadRepo:
            MockUploadRepo.return_value.create = AsyncMock(return_value=mock_upload)

            upload_response = client.post(
                "/api/uploads/fridge",
                files={"file": ("my_fridge.jpg", b"fridge-jpeg-bytes", "image/jpeg")},
                headers={"Authorization": f"Bearer {access_token}"},
            )

        assert upload_response.status_code == 202
        assert upload_response.json()["status"] == "pending"

        # Verify image stored and job enqueued
        assert len(mock_storage.objects) == 1
        assert len(mock_queue.jobs) == 1

        # ─── Step 4: List recipes (empty initially) ──────────────────────

        with patch("whattocook.api.recipes.RecipeRepository") as MockRecipeRepo:
            MockRecipeRepo.return_value.list_by_user = AsyncMock(return_value=[])

            list_response = client.get(
                "/api/recipes",
                headers={"Authorization": f"Bearer {access_token}"},
            )

        assert list_response.status_code == 200
        assert list_response.json() == []

        # ─── Step 5: List recipes (after processing) ─────────────────────

        mock_recipe = MagicMock()
        mock_recipe.id = RECIPE_ID
        mock_recipe.title = "Chicken Caprese"
        mock_recipe.description = "Delicious chicken with tomatoes and mozzarella."
        mock_recipe.cuisine = "Italian"
        mock_recipe.difficulty = "easy"
        mock_recipe.prep_time_minutes = 10
        mock_recipe.cook_time_minutes = 20
        mock_recipe.servings = 2
        mock_recipe.created_at = datetime(2025, 1, 1, 12, 0)
        mock_recipe.images = []

        with patch("whattocook.api.recipes.RecipeRepository") as MockRecipeRepo:
            MockRecipeRepo.return_value.list_by_user = AsyncMock(
                return_value=[mock_recipe]
            )

            list_response = client.get(
                "/api/recipes",
                headers={"Authorization": f"Bearer {access_token}"},
            )

        assert list_response.status_code == 200
        recipes = list_response.json()
        assert len(recipes) == 1
        assert recipes[0]["title"] == "Chicken Caprese"

        # ─── Step 6: Get recipe detail ───────────────────────────────────

        mock_recipe.user_id = USER_ID
        mock_recipe.ingredients_json = [
            {"name": "chicken breast", "amount": "2", "unit": "pieces"},
        ]
        mock_recipe.instructions_json = [
            {"step": 1, "text": "Season the chicken."},
        ]
        mock_recipe.references = []
        mock_recipe.images = []

        with patch("whattocook.api.recipes.RecipeRepository") as MockRecipeRepo:
            MockRecipeRepo.return_value.get_by_id = AsyncMock(
                return_value=mock_recipe
            )

            detail_response = client.get(
                f"/api/recipes/{RECIPE_ID}",
                headers={"Authorization": f"Bearer {access_token}"},
            )

        assert detail_response.status_code == 200
        detail = detail_response.json()
        assert detail["title"] == "Chicken Caprese"
        assert len(detail["ingredients_json"]) == 1
        assert len(detail["instructions_json"]) == 1

        # Cleanup
        app.dependency_overrides.clear()  # type: ignore[union-attr]


class TestAuthorizationFlow:
    def test_expired_token_rejected(self, client: TestClient, settings: MagicMock) -> None:
        """Verify that an invalid/expired token is rejected."""
        response = client.get(
            "/api/recipes",
            headers={"Authorization": "Bearer invalid.token.here"},
        )
        assert response.status_code == 401

    def test_missing_token_rejected(self, client: TestClient) -> None:
        """Verify that missing auth is rejected."""
        response = client.get("/api/recipes")
        assert response.status_code == 401

    def test_refresh_token_rejected_for_access(
        self, client: TestClient, settings: MagicMock
    ) -> None:
        """Verify that a refresh token cannot be used as an access token."""
        from whattocook.api.auth import create_refresh_token
        from whattocook.config import get_settings as config_get_settings
        from whattocook.db.session import get_session

        app = client.app
        app.dependency_overrides[config_get_settings] = lambda: settings  # type: ignore[union-attr]

        mock_session = AsyncMock()

        async def fake_session():
            yield mock_session

        app.dependency_overrides[get_session] = fake_session  # type: ignore[union-attr]

        refresh_token = create_refresh_token(USER_ID, settings)

        response = client.get(
            "/api/recipes",
            headers={"Authorization": f"Bearer {refresh_token}"},
        )

        app.dependency_overrides.clear()  # type: ignore[union-attr]

        # get_current_user_id checks type == "access", so refresh token should fail
        assert response.status_code == 401
