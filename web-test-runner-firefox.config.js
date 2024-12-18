/* eslint-env node */
const { playwrightLauncher } = require('@web/test-runner-playwright');
const { createUnitTestsConfig } = require('./wtr-utils.js');
const devServerConfig = require('./web-dev-server.config.js');

const unitTestsConfig = createUnitTestsConfig({
  browsers: [
    playwrightLauncher({
      product: 'firefox',
      launchOptions: {
        firefoxUserPrefs: { 'dom.disable_tab_focus_to_root_element': false },
      },
    }),
  ],
});

module.exports = {
  ...unitTestsConfig,
  ...devServerConfig,
};
