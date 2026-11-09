/// <reference types="vitest" />

import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { defineConfig } from 'vitest/config';

// In Node 20.11+, import.meta.dirname gives you the directory path directly
const __dirname = import.meta.dirname;

export default defineConfig({
  envDir: resolve(__dirname, '../../'),
  plugins: [
    react(),
    tailwindcss(),
    nodePolyfills({
      protocolImports: true,
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],

  root: __dirname,

  cacheDir: resolve(__dirname, '../../node_modules/.vite/my_vite'),

  server: {
    host: '0.0.0.0', // Ensure it's reachable outside the container
    port: 5173,
    watch: {
      usePolling: true, // Necessary for file changes to register in Docker
    },
    hmr: {
      clientPort: 5173, // The port your browser uses
    },
    proxy: {
      '/api': {
        // CRITICAL: Point to 'backend' service for Docker-to-Docker talk
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 5173,
    host: 'localhost',
  },

  resolve: {
    tsconfigPaths: true,
    alias: {
      '@domo/state': resolve(__dirname, '../../libs/shared/state/src/index.ts'),
      '@domo/ui-header': resolve(__dirname, '../../libs/shared/ui-header/src/index.ts'),
      '@domo/ui-footer': resolve(__dirname, '../../libs/shared/ui-footer/src/index.ts'),
      '@domo/ui-sidebar': resolve(__dirname, '../../libs/shared/ui-sidebar/src/index.ts'),
      '@domo/ui-buttons': resolve(__dirname, '../../libs/shared/ui-buttons/src/index.ts'),
      '@domo/utils': resolve(__dirname, '../../libs/shared/utils/src/index.client.ts'),
      '@domo/constants': resolve(__dirname, '../../libs/shared/constants/src/index.ts'),
      '@domo/config': resolve(__dirname, '../../libs/shared/config/src/index.client.ts'),
      '@domo/reusableComponents': resolve(
        __dirname,
        '../../libs/shared/reusableComponents/src/index.ts',
      ),
      '@domo/types': resolve(__dirname, '../../libs/shared/types/src/index.ts'),
      '@domo/hooks': resolve(__dirname, '../../libs/shared/hooks/src/index.ts'),
      '@domo/firebase': resolve(__dirname, '../../libs/shared/firebase/src/index.ts'),
      '@domo/forms': resolve(__dirname, '../../libs/shared/forms/src/index.ts'),
      '@domo/context': resolve(__dirname, '../../libs/shared/context/src/index.ts'),
    },
  },

  build: {
    rollupOptions: {
      external: ['mongodb'],
    },
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'react-router',
              test: /node_modules[\\/](?:@remix-run[\\/]router|react-router|react-router-dom)[\\/]/,
              priority: 2,
            },
            {
              name: 'react-vendor',
              test: /node_modules[\\/](?:react|react-dom|scheduler)[\\/]/,
              priority: 1,
            },
          ],
        },
      },
    },
    outDir: resolve(__dirname, '../../dist/apps/my_vite'),
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
      ignore: ['mongodb', 'bson', 'fetch-blob'],
    },
  },

  test: {
    name: 'vite',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/my_vite',
      provider: 'v8' as const,
    },
  },

  optimizeDeps: {
    exclude: [
      'mongodb',
      '@domo/state',
      '@domo/ui-header',
      '@domo/ui-footer',
      '@domo/ui-sidebar',
      '@domo/ui-buttons',
      '@domo/utils',
      '@domo/constants',
      '@domo/reusableComponents',
      '@domo/types',
      '@domo/hooks',
      '@domo/firebase',
      '@domo/forms',
      '@domo/context',
      'bson',
      'fetch-blob',
    ],
  },
});
