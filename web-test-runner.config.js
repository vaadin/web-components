/* eslint-env node */
const fs = require('fs');

const packages = fs
  .readdirSync('packages')
  .filter((dir) => fs.statSync(`packages/${dir}`).isDirectory() && fs.existsSync(`packages/${dir}/test`));

module.exports = {
  nodeResolve: true,
  browserStartTimeout: 60000, // default 30000
  testsStartTimeout: 60000, // default 10000
  testsFinishTimeout: 60000, // default 20000
  coverageConfig: {
    include: ['packages/**/src/*', 'packages/**/*.js'],
    threshold: {
      statements: 95,
      branches: 59,
      functions: 93,
      lines: 95
    }
  },
  testFramework: {
    config: {
      ui: 'bdd',
      timeout: '10000'
    }
  },
  testRunnerHtml: (testFramework) => `
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
  `,
  groups: packages.map((pkg) => {
    return {
      name: pkg,
      files: `packages/${pkg}/test/*.test.js`
    };
  }),
  // Suppress console warnings in tests (avatar).
  filterBrowserLogs: (log) => log.type === 'error'
};
