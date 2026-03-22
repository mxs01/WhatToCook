"""Application configuration via environment variables."""

from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # General
    environment: Literal["development", "staging", "production"] = "development"
    debug: bool = False
    api_host: str = "0.0.0.0"
    api_port: int = 8080

    # Database
    database_url: str = "postgresql+asyncpg://whattocook:whattocook_dev@localhost:5432/whattocook"

    # Redis
    redis_url: str = "redis://localhost:6379/0"

    # JWT Auth
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 30
    jwt_refresh_token_expire_days: int = 7
    admin_api_key: str

    # LLM Provider
    llm_provider: Literal["local_vllm", "gemini", "mock"] = "local_vllm"

    # Local vLLM
    vllm_base_url: str = "http://localhost:8000/v1"
    vllm_model_name: str = "gpt-oss-120b"
    vllm_api_key: str = "not-needed"

    # Gemini
    gemini_api_key: str = ""
    gemini_model_name: str = "gemini-2.5-pro"

    # Embedding Provider
    embedding_provider: Literal["local_vllm", "gemini", "mock"] = "local_vllm"
    vllm_embedding_model_name: str = "text-embedding-model"
    vllm_embedding_base_url: str = "http://localhost:8000/v1"
    gemini_embedding_model_name: str = "text-embedding-004"

    # Image Generation
    flux_worker_url: str = "http://localhost:8100"

    # Object Storage
    s3_endpoint_url: str = "http://localhost:9000"
    s3_access_key_id: str = "minioadmin"
    s3_secret_access_key: str = "minioadmin"
    s3_bucket_name: str = "whattocook"
    s3_region: str = "us-east-1"
    s3_use_path_style: bool = True


def get_settings() -> Settings:
    """Create and return application settings. Cached at module level."""
    return Settings()
