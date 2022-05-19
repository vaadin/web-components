/* eslint-env node */
const { createIntegrationTestsConfig } = require('./wtr-utils.js');
const devServerConfig = require('./web-dev-server.config.js');

const unitTestsConfig = createIntegrationTestsConfig();

module.exports = {
  ...unitTestsConfig,
  ...devServerConfig,
};
