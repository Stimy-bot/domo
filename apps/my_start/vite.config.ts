import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import { nodePolyfills } from 'vite-plugin-node-polyfills'; // 👈 Import the plugin

export default defineConfig(() => {
  const rootDir = import.meta.dirname;

  return {
    root: rootDir,
    cacheDir: resolve(rootDir, '../../node_modules/.vite/my_start'),
    define: {
      global: 'globalThis',
    },
    optimizeDeps: {
      exclude: ['mongodb', 'bson'],
    },
    build: {
      rolldownOptions: {
        external: ['@tanstack/ai-client', '@tanstack/ai-react', 'crypto', 'util', 'fs', 'path'],
        output: {
          codeSplitting: true,
        },
      },
      chunkSizeWarningLimit: 1000,
      outDir: resolve(rootDir, '../../dist/apps/my_start'),
      emptyOutDir: true,
    },
    resolve: {
      tsconfigPaths: true,
      alias: {
        '@': resolve(rootDir, './src'),
        // No need for manual crypto/stream aliases below; the plugin handles it!
      },
    },
    server: {
      watch: {
        ignored: ['**/tmp/**'],
      },
    },
    plugins: [
 nodePolyfills({
        protocolImports: true,
        exclude: [
          'module',
        ],
      }),
      devtools(),
      tailwindcss(),
      !process.env.NX_GRAPH_CREATION &&
        tanstackStart({
          router: {
            routesDirectory: resolve(rootDir, './src/routes'),
            generatedRouteTree: resolve(rootDir, './src/routeTree.gen.ts'),
          },
        }),
      viteReact(),
    ].filter(Boolean),
  };
});