import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  {
    extends: 'vite.config.ts',
    test: {
      setupFiles: './test/setup.ts',
      testTimeout: 2000,
      hookTimeout: 2000,
      browser: {
        enabled: true,
        provider: 'playwright',
        // https://vitest.dev/guide/browser/playwright
        instances: [{ browser: 'chromium' }],
      },
    },
  },
]);
