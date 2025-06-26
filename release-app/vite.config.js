import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: path.resolve('release-app'),
  base: './',
});
