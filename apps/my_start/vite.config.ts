import { defineConfig } from 'vitest/config'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  root: import.meta.dirname,

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
    outDir: path.resolve(import.meta.dirname, '../../dist/apps/my_start'),
    emptyOutDir: true,
  },

  resolve: {
    // Vite 8 native tsconfig path resolution target
    tsconfigPaths: true,
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
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
          routesDirectory: path.resolve(import.meta.dirname, './src/routes'),
          generatedRouteTree: path.resolve(import.meta.dirname, './src/routeTree.gen.ts'),
        },
      }),
    viteReact(),
  ].filter(Boolean),
})