/* eslint-env node */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const { execSync } = require('child_process');
const { createSauceLabsLauncher } = require('@web/test-runner-saucelabs');
const { visualRegressionPlugin } = require('@web/test-runner-visual-regression/plugin');

const HIDDEN_WARNINGS = [
  '<vaadin-crud> Unable to autoconfigure form because the data structure is unknown. Either specify `include` or ensure at least one item is available beforehand.',
  'The <vaadin-grid> needs the total number of items in order to display rows. Set the total number of items to the `size` property, or provide the total number of items in the second argument of the `dataProvider`’s `callback` call.',
  /^WARNING: Since Vaadin .* is deprecated.*/u,
  /^WARNING: <template> inside <[^>]+> is deprecated. Use a renderer function instead/u,
];

const filterBrowserLogs = (log) => {
  const message = log.args[0];

  const isHidden = HIDDEN_WARNINGS.some((warning) => {
    if (warning instanceof RegExp && warning.test(message)) {
      return true;
    }

    if (warning === message) {
      return true;
    }

    return false;
  });

  return !isHidden;
};

const hasGroupParam = process.argv.includes('--group');
const hasCoverageParam = process.argv.includes('--coverage');
const hasAllParam = process.argv.includes('--all');

/**
 * Check if lockfile has changed.
 */
const isLockfileChanged = () => {
  const log = execSync('git diff --name-only origin/master HEAD').toString();
  return log.split('\n').some((line) => line.includes('yarn.lock'));
};

/**
 * Get packages changed since master.
 */
const getChangedPackages = () => {
  const output = execSync('./node_modules/.bin/lerna la --since origin/master --json --loglevel silent');
  return JSON.parse(output.toString()).map((project) => project.name.replace('@vaadin/', ''));
};

/**
 * Get all available packages with unit tests.
 */
const getAllUnitPackages = () => {
  return fs
    .readdirSync('packages')
    .filter(
      (dir) => fs.statSync(`packages/${dir}`).isDirectory() && glob.sync(`packages/${dir}/test/*.test.js`).length > 0,
    );
};

/**
 * Get all available packages with snapshot tests.
 */
const getAllSnapshotPackages = () => {
  return fs
    .readdirSync('packages')
    .filter((dir) => fs.statSync(`packages/${dir}`).isDirectory() && fs.existsSync(`packages/${dir}/test/dom`));
};

/**
 * Get all available packages with visual tests.
 */
const getAllVisualPackages = () => {
  return fs
    .readdirSync('packages')
    .filter((dir) => fs.statSync(`packages/${dir}`).isDirectory() && fs.existsSync(`packages/${dir}/test/visual`));
};

/**
 * Get packages for running tests.
 */
const getTestPackages = (allPackages) => {
  // If --group flag is passed, return all packages.
  if (hasGroupParam) {
    return allPackages;
  }
  // If --all flag is passed, return all packages.
  if (hasAllParam) {
    return allPackages;
  }

  // If yarn.lock has changed, return all packages.
  if (isLockfileChanged()) {
    console.log('yarn.lock has changed, testing all packages');
    return allPackages;
  }

  let packages = getChangedPackages().filter((pkg) => allPackages.includes(pkg));

  if (packages.length === 0) {
    // When running in GitHub Actions, do nothing.
    if (process.env.GITHUB_REF) {
      console.log('No local packages have changed, exiting.');
      process.exit(0);
    } else {
      console.log('No local packages have changed, testing all packages.');
      packages = allPackages;
    }
  } else {
    console.log(`Running tests for changed packages:\n${packages.join('\n')}`);
  }

  return packages;
};

/**
 * Get unit test groups based on packages.
 */
const getSnapshotTestGroups = (packages) => {
  return packages.map((pkg) => {
    return {
      name: pkg,
      files: `packages/${pkg}/test/dom/*.test.js`,
    };
  });
};

/**
 * Get unit test groups based on packages.
 */
const getUnitTestGroups = (packages) => {
  return packages.map((pkg) => {
    return {
      name: pkg,
      files: `packages/${pkg}/test/*.test.js`,
    };
  });
};

/**
 * Get visual test groups based on packages.
 */
const getVisualTestGroups = (packages, theme) => {
  return packages
    .filter(
      (pkg) => !pkg.includes('icons') && !pkg.includes(theme) && !pkg.includes(theme === 'lumo' ? 'material' : 'lumo'),
    )
    .map((pkg) => {
      return {
        name: pkg,
        files: `packages/${pkg}/test/visual/${theme}/*.test.js`,
      };
    })
    .concat({
      name: `vaadin-${theme}-styles`,
      files: `packages/vaadin-${theme}-styles/test/visual/*.test.js`,
    })
    .concat({
      name: `vaadin-icons`,
      files: `packages/icons/test/visual/*.test.js`,
    });
};

const fontRoboto = '<link rel="stylesheet" href="./node_modules/@fontsource/roboto/latin.css">';

const getTestRunnerHtml = (theme) => (testFramework) =>
  `
  <!DOCTYPE html>
  <html>
    <body>
      <style>
        html,
        body {
          height: 100%;
        }

        body {
          margin: 0;
          padding: 0;
        }
      </style>
      ${theme === 'material' ? fontRoboto : ''}
      <script>
        /* Disable Roboto for Material theme tests */
        window.polymerSkipLoadingFontRoboto = true;

        /* Force development mode for element-mixin */
        localStorage.setItem('vaadin.developmentmode.force', true);
      </script>
      <script type="module" src="${testFramework}"></script>
    </body>
  </html>
`;

const getScreenshotFileName = ({ name, testFile }, type, diff) => {
  let folder;
  if (testFile.includes('-styles')) {
    const match = testFile.match(/\/packages\/(vaadin-(lumo|material)-styles\/test\/visual\/)(.+)/u);
    folder = `${match[1]}screenshots`;
  } else if (testFile.includes('icons')) {
    folder = 'icons/test/visual/screenshots';
  } else {
    const match = testFile.match(/\/packages\/(.+)\.test\.js/u);
    folder = match[1].replace(/(lumo|material)/u, '$1/screenshots');
  }
  return path.join(folder, type, diff ? `${name}-diff` : name);
};

const getBaselineScreenshotName = (args) => getScreenshotFileName(args, 'baseline');

const getDiffScreenshotName = (args) => getScreenshotFileName(args, 'failed', true);

const getFailedScreenshotName = (args) => getScreenshotFileName(args, 'failed');

const createSnapshotTestsConfig = (config) => {
  const snapshotPackages = getAllSnapshotPackages();
  const packages = getTestPackages(snapshotPackages);
  const groups = getSnapshotTestGroups(packages);

  return {
    ...config,
    nodeResolve: true,
    groups,
    testRunnerHtml: getTestRunnerHtml(),
    filterBrowserLogs,
  };
};

const createUnitTestsConfig = (config) => {
  const allPackages = getAllUnitPackages();
  const testPackages = getTestPackages(allPackages);
  const groups = getUnitTestGroups(testPackages);

  return {
    ...config,
    nodeResolve: true,
    browserStartTimeout: 60000, // Default 30000
    testsStartTimeout: 60000, // Default 10000
    testsFinishTimeout: 120000, // Default 20000
    testFramework: {
      config: {
        ui: 'bdd',
        timeout: '10000',
      },
    },
    coverage: hasCoverageParam,
    groups,
    testRunnerHtml: getTestRunnerHtml(),
    filterBrowserLogs,
  };
};

const createVisualTestsConfig = (theme) => {
  const visualPackages = getAllVisualPackages();
  const packages = getTestPackages(visualPackages);
  const groups = getVisualTestGroups(packages, theme);

  const sauceLabsLauncher = createSauceLabsLauncher(
    {
      user: process.env.SAUCE_USERNAME,
      key: process.env.SAUCE_ACCESS_KEY,
    },
    {
      name: `${theme[0].toUpperCase()}${theme.slice(1)} visual tests`,
      build: `${process.env.GITHUB_REF || 'local'} build ${process.env.GITHUB_RUN_NUMBER || ''}`,
      recordScreenshots: false,
      recordVideo: false,
    },
  );

  return {
    concurrency: 1,
    nodeResolve: true,
    testFramework: {
      config: {
        timeout: '20000', // Default 2000
      },
    },
    browsers: [
      sauceLabsLauncher({
        browserName: 'chrome',
        platformName: 'Windows 10',
        browserVersion: '108',
      }),
    ],
    plugins: [
      visualRegressionPlugin({
        baseDir: 'packages',
        getBaselineName: getBaselineScreenshotName,
        getDiffName: getDiffScreenshotName,
        getFailedName: getFailedScreenshotName,
        failureThreshold: 0.05,
        failureThresholdType: 'percent',
        update: process.env.TEST_ENV === 'update',
      }),
    ],
    groups,
    testRunnerHtml: getTestRunnerHtml(theme),
    filterBrowserLogs,
  };
};

const createIntegrationTestsConfig = (config) => {
  const changedPackages = getChangedPackages();

  // When running in GitHub Actions, do nothing.
  if (!changedPackages.includes('integration-tests') && process.env.GITHUB_REF) {
    console.log('No packages have changed, exiting.');
    process.exit(0);
  }

  return {
    ...config,
    nodeResolve: true,
    browserStartTimeout: 60000, // Default 30000
    testsStartTimeout: 60000, // Default 10000
    testsFinishTimeout: 120000, // Default 20000
    testFramework: {
      config: {
        ui: 'bdd',
        timeout: '10000',
      },
    },
    groups: [
      {
        name: 'integration',
        files: 'integration/tests/*.test.js',
      },
    ],
    testRunnerHtml: getTestRunnerHtml(),
    filterBrowserLogs,
  };
};

module.exports = {
  createSnapshotTestsConfig,
  createUnitTestsConfig,
  createVisualTestsConfig,
  createIntegrationTestsConfig,
};
