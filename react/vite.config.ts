import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'esnext',
  },
  // @ts-expect-error: Unknown error "typeof import(@vitejs/plugin-react) has
  // no call signatures". Not sure why it happens.
  plugins: [react()],
  root: resolve(process.cwd(), 'test/kitchen-sink'),
});
