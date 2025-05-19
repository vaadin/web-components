/* eslint-env node */
import { esbuildPlugin } from '@web/dev-server-esbuild';
import fs from 'node:fs';
import path from 'node:path';

const hasLitParam = process.argv.includes('--lit');
const hasBaseParam = process.argv.includes('--base');

/** @return {import('@web/test-runner').TestRunnerPlugin} */
export function enforceLitVersionsPlugin(predicate) {
  return {
    name: 'enforce-lit-versions',
    transformImport({ source, context }) {
      if (!predicate || predicate(context)) {
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
    },
  };
}

/** @return {import('@web/test-runner').TestRunnerPlugin} */
export function enforceBaseStylesPlugin() {
  return {
    name: 'enforce-base-styles',
    transform(context) {
      if (context.response.is('html')) {
        return { body: context.body.replace('./common.js', './common-base.js') };
      }
    },
    transformImport({ source }) {
      source = source.replace('/theme/lumo/', '/src/');
      source = source.replace(/(.+)-core-styles\.js/u, '$1-base-styles.js');
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

export default {
  plugins: [
    {
      name: 'dev-page-listing',
      transform(context) {
        if (context.response.is('html')) {
          let body = context.body;

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
    hasLitParam && enforceLitVersionsPlugin(),
    // When passing --base flag to `yarn start` command, load base styles and not Lumo
    hasBaseParam && enforceBaseStylesPlugin(),
    esbuildPlugin({ ts: true }),
  ].filter(Boolean),
};
