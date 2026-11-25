import { playwrightLauncher } from '@web/test-runner-playwright';
import { touchEmulationPlugin } from './test/test-runner-commands/plugins.js';
import devServerConfig from './web-dev-server.config.js';
import { createUnitTestsConfig } from './wtr-utils.js';

const unitTestsConfig = createUnitTestsConfig({
  browsers: [playwrightLauncher({ product: 'webkit' })],
});

export default {
  ...unitTestsConfig,
  ...devServerConfig,
  plugins: [...devServerConfig.plugins, touchEmulationPlugin()],
};
