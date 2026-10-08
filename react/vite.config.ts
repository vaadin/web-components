import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { version } = JSON.parse(readFileSync(resolve(root, 'lerna.json'), 'utf8')) as { version: string };

export default defineConfig(({ mode }) => ({
  root,
  define: {
    __VERSION__: JSON.stringify(version),
  },
  build: {
    target: 'esnext',
  },
  plugins: [react()],
  optimizeDeps: {
    // Limit the dependency scan to the React dev pages instead of every HTML file in the repo.
    entries: ['react/dev/**/*.html'],
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      '@lit/react',
      'lit',
      'vitest-browser-react',
      'chai-dom',
      'chai-as-promised',
      'sinon',
    ],
  },
  resolve: {
    // Specs import core through the package name. In tests, subpath imports resolve to the
    // sources so that a change in core is visible without a build. The bare import keeps
    // using the built `index.js`, so `yarn release:react` runs once before `yarn test:react`.
    // Note: a spec may then load two instances of `utils/*`. No module there holds state.
    alias:
      mode === 'test'
        ? [
            {
              find: /^@vaadin\/react-components\/(.*)$/u,
              replacement: resolve(root, 'packages/react-components/src/$1'),
            },
          ]
        : [],
  },
  test: {
    include: ['packages/react-components*/test/**/*.spec.tsx'],
    setupFiles: ['react/test/setup.ts'],
    testTimeout: 2000,
    hookTimeout: 2000,
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
  },
}));
