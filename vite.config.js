import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        bundle: path.resolve(import.meta.dirname, 'dev/rich-text-editor.html'),
      },
    },
  },
});
