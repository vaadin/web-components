/* eslint-env node */
const { createSauceLabsLauncher } = require('@web/test-runner-saucelabs');

const config = {
  nodeResolve: true,
  browserStartTimeout: 60000, // default 30000
  testsStartTimeout: 60000, // default 10000
  testsFinishTimeout: 60000, // default 20000
  coverageConfig: {
    include: ['**/src/*'],
    threshold: {
      statements: 94,
      branches: 58,
      functions: 90,
      lines: 94
    }
  }
};

if (process.env.TEST_ENV === 'sauce') {
  const sauceLabsLauncher = createSauceLabsLauncher({
    user: process.env.SAUCE_USERNAME,
    key: process.env.SAUCE_ACCESS_KEY
  });

  const sharedCapabilities = {
    'sauce:options': {
      name: 'vaadin-date-picker unit tests',
      build: `${process.env.GITHUB_REF || 'local'} build ${process.env.GITHUB_RUN_NUMBER || ''}`
    }
  };

  config.concurrentBrowsers = 2;
  config.concurrency = 1;
  config.browsers = [
    sauceLabsLauncher({
      ...sharedCapabilities,
      browserName: 'firefox',
      platform: 'Windows 10',
      browserVersion: 'latest'
    }),
    sauceLabsLauncher({
      ...sharedCapabilities,
      browserName: 'safari',
      platform: 'macOS 10.15',
      browserVersion: '13.1'
    })
    // TODO: this seems to also test desktop Safari.
    // Setting "iphone" returns a WebDriverError.
    // sauceLabsLauncher({
    //   ...sharedCapabilities,
    //   browserName: 'safari',
    //   platform: 'iOS Simulator',
    //   browserVersion: '13.1'
    // })
  ];
}

module.exports = config;
