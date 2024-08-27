/* eslint-env node */
const { playwrightLauncher } = require('@web/test-runner-playwright');
const { createIntegrationTestsConfig } = require('./wtr-utils.js');
const devServerConfig = require('./web-dev-server.config.js');

const unitTestsConfig = createIntegrationTestsConfig({
  browsers: [playwrightLauncher({ product: 'chromium' })],
});

module.exports = {
  ...unitTestsConfig,
  ...devServerConfig,
};
