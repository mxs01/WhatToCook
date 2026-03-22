"""Add preferences and recipe api support fields.

Revision ID: 0003_recipe_user_api_fields
Revises: 0002_json_to_jsonb
Create Date: 2026-03-22

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects.postgresql import JSONB

revision: str = "0003_recipe_user_api_fields"
down_revision: Union[str, None] = "0002_json_to_jsonb"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column(
            "preferences_json",
            JSONB(),
            nullable=False,
            server_default=sa.text("'{}'::jsonb"),
        ),
    )

    op.alter_column("recipes", "upload_id", existing_type=sa.UUID(), nullable=True)
    op.add_column("recipes", sa.Column("calories", sa.Float(), nullable=True))
    op.add_column("recipes", sa.Column("protein", sa.Float(), nullable=True))
    op.add_column("recipes", sa.Column("carbs", sa.Float(), nullable=True))
    op.add_column("recipes", sa.Column("fat", sa.Float(), nullable=True))
    op.add_column(
        "recipes",
        sa.Column(
            "tags_json",
            JSONB(),
            nullable=False,
            server_default=sa.text("'[]'::jsonb"),
        ),
    )


def downgrade() -> None:
    op.drop_column("recipes", "tags_json")
    op.drop_column("recipes", "fat")
    op.drop_column("recipes", "carbs")
    op.drop_column("recipes", "protein")
    op.drop_column("recipes", "calories")
    op.alter_column("recipes", "upload_id", existing_type=sa.UUID(), nullable=False)
    op.drop_column("users", "preferences_json")
