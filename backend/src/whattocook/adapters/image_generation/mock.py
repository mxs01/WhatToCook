"""Mock image generation adapter — returns a tiny placeholder PNG."""

from __future__ import annotations

import logging
import struct
import zlib

from whattocook.ports.image_generation import ImageGenerationPort

logger = logging.getLogger(__name__)


def _create_placeholder_png(width: int = 64, height: int = 64) -> bytes:
    """Generate a minimal valid PNG with a solid orange (#FF8C00) fill.

    Keeps it small (~200 bytes) so it doesn't bloat MinIO during testing.
    """

    def _chunk(chunk_type: bytes, data: bytes) -> bytes:
        c = chunk_type + data
        return struct.pack(">I", len(data)) + c + struct.pack(">I", zlib.crc32(c) & 0xFFFFFFFF)

    # IHDR
    ihdr_data = struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0)  # 8-bit RGB
    ihdr = _chunk(b"IHDR", ihdr_data)

    # IDAT — raw pixel rows (filter byte 0 + RGB per pixel)
    raw_row = b"\x00" + b"\xff\x8c\x00" * width  # filter=None, orange pixels
    raw = raw_row * height
    idat = _chunk(b"IDAT", zlib.compress(raw))

    # IEND
    iend = _chunk(b"IEND", b"")

    return b"\x89PNG\r\n\x1a\n" + ihdr + idat + iend


# Pre-generate once so it's reused across calls.
_PLACEHOLDER = _create_placeholder_png()


class MockImageGenerationAdapter(ImageGenerationPort):
    """Image generation adapter that returns a tiny placeholder PNG.

    No GPU, no network — just a solid-color PNG so the pipeline can
    complete end-to-end.
    """

    async def generate(
        self,
        prompt: str,
        *,
        width: int = 1024,
        height: int = 1024,
        num_inference_steps: int = 50,
        guidance_scale: float = 7.5,
    ) -> bytes:
        logger.info("MockImageGen: returning placeholder PNG (%d bytes)", len(_PLACEHOLDER))
        return _PLACEHOLDER
