import { playwrightLauncher } from '@web/test-runner-playwright';
import devServerConfig from './web-dev-server.config.js';
import { createIntegrationTestsConfig } from './wtr-utils.js';

const unitTestsConfig = createIntegrationTestsConfig({
  browsers: [
    playwrightLauncher({
      product: 'chromium',
      launchOptions: {
        channel: 'chrome',
        headless: true,
      },
    }),
  ],
});

export default {
  ...unitTestsConfig,
  ...devServerConfig,
};
