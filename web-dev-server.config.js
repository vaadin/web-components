/* eslint-env node */
import rollupAlias from '@rollup/plugin-alias';
import { esbuildPlugin } from '@web/dev-server-esbuild';
import { fromRollup } from '@web/dev-server-rollup';
import fs from 'node:fs';
import path from 'node:path';

const alias = fromRollup(rollupAlias);

const hasBaseParam = process.argv.includes('--base');

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

const preventFouc = `
  <style>
    body:not(.resolved) {
      opacity: 0;
    }

    body {
      transition: opacity 0.2s;
    }
  </style>

  <script type="module">
    // It's important to use type module for the script so the timing is correct
    document.body.classList.add('resolved');
  </script>
`;

// When passing --base flag to `yarn start` command, load base styles and not Lumo
const commonStyles = `<script type="module" src="./common${hasBaseParam ? '-base' : ''}.js"></script>`;

export default {
  plugins: [
    {
      name: 'dev-page-listing',
      transform(context) {
        if (context.response.is('html')) {
          let body = context.body;

          // Common styles and a flag to detect which version to import
          body = body.replace(
            /<\/head>/u,
            `${commonStyles}\n<script>window.useBaseStyles = ${hasBaseParam}</script></head>`,
          );

          // Fouc prevention
          body = body.replace(/<\/body>/u, `${preventFouc}\n</body>`);

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
    hasBaseParam &&
      alias({
        entries: [
          {
            find: /(.+)-core-styles\.js/u,
            replacement: '$1-base-styles.js',
          },
        ],
      }),
    esbuildPlugin({ ts: true }),
    generatedLitTestsPlugin(),
  ].filter(Boolean),
};
