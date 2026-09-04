/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'node:path';

import type { PluginOption } from 'vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths({
      projects: [resolve(import.meta.dirname, '../../tsconfig.base.json')],
    }),
  ] as PluginOption[],

  // Required for Vite's native config loader
  root: import.meta.dirname,

  cacheDir: resolve(import.meta.dirname, '../../node_modules/.vite/my_vite'),

  server: {
    port: 5173,
    host: 'localhost',
  },

  preview: {
    port: 5173,
    host: 'localhost',
  },

  define: {
    'process.env': {},
  },

  resolve: {
    alias: {
      '@domo/state': resolve(
        import.meta.dirname,
        '../../libs/shared/state/src/index.ts',
      ),
      '@domo/ui-header': resolve(
        import.meta.dirname,
        '../../libs/shared/ui-header/src/index.ts',
      ),
      '@domo/ui-footer': resolve(
        import.meta.dirname,
        '../../libs/shared/ui-footer/src/index.ts',
      ),
      '@domo/ui-sidebar': resolve(
        import.meta.dirname,
        '../../libs/shared/ui-sidebar/src/index.ts',
      ),
      '@domo/ui-button': resolve(
        import.meta.dirname,
        '../../libs/shared/ui-button/src/index.ts',
      ),
      '@domo/utils': resolve(
        import.meta.dirname,
        '../../libs/shared/utils/src/index.ts',
      ),
      '@domo/constants': resolve(
        import.meta.dirname,
        '../../libs/shared/constants/src/index.ts',
      ),
      '@domo/reusableComponents': resolve(
        import.meta.dirname,
        '../../libs/shared/reusableComponents/src/index.ts',
      ),
        '@domo/types': resolve(
        import.meta.dirname,
        '../../libs/shared/types/src/index.ts',
      ),
        '@domo/hooks': resolve(
        import.meta.dirname,
        '../../libs/shared/hooks/src/index.ts',
      ),
        '@domo/firebase': resolve(
        import.meta.dirname,
        '../../libs/shared/firebase/src/index.ts',
      ),
    },
  },

  build: {
    outDir: resolve(import.meta.dirname, '../../dist/apps/my_vite'),
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
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
    ],
  },
});
