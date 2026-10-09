import { playwrightLauncher } from '@web/test-runner-playwright';
import devServerConfig from './web-dev-server.config.js';
import { accessibilityTreePlugin, createUnitTestsConfig, touchEmulationPlugin } from './wtr-utils.js';

const unitTestsConfig = createUnitTestsConfig({
  browsers: [playwrightLauncher({ product: 'webkit' })],
});

export default {
  ...unitTestsConfig,
  ...devServerConfig,
  plugins: [...devServerConfig.plugins, accessibilityTreePlugin(), touchEmulationPlugin()],
};
