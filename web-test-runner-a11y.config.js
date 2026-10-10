import { a11ySnapshotPlugin } from '@web/test-runner-commands/plugins';
import { playwrightLauncher } from '@web/test-runner-playwright';
import devServerConfig from './web-dev-server.config.js';
import { createA11yTestsConfig } from './wtr-utils.js';

const a11yConfig = createA11yTestsConfig({
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
  ...a11yConfig,
  ...devServerConfig,
  plugins: [...devServerConfig.plugins, a11ySnapshotPlugin()],
};
