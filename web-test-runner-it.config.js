/* eslint-env node */
const { puppeteerLauncher } = require('@web/test-runner-puppeteer');
const { createIntegrationTestsConfig } = require('./wtr-utils.js');
const devServerConfig = require('./web-dev-server.config.js');

const unitTestsConfig = createIntegrationTestsConfig({
  browsers: [
    puppeteerLauncher({
      launchOptions: {
        headless: 'shell',
      },
    }),
  ],
});

module.exports = {
  ...unitTestsConfig,
  ...devServerConfig,
};
