/* eslint-env node */
const { playwrightLauncher } = require('@web/test-runner-playwright');
const { createUnitTestsConfig } = require('./wtr-utils.js');

module.exports = createUnitTestsConfig({
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
    include: ['packages/**/src/*', 'packages/**/*.js'],
    threshold: {
      statements: 95,
      branches: 90,
      functions: 92,
      lines: 95,
    },
  },
});
