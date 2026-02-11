#!/bin/bash

# Setup environment variables
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Created .env from .env.example"
fi

# Initialize virtual environment
if [ ! -d venv ]; then
    python -m venv venv
    echo "Created virtual environment"
fi

# Load environment variables
source .env

echo "Environment setup complete."
