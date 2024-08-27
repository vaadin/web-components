/* eslint-env node */
const { playwrightLauncher } = require('@web/test-runner-playwright');
const { createSnapshotTestsConfig } = require('./wtr-utils.js');

module.exports = createSnapshotTestsConfig({
  browsers: [playwrightLauncher({ product: 'chromium' })],
});
