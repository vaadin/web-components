import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import devPagesPlugin from './dev/dev-pages-plugin.js';

const root = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(root, '..');
const { version } = JSON.parse(readFileSync(resolve(repoRoot, 'lerna.json'), 'utf8')) as { version: string };

export default defineConfig(({ mode }) => ({
  root,
  define: {
    __VERSION__: JSON.stringify(version),
  },
  build: {
    target: 'esnext',
  },
  plugins: [react(), devPagesPlugin()],
  server: {
    // The packages live outside the Vite root.
    fs: { allow: [repoRoot] },
  },
  optimizeDeps: {
    entries: ['dev/**/*.html'],
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      '@lit/react',
      'lit',
      'lit/directive-helpers.js',
      'dompurify',
      'marked',
      'vitest-browser-react',
      'chai-dom',
      'chai-as-promised',
      'sinon',
    ],
  },
  resolve: {
    // Specs import the React packages by name. In tests, subpath imports such as
    // `@vaadin/react-components/Grid.js` are aliased to the `src/` sources, so a change there
    // is visible without a rebuild. The bare `@vaadin/react-components` import has no alias
    // and resolves to the built `index.js`, which is missing on a fresh checkout. Run
    // `yarn build:react` once before `yarn test:react`; nothing here runs it for you.
    // Note: a spec may then load two instances of `utils/*`. No module there holds state.
    alias:
      mode === 'test'
        ? [
            {
              find: /^@vaadin\/react-components\/(.*)$/u,
              replacement: resolve(repoRoot, 'packages/react-components/src/$1'),
            },
          ]
        : [],
  },
  test: {
    dir: resolve(repoRoot, 'packages'),
    include: ['react-components*/test/**/*.spec.tsx'],
    setupFiles: [resolve(root, 'test/setup.ts')],
    testTimeout: 2000,
    hookTimeout: 2000,
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
  },
}));
