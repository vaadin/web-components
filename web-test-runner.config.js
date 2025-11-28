import { playwrightLauncher } from '@web/test-runner-playwright';
import devServerConfig from './web-dev-server.config.js';
import { createUnitTestsConfig } from './wtr-utils.js';

const unitTestsConfig = createUnitTestsConfig({
  browsers: [
    playwrightLauncher({
      product: 'chromium',
      launchOptions: {
        channel: 'chrome',
        headless: true,
        ignoreDefaultArgs: ['--hide-scrollbars'],
      },
    }),
  ],
  coverageConfig: {
    include: ['packages/**/src/**/*', 'packages/*/*.js'],
    threshold: {
      statements: 95,
      branches: 95,
      functions: 95,
      lines: 95,
    },
  },
});

export default {
  ...unitTestsConfig,
  ...devServerConfig,
};
