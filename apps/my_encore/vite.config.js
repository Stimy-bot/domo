/// <reference types="vitest" />

import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '~encore': path.resolve(import.meta.dirname, './encore.gen'),
    },
  },
});
