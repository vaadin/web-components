/* eslint-env node */
const { playwrightLauncher } = require('@web/test-runner-playwright');
const { createUnitTestsConfig } = require('./wtr-utils.js');

module.exports = createUnitTestsConfig({
  browsers: [playwrightLauncher({ product: 'firefox' })],
});
