import { playwrightLauncher } from '@web/test-runner-playwright';
import devServerConfig from './web-dev-server.config.js';
import { createSnapshotTestsConfig } from './wtr-utils.js';

const snapshotsConfig = createSnapshotTestsConfig({
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

export default {
  ...snapshotsConfig,
  ...devServerConfig,
};
