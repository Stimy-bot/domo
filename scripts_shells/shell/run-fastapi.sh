#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -e

# 1. Navigate to the project directory
cd apps/my_fastapi

# 2. Activate the virtual environment
source .venv/bin/activate

# 3. Start the Uvicorn server with hot reload
uv run uvicorn app.main:app --reload