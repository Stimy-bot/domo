import { defineConfig } from 'vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

// These options were migrated by @nx/vite:convert-to-inferred from the project.json file.
const configValues = { default: {}, development: {}, production: {} };

// Determine the correct configValue to use based on the configuration
const nxConfiguration = process.env.NX_TASK_TARGET_CONFIGURATION ?? 'default';

const options = {
  ...configValues.default,
  ...(configValues[nxConfiguration] ?? {}),
};

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
    tanstackStart({
      router: {
        routesDirectory: path.resolve(import.meta.dirname, './src/routes'),
        generatedRouteTree: path.resolve(
          import.meta.dirname,
          './src/routeTree.gen.ts',
        ),
      },
    }),
    viteReact(),
  ],
});
