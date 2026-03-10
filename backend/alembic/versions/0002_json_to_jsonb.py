"""Convert JSON columns to JSONB for better performance and indexing.

Revision ID: 0002_json_to_jsonb
Revises: 0001_initial
Create Date: 2026-03-10

"""
from typing import Sequence, Union

from alembic import op

revision: str = "0002_json_to_jsonb"
down_revision: Union[str, None] = "0001_initial"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# (table, column) pairs to convert from json → jsonb
_COLUMNS = [
    ("ingredient_detections", "bbox_json"),
    ("embedding_chunks", "metadata_json"),
    ("recipes", "ingredients_json"),
    ("recipes", "instructions_json"),
    ("agent_runs", "graph_state_json"),
    ("jobs", "payload_json"),
]


def upgrade() -> None:
    for table, column in _COLUMNS:
        op.execute(
            f"ALTER TABLE {table} "
            f"ALTER COLUMN {column} TYPE jsonb USING {column}::jsonb"
        )


def downgrade() -> None:
    for table, column in _COLUMNS:
        op.execute(
            f"ALTER TABLE {table} "
            f"ALTER COLUMN {column} TYPE json USING {column}::json"
        )
