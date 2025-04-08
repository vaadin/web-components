/* eslint-env node */
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
      input: [
        'dev/lumo-injection/link-head.html',
        'dev/lumo-injection/link-body.html',
        'dev/lumo-injection/style-head.html',
      ],
      output: {
        format: 'es',
        dir: 'dist',
      },
    },
  },
});
