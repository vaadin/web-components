import { esbuildPlugin } from '@web/dev-server-esbuild';
import { playwrightLauncher } from '@web/test-runner-playwright';
import { visualRegressionPlugin } from '@web/test-runner-visual-regression/plugin';
import { globSync } from 'glob';
import minimist from 'minimist';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { cssImportPlugin } from './web-dev-server.config.js';

const argv = minimist(process.argv.slice(2));

const HIDDEN_WARNINGS = [
  '<vaadin-crud> Unable to autoconfigure form because the data structure is unknown. Either specify `include` or ensure at least one item is available beforehand.',
  'The <vaadin-grid> needs the total number of items in order to display rows, which you can specify either by setting the `size` property, or by providing it to the second argument of the `dataProvider` function `callback` call.',
  /is deprecated/u,
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
 * Packages whose Lumo visual tests are reused for the light-DOM Lumo (`wip`) theme.
 * Only components already ported to `packages/lumo` and whose tested states render
 * no built-in icon glyphs (lumo-icons font in the original vs SVG masks in the base),
 * so screenshots are comparable against the existing Lumo baselines.
 */
const WIP_LUMO_PACKAGES = [
  'breadcrumbs',
  'button',
  'card',
  'charts',
  'confirm-dialog',
  'dialog',
  'horizontal-layout',
  'icon',
  'input-container',
  'master-detail-layout',
  'message-input',
  'message-list',
  'notification',
  'overlay',
  'popover',
  'radio-group',
  'scroller',
  'split-layout',
  'tooltip',
  'vertical-layout',
  'virtual-list',
];

const LUMO_TEST_FILES = '/packages/*/test/visual/lumo/*.test.{js,ts}';
const LUMO_STYLES_IMPORT =
  /^\s*import\s+['"][^'"]*vaadin-lumo-styles\/(?:src\/(?:props|global)\/index|components\/[\w-]+)\.css[^'"]*['"];?\s*$/gmu;
const LUMO_GLOBAL_IMPORT = /vaadin-lumo-styles\/src\/global\/index\.css/u;

/**
 * `wip`: rewrites `test/visual/lumo/*.test.js` modules so they load the light-DOM
 * Lumo theme (`packages/lumo/lumo.css`) instead of the shadow-DOM Lumo styles:
 * - drops `@vaadin/vaadin-lumo-styles/{src/props,src/global}/index.css` imports
 * - drops `@vaadin/vaadin-lumo-styles/components/*.css` imports (shadow injection markers)
 * - prepends a single `packages/lumo/lumo.css` import
 * Iconset imports (`vaadin-iconset.js`) are kept: they are JS, not theme CSS.
 *
 * `wip-ref`: keeps the shadow-DOM Lumo styles but adds `src/global/index.css`
 * (body typography, color scheme) when the test does not import it, so the
 * reference screenshots share the globals that `lumo.css` always applies.
 */
const createLumoLightDomPlugin = (theme) => {
  return {
    name: 'lumo-light-dom',
    transform(context) {
      if (!path.matchesGlob(context.path, LUMO_TEST_FILES)) {
        return;
      }
      if (theme === 'wip-ref') {
        if (LUMO_GLOBAL_IMPORT.test(context.body)) {
          return;
        }
        return `import '/packages/vaadin-lumo-styles/src/global/index.css?injectCSS';\n${context.body}`;
      }
      const body = context.body.replace(LUMO_STYLES_IMPORT, '');
      return `import '/packages/lumo/lumo.css?injectCSS';\n${body}`;
    },
  };
};

/**
 * Get visual test groups based on packages.
 */
const getVisualTestGroups = (packages, theme) => {
  const filesGlob = argv.glob || '*';

  if (theme === 'base') {
    packages = packages.filter((pkg) => !pkg.includes('lumo'));
  }

  // Light-DOM Lumo reuses the Lumo test files.
  const themeDir = theme.startsWith('wip') ? 'lumo' : theme;

  return packages.map((pkg) => {
    return {
      name: pkg,
      files: [
        `packages/${pkg}/test/visual/${filesGlob}.test.{js,ts}`,
        `packages/${pkg}/test/visual/${themeDir}/${filesGlob}.test.{js,ts}`,
      ],
    };
  });
};

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

        ${theme === 'aura' && argv.dark ? 'html { color-scheme: dark }' : ''}
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

const getScreenshotFileName = ({ name, testFile }, type, diff, theme) => {
  let folder = path.join(path.dirname(testFile), 'screenshots');

  // Light-DOM Lumo screenshots live next to the Lumo ones under `wip-*` folders (gitignored).
  if (theme && theme.startsWith('wip')) {
    type = `wip-${type}`;
  }

  if (path.matchesGlob(testFile, '**/visual/aura/*')) {
    folder = path.join(folder, `${argv.dark ? 'dark' : 'default'}`);
  }

  if (path.matchesGlob(testFile, '**/packages/!(vaadin-lumo-styles|field-base)/**')) {
    folder = path.join(folder, path.basename(testFile).replace(/\.test\.(js|ts)$/u, ''));
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
    browserStartTimeout: 60000, // Default 30000
    testsStartTimeout: 60000, // Default 10000
    testsFinishTimeout: 120000, // Default 20000
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

const createVisualTestsConfig = (theme) => {
  let visualPackages;
  if (theme === 'base') {
    visualPackages = getAllVisualPackages().filter((dir) => dir !== 'vaadin-lumo-styles');
  } else if (theme === 'aura') {
    visualPackages = getAllVisualPackages().filter((dir) => dir !== 'vaadin-lumo-styles' && dir !== 'field-base');
  } else if (theme.startsWith('wip')) {
    visualPackages = getAllVisualPackages().filter((dir) => WIP_LUMO_PACKAGES.includes(dir));
  } else {
    visualPackages = getAllVisualPackages().filter((dir) => dir !== 'field-base');
  }

  // The wip subset is explicit; skip the changed-packages detection.
  const packages = theme.startsWith('wip') ? visualPackages : getTestPackages(visualPackages);
  const groups = getVisualTestGroups(packages, theme);

  const viewportWidth = 1024;
  const viewportHeight = 768;
  const browser = playwrightLauncher({
    product: 'chromium',
    launchOptions: {
      headless: true,
      ignoreDefaultArgs: ['--hide-scrollbars'],
    },
    async createPage({ context }) {
      const page = await context.newPage();
      // Override setViewportSize to use our dimensions instead of the
      // 800x600 default hardcoded in @web/test-runner-playwright.
      const originalSetViewportSize = page.setViewportSize.bind(page);
      page.setViewportSize = (_size) => originalSetViewportSize({ width: viewportWidth, height: viewportHeight });
      return page;
    },
  });

  return {
    concurrency: 1,
    nodeResolve: true,
    testFramework: {
      config: {
        timeout: '20000', // Default 2000
      },
    },
    browsers: [browser],
    plugins: [
      esbuildPlugin({ ts: true, target: 'esnext' }),
      visualRegressionPlugin({
        baseDir: 'packages',
        getBaselineName(args) {
          return getScreenshotFileName(args, 'baseline', false, theme);
        },
        getDiffName(args) {
          return getScreenshotFileName(args, 'failed', true, theme);
        },
        getFailedName(args) {
          return getScreenshotFileName(args, 'failed', false, theme);
        },
        diffOptions: { threshold: 0.2 },
        failureThreshold: 0.05,
        failureThresholdType: 'percent',
        // Light-DOM Lumo never writes references; `wip-ref` does.
        update: process.env.TEST_ENV === 'update' && theme !== 'wip',
      }),
      cssImportPlugin(),
      ...(theme.startsWith('wip') ? [createLumoLightDomPlugin(theme)] : []),
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
