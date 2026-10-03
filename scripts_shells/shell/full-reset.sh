#!/usr/bin/env bash
set -euo pipefail

echo "💣 FULL RESET: Nx monorepo"

# 1. Forcefully kill any running Nx daemon processes to prevent VersionMismatchError
echo "→ Killing lingering Nx daemon processes"
pkill -f nx-daemon || true
pkill -f "@nx/" || true

# 2. Reset Nx cache
echo "→ Resetting Nx cache"
pnpm exec nx reset || true

# 3. Remove build outputs, caches, and Nx daemon metadata
echo "→ Removing build outputs and cache files"
rm -rf dist .nx/cache .angular/cache node_modules/.cache/nx
find . \
  \( -name "dist" -o -name "*.tsbuildinfo" \) \
  -not -path "*/node_modules/*" \
  -exec rm -rf {} +

# 4. Remove node_modules
echo "→ Removing all node_modules/"
find . -name node_modules -type d -prune -exec rm -rf {} +

# Keep lockfile
echo "→ Keeping pnpm-lock.yaml"

# 5. Prune store
echo "→ Pruning pnpm store"
pnpm store prune

# 6. Fresh install with larger heap
echo "→ Installing dependencies"
NODE_OPTIONS="--max-old-space-size=8192" \
pnpm install \
  --frozen-lockfile \
  --child-concurrency=1

# 7. Rebuild
echo "→ Rebuilding all Nx projects"
pnpm exec nx run-many \
  --target=build \
  --all \
  --configuration=development \
  --verbose

echo "✨ FULL RESET + REBUILD COMPLETE!"