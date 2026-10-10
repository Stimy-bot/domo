import { defineConfig } from 'vitest/config'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path';
const __dirname = import.meta.dirname;

export default defineConfig({
  build: {
    rolldownOptions: {
      external: [
        '@tanstack/ai-client',
        '@tanstack/ai-react',
      ],
      output: {
        codeSplitting: true,
      },
    },
    chunkSizeWarningLimit: 1000,
    outDir: resolve(import.meta.dirname, '../../dist/apps/my_start'),
    emptyOutDir: true,
  },

root: __dirname,

cacheDir: resolve(__dirname, '../../node_modules/.vite/my_start'),

resolve: {
    // Vite 8 native tsconfig path resolution target
    tsconfigPaths: true,
    alias: {
      '@': resolve(import.meta.dirname, './src'),
    },
  },

  server: {
    watch: {
      ignored: ['**/tmp/**'],
    },
  },

  plugins: [
    devtools(),
    tailwindcss(),
    !process.env.NX_GRAPH_CREATION &&
      tanstackStart({
        router: {
          routesDirectory: resolve(import.meta.dirname, './src/routes'),
          generatedRouteTree: resolve(import.meta.dirname, './src/routeTree.gen.ts'),
        },
      }),
    viteReact(),
  ].filter(Boolean),
})