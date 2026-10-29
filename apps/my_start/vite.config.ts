import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import { defineConfig, loadEnv } from 'vite';

const rootDir = import.meta.dirname;
const monorepoRoot = resolve(rootDir, '../../');

dotenv.config({ path: resolve(monorepoRoot, '.env') });

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, monorepoRoot, ''));

  return {
    root: rootDir,
    envDir: monorepoRoot,
    cacheDir: resolve(rootDir, '../../node_modules/.vite/my_start'),
    define: {
      global: 'globalThis',
    },
    optimizeDeps: {
      exclude: ['mongodb', 'bson'],
    },
    build: {
      rolldownOptions: {
        external: ['@tanstack/ai-client', '@tanstack/ai-react', 'crypto', 'util', 'fs', 'path'],
        output: {
          codeSplitting: true,
        },
      },
      chunkSizeWarningLimit: 1000,
      outDir: resolve(rootDir, '../../dist/apps/my_start'),
      emptyOutDir: true,
    },
    resolve: {
      tsconfigPaths: true,
      alias: {
        '@': resolve(rootDir, './src'),
        '@domo/client': resolve(monorepoRoot, 'libs/shared/client/src/index.ts'),
        '@domo/config': resolve(monorepoRoot, 'libs/shared/config/src/index.ts'),
        '@domo/constants': resolve(monorepoRoot, 'libs/shared/constants/src/index.ts'),
        '@domo/context': resolve(monorepoRoot, 'libs/shared/context/src/index.ts'),
        '@domo/controllers': resolve(monorepoRoot, 'libs/shared/controllers/src/index.ts'),
        '@domo/error': resolve(monorepoRoot, 'libs/shared/error/src/index.ts'),
        '@domo/firebase': resolve(monorepoRoot, 'libs/shared/firebase/src/index.ts'),
        '@domo/forms': resolve(monorepoRoot, 'libs/shared/forms/src/index.ts'),
        '@domo/hooks': resolve(monorepoRoot, 'libs/shared/hooks/src/index.ts'),
        '@domo/middleware': resolve(monorepoRoot, 'libs/shared/middleware/src/index.ts'),
        '@domo/models': resolve(monorepoRoot, 'libs/shared/models/src/index.ts'),
        '@domo/reusableComponents': resolve(
          monorepoRoot,
          'libs/shared/reusableComponents/src/index.ts',
        ),
        '@domo/schemas': resolve(monorepoRoot, 'libs/shared/schemas/src/index.ts'),
        '@domo/services': resolve(monorepoRoot, 'libs/shared/services/src/index.ts'),
        '@domo/state': resolve(monorepoRoot, 'libs/shared/state/src/index.ts'),
        '@domo/types': resolve(monorepoRoot, 'libs/shared/types/src/index.ts'),
        '@domo/ui-buttons': resolve(monorepoRoot, 'libs/shared/ui-buttons/src/index.ts'),
        '@domo/ui-footer': resolve(monorepoRoot, 'libs/shared/ui-footer/src/index.ts'),
        '@domo/ui-header': resolve(monorepoRoot, 'libs/shared/ui-header/src/index.ts'),
        '@domo/ui-sidebar': resolve(monorepoRoot, 'libs/shared/ui-sidebar/src/index.ts'),
        '@domo/utils': resolve(monorepoRoot, 'libs/shared/utils/src/index.ts'),
        '@domo/validates': resolve(monorepoRoot, 'libs/shared/validates/src/index.ts'),
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
            routesDirectory: resolve(rootDir, './src/routes'),
            generatedRouteTree: resolve(rootDir, './src/routeTree.gen.ts'),
          },
        }),
      viteReact(),
    ].filter(Boolean),
  };
});
