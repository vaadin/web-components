/* eslint-env node */
const { puppeteerLauncher } = require('@web/test-runner-puppeteer');
const { createSnapshotTestsConfig } = require('./wtr-utils.js');

module.exports = createSnapshotTestsConfig({
  browsers: [
    puppeteerLauncher({
      launchOptions: {
        headless: 'shell',
      },
    }),
  ],
});
