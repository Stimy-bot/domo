#!/usr/bin/env bash

echo "🔄 Rebuilding Nx monorepo..."

# Stop Nx daemon + clear Nx cache
echo "→ Resetting Nx cache"
pnpm nx reset

# Remove all build outputs
echo "→ Removing dist/"
rm -rf dist

# Remove all tsbuildinfo files
echo "→ Removing TypeScript build info"
find . -name "*.tsbuildinfo" -type f -delete

# Rebuild everything in dependency order
echo "→ Running full Nx rebuild"
pnpm nx run-many --target=build --all --configuration=development --verbose

echo "✨ Rebuild complete!"
