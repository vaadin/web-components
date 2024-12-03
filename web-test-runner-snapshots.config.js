/* eslint-env node */
const { puppeteerLauncher } = require('@web/test-runner-puppeteer');
const { createSnapshotTestsConfig } = require('./wtr-utils.js');
const devServerConfig = require('./web-dev-server.config.js');

const snapshotsConfig = createSnapshotTestsConfig({
  browsers: [
    puppeteerLauncher({
      launchOptions: {
        headless: 'shell',
      },
    }),
  ],
});

module.exports = {
  ...snapshotsConfig,
  ...devServerConfig,
};
