/* eslint-env node */
const { chromeLauncher } = require('@web/test-runner-chrome');
const { createSnapshotTestsConfig } = require('./wtr-utils.js');

module.exports = createSnapshotTestsConfig({
  browsers: [
    chromeLauncher({
      launchOptions: {
        headless: 'shell',
      },
    }),
  ],
});
