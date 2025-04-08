/* eslint-env node */
const fs = require('fs');
const { esbuildPlugin } = require('@web/dev-server-esbuild');
const path = require('path');

/** @return {import('@web/test-runner').TestRunnerPlugin} */
function generatedLitTestsPlugin() {
  return {
    name: 'generated-lit-tests',
    transformImport({ source, context }) {
      if (context.url.includes('-lit.generated.test.')) {
        const dependencyPath = path.resolve(path.dirname(context.url), source);

        const litDependencyPath = dependencyPath
          // /button/vaadin-button.js -> /button/vaadin-lit-button.js
          .replace(/\/vaadin-(?!lit)([^/]+)/u, '/vaadin-lit-$1')
          // /grid/all-imports.js -> /grid/lit-all-imports.js
          .replace(/\/all-imports/u, '/lit-all-imports');

        if (litDependencyPath !== dependencyPath && fs.existsSync(`.${litDependencyPath}`)) {
          return litDependencyPath;
        }
      }
      return source;
    },
  };
}

module.exports = {
  plugins: [
    {
      name: 'dev-page-listing',
      transform(context) {
        if (context.response.is('html')) {
          let body = context.body;

          // Index page listing
          if (['/dev/index.html', '/dev', '/dev/'].includes(context.path)) {
            const listing = `
              <ul id="listing">
                ${fs
                  .readdirSync('./dev')
                  .filter((file) => file !== 'index.html')
                  .filter((file) => file.endsWith('.html'))
                  .map((file) => `<li><a href="/dev/${file}">${file}</a></li>`)
                  .join('')}
              </ul>`;

            body = body.replace(/<ul id="listing">.*<\/ul>/u, listing);
          }

          return { body };
        }
      },
    },
    esbuildPlugin({ ts: true }),
    generatedLitTestsPlugin(),
  ],
  nodeResolve: {
    // Use Lit in production mode
    exportConditions: ['default'],
  },
};
