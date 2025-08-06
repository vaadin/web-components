import { esbuildPlugin } from '@web/dev-server-esbuild';
import fs from 'node:fs';
import path from 'node:path';

const theme = process.argv.join(' ').match(/--theme=(\w+)/u)?.[1] ?? 'base';

/** @return {import('@web/test-runner').TestRunnerPlugin} */
export function cssImportPlugin() {
  return {
    name: 'css-import',
    transformImport({ source }) {
      if (source.endsWith('.css')) {
        return `${source}?injectCSS`;
      }
    },
    transform(context) {
      if (context.query.injectCSS !== undefined) {
        return `
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = ${JSON.stringify(context.path)};
          document.head.appendChild(link);
          await new Promise((resolve, reject) => {
            link.addEventListener('load', resolve);
            link.addEventListener('error', reject);
          });
        `;
      }
    },
    resolveMimeType(context) {
      if (context.query.injectCSS !== undefined) {
        return 'text/javascript';
      }
    },
  };
}

/** @return {import('@web/test-runner').TestRunnerPlugin} */
export function enforceThemePlugin(theme) {
  return {
    name: 'enforce-theme',
    transform(context) {
      let { body } = context;

      if (theme === 'aura' && context.response.is('html')) {
        // For dev pages: replace link to CSS stylesheet with JS autoload script
        body = body.replace(
          '<link rel="stylesheet" href="/packages/vaadin-lumo-styles/lumo.css" />',
          '<link rel="stylesheet" href="/packages/aura/aura.css" />',
        );
      }

      if (['base', 'legacy-lumo', 'aura'].includes(theme) && context.response.is('html', 'js')) {
        // Remove all not transformed CSS imports
        body = body.replaceAll(/^.+(vaadin-lumo-styles|\.\.)\/.+\.css.+$/gmu, '');
      }

      return body;
    },
    transformImport({ source, context }) {
      // TODO: remove after replacing core styles with base styles
      const baseStylesResolvedPath = path.resolve(
        path.dirname(context.url),
        source.replace('-core-styles', '-base-styles'),
      );
      if (fs.existsSync(`.${baseStylesResolvedPath}`)) {
        source = source.replace('-core-styles', '-base-styles');
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
    esbuildPlugin({ ts: true }),

    // yarn start
    theme === 'base' && enforceThemePlugin('base'),

    // yarn start --theme=lumo
    theme === 'lumo' && enforceThemePlugin('lumo'),
    theme === 'lumo' && cssImportPlugin(),

    // yarn start --theme=aura
    theme === 'aura' && enforceThemePlugin('aura'),
    theme === 'aura' && cssImportPlugin(),
  ].filter(Boolean),
};
