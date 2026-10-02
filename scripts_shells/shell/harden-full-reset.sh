echo "→ Terminating stale Nx daemon processes"
pkill -f '[n]x/src/daemon' 2>/dev/null || true
pkill -f '[n]x.*daemon' 2>/dev/null || true

echo "→ Removing Nx daemon state"
rm -rf .nx/workspace-data
rm -rf .nx/cache/d
rm -rf "${HOME}/.nx/sockets"
rm -rf "/tmp/.nx/$(id -u)/sockets"

echo "→ Resetting newly installed Nx"
NX_DAEMON=false pnpm exec nx reset

echo "→ Rebuilding all Nx projects"
NX_DAEMON=false pnpm exec nx run-many -t build --all