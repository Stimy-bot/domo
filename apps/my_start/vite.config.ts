import { defineConfig } from 'vite';
import { devtools } from '@tanstack/devtools-vite';
import viteReact from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig(async () => {
  // Dynamic ESM import prevents Vite/Rolldown from trying to `require()` this package
  const { tanstackStart } = await import('@tanstack/react-start/plugin/vite');

  return {
    root: __dirname,

    resolve: {
      // Use Vite's native tsconfig path resolution
      tsconfigPaths: true,
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    server: {
      watch: {
        ignored: ['**/tmp/**'],
      },
    },

    build: {
      outDir: path.resolve(__dirname, '../../dist/apps/my_start'),
      emptyOutDir: true,
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      rollupOptions: {
        input: path.resolve(__dirname, 'index.html'),
        output: {
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash].[ext]',
        },
      },
    },

    plugins: [
      devtools(),
      tailwindcss(),

      // initialize the ESM-only plugin
      tanstackStart({
        router: {
          routesDirectory: path.resolve(__dirname, './src/routes'),
          generatedRouteTree: path.resolve(__dirname, './src/routeTree.gen.ts'),
        },
      }),

      viteReact(),
    ],

    optimizeDeps: {
      // Prevent Vite from trying to pre-bundle this ESM-only plugin with CJS tooling
      exclude: ['@tanstack/react-start/plugin/vite'],
    },
  };
});
