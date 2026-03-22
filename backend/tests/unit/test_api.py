"""Unit tests for API endpoints using FastAPI TestClient with mocked dependencies."""

from __future__ import annotations

import io
import uuid
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from fastapi.testclient import TestClient

from whattocook.api.auth import create_access_token
from whattocook.main import create_app

from tests.conftest import (
    USER_ID,
    UPLOAD_ID,
    RECIPE_ID,
    MockJobQueue,
    MockObjectStorage,
)


# ─── Fixtures ────────────────────────────────────────────────────────────────


@pytest.fixture
def settings() -> MagicMock:
    s = MagicMock()
    s.environment = "development"
    s.debug = False
    s.jwt_secret_key = "test-secret"
    s.jwt_algorithm = "HS256"
    s.jwt_access_token_expire_minutes = 30
    s.jwt_refresh_token_expire_days = 7
    s.database_url = "postgresql+asyncpg://test:test@localhost/test"
    s.redis_url = "redis://localhost:6379/0"
    s.llm_provider = "local_vllm"
    s.embedding_provider = "local_vllm"
    return s


@pytest.fixture
def auth_token(settings: MagicMock) -> str:
    return create_access_token(USER_ID, settings)


@pytest.fixture
def client(settings: MagicMock) -> TestClient:
    """Create a TestClient with mocked DB session and dependencies."""
    with (
        patch("whattocook.main.get_settings", return_value=settings),
        patch("whattocook.db.session.get_settings", return_value=settings),
        patch("whattocook.main.engine"),
    ):
        app = create_app()

    return TestClient(app, raise_server_exceptions=False)


# ─── Health endpoint ─────────────────────────────────────────────────────────


class TestHealthEndpoint:
    def test_health_returns_ok(self, client: TestClient) -> None:
        response = client.get("/api/health")
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}


# ─── Auth endpoints ─────────────────────────────────────────────────────────


class TestAuthEndpoints:
    def test_register_success(self, client: TestClient) -> None:
        mock_user = MagicMock()
        mock_user.id = USER_ID
        mock_user.email = "test@example.com"
        mock_user.display_name = "Test User"
        mock_user.created_at = "2025-01-01T00:00:00"

        with (
            patch("whattocook.api.users.UserRepository") as MockRepo,
            patch("whattocook.api.users.get_session") as mock_get_session,
        ):
            # Override the get_session dependency
            mock_session = AsyncMock()
            mock_session.commit = AsyncMock()

            async def fake_session():
                yield mock_session

            app = client.app
            from whattocook.db.session import get_session

            app.dependency_overrides[get_session] = fake_session  # type: ignore[union-attr]

            repo_instance = MockRepo.return_value
            repo_instance.get_by_email = AsyncMock(return_value=None)
            repo_instance.create = AsyncMock(return_value=mock_user)

            response = client.post(
                "/api/auth/register",
                json={
                    "email": "test@example.com",
                    "password": "securepassword123",
                    "display_name": "Test User",
                },
            )

            app.dependency_overrides.clear()  # type: ignore[union-attr]

        assert response.status_code == 201
        data = response.json()
        assert data["email"] == "test@example.com"

    def test_register_duplicate_email(self, client: TestClient) -> None:
        existing_user = MagicMock()
        existing_user.email = "exists@example.com"

        with patch("whattocook.api.users.UserRepository") as MockRepo:
            mock_session = AsyncMock()

            async def fake_session():
                yield mock_session

            app = client.app
            from whattocook.db.session import get_session

            app.dependency_overrides[get_session] = fake_session  # type: ignore[union-attr]

            repo_instance = MockRepo.return_value
            repo_instance.get_by_email = AsyncMock(return_value=existing_user)

            response = client.post(
                "/api/auth/register",
                json={
                    "email": "exists@example.com",
                    "password": "password123",
                },
            )

            app.dependency_overrides.clear()  # type: ignore[union-attr]

        assert response.status_code == 409

    def test_register_short_password_rejected(self, client: TestClient) -> None:
        response = client.post(
            "/api/auth/register",
            json={"email": "test@example.com", "password": "short"},
        )
        assert response.status_code == 422  # Validation error

    def test_login_success(self, client: TestClient, settings: MagicMock) -> None:
        from whattocook.api.auth import hash_password

        mock_user = MagicMock()
        mock_user.id = USER_ID
        mock_user.hashed_password = hash_password("correct_password")

        with patch("whattocook.api.users.UserRepository") as MockRepo:
            mock_session = AsyncMock()

            async def fake_session():
                yield mock_session

            app = client.app
            from whattocook.db.session import get_session
            from whattocook.config import get_settings as config_get_settings

            app.dependency_overrides[get_session] = fake_session  # type: ignore[union-attr]
            app.dependency_overrides[config_get_settings] = lambda: settings  # type: ignore[union-attr]

            repo_instance = MockRepo.return_value
            repo_instance.get_by_email = AsyncMock(return_value=mock_user)

            response = client.post(
                "/api/auth/login",
                json={
                    "email": "test@example.com",
                    "password": "correct_password",
                },
            )

            app.dependency_overrides.clear()  # type: ignore[union-attr]

        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"

    def test_login_wrong_password(self, client: TestClient, settings: MagicMock) -> None:
        from whattocook.api.auth import hash_password

        mock_user = MagicMock()
        mock_user.id = USER_ID
        mock_user.hashed_password = hash_password("real_password")

        with patch("whattocook.api.users.UserRepository") as MockRepo:
            mock_session = AsyncMock()

            async def fake_session():
                yield mock_session

            app = client.app
            from whattocook.db.session import get_session
            from whattocook.config import get_settings as config_get_settings

            app.dependency_overrides[get_session] = fake_session  # type: ignore[union-attr]
            app.dependency_overrides[config_get_settings] = lambda: settings  # type: ignore[union-attr]

            repo_instance = MockRepo.return_value
            repo_instance.get_by_email = AsyncMock(return_value=mock_user)

            response = client.post(
                "/api/auth/login",
                json={
                    "email": "test@example.com",
                    "password": "wrong_password",
                },
            )

            app.dependency_overrides.clear()  # type: ignore[union-attr]

        assert response.status_code == 401


# ─── Upload endpoints ───────────────────────────────────────────────────────


class TestUploadEndpoints:
    def test_upload_requires_auth(self, client: TestClient) -> None:
        response = client.post(
            "/api/uploads/fridge",
            files={"file": ("fridge.jpg", b"image-data", "image/jpeg")},
        )
        assert response.status_code == 401

    def test_upload_rejects_non_image(
        self,
        client: TestClient,
        auth_token: str,
        settings: MagicMock,
    ) -> None:
        app = client.app
        from whattocook.db.session import get_session
        from whattocook.config import get_settings as config_get_settings
        from whattocook.dependencies import get_object_storage, get_job_queue

        mock_session = AsyncMock()

        async def fake_session():
            yield mock_session

        app.dependency_overrides[get_session] = fake_session  # type: ignore[union-attr]
        app.dependency_overrides[config_get_settings] = lambda: settings  # type: ignore[union-attr]
        app.dependency_overrides[get_object_storage] = lambda: MockObjectStorage()  # type: ignore[union-attr]
        app.dependency_overrides[get_job_queue] = lambda: MockJobQueue()  # type: ignore[union-attr]

        response = client.post(
            "/api/uploads/fridge",
            files={"file": ("document.pdf", b"pdf-data", "application/pdf")},
            headers={"Authorization": f"Bearer {auth_token}"},
        )

        app.dependency_overrides.clear()  # type: ignore[union-attr]

        assert response.status_code == 400
        assert "image" in response.json()["detail"].lower()

    def test_upload_fridge_success(
        self,
        client: TestClient,
        auth_token: str,
        settings: MagicMock,
    ) -> None:
        app = client.app
        from whattocook.db.session import get_session
        from whattocook.config import get_settings as config_get_settings
        from whattocook.dependencies import get_object_storage, get_job_queue

        mock_session = AsyncMock()
        mock_session.commit = AsyncMock()

        async def fake_session():
            yield mock_session

        mock_storage = MockObjectStorage()
        mock_queue = MockJobQueue()

        mock_upload = MagicMock()
        mock_upload.id = UPLOAD_ID

        app.dependency_overrides[get_session] = fake_session  # type: ignore[union-attr]
        app.dependency_overrides[config_get_settings] = lambda: settings  # type: ignore[union-attr]
        app.dependency_overrides[get_object_storage] = lambda: mock_storage  # type: ignore[union-attr]
        app.dependency_overrides[get_job_queue] = lambda: mock_queue  # type: ignore[union-attr]

        with patch("whattocook.api.uploads.UploadRepository") as MockUploadRepo:
            MockUploadRepo.return_value.create = AsyncMock(return_value=mock_upload)

            response = client.post(
                "/api/uploads/fridge",
                files={"file": ("fridge.jpg", b"jpeg-image-data", "image/jpeg")},
                headers={"Authorization": f"Bearer {auth_token}"},
            )

        app.dependency_overrides.clear()  # type: ignore[union-attr]

        assert response.status_code == 202
        data = response.json()
        assert "job_id" in data
        assert data["status"] == "pending"

        # Verify image was stored
        assert len(mock_storage.objects) == 1
        # Verify job was enqueued
        assert len(mock_queue.jobs) == 1


# ─── Recipe endpoints ───────────────────────────────────────────────────────


class TestRecipeEndpoints:
    def test_list_recipes_requires_auth(self, client: TestClient) -> None:
        response = client.get("/api/recipes")
        assert response.status_code == 401

    def test_list_recipes_empty(
        self,
        client: TestClient,
        auth_token: str,
        settings: MagicMock,
    ) -> None:
        app = client.app
        from whattocook.db.session import get_session
        from whattocook.config import get_settings as config_get_settings

        mock_session = AsyncMock()

        async def fake_session():
            yield mock_session

        app.dependency_overrides[get_session] = fake_session  # type: ignore[union-attr]
        app.dependency_overrides[config_get_settings] = lambda: settings  # type: ignore[union-attr]

        with patch("whattocook.api.recipes.RecipeRepository") as MockRecipeRepo:
            MockRecipeRepo.return_value.list_by_user = AsyncMock(return_value=[])

            response = client.get(
                "/api/recipes",
                headers={"Authorization": f"Bearer {auth_token}"},
            )

        app.dependency_overrides.clear()  # type: ignore[union-attr]

        assert response.status_code == 200
        assert response.json() == []

    def test_list_recipes_with_data(
        self,
        client: TestClient,
        auth_token: str,
        settings: MagicMock,
    ) -> None:
        from datetime import datetime

        app = client.app
        from whattocook.db.session import get_session
        from whattocook.config import get_settings as config_get_settings

        mock_session = AsyncMock()

        async def fake_session():
            yield mock_session

        mock_recipe = MagicMock()
        mock_recipe.id = RECIPE_ID
        mock_recipe.title = "Test Recipe"
        mock_recipe.description = "A test recipe"
        mock_recipe.cuisine = "Italian"
        mock_recipe.difficulty = "easy"
        mock_recipe.prep_time_minutes = 10
        mock_recipe.cook_time_minutes = 20
        mock_recipe.servings = 4
        mock_recipe.created_at = datetime(2025, 1, 1)
        mock_recipe.images = []

        app.dependency_overrides[get_session] = fake_session  # type: ignore[union-attr]
        app.dependency_overrides[config_get_settings] = lambda: settings  # type: ignore[union-attr]

        with patch("whattocook.api.recipes.RecipeRepository") as MockRecipeRepo:
            MockRecipeRepo.return_value.list_by_user = AsyncMock(return_value=[mock_recipe])

            response = client.get(
                "/api/recipes",
                headers={"Authorization": f"Bearer {auth_token}"},
            )

        app.dependency_overrides.clear()  # type: ignore[union-attr]

        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["title"] == "Test Recipe"
        assert data[0]["cuisine"] == "Italian"
        assert data[0]["image_url"] is None

    def test_get_recipe_not_found(
        self,
        client: TestClient,
        auth_token: str,
        settings: MagicMock,
    ) -> None:
        app = client.app
        from whattocook.db.session import get_session
        from whattocook.config import get_settings as config_get_settings

        mock_session = AsyncMock()

        async def fake_session():
            yield mock_session

        app.dependency_overrides[get_session] = fake_session  # type: ignore[union-attr]
        app.dependency_overrides[config_get_settings] = lambda: settings  # type: ignore[union-attr]

        with patch("whattocook.api.recipes.RecipeRepository") as MockRecipeRepo:
            MockRecipeRepo.return_value.get_by_id = AsyncMock(return_value=None)

            response = client.get(
                f"/api/recipes/{RECIPE_ID}",
                headers={"Authorization": f"Bearer {auth_token}"},
            )

        app.dependency_overrides.clear()  # type: ignore[union-attr]

        assert response.status_code == 404


class TestRecipeGenerationEndpoints:
    def test_generate_recipe_from_text_enqueues_job(
        self,
        client: TestClient,
        auth_token: str,
        settings: MagicMock,
    ) -> None:
        app = client.app
        from whattocook.config import get_settings as config_get_settings
        from whattocook.dependencies import get_job_queue

        mock_queue = MockJobQueue()
        app.dependency_overrides[config_get_settings] = lambda: settings  # type: ignore[union-attr]
        app.dependency_overrides[get_job_queue] = lambda: mock_queue  # type: ignore[union-attr]

        response = client.post(
            "/api/recipes/generate",
            json={"prompt": "High-protein dinner", "preferences": {"diet": "high-protein"}},
            headers={"Authorization": f"Bearer {auth_token}"},
        )

        app.dependency_overrides.clear()  # type: ignore[union-attr]

        assert response.status_code == 202
        data = response.json()
        assert data["status"] == "pending"
        assert data["upload_id"] is None
        assert len(mock_queue.jobs) == 1

    def test_generate_recipe_requires_auth(self, client: TestClient) -> None:
        response = client.post(
            "/api/recipes/generate",
            json={"prompt": "Simple pasta", "preferences": {}},
        )
        assert response.status_code == 401


class TestJobsEndpoints:
    def test_get_job_status_returns_payload(
        self,
        client: TestClient,
        auth_token: str,
        settings: MagicMock,
    ) -> None:
        app = client.app
        from whattocook.config import get_settings as config_get_settings
        from whattocook.dependencies import get_job_queue

        mock_queue = MockJobQueue()
        app.dependency_overrides[config_get_settings] = lambda: settings  # type: ignore[union-attr]
        app.dependency_overrides[get_job_queue] = lambda: mock_queue  # type: ignore[union-attr]

        job_id = "job-123"
        mock_queue.jobs[job_id] = {
            "job_id": job_id,
            "status": "completed",
            "payload": {"user_id": str(USER_ID)},
            "result": {"recipe_id": str(RECIPE_ID)},
        }

        response = client.get(
            f"/api/jobs/{job_id}",
            headers={"Authorization": f"Bearer {auth_token}"},
        )

        app.dependency_overrides.clear()  # type: ignore[union-attr]

        assert response.status_code == 200
        data = response.json()
        assert data["job_id"] == job_id
        assert data["status"] == "completed"
        assert data["result"]["recipe_id"] == str(RECIPE_ID)

    def test_get_job_status_for_other_user_returns_404(
        self,
        client: TestClient,
        auth_token: str,
        settings: MagicMock,
    ) -> None:
        app = client.app
        from whattocook.config import get_settings as config_get_settings
        from whattocook.dependencies import get_job_queue

        mock_queue = MockJobQueue()
        app.dependency_overrides[config_get_settings] = lambda: settings  # type: ignore[union-attr]
        app.dependency_overrides[get_job_queue] = lambda: mock_queue  # type: ignore[union-attr]

        job_id = "job-foreign"
        mock_queue.jobs[job_id] = {
            "job_id": job_id,
            "status": "processing",
            "payload": {"user_id": str(uuid.uuid4())},
        }

        response = client.get(
            f"/api/jobs/{job_id}",
            headers={"Authorization": f"Bearer {auth_token}"},
        )

        app.dependency_overrides.clear()  # type: ignore[union-attr]

        assert response.status_code == 404


class TestRecipeNutritionEndpoints:
    def test_get_recipe_nutrition_success(
        self,
        client: TestClient,
        auth_token: str,
        settings: MagicMock,
    ) -> None:
        app = client.app
        from whattocook.config import get_settings as config_get_settings
        from whattocook.db.session import get_session

        mock_session = AsyncMock()

        async def fake_session():
            yield mock_session

        mock_recipe = MagicMock()
        mock_recipe.user_id = USER_ID
        mock_recipe.calories = 560.0
        mock_recipe.protein = 42.5
        mock_recipe.carbs = 33.2
        mock_recipe.fat = 21.1

        app.dependency_overrides[get_session] = fake_session  # type: ignore[union-attr]
        app.dependency_overrides[config_get_settings] = lambda: settings  # type: ignore[union-attr]

        with patch("whattocook.api.recipe_nutrition.RecipeRepository") as MockRecipeRepo:
            MockRecipeRepo.return_value.get_by_id = AsyncMock(return_value=mock_recipe)

            response = client.get(
                f"/api/recipes/{RECIPE_ID}/nutrition",
                headers={"Authorization": f"Bearer {auth_token}"},
            )

        app.dependency_overrides.clear()  # type: ignore[union-attr]

        assert response.status_code == 200
        data = response.json()
        assert data["calories"] == 560.0
        assert data["protein"] == 42.5
        assert data["carbs"] == 33.2
        assert data["fat"] == 21.1


class TestUserPreferencesEndpoints:
    def test_get_user_preferences_success(
        self,
        client: TestClient,
        auth_token: str,
        settings: MagicMock,
    ) -> None:
        app = client.app
        from whattocook.config import get_settings as config_get_settings
        from whattocook.db.session import get_session

        mock_session = AsyncMock()

        async def fake_session():
            yield mock_session

        app.dependency_overrides[get_session] = fake_session  # type: ignore[union-attr]
        app.dependency_overrides[config_get_settings] = lambda: settings  # type: ignore[union-attr]

        with patch("whattocook.api.user_preferences.UserRepository") as MockUserRepo:
            MockUserRepo.return_value.get_preferences = AsyncMock(
                return_value={"diet": "vegetarian", "allergens": ["nuts"]}
            )

            response = client.get(
                "/api/users/me/preferences",
                headers={"Authorization": f"Bearer {auth_token}"},
            )

        app.dependency_overrides.clear()  # type: ignore[union-attr]

        assert response.status_code == 200
        data = response.json()
        assert data["preferences"]["diet"] == "vegetarian"
        assert data["preferences"]["allergens"] == ["nuts"]

    def test_put_user_preferences_success(
        self,
        client: TestClient,
        auth_token: str,
        settings: MagicMock,
    ) -> None:
        app = client.app
        from whattocook.config import get_settings as config_get_settings
        from whattocook.db.session import get_session

        mock_session = AsyncMock()
        mock_session.commit = AsyncMock()

        async def fake_session():
            yield mock_session

        app.dependency_overrides[get_session] = fake_session  # type: ignore[union-attr]
        app.dependency_overrides[config_get_settings] = lambda: settings  # type: ignore[union-attr]

        body = {"preferences": {"diet": "keto", "max_calories": 700}}

        with patch("whattocook.api.user_preferences.UserRepository") as MockUserRepo:
            MockUserRepo.return_value.update_preferences = AsyncMock(
                return_value=body["preferences"]
            )

            response = client.put(
                "/api/users/me/preferences",
                json=body,
                headers={"Authorization": f"Bearer {auth_token}"},
            )

        app.dependency_overrides.clear()  # type: ignore[union-attr]

        assert response.status_code == 200
        data = response.json()
        assert data["preferences"] == body["preferences"]

    def test_get_recipe_wrong_user(
        self,
        client: TestClient,
        auth_token: str,
        settings: MagicMock,
    ) -> None:
        app = client.app
        from whattocook.db.session import get_session
        from whattocook.config import get_settings as config_get_settings

        mock_session = AsyncMock()

        async def fake_session():
            yield mock_session

        # Recipe belongs to a different user
        mock_recipe = MagicMock()
        mock_recipe.user_id = uuid.uuid4()  # Different from USER_ID

        app.dependency_overrides[get_session] = fake_session  # type: ignore[union-attr]
        app.dependency_overrides[config_get_settings] = lambda: settings  # type: ignore[union-attr]

        with patch("whattocook.api.recipes.RecipeRepository") as MockRecipeRepo:
            MockRecipeRepo.return_value.get_by_id = AsyncMock(return_value=mock_recipe)

            response = client.get(
                f"/api/recipes/{RECIPE_ID}",
                headers={"Authorization": f"Bearer {auth_token}"},
            )

        app.dependency_overrides.clear()  # type: ignore[union-attr]

        assert response.status_code == 404


class TestUserProfileEndpoints:
    def test_get_my_profile_dashboard_success(
        self,
        client: TestClient,
        auth_token: str,
        settings: MagicMock,
    ) -> None:
        from datetime import datetime

        app = client.app
        from whattocook.config import get_settings as config_get_settings
        from whattocook.db.session import get_session

        mock_session = AsyncMock()

        async def fake_session():
            yield mock_session

        app.dependency_overrides[get_session] = fake_session  # type: ignore[union-attr]
        app.dependency_overrides[config_get_settings] = lambda: settings  # type: ignore[union-attr]

        mock_user = MagicMock()
        mock_user.id = USER_ID
        mock_user.email = "chef@example.com"
        mock_user.display_name = "Chef"
        mock_user.created_at = datetime(2025, 1, 1)
        mock_user.pricing_plan = MagicMock(
            id=uuid.uuid4(),
            name="Pro",
            price=9.99,
            llm_generations_per_week=100,
        )
        mock_user.payment_duration = MagicMock(id=uuid.uuid4(), duration="monthly")

        mock_session_item = MagicMock()
        mock_session_item.id = uuid.uuid4()
        mock_session_item.user_agent = "pytest-agent"
        mock_session_item.created_at = datetime(2025, 1, 2)
        mock_session_item.last_active_at = datetime(2025, 1, 3)

        mock_recipe = MagicMock()
        mock_recipe.id = RECIPE_ID
        mock_recipe.title = "Profile Recipe"
        mock_recipe.description = "From profile endpoint"
        mock_recipe.cuisine = "Italian"
        mock_recipe.difficulty = "easy"
        mock_recipe.prep_time_minutes = 10
        mock_recipe.cook_time_minutes = 15
        mock_recipe.servings = 2
        mock_recipe.created_at = datetime(2025, 1, 4)
        mock_recipe.images = []
        mock_recipe.tags_json = []

        with (
            patch("whattocook.api.user_profile.UserRepository") as MockUserRepo,
            patch("whattocook.api.user_profile.RecipeRepository") as MockRecipeRepo,
        ):
            MockUserRepo.return_value.get_by_id = AsyncMock(return_value=mock_user)
            MockUserRepo.return_value.list_active_sessions = AsyncMock(
                return_value=[mock_session_item]
            )
            MockRecipeRepo.return_value.list_by_user_since = AsyncMock(return_value=[mock_recipe])

            response = client.get(
                "/api/users/me/profile?recipe_span=7days",
                headers={"Authorization": f"Bearer {auth_token}"},
            )

        app.dependency_overrides.clear()  # type: ignore[union-attr]

        assert response.status_code == 200
        data = response.json()
        assert data["user"]["email"] == "chef@example.com"
        assert data["pricing_plan"]["name"] == "Pro"
        assert data["payment_duration"]["duration"] == "monthly"
        assert len(data["active_sessions"]) == 1
        assert len(data["recipes"]) == 1

    def test_get_my_recipes_by_span_invalid_span(
        self,
        client: TestClient,
        auth_token: str,
        settings: MagicMock,
    ) -> None:
        app = client.app
        from whattocook.config import get_settings as config_get_settings
        from whattocook.db.session import get_session

        mock_session = AsyncMock()

        async def fake_session():
            yield mock_session

        app.dependency_overrides[get_session] = fake_session  # type: ignore[union-attr]
        app.dependency_overrides[config_get_settings] = lambda: settings  # type: ignore[union-attr]

        response = client.get(
            "/api/users/me/recipes?recipe_span=abc",
            headers={"Authorization": f"Bearer {auth_token}"},
        )

        app.dependency_overrides.clear()  # type: ignore[union-attr]

        assert response.status_code == 422

    def test_get_my_pricing_success(
        self,
        client: TestClient,
        auth_token: str,
        settings: MagicMock,
    ) -> None:
        from datetime import datetime

        app = client.app
        from whattocook.config import get_settings as config_get_settings
        from whattocook.db.session import get_session

        mock_session = AsyncMock()

        async def fake_session():
            yield mock_session

        app.dependency_overrides[get_session] = fake_session  # type: ignore[union-attr]
        app.dependency_overrides[config_get_settings] = lambda: settings  # type: ignore[union-attr]

        mock_user = MagicMock()
        mock_user.id = USER_ID
        mock_user.email = "chef@example.com"
        mock_user.display_name = "Chef"
        mock_user.created_at = datetime(2025, 1, 1)
        mock_user.pricing_plan = MagicMock(
            id=uuid.uuid4(),
            name="Starter",
            price=0.0,
            llm_generations_per_week=10,
        )
        mock_user.payment_duration = MagicMock(id=uuid.uuid4(), duration="annual")

        with patch("whattocook.api.user_profile.UserRepository") as MockUserRepo:
            MockUserRepo.return_value.get_by_id = AsyncMock(return_value=mock_user)

            response = client.get(
                "/api/users/me/pricing",
                headers={"Authorization": f"Bearer {auth_token}"},
            )

        app.dependency_overrides.clear()  # type: ignore[union-attr]

        assert response.status_code == 200
        data = response.json()
        assert data["pricing_plan"]["name"] == "Starter"
        assert data["payment_duration"]["duration"] == "annual"
