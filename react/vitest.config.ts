import { playwright } from '@vitest/browser-playwright';
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      setupFiles: './test/setup.ts',
      testTimeout: 2000,
      hookTimeout: 2000,
      browser: {
        enabled: true,
        // https://vitest.dev/guide/browser/playwright
        provider: playwright(),
        instances: [{ browser: 'chromium' }],
      },
    },
  }),
);
