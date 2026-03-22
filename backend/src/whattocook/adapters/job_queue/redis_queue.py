"""Redis queue adapter — simple reliable job queue using Redis lists."""

from __future__ import annotations

import json
import uuid
from datetime import datetime
from typing import Any

import redis.asyncio as aioredis

from whattocook.config import Settings
from whattocook.ports.job_queue import JobQueuePort

QUEUE_KEY = "whattocook:jobs"
JOB_PREFIX = "whattocook:job:"


class RedisQueueAdapter(JobQueuePort):
    """Job queue adapter using Redis LPUSH/BRPOP for reliable queueing."""

    def __init__(self, settings: Settings) -> None:
        self._redis = aioredis.from_url(
            settings.redis_url,
            decode_responses=True,
        )

    async def enqueue(self, job_type: str, payload: dict[str, Any]) -> str:
        job_id = str(uuid.uuid4())
        job_data = {
            "job_id": job_id,
            "job_type": job_type,
            "payload": payload,
            "status": "pending",
            "created_at": datetime.utcnow().isoformat(),
        }

        # Store job metadata
        await self._redis.set(
            f"{JOB_PREFIX}{job_id}",
            json.dumps(job_data),
            ex=86400,  # 24h TTL
        )

        # Push job ID to the queue
        await self._redis.lpush(QUEUE_KEY, json.dumps(job_data))

        return job_id

    async def dequeue(self, timeout: int = 5) -> dict[str, Any] | None:
        result = await self._redis.brpop(QUEUE_KEY, timeout=timeout)
        if result is None:
            return None

        _, raw_data = result
        job_data = json.loads(raw_data)

        # Update job status to processing
        job_data["status"] = "processing"
        job_data["started_at"] = datetime.utcnow().isoformat()
        await self._redis.set(
            f"{JOB_PREFIX}{job_data['job_id']}",
            json.dumps(job_data),
            ex=86400,
        )

        return job_data

    async def complete(self, job_id: str, result: dict[str, Any] | None = None) -> None:
        raw = await self._redis.get(f"{JOB_PREFIX}{job_id}")
        if raw:
            job_data = json.loads(raw)
            job_data["status"] = "completed"
            job_data["completed_at"] = datetime.utcnow().isoformat()
            if result is not None:
                job_data["result"] = result
            await self._redis.set(
                f"{JOB_PREFIX}{job_id}",
                json.dumps(job_data),
                ex=86400,
            )

    async def fail(self, job_id: str, error: str) -> None:
        raw = await self._redis.get(f"{JOB_PREFIX}{job_id}")
        if raw:
            job_data = json.loads(raw)
            job_data["status"] = "failed"
            job_data["error"] = error
            job_data["completed_at"] = datetime.utcnow().isoformat()
            await self._redis.set(
                f"{JOB_PREFIX}{job_id}",
                json.dumps(job_data),
                ex=86400,
            )

    async def get_job_status(self, job_id: str) -> dict[str, Any] | None:
        """Get the current status of a job by its ID."""
        raw = await self._redis.get(f"{JOB_PREFIX}{job_id}")
        if raw:
            return json.loads(raw)
        return None
