#!/usr/bin/env bash
set -euo pipefail

echo "💣 FULL RESET: Nx monorepo"

# 1. Stop Nx daemon + clear Nx cache
echo "→ Resetting Nx cache"
pnpm exec nx reset

# 2. Remove all build outputs & cache directories across packages/apps
echo "→ Removing build outputs and cache files"
rm -rf dist .nx/cache .angular/cache
find . \( -name "dist" -o -name "*.tsbuildinfo" \) -not -path "*/node_modules/*" -exec rm -rf {} +

# 3. Remove all root and nested node_modules
echo "→ Removing all node_modules/"
find . -name "node_modules" -type d -prune -exec rm -rf {} +

# 4. Remove pnpm lockfile
echo "→ Removing pnpm-lock.yaml"
rm -f pnpm-lock.yaml

# 5. Prune pnpm store
echo "→ Pruning pnpm store"
pnpm store prune

# 6. Fresh install
echo "→ Installing dependencies"
pnpm install --child-concurrency 1

# 7. Full rebuild in Nx dependency order
echo "→ Rebuilding all Nx projects"
pnpm exec nx run-many --target=build --all --configuration=development --verbose

echo "✨ FULL RESET + REBUILD COMPLETE!"