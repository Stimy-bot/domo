/// <reference types='vitest' />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => ({
  plugins: [
    react(), 
    tailwindcss(),
    tsconfigPaths({
      projects: ['../../tsconfig.base.json'],
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
  resolve: {
    // Disables native Vite resolution to prevent escaping to /home in Nx
    tsconfigPaths: false,
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
    ],
  },
}));