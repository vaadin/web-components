/* eslint-env node */
const { createSauceLabsLauncher } = require('@web/test-runner-saucelabs');
const { visualRegressionPlugin } = require('@web/test-runner-visual-regression/plugin');
const {
  filterBrowserLogs,
  getBaselineScreenshotName,
  getDiffScreenshotName,
  getFailedScreenshotName,
  getVisualTestGroups,
  getVisualTestPackages,
  testRunnerHtml
} = require('./wtr-utils.js');

const packages = getVisualTestPackages();
const groups = getVisualTestGroups(packages, 'lumo');

const sauceLabsLauncher = createSauceLabsLauncher(
  {
    user: process.env.SAUCE_USERNAME,
    key: process.env.SAUCE_ACCESS_KEY
  },
  {
    name: 'Lumo visual tests',
    build: `${process.env.GITHUB_REF || 'local'} build ${process.env.GITHUB_RUN_NUMBER || ''}`,
    recordScreenshots: false,
    recordVideo: false
  }
);

const config = {
  concurrency: 1,
  nodeResolve: true,
  testFramework: {
    config: {
      timeout: '20000' // default 2000
    }
  },
  browsers: [
    sauceLabsLauncher({
      browserName: 'chrome',
      platformName: 'Windows 10',
      browserVersion: 'latest'
    })
  ],
  plugins: [
    visualRegressionPlugin({
      baseDir: 'screenshots/lumo',
      getBaselineName: getBaselineScreenshotName,
      getDiffName: getDiffScreenshotName,
      getFailedName: getFailedScreenshotName,
      diffOptions: {
        threshold: 0.2
      },
      update: process.env.TEST_ENV === 'update'
    })
  ],
  groups,
  testRunnerHtml,
  filterBrowserLogs
};

module.exports = config;
