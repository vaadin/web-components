import { esbuildPlugin } from '@web/dev-server-esbuild';
import { playwrightLauncher } from '@web/test-runner-playwright';
import { createSauceLabsLauncher } from '@web/test-runner-saucelabs';
import { visualRegressionPlugin } from '@web/test-runner-visual-regression/plugin';
import dotenv from 'dotenv';
import { globSync } from 'glob';
import minimist from 'minimist';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { cssImportPlugin, enforceThemePlugin } from './web-dev-server.config.js';

dotenv.config();

const argv = minimist(process.argv.slice(2));
const hasPortedParam = process.argv.includes('--ported');

const HIDDEN_WARNINGS = [
  '<vaadin-crud> Unable to autoconfigure form because the data structure is unknown. Either specify `include` or ensure at least one item is available beforehand.',
  'The <vaadin-grid> needs the total number of items in order to display rows, which you can specify either by setting the `size` property, or by providing it to the second argument of the `dataProvider` function `callback` call.',
  'The Material theme is deprecated and will be removed in Vaadin 25.',
  /^WARNING: Since Vaadin .* is deprecated.*/u,
  /Lit is in dev mode/u,
];

const filterBrowserLogs = (log) => {
  const message = log.args[0];

  // Filter out webdriver debug output
  if (log.type === 'debug' && message.startsWith('[WDIO]')) {
    return false;
  }

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

const hasLocalParam = process.argv.includes('--local');
const hasGroupParam = process.argv.includes('--group');
const hasCoverageParam = process.argv.includes('--coverage');
const hasAllParam = process.argv.includes('--all');

/**
 * Check if lockfile has changed.
 */
const isLockfileChanged = () => {
  const log = execSync('git diff --name-only origin/main HEAD').toString(); // NOSONAR
  return log.split('\n').some((line) => line.includes('yarn.lock'));
};

/**
 * Get packages changed since main.
 */
const getChangedPackages = () => {
  const pathToLerna = path.normalize('./node_modules/.bin/lerna');
  const output = execSync(`${pathToLerna} la --since origin/main --json --loglevel silent`); // NOSONAR
  return JSON.parse(output.toString()).map((project) => project.name.replace('@vaadin/', ''));
};

/**
 * Get all available packages with unit tests.
 */
const getAllUnitPackages = () => {
  return fs
    .readdirSync('packages')
    .filter(
      (dir) =>
        fs.statSync(`packages/${dir}`).isDirectory() && globSync(`packages/${dir}/test/*.test.{js,ts}`).length > 0,
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
 * Get all available packages with visual tests for given theme.
 */
const getAllThemePackages = (theme) => {
  return fs
    .readdirSync('packages')
    .filter(
      (dir) => fs.statSync(`packages/${dir}`).isDirectory() && fs.existsSync(`packages/${dir}/test/visual/${theme}`),
    );
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
      files: `packages/${pkg}/test/dom/*.test.{js,ts}`,
    };
  });
};

/**
 * Get unit test groups based on packages.
 */
const getUnitTestGroups = (packages) => {
  return packages.map((pkg) => {
    const filesGlob = argv.glob || '*';
    return { name: pkg, files: `packages/${pkg}/test/${filesGlob}.test.{js,ts}` };
  });
};

/**
 * Get visual test groups based on packages.
 */
const getVisualTestGroups = (packages, theme) => {
  if (theme === 'base') {
    packages = packages.filter((pkg) => !pkg.includes('lumo'));
  }

  return packages.map((pkg) => {
    return {
      name: pkg,
      files: [`packages/${pkg}/test/visual/*.test.{js,ts}`, `packages/${pkg}/test/visual/${theme}/*.test.{js,ts}`],
    };
  });
};

const getTestRunnerHtml = () => (testFramework) =>
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
      <script>
        /* Force development mode for element-mixin */
        localStorage.setItem('vaadin.developmentmode.force', true);
      </script>
      <script type="module">
        // See https://github.com/modernweb-dev/web/issues/2802#issuecomment-2352116570
        import structuredClone from '@ungap/structured-clone';
        window.structuredClone = (value) => structuredClone(value, { lossy: true });
      </script>
      <script type="module" src="${testFramework}"></script>
    </body>
  </html>
`;

const getScreenshotFileName = ({ name, testFile }, type, diff) => {
  let folder;
  if (testFile.includes('-styles')) {
    const match = testFile.match(/\/packages\/(vaadin-lumo-styles\/test\/visual\/)(.+)/u);
    folder = `${match[1]}screenshots`;
  } else {
    const match = testFile.match(/\/packages\/(.+)\.test\.(js|ts)/u);
    folder = match[1].replace(/(base|lumo)/u, '$1/screenshots');
  }
  return path.join(folder, type, diff ? `${name}-diff` : name);
};

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
        retries: process.env.GITHUB_REF ? 2 : 0,
      },
    },
    coverage: hasCoverageParam,
    groups,
    testRunnerHtml: getTestRunnerHtml(),
    filterBrowserLogs,
  };
};

const createVisualTestsConfig = (theme, browserVersion) => {
  let visualPackages = [];
  if (theme === 'base') {
    visualPackages = getAllVisualPackages().filter((dir) => dir !== 'vaadin-lumo-styles');
  } else if (theme === 'aura') {
    visualPackages = getAllThemePackages('aura');
  } else {
    visualPackages = getAllVisualPackages();
  }

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
      hasLocalParam
        ? playwrightLauncher({
            product: 'chromium',
            launchOptions: {
              channel: 'chrome',
              headless: true,
            },
          })
        : sauceLabsLauncher({
            browserName: 'chrome',
            platformName: 'Windows 10',
            browserVersion,
            'wdio:enforceWebDriverClassic': true,
          }),
    ],
    plugins: [
      esbuildPlugin({ ts: true }),
      visualRegressionPlugin({
        baseDir: 'packages',
        getBaselineName(args) {
          return getScreenshotFileName(args, `${hasLocalParam ? 'local-' : ''}baseline`);
        },
        getDiffName(args) {
          return getScreenshotFileName(args, `${hasLocalParam ? 'local-' : ''}failed`, true);
        },
        getFailedName(args) {
          return getScreenshotFileName(args, `${hasLocalParam ? 'local-' : ''}failed`);
        },
        failureThreshold: 0.05,
        failureThresholdType: 'percent',
        update: process.env.TEST_ENV === 'update',
      }),

      // yarn test:base
      theme === 'base' && enforceThemePlugin('base'),

      // yarn test:lumo (uses legacy lumo styles defined in js files)
      theme === 'lumo' && !hasPortedParam && enforceThemePlugin('legacy-lumo'),

      // yarn test:lumo --ported (uses base styles and lumo styles defined in css files)
      theme === 'lumo' && hasPortedParam && enforceThemePlugin('ported-lumo'),
      theme === 'lumo' && hasPortedParam && cssImportPlugin(),
    ].filter(Boolean),
    groups,
    testRunnerHtml: getTestRunnerHtml(),
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

  const filesGlob = argv.glob || '*';

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
        retries: process.env.GITHUB_REF ? 2 : 0,
      },
    },
    groups: [
      {
        name: 'integration',
        files: `test/integration/${filesGlob}.test.{js,ts}`,
      },
    ],
    testRunnerHtml: getTestRunnerHtml(),
    filterBrowserLogs,
  };
};

export { createSnapshotTestsConfig, createUnitTestsConfig, createVisualTestsConfig, createIntegrationTestsConfig };
