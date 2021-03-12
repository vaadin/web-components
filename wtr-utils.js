/* eslint-env node */
const fs = require('fs');
const { execSync } = require('child_process');

const filterBrowserLogs = (log) => log.type === 'error';

const group = process.argv.indexOf('--group') !== -1;

const NO_TESTS = ['vaadin', 'vaadin-core', 'vaadin-icons', 'vaadin-lumo-styles', 'vaadin-material-styles'];

/**
 * Get packages changed since master.
 */
const getChangedPackages = () => {
  const output = execSync('./node_modules/.bin/lerna ls --since origin/master --json --loglevel silent');
  const changedPackages = JSON.parse(output.toString());
  return changedPackages
    .map((project) => project.name.replace('@vaadin/', ''))
    .filter((project) => NO_TESTS.indexOf(project) === -1);
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
 * Get packages for testing.
 */
const getPackages = () => {
  // If --group flag is passed, return all packages.
  if (group) {
    return getAllPackages();
  }

  let packages = getChangedPackages();

  if (packages.length == 0) {
    // When running in GitHub Actions, do nothing.
    if (process.env.GITHUB_REF) {
      console.log(`No local packages have changed, exiting.`);
      process.exit(0);
    } else {
      console.log(`No local packages have changed, testing all packages.`);
      packages = getAllPackages();
    }
  } else {
    console.log(`Running tests for changed packages:\n${packages.join('\n')}`);
  }

  return packages;
};

/**
 * Get test groups based on packages.
 */
const getTestGroups = (packages) => {
  return packages.map((pkg) => {
    return {
      name: pkg,
      files: `packages/${pkg}/test/*.test.js`
    };
  });
};

const testRunnerHtml = (testFramework) => `
  <!DOCTYPE html>
  <html>
    <body>
      <style>
        body {
          margin: 0;
          padding: 0;
        }
      </style>
      <script>
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

module.exports = {
  filterBrowserLogs,
  getPackages,
  getTestGroups,
  testRunnerHtml
};
