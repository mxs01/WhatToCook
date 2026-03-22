.PHONY: help up-core up-all up-gpu down logs ps restart-core

COMPOSE ?= docker compose
CORE_SERVICES := postgres redis minio minio-init

help:
	@printf "Available targets:\n"
	@printf "  make up-core      Start core infrastructure services\n"
	@printf "  make up-all       Start all default services\n"
	@printf "  make up-gpu       Start all services including gpu profile\n"
	@printf "  make down         Stop and remove containers\n"
	@printf "  make logs         Follow logs for all services\n"
	@printf "  make ps           Show service status\n"
	@printf "  make restart-core Restart core infrastructure services\n"

up-core:
	$(COMPOSE) up -d $(CORE_SERVICES)

up-all:
	$(COMPOSE) up -d

up-gpu:
	$(COMPOSE) --profile gpu up -d

down:
	$(COMPOSE) down

logs:
	$(COMPOSE) logs -f

ps:
	$(COMPOSE) ps

restart-core:
	$(COMPOSE) restart $(CORE_SERVICES)
