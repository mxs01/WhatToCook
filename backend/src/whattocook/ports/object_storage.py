"""ObjectStoragePort — abstract interface for object/file storage."""

from __future__ import annotations

from abc import ABC, abstractmethod


class ObjectStoragePort(ABC):
    """Port for storing and retrieving binary objects (images, files)."""

    @abstractmethod
    async def upload(self, key: str, data: bytes, content_type: str = "application/octet-stream") -> str:
        """Upload data to storage.

        Args:
            key: The storage key (path) for the object.
            data: Raw bytes to store.
            content_type: MIME type of the data.

        Returns:
            The storage key of the uploaded object.
        """
        ...

    @abstractmethod
    async def download(self, key: str) -> bytes:
        """Download data from storage.

        Args:
            key: The storage key of the object.

        Returns:
            Raw bytes of the stored object.
        """
        ...

    @abstractmethod
    async def get_presigned_url(self, key: str, expires_in: int = 3600) -> str:
        """Generate a presigned URL for temporary access to an object.

        Args:
            key: The storage key of the object.
            expires_in: URL expiration time in seconds.

        Returns:
            A presigned URL string.
        """
        ...

    @abstractmethod
    async def delete(self, key: str) -> None:
        """Delete an object from storage.

        Args:
            key: The storage key of the object to delete.
        """
        ...
