import { esbuildPlugin } from '@web/dev-server-esbuild';
import { appendStyles, generateListing, isIndexPage } from './wds-utils.js';

// Theme switching is now handled client-side via URL parameters in dev/common.js

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
  ],
};
