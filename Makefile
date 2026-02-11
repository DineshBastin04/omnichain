.PHONY: help install build up down test lint clean

help:
	@echo "Usage:"
	@echo "  make install    Install dependencies"
	@echo "  make build      Build docker containers"
	@echo "  make up         Start development environment"
	@echo "  make down       Stop development environment"
	@echo "  make test       Run tests"
	@echo "  make lint       Run linting"
	@echo "  make clean      Remove build artifacts"

install:
	pip install -r requirements.txt
	cd frontend && npm install

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

test:
	pytest tests/

lint:
	flake8 backend agents pipelines
	cd frontend && npm run lint

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
