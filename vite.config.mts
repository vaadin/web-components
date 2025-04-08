/* eslint-env node */
import { globSync } from 'glob';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 8000,
  },
  preview: {
    port: 8000,
  },
  optimizeDeps: {
    noDiscovery: true,
  },
  build: {
    rollupOptions: {
      input: globSync('dev/lumo-injection/*.html'),
      output: {
        format: 'es',
        dir: 'dist',
      },
    },
  },
});
