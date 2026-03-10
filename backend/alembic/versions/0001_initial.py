"""Initial schema — all tables.

Revision ID: 0001_initial
Revises:
Create Date: 2026-03-10

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from pgvector.sqlalchemy import Vector
from sqlalchemy.dialects.postgresql import JSONB

revision: str = "0001_initial"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Enable pgvector extension
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")

    # users
    op.create_table(
        "users",
        sa.Column("id", sa.UUID(), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("email", sa.String(255), unique=True, nullable=False, index=True),
        sa.Column("hashed_password", sa.String(255), nullable=False),
        sa.Column("display_name", sa.String(100), nullable=True),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.func.now()),
    )

    # fridge_uploads
    op.create_table(
        "fridge_uploads",
        sa.Column("id", sa.UUID(), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("user_id", sa.UUID(), sa.ForeignKey("users.id"), nullable=False, index=True),
        sa.Column("image_key", sa.String(500), nullable=False),
        sa.Column("status", sa.String(20), server_default="pending"),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now()),
    )

    # ingredient_detections
    op.create_table(
        "ingredient_detections",
        sa.Column("id", sa.UUID(), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column(
            "upload_id",
            sa.UUID(),
            sa.ForeignKey("fridge_uploads.id"),
            nullable=False,
            index=True,
        ),
        sa.Column("name", sa.String(200), nullable=False),
        sa.Column("normalized_name", sa.String(200), nullable=False, server_default=""),
        sa.Column("confidence", sa.Float(), server_default="0.0"),
        sa.Column("bbox_json", JSONB(), nullable=True),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now()),
    )

    # embedding_documents
    op.create_table(
        "embedding_documents",
        sa.Column("id", sa.UUID(), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("title", sa.String(500), nullable=False),
        sa.Column("source_url", sa.String(1000), server_default=""),
        sa.Column("content_hash", sa.String(64), server_default="", index=True),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now()),
    )

    # embedding_chunks
    op.create_table(
        "embedding_chunks",
        sa.Column("id", sa.UUID(), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column(
            "document_id",
            sa.UUID(),
            sa.ForeignKey("embedding_documents.id"),
            nullable=False,
            index=True,
        ),
        sa.Column("chunk_index", sa.Integer(), nullable=False),
        sa.Column("text", sa.Text(), nullable=False),
        sa.Column("embedding", Vector(768), nullable=True),
        sa.Column("metadata_json", JSONB(), nullable=True),
    )

    # recipes
    op.create_table(
        "recipes",
        sa.Column("id", sa.UUID(), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("user_id", sa.UUID(), sa.ForeignKey("users.id"), nullable=False, index=True),
        sa.Column(
            "upload_id",
            sa.UUID(),
            sa.ForeignKey("fridge_uploads.id"),
            nullable=False,
            index=True,
        ),
        sa.Column("title", sa.String(300), nullable=False),
        sa.Column("description", sa.Text(), server_default=""),
        sa.Column("ingredients_json", JSONB(), nullable=False),
        sa.Column("instructions_json", JSONB(), nullable=False),
        sa.Column("prep_time_minutes", sa.Integer(), server_default="0"),
        sa.Column("cook_time_minutes", sa.Integer(), server_default="0"),
        sa.Column("servings", sa.Integer(), server_default="2"),
        sa.Column("cuisine", sa.String(100), server_default=""),
        sa.Column("difficulty", sa.String(50), server_default="medium"),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now()),
    )

    # recipe_references
    op.create_table(
        "recipe_references",
        sa.Column("id", sa.UUID(), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column(
            "recipe_id", sa.UUID(), sa.ForeignKey("recipes.id"), nullable=False, index=True
        ),
        sa.Column(
            "source_document_id",
            sa.UUID(),
            sa.ForeignKey("embedding_documents.id"),
            nullable=False,
        ),
        sa.Column(
            "source_chunk_id",
            sa.UUID(),
            sa.ForeignKey("embedding_chunks.id"),
            nullable=False,
        ),
        sa.Column("relevance_score", sa.Float(), server_default="0.0"),
        sa.Column("snippet", sa.Text(), server_default=""),
    )

    # recipe_images
    op.create_table(
        "recipe_images",
        sa.Column("id", sa.UUID(), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column(
            "recipe_id", sa.UUID(), sa.ForeignKey("recipes.id"), nullable=False, index=True
        ),
        sa.Column("image_key", sa.String(500), nullable=False),
        sa.Column("prompt_used", sa.Text(), server_default=""),
        sa.Column("model_version", sa.String(100), server_default="flux-dev"),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now()),
    )

    # agent_runs
    op.create_table(
        "agent_runs",
        sa.Column("id", sa.UUID(), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column(
            "upload_id",
            sa.UUID(),
            sa.ForeignKey("fridge_uploads.id"),
            nullable=False,
            index=True,
        ),
        sa.Column("status", sa.String(20), server_default="running"),
        sa.Column("started_at", sa.DateTime(), server_default=sa.func.now()),
        sa.Column("completed_at", sa.DateTime(), nullable=True),
        sa.Column("error_message", sa.Text(), nullable=True),
        sa.Column("graph_state_json", JSONB(), nullable=True),
    )

    # llm_runs
    op.create_table(
        "llm_runs",
        sa.Column("id", sa.UUID(), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column(
            "agent_run_id",
            sa.UUID(),
            sa.ForeignKey("agent_runs.id"),
            nullable=False,
            index=True,
        ),
        sa.Column("node_name", sa.String(100), nullable=False),
        sa.Column("model", sa.String(100), nullable=False),
        sa.Column("prompt_hash", sa.String(64), server_default=""),
        sa.Column("input_tokens", sa.Integer(), server_default="0"),
        sa.Column("output_tokens", sa.Integer(), server_default="0"),
        sa.Column("latency_ms", sa.Integer(), server_default="0"),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now()),
    )

    # jobs
    op.create_table(
        "jobs",
        sa.Column("id", sa.UUID(), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("type", sa.String(100), nullable=False),
        sa.Column("payload_json", JSONB(), nullable=False),
        sa.Column("status", sa.String(20), server_default="pending", index=True),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now()),
        sa.Column("started_at", sa.DateTime(), nullable=True),
        sa.Column("completed_at", sa.DateTime(), nullable=True),
        sa.Column("error", sa.Text(), nullable=True),
    )

    # Create index for vector similarity search
    op.execute(
        "CREATE INDEX IF NOT EXISTS idx_embedding_chunks_embedding "
        "ON embedding_chunks USING ivfflat (embedding vector_cosine_ops) "
        "WITH (lists = 100)"
    )


def downgrade() -> None:
    op.drop_table("llm_runs")
    op.drop_table("agent_runs")
    op.drop_table("jobs")
    op.drop_table("recipe_images")
    op.drop_table("recipe_references")
    op.drop_table("recipes")
    op.drop_table("ingredient_detections")
    op.drop_table("embedding_chunks")
    op.drop_table("embedding_documents")
    op.drop_table("fridge_uploads")
    op.drop_table("users")
    op.execute("DROP EXTENSION IF EXISTS vector")
