import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig(() => {
  const rootDir = import.meta.dirname;

  return {
    root: rootDir,
    cacheDir: resolve(rootDir, '../../node_modules/.vite/my_start'),
    build: {
      rolldownOptions: {
        external: ['@tanstack/ai-client', '@tanstack/ai-react'],
        output: {
          codeSplitting: true,
        },
      },
      chunkSizeWarningLimit: 1000,
      outDir: resolve(rootDir, '../../dist/apps/my_start'),
      emptyOutDir: true,
    },
    resolve: {
      alias: {
        '@': resolve(rootDir, './src'),
      },
    },
    server: {
      watch: {
        ignored: ['**/tmp/**'],
      },
    },
    plugins: [
      tsconfigPaths({
        projects: [resolve(rootDir, '../../tsconfig.base.json')],
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
