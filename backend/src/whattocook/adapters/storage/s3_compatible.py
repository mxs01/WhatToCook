"""S3-compatible object storage adapter — works with MinIO (dev) and S3 (prod)."""

from __future__ import annotations

import aioboto3

from whattocook.config import Settings
from whattocook.domain.exceptions import StorageError
from whattocook.ports.object_storage import ObjectStoragePort


class S3CompatibleStorageAdapter(ObjectStoragePort):
    """Object storage adapter using S3-compatible APIs (MinIO / AWS S3)."""

    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._session = aioboto3.Session(
            aws_access_key_id=settings.s3_access_key_id,
            aws_secret_access_key=settings.s3_secret_access_key,
            region_name=settings.s3_region,
        )
        self._bucket = settings.s3_bucket_name
        self._endpoint_url = settings.s3_endpoint_url
        self._use_path_style = settings.s3_use_path_style

    def _client_kwargs(self) -> dict:
        kwargs: dict = {"endpoint_url": self._endpoint_url}
        if self._use_path_style:
            kwargs["config"] = aioboto3.Session().resource("s3")  # type: ignore[assignment]
            # For path-style access with aioboto3, we pass the config at creation
        return {"endpoint_url": self._endpoint_url}

    async def upload(
        self, key: str, data: bytes, content_type: str = "application/octet-stream"
    ) -> str:
        try:
            async with self._session.client("s3", endpoint_url=self._endpoint_url) as s3:
                await s3.put_object(
                    Bucket=self._bucket,
                    Key=key,
                    Body=data,
                    ContentType=content_type,
                )
            return key
        except Exception as e:
            raise StorageError(f"Failed to upload {key}: {e}") from e

    async def download(self, key: str) -> bytes:
        try:
            async with self._session.client("s3", endpoint_url=self._endpoint_url) as s3:
                response = await s3.get_object(Bucket=self._bucket, Key=key)
                return await response["Body"].read()
        except Exception as e:
            raise StorageError(f"Failed to download {key}: {e}") from e

    async def get_presigned_url(self, key: str, expires_in: int = 3600) -> str:
        try:
            async with self._session.client("s3", endpoint_url=self._endpoint_url) as s3:
                url = await s3.generate_presigned_url(
                    "get_object",
                    Params={"Bucket": self._bucket, "Key": key},
                    ExpiresIn=expires_in,
                )
                return url
        except Exception as e:
            raise StorageError(f"Failed to generate presigned URL for {key}: {e}") from e

    async def delete(self, key: str) -> None:
        try:
            async with self._session.client("s3", endpoint_url=self._endpoint_url) as s3:
                await s3.delete_object(Bucket=self._bucket, Key=key)
        except Exception as e:
            raise StorageError(f"Failed to delete {key}: {e}") from e
