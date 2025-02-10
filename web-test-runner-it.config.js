/* eslint-env node */
const { createIntegrationTestsConfig } = require('./wtr-utils.js');
const devServerConfig = require('./web-dev-server.config.js');
const { playwrightLauncher } = require('@web/test-runner-playwright');

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

module.exports = {
  ...unitTestsConfig,
  ...devServerConfig,
};
