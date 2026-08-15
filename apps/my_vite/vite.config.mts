/// <reference types='vitest' />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'node:path';

// These options were migrated by @nx/vite:convert-to-inferred from the project.json file.
const configValues: Record<string, object> = {
  default: {},
};

const nxConfiguration = process.env.NX_TASK_TARGET_CONFIGURATION ?? 'default';

const options = {
  ...configValues.default,
  ...(configValues[nxConfiguration] ?? {}),
};

export default defineConfig(() => ({
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
  plugins: [
    react(), 
    tailwindcss(),
    tsconfigPaths({
      projects: [path.resolve(import.meta.dirname, '../../tsconfig.base.json')],
    }),
  ],
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
}));