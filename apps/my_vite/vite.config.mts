/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
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
    port: 5173,
    host: 'localhost',
  },

  preview: {
    port: 5173,
    host: 'localhost',
  },

  resolve: {
    tsconfigPaths: true,
    alias: {
      '@domo/state': resolve(
        __dirname, 
        '../../libs/shared/state/src/index.ts'
      ),
      '@domo/ui-header': resolve(
        __dirname,
        '../../libs/shared/ui-header/src/index.ts',
      ),
      '@domo/ui-footer': resolve(
        __dirname,
        '../../libs/shared/ui-footer/src/index.ts',
      ),
      '@domo/ui-sidebar': resolve(
        __dirname,
        '../../libs/shared/ui-sidebar/src/index.ts',
      ),
      '@domo/ui-button': resolve(
        __dirname,
        '../../libs/shared/ui-button/src/index.ts',
      ),
      '@domo/utils': resolve(
        __dirname,
        '../../libs/shared/utils/src/index.client.ts',
      ),
      '@domo/constants': resolve(
        __dirname,
        '../../libs/shared/constants/src/index.ts',
      ),
      '@domo/config': resolve(
        __dirname,
        '../../libs/shared/config/src/index.client.ts',
      ),
      '@domo/reusableComponents': resolve(
        __dirname,
        '../../libs/shared/reusableComponents/src/index.ts',
      ),
      '@domo/types': resolve(
        __dirname, 
        '../../libs/shared/types/src/index.ts'
      ),
      '@domo/hooks': resolve(
        __dirname, 
        '../../libs/shared/hooks/src/index.ts'
      ),
      '@domo/firebase': resolve(
        __dirname,
        '../../libs/shared/firebase/src/index.ts',
      ),
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
      '@domo/ui-button',
      '@domo/utils',
      '@domo/constants',
      '@domo/reusableComponents',
      '@domo/types',
      '@domo/hooks',
      '@domo/firebase',
      'mongodb',
      'bson',
      'fetch-blob',
    ],
  },
});
