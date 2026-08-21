/// <reference types='vitest' />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'node:path';

export default defineConfig(() => ({
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths({
      projects: [path.resolve(__dirname, '../../tsconfig.base.json')],
    }),
  ],

  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/my_vite',
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
  // Explicit fallback aliases alongside plugin resolution
  resolve: {
    alias: {
      '@domo/ui-header': path.resolve(__dirname, '../../libs/shared/ui-header/src/index.ts'),
      '@domo/ui-footer': path.resolve(__dirname, '../../libs/shared/ui-footer/src/index.ts'),
      '@domo/ui-sidebar': path.resolve(__dirname, '../../libs/shared/ui-sidebar/src/index.ts'),
      '@domo/ui-button': path.resolve(__dirname, '../../libs/shared/ui-button/src/index.ts'),
      '@domo/utils': path.resolve(__dirname, '../../libs/shared/utils/src/index.ts'),
      '@domo/constants': path.resolve(__dirname, '../../libs/shared/constants/src/index.ts'),
      '@dommo/shared/reusableComponents': path.resolve(__dirname, '../../libs/shared/reusableComponents/src/index.ts'),
    },
  },
  build: {
    outDir: '../../dist/apps/my_vite',
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
      '@domo/ui-header',
      '@domo/ui-footer',
      '@domo/ui-sidebar',
      '@domo/ui-button',
      '@domo/utils',
      '@domo/constants',
      '@dommo/shared/reusableComponents',
    ],
  },
}));