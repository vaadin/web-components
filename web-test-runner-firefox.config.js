/* eslint-env node */
const { playwrightLauncher } = require('@web/test-runner-playwright');
const { createUnitTestsConfig } = require('./wtr-utils.js');
const devServerConfig = require('./web-dev-server.config.js');

const unitTestsConfig = createUnitTestsConfig({
  browsers: [playwrightLauncher({ product: 'firefox' })],
});

module.exports = {
  ...unitTestsConfig,
  ...devServerConfig,
};
