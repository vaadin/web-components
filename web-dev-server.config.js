import { esbuildPlugin } from '@web/dev-server-esbuild';
import { appendStyles, generateListing, isIndexPage } from './wds-utils.js';

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
export function enforceThemePlugin(defaultTheme) {
  return {
    name: 'enforce-theme',
    transform(context) {
      if (!context.response.is('html')) {
        return context.body;
      }

      let { body } = context;

      // Inject theme into HTML responses
      // Use query parameter if present, otherwise fall back to process arg
      const theme = context.query.theme || defaultTheme;

      body = body.replace('<html', `<html data-theme="${theme}"`);

      if (theme === 'lumo') {
        body = body.replace(
          '</title>',
          '</title><link rel="stylesheet" href="/packages/vaadin-lumo-styles/lumo.css" />',
        );
      }

      if (theme === 'aura') {
        body = body.replace('</title>', '</title><link rel="stylesheet" href="/packages/aura/aura.css" />');
      }

      // Inject theme switcher
      body = body.replace('</body>', '<theme-switcher></theme-switcher></body>');

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
          if (isIndexPage(body)) {
            const path = context.path.replace(/\/?(index.html)?$/u, '');
            const dir = `.${path}`;
            body = generateListing(body, dir);

            // Add <base> to make index pages work without trailing slash
            body = body.replace('<head>', `<head>\n<base href="${path}/">`);
          }

          return { body };
        }
      },
    },
    esbuildPlugin({ ts: true }),

    enforceThemePlugin(theme),
    cssImportPlugin(),
  ].filter(Boolean),
};
