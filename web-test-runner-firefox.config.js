/* eslint-env node */
const { playwrightLauncher } = require('@web/test-runner-playwright');
const { filterBrowserLogs, getPackages, getTestGroups, testRunnerHtml } = require('./wtr-utils.js');

const packages = getPackages();
const groups = getTestGroups(packages);

module.exports = {
  nodeResolve: true,
  browserStartTimeout: 60000, // default 30000
  testsStartTimeout: 60000, // default 10000
  testsFinishTimeout: 120000, // default 20000
  browsers: [playwrightLauncher({ product: 'firefox' })],
  testFramework: {
    config: {
      ui: 'bdd',
      timeout: '10000'
    }
  },
  groups,
  testRunnerHtml,
  filterBrowserLogs
};
