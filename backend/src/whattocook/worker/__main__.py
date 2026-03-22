"""Background worker entrypoint — polls Redis and processes jobs."""

from __future__ import annotations

import asyncio
import logging

from opentelemetry import trace

from whattocook.adapters.job_queue.redis_queue import RedisQueueAdapter
from whattocook.config import get_settings
from whattocook.telemetry import setup_telemetry
from whattocook.worker.tasks import JOB_HANDLERS
from whattocook.worker.tracing import extract_trace_context

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("whattocook.worker")
tracer = trace.get_tracer(__name__)


async def run_worker() -> None:
    """Main worker loop — poll Redis queue and process jobs."""
    settings = get_settings()
    setup_telemetry(settings)
    queue = RedisQueueAdapter(settings)

    logger.info("Worker started. Waiting for jobs...")

    while True:
        try:
            job = await queue.dequeue(timeout=5)
            if job is None:
                continue

            job_id = job["job_id"]
            job_type = job["job_type"]
            payload = job["payload"]

            logger.info(f"Processing job {job_id} (type={job_type})")

            handler = JOB_HANDLERS.get(job_type)
            if handler is None:
                logger.error(f"Unknown job type: {job_type}")
                await queue.fail(job_id, f"Unknown job type: {job_type}")
                continue

            try:
                job_context = extract_trace_context(payload)
                with tracer.start_as_current_span(
                    f"job.process.{job_type}",
                    context=job_context,
                    attributes={
                        "job.id": job_id,
                        "job.type": job_type,
                    },
                ):
                    result = await handler(payload)
                if isinstance(result, str):
                    await queue.complete(job_id, result={"recipe_id": result})
                else:
                    await queue.complete(job_id)
                logger.info(f"Job {job_id} completed successfully")
            except Exception as e:
                logger.exception(f"Job {job_id} failed: {e}")
                await queue.fail(job_id, str(e))

        except Exception as e:
            logger.exception(f"Worker error: {e}")
            await asyncio.sleep(5)


def main() -> None:
    asyncio.run(run_worker())


if __name__ == "__main__":
    main()
