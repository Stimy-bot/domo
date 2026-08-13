#!/usr/bin/env bash

echo "🧹 Cleaning Nx monorepo..."

# Stop Nx daemon + clear Nx cache
echo "→ Resetting Nx cache"
pnpm nx reset

# Remove all build outputs
echo "→ Removing dist/"
rm -rf dist

# Remove all tsbuildinfo files
echo "→ Removing TypeScript build info"
find . -name "*.tsbuildinfo" -type f -delete

# Remove node_modules
echo "→ Removing node_modules/"
rm -rf node_modules

# Optional: prune pnpm store (safe)
echo "→ Pruning pnpm store"
pnpm store prune

# Reinstall dependencies
echo "→ Reinstalling dependencies"
pnpm install --child-concurrency 1
# Rebuild everything in dependency order
echo "→ Rebuilding all Nx projects"
pnpm nx run-many --target=build --all --configuration=development --verbose

echo "✨ Clean rebuild complete!"
