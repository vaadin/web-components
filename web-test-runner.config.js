/* eslint-env node */
const { filterBrowserLogs, getPackages, getTestGroups, testRunnerHtml } = require('./wtr-utils.js');

const packages = getPackages();
const groups = getTestGroups(packages);

module.exports = {
  nodeResolve: true,
  browserStartTimeout: 60000, // default 30000
  testsStartTimeout: 60000, // default 10000
  testsFinishTimeout: 60000, // default 20000
  coverageConfig: {
    include: ['packages/**/src/*', 'packages/**/*.js'],
    threshold: {
      statements: 80,
      branches: 50,
      functions: 80,
      lines: 80
    }
  },
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
