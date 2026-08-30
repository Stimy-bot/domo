import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
root: import.meta.dirname,
  resolve: {
  tsconfigPaths: false,
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