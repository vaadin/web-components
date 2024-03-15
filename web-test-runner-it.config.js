/* eslint-env node */
const { chromeLauncher } = require('@web/test-runner-chrome');
const { createIntegrationTestsConfig } = require('./wtr-utils.js');
const devServerConfig = require('./web-dev-server.config.js');

const unitTestsConfig = createIntegrationTestsConfig({
  browsers: [
    chromeLauncher({
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
