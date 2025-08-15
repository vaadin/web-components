import { esbuildPlugin } from '@web/dev-server-esbuild';
import { appendStyles, generateListing } from './wds-utils.js';

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

      if (theme === 'lumo' && context.response.is('html')) {
        // For dev pages: add Lumo stylesheet
        body = body.replace(
          '</title>',
          '</title><link rel="stylesheet" href="/packages/vaadin-lumo-styles/lumo.css" />',
        );
      }

      if (theme === 'aura' && context.response.is('html')) {
        // For dev pages: add Aura Stylesheet
        body = body.replace('</title>', '</title><link rel="stylesheet" href="/packages/aura/aura.css" />');
      }

      if (theme === 'base' && context.response.is('html', 'js')) {
        // Remove all not transformed CSS imports
        body = body.replaceAll(/^.+(vaadin-lumo-styles|\.\.)\/.+\.css.+$/gmu, '');
      }

      return body;
    },
  };
}

export default {
  plugins: [
    {
      name: 'dev-page-listing',
      transform(context) {
        if (context.response.is('html')) {
          let body = context.body;

          // Fouc prevention
          body = appendStyles(body);

          // Index page listing
          if (['/dev/index.html', '/dev', '/dev/'].includes(context.path)) {
            body = generateListing(body, './dev', context.path);
          }

          return { body };
        }
      },
    },
    esbuildPlugin({ ts: true }),

    // Used by all themes
    enforceThemePlugin(theme),

    // Lumo / Aura CSS
    ['lumo', 'aura'].includes(theme) && cssImportPlugin(),
  ].filter(Boolean),
};
