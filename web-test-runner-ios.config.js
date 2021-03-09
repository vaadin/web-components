/* eslint-env node */
const fs = require('fs');
const { webdriverLauncher } = require('@web/test-runner-webdriver');

const packages = fs
  .readdirSync('packages')
  .filter((dir) => fs.statSync(`packages/${dir}`).isDirectory() && fs.existsSync(`packages/${dir}/test`));

const config = {
  nodeResolve: true,
  browserStartTimeout: 1000 * 60 * 4, // default 30000
  testsStartTimeout: 1000 * 60 * 4, // default 10000
  testsFinishTimeout: 1000 * 60 * 4, // default 20000
  testFramework: {
    config: {
      ui: 'bdd',
      timeout: '10000'
    }
  },
  concurrency: 1,
  browsers: [
    webdriverLauncher({
      port: 4723,
      path: '/wd/hub/',
      capabilities: {
        browserName: 'safari',
        platformName: 'iOS',
        // For W3C the appium capabilities need to have an extension prefix
        // This is `appium:` for all Appium Capabilities which can be found here
        // http://appium.io/docs/en/writing-running-appium/caps/
        'appium:deviceName': 'iPhone 12',
        'appium:platformVersion': '14.4',
        'appium:orientation': 'PORTRAIT',
        'appium:automationName': 'XCUITest',
        'appium:newCommandTimeout': 240
      }
    })
  ],
  groups: packages.map((pkg) => {
    return {
      name: pkg,
      files: `packages/${pkg}/test/*.test.js`
    };
  }),
  // Suppress console warnings in tests (avatar).
  filterBrowserLogs: (log) => log.type === 'error'
};

module.exports = config;
