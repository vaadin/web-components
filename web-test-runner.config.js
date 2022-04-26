/* eslint-env node */
const { createUnitTestsConfig } = require('./wtr-utils.js');
const devServerConfig = require('./web-dev-server.config.js');

const unitTestsConfig = createUnitTestsConfig({
  coverageConfig: {
    include: ['packages/**/src/*', 'packages/**/*.js'],
    threshold: {
      statements: 95,
      branches: 90,
      functions: 92,
      lines: 95,
    },
  },
});

module.exports = {
  ...unitTestsConfig,
  ...devServerConfig,
};
