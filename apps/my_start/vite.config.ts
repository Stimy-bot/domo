import { defineConfig } from 'vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'node:path';

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

  build: {
    outDir: path.resolve(import.meta.dirname, '../../dist/apps/my_start'),
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      input: path.resolve(import.meta.dirname, 'index.html'),
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
  },

  plugins: [
    tsconfigPaths({
      projects: [path.resolve(import.meta.dirname, '../../tsconfig.base.json')],
    }),

    devtools(),
    tailwindcss(),

    tanstackStart({
      router: {
        routesDirectory: path.resolve(import.meta.dirname, './src/routes'),
        generatedRouteTree: path.resolve(
          import.meta.dirname,
          './src/routeTree.gen.ts'
        ),
      },
    }),

    viteReact(),
  ],
});
