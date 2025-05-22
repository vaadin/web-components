/* eslint-env node */
import { playwrightLauncher } from '@web/test-runner-playwright';
import { createSnapshotTestsConfig } from './wtr-utils.js';

export default createSnapshotTestsConfig({
  browsers: [
    playwrightLauncher({
      product: 'chromium',
      launchOptions: {
        channel: 'chrome',
        headless: true,
      },
    }),
  ],
});
