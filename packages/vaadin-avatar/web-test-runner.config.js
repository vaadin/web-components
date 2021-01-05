/* eslint-env node */
const { createSauceLabsLauncher } = require('@web/test-runner-saucelabs');

const config = {
  nodeResolve: true,
  browserStartTimeout: 60000, // default 30000
  testsStartTimeout: 60000, // default 10000
  testsFinishTimeout: 60000, // default 20000
  testFramework: {
    config: {
      timeout: '10000' // default 2000
    }
  },
  coverageConfig: {
    include: ['**/src/*'],
    threshold: {
      statements: 99,
      branches: 86,
      functions: 100,
      lines: 99
    }
  },
  // Ignore missing color index warnings.
  filterBrowserLogs: (log) => log.type === 'error'
};

if (process.env.TEST_ENV === 'sauce') {
  const sauceLabsLauncher = createSauceLabsLauncher(
    {
      user: process.env.SAUCE_USERNAME,
      key: process.env.SAUCE_ACCESS_KEY
    },
    {
      name: 'vaadin-avatar unit tests',
      build: `${process.env.GITHUB_REF || 'local'} build ${process.env.GITHUB_RUN_NUMBER || ''}`,
      recordScreenshots: false,
      recordVideo: false
    }
  );

  config.concurrency = 1;
  config.browsers = [
    sauceLabsLauncher({
      browserName: 'firefox',
      platformName: 'Windows 10',
      browserVersion: 'latest'
    }),
    sauceLabsLauncher({
      browserName: 'safari',
      platformName: 'macOS 10.15',
      browserVersion: '13.1'
    }),
    sauceLabsLauncher({
      browserName: 'iphone',
      platform: 'iPhone X Simulator',
      version: '13.0'
    })
  ];
}

module.exports = config;
