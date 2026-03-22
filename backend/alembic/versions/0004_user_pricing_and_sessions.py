"""Add user pricing and sessions tables.

Revision ID: 0004_user_pricing_and_sessions
Revises: 0003_recipe_user_api_fields
Create Date: 2026-03-22

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0004_user_pricing_and_sessions"
down_revision: Union[str, None] = "0003_recipe_user_api_fields"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "pricing_plans",
        sa.Column("id", sa.UUID(), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("name", sa.String(length=100), nullable=False, unique=True),
        sa.Column("price", sa.Float(), nullable=False),
        sa.Column("llm_generations_per_week", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
    )

    op.create_table(
        "payment_durations",
        sa.Column("id", sa.UUID(), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("duration", sa.String(length=20), nullable=False, unique=True),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.CheckConstraint(
            "duration IN ('monthly', 'annual')",
            name="ck_payment_durations_duration",
        ),
    )

    op.create_table(
        "user_sessions",
        sa.Column("id", sa.UUID(), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("user_id", sa.UUID(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("session_key", sa.String(length=128), nullable=False, unique=True),
        sa.Column("user_agent", sa.String(length=500), nullable=False, server_default="unknown"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
        sa.Column("last_active_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
    )

    op.create_index("ix_user_sessions_user_id", "user_sessions", ["user_id"])

    op.execute(
        "INSERT INTO payment_durations (duration) VALUES ('monthly'), ('annual') "
        "ON CONFLICT (duration) DO NOTHING"
    )

    op.add_column("users", sa.Column("pricing_plan_id", sa.UUID(), nullable=True))
    op.add_column("users", sa.Column("payment_duration_id", sa.UUID(), nullable=True))
    op.create_index("ix_users_pricing_plan_id", "users", ["pricing_plan_id"])
    op.create_index("ix_users_payment_duration_id", "users", ["payment_duration_id"])

    op.create_foreign_key(
        "fk_users_pricing_plan_id",
        "users",
        "pricing_plans",
        ["pricing_plan_id"],
        ["id"],
    )
    op.create_foreign_key(
        "fk_users_payment_duration_id",
        "users",
        "payment_durations",
        ["payment_duration_id"],
        ["id"],
    )


def downgrade() -> None:
    op.drop_constraint("fk_users_payment_duration_id", "users", type_="foreignkey")
    op.drop_constraint("fk_users_pricing_plan_id", "users", type_="foreignkey")
    op.drop_index("ix_users_payment_duration_id", table_name="users")
    op.drop_index("ix_users_pricing_plan_id", table_name="users")
    op.drop_column("users", "payment_duration_id")
    op.drop_column("users", "pricing_plan_id")

    op.drop_index("ix_user_sessions_user_id", table_name="user_sessions")
    op.drop_table("user_sessions")
    op.drop_table("payment_durations")
    op.drop_table("pricing_plans")
