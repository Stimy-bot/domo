import dotenv from "dotenv";
import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
// import { nodePolyfills } from "vite-plugin-node-polyfills";

// 1. Get the root directory using ESM native import.meta.dirname
const rootDir = import.meta.dirname;
const monorepoRoot = resolve(rootDir, "../../");

// 2. Load env vars immediately into Node's process.env BEFORE defineConfig runs
dotenv.config({ path: resolve(monorepoRoot, ".env") });

export default defineConfig(({ mode }) => {
  // 3. Also load mode-specific envs (e.g. .env.development) into process.env
  Object.assign(process.env, loadEnv(mode, monorepoRoot, ""));

  return {
    root: rootDir,
    cacheDir: resolve(rootDir, "../../node_modules/.vite/my_start"),
    define: {
      global: "globalThis",
    },
    optimizeDeps: {
      exclude: ["mongodb", "bson"],
    },
    build: {
      rolldownOptions: {
        external: [
          "@tanstack/ai-client",
          "@tanstack/ai-react",
          "crypto",
          "util",
          "fs",
          "path",
        ],
        output: {
          codeSplitting: true,
        },
      },
      chunkSizeWarningLimit: 1000,
      outDir: resolve(rootDir, "../../dist/apps/my_start"),
      emptyOutDir: true,
    },
    resolve: {
      tsconfigPaths: true,
      alias: {
        "@": resolve(rootDir, "./src"),
      },
    },
    server: {
      watch: {
        ignored: ["**/tmp/**"],
      },
    },
    plugins: [
      // nodePolyfills({
      //   protocolImports: true,
      //   globals: {
      //     Buffer: true,
      //     global: true,
      //     process: true,
      //   },
      //   exclude: ["module"],
      // }),
      devtools(),
      tailwindcss(),
      !process.env.NX_GRAPH_CREATION &&
        tanstackStart({
          router: {
            routesDirectory: resolve(rootDir, "./src/routes"),
            generatedRouteTree: resolve(rootDir, "./src/routeTree.gen.ts"),
          },
        }),
      viteReact(),
    ].filter(Boolean),
  };
});