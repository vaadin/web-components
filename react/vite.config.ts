import react from '@vitejs/plugin-react';
import { readFile } from 'node:fs/promises';
import type { PackageJson } from 'type-fest';
import { defineConfig } from 'vite';
import devPagesPlugin from './dev/dev-pages-plugin';

const root = new URL(import.meta.url);

const packageJson: PackageJson = await readFile(new URL('package.json', root), 'utf8').then(JSON.parse);

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __VERSION__: `'${packageJson.version ?? '0.0.0'}'`,
  },
  build: {
    target: 'esnext',
  },
  plugins: [react(), devPagesPlugin()],
  root: process.cwd(),
});
