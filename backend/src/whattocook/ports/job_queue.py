"""JobQueuePort — abstract interface for background job queue."""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any


class JobQueuePort(ABC):
    """Port for enqueueing and dequeueing background jobs."""

    @abstractmethod
    async def enqueue(self, job_type: str, payload: dict[str, Any]) -> str:
        """Add a job to the queue.

        Args:
            job_type: The type/name of the job (e.g. "process_fridge_upload").
            payload: JSON-serializable payload for the job.

        Returns:
            The job ID.
        """
        ...

    @abstractmethod
    async def dequeue(self, timeout: int = 5) -> dict[str, Any] | None:
        """Remove and return the next job from the queue.

        Args:
            timeout: How long to wait for a job (in seconds). 0 for non-blocking.

        Returns:
            A dict with job_id, job_type, and payload, or None if no job available.
        """
        ...

    @abstractmethod
    async def complete(self, job_id: str) -> None:
        """Mark a job as completed.

        Args:
            job_id: The ID of the job to mark as completed.
        """
        ...

    @abstractmethod
    async def fail(self, job_id: str, error: str) -> None:
        """Mark a job as failed.

        Args:
            job_id: The ID of the job to mark as failed.
            error: Error message describing the failure.
        """
        ...
