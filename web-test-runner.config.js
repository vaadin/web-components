/* eslint-env node */
const { createUnitTestsConfig } = require('./wtr-utils.js');
const devServerConfig = require('./web-dev-server.config.js');
const { playwrightLauncher } = require('@web/test-runner-playwright');

const unitTestsConfig = createUnitTestsConfig({
  browsers: [
    playwrightLauncher({
      product: 'chromium',
      launchOptions: {
        channel: 'chrome',
        headless: true,
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
