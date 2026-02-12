#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

choose_python() {
    if command -v python3 >/dev/null 2>&1; then
        echo "python3"
    elif command -v python >/dev/null 2>&1; then
        echo "python"
    else
        echo ""
    fi
}

cd "${ROOT_DIR}"

PYTHON_CMD="$(choose_python)"
if [ -z "${PYTHON_CMD}" ]; then
    echo "Error: Python is required but was not found."
    exit 1
fi

if [ ! -f .env ]; then
    if [ ! -f .env.example ]; then
        echo "Error: .env.example not found."
        exit 1
    fi
    cp .env.example .env
    echo "Created .env from .env.example"
else
    echo ".env already exists; keeping current values."
fi

if [ ! -d venv ]; then
    "${PYTHON_CMD}" -m venv venv
    echo "Created virtual environment at ./venv"
else
    echo "Virtual environment already exists at ./venv"
fi

echo "Environment setup complete."
echo "Next: activate your virtual environment and run scripts/install.sh"
