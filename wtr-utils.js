/* eslint-env node */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { createSauceLabsLauncher } = require('@web/test-runner-saucelabs');
const { visualRegressionPlugin } = require('@web/test-runner-visual-regression/plugin');

const HIDDEN_WARNINGS = [
  '<vaadin-crud> Unable to autoconfigure form because the data structure is unknown. Either specify `include` or ensure at least one item is available beforehand.',
  'The <vaadin-grid> needs the total number of items in order to display rows. Set the total number of items to the `size` property, or provide the total number of items in the second argument of the `dataProvider`’s `callback` call.',
  'PositionMixin is not considered stable and might change any time',
  'WARNING: Since Vaadin 21, update() is deprecated. Please use updateConfiguration() instead.',
  'WARNING: Since Vaadin 21, render() is deprecated. The items value is immutable. Please replace it with a new value instead of mutating in place.',
  'WARNING: Since Vaadin 21, render() is deprecated. Please use requestContentUpdate() instead.',
  /^WARNING: <template> inside <[^>]+> is deprecated. Use a renderer function instead/
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

const group = process.argv.indexOf('--group') !== -1;

const NO_UNIT_TESTS = [
  'vaadin-icons',
  'vaadin-lumo-styles',
  'vaadin-material-styles',
  'vaadin-button',
  'vaadin-select'
];

const hasUnitTests = (pkg) => !NO_UNIT_TESTS.includes(pkg);

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
  const output = execSync('./node_modules/.bin/lerna ls --since origin/master --json --loglevel silent');
  return JSON.parse(output.toString()).map((project) => project.name.replace('@vaadin/', ''));
};

/**
 * Get all available packages.
 */
const getAllPackages = () => {
  return fs
    .readdirSync('packages')
    .filter((dir) => fs.statSync(`packages/${dir}`).isDirectory() && fs.existsSync(`packages/${dir}/test`));
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
 * Get packages for running unit tests.
 */
const getUnitTestPackages = () => {
  let unitPackages = getAllPackages().filter(hasUnitTests);

  // If --group flag is passed, return all packages.
  if (group || isLockfileChanged()) {
    return unitPackages;
  }

  let packages = getChangedPackages().filter(hasUnitTests);

  if (packages.length === 0) {
    // When running in GitHub Actions, do nothing.
    if (process.env.GITHUB_REF) {
      console.log(`No local packages have changed, exiting.`);
      process.exit(0);
    } else {
      console.log(`No local packages have changed, testing all packages.`);
      packages = unitPackages;
    }
  } else {
    console.log(`Running tests for changed packages:\n${packages.join('\n')}`);
  }

  return packages;
};

/**
 * Get packages for running visual tests.
 */
const getVisualTestPackages = () => {
  const visualPackages = getAllVisualPackages();

  // If --group flag is passed, return all packages.
  if (group || isLockfileChanged()) {
    return visualPackages;
  }

  let packages = getChangedPackages();

  if (packages.length === 0) {
    // When running in GitHub Actions, do nothing.
    if (process.env.GITHUB_REF) {
      console.log(`No local packages have changed, exiting.`);
      process.exit(0);
    } else {
      console.log(`No local packages have changed, testing all packages.`);
      packages = visualPackages;
    }
  } else {
    // Filter out possible duplicates from packages list
    packages = packages.filter((v, i, a) => a.indexOf(v) === i);
    console.log(`Running tests for changed packages:\n${packages.join('\n')}`);
  }

  return packages.filter((pkg) => visualPackages.includes(pkg));
};

/**
 * Get unit test groups based on packages.
 */
const getUnitTestGroups = (packages) => {
  return packages.map((pkg) => {
    return {
      name: pkg,
      files: `packages/${pkg}/test/*.test.js`
    };
  });
};

/**
 * Get visual test groups based on packages.
 */
const getVisualTestGroups = (packages, theme) => {
  return packages
    .filter(
      (pkg) => !pkg.includes('icons') && !pkg.includes(theme) && !pkg.includes(theme === 'lumo' ? 'material' : 'lumo')
    )
    .map((pkg) => {
      return {
        name: pkg,
        files: `packages/${pkg}/test/visual/${theme}/*.test.js`
      };
    })
    .concat({
      name: `vaadin-${theme}-styles`,
      files: `packages/vaadin-${theme}-styles/test/visual/*.test.js`
    })
    .concat({
      name: `vaadin-icons`,
      files: `packages/vaadin-icons/test/visual/*.test.js`
    });
};

const testRunnerHtml = (testFramework) => `
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

        html {
          --vaadin-user-color-0: #df0b92;
          --vaadin-user-color-1: #650acc;
          --vaadin-user-color-2: #097faa;
          --vaadin-user-color-3: #ad6200;
          --vaadin-user-color-4: #bf16f3;
          --vaadin-user-color-5: #084391;
          --vaadin-user-color-6: #078836;
        }
      </style>
      <script>
        /* Disable Roboto for Material theme tests */
        window.polymerSkipLoadingFontRoboto = true;

        /* Force development mode for element-mixin */
        localStorage.setItem('vaadin.developmentmode.force', true);

        /* Prevent license checker popup for Pro */
        const now = new Date().getTime();
        localStorage.setItem('vaadin.licenses.vaadin-board.lastCheck', now);
        localStorage.setItem('vaadin.licenses.vaadin-charts.lastCheck', now);
        localStorage.setItem('vaadin.licenses.vaadin-confirm-dialog.lastCheck', now);
        localStorage.setItem('vaadin.licenses.vaadin-cookie-consent.lastCheck', now);
        localStorage.setItem('vaadin.licenses.vaadin-crud.lastCheck', now);
        localStorage.setItem('vaadin.licenses.vaadin-grid-pro.lastCheck', now);
        localStorage.setItem('vaadin.licenses.vaadin-rich-text-editor.lastCheck', now);
      </script>
      <script type="module" src="${testFramework}"></script>
    </body>
  </html>
`;

const getScreenshotFileName = ({ name }, type, diff) => {
  const [meta, test] = name.split('_');
  const { pathname } = new URL(meta);
  let folder;
  if (name.includes('-styles')) {
    const match = pathname.match(/\/packages\/(vaadin-(lumo|material)-styles\/test\/visual\/)(.+)/);
    folder = match[1] + 'screenshots';
  } else if (name.includes('vaadin-icons')) {
    folder = 'vaadin-icons/test/visual/screenshots';
  } else {
    const match = pathname.match(/\/packages\/(.+)\.test\.js/);
    folder = match[1].replace(/(lumo|material)/, '$1/screenshots');
  }
  return path.join(folder, type, diff ? `${test}-diff` : test);
};

const getBaselineScreenshotName = (args) => getScreenshotFileName(args, 'baseline');

const getDiffScreenshotName = (args) => getScreenshotFileName(args, 'failed', true);

const getFailedScreenshotName = (args) => getScreenshotFileName(args, 'failed');

const createUnitTestsConfig = (config) => {
  const packages = getUnitTestPackages();
  const groups = getUnitTestGroups(packages);

  return {
    ...config,
    nodeResolve: true,
    browserStartTimeout: 60000, // default 30000
    testsStartTimeout: 60000, // default 10000
    testsFinishTimeout: 120000, // default 20000
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
};

const createVisualTestsConfig = (theme) => {
  const packages = getVisualTestPackages();
  const groups = getVisualTestGroups(packages, theme);

  const sauceLabsLauncher = createSauceLabsLauncher(
    {
      user: process.env.SAUCE_USERNAME,
      key: process.env.SAUCE_ACCESS_KEY
    },
    {
      name: `${theme[0].toUpperCase()}${theme.slice(1)} visual tests`,
      build: `${process.env.GITHUB_REF || 'local'} build ${process.env.GITHUB_RUN_NUMBER || ''}`,
      recordScreenshots: false,
      recordVideo: false
    }
  );

  return {
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
        browserVersion: '88'
      })
    ],
    plugins: [
      visualRegressionPlugin({
        baseDir: 'packages',
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
};

module.exports = {
  createUnitTestsConfig,
  createVisualTestsConfig
};
