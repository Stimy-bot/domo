#!/usr/bin/env bash
set -euo pipefail

echo "💣 FULL RESET: Nx monorepo"

# Reset Nx
echo "→ Resetting Nx cache"
pnpm exec nx reset

# Remove build outputs
echo "→ Removing build outputs and cache files"
rm -rf dist .nx/cache .angular/cache
find . \
  \( -name "dist" -o -name "*.tsbuildinfo" \) \
  -not -path "*/node_modules/*" \
  -exec rm -rf {} +

# Remove node_modules
echo "→ Removing all node_modules/"
find . -name node_modules -type d -prune -exec rm -rf {} +

# Keep lockfile
echo "→ Keeping pnpm-lock.yaml"

# Prune store
echo "→ Pruning pnpm store"
pnpm store prune

# Fresh install with larger heap
echo "→ Installing dependencies"
NODE_OPTIONS="--max-old-space-size=8192" \
pnpm install \
  --frozen-lockfile \
  --child-concurrency=1

# Rebuild
echo "→ Rebuilding all Nx projects"
pnpm exec nx run-many \
  --target=build \
  --all \
  --configuration=development \
  --verbose

echo "✨ FULL RESET + REBUILD COMPLETE!"