import { playwrightLauncher } from '@web/test-runner-playwright';
import minimist from 'minimist';
import { cssImportPlugin } from './web-dev-server.config.js';

const argv = minimist(process.argv.slice(2));
const filesGlob = argv.glob || '*';

export default {
  browsers: [
    playwrightLauncher({
      product: 'chromium',
      launchOptions: {
        headless: true,
      },
    }),
  ],
  nodeResolve: true,
  browserStartTimeout: 60000, // Default 30000
  testsStartTimeout: 60000, // Default 10000
  testsFinishTimeout: 120000, // Default 20000
  testFramework: {
    config: {
      ui: 'bdd',
      timeout: '10000',
      retries: process.env.GITHUB_REF ? 2 : 0,
    },
  },
  groups: [
    {
      name: 'aura-props',
      files: `test/aura-props/${filesGlob}.test.{js,ts}`,
    },
  ],
  plugins: [cssImportPlugin()],
};
