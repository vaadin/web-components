/* eslint-env node */
const { chromeLauncher } = require('@web/test-runner-chrome');
const { createUnitTestsConfig } = require('./wtr-utils.js');
const devServerConfig = require('./web-dev-server.config.js');

const unitTestsConfig = createUnitTestsConfig({
  browsers: [
    chromeLauncher({
      launchOptions: {
        headless: 'shell',
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

module.exports = {
  ...unitTestsConfig,
  ...devServerConfig,
};
