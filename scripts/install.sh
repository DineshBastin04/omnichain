#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

require_command() {
    if ! command -v "$1" >/dev/null 2>&1; then
        echo "Error: required command not found: $1"
        exit 1
    fi
}

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

require_command npm

if [ ! -f requirements.txt ]; then
    echo "Error: requirements.txt not found in ${ROOT_DIR}"
    exit 1
fi

echo "Installing Python dependencies..."
"${PYTHON_CMD}" -m pip install --upgrade pip
"${PYTHON_CMD}" -m pip install -r requirements.txt

if [ -f frontend/package.json ]; then
    echo "Installing frontend dependencies..."
    cd frontend
    if [ -f package-lock.json ]; then
        npm ci
    else
        npm install
    fi
else
    echo "Skipping frontend install: frontend/package.json not found."
fi

echo "Installation complete."
