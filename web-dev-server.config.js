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

      return body;
    },
  };
}

/** @return {import('@web/dev-server').Plugin} */
export function fileUploadEndpointPlugin() {
  return {
    name: 'file-upload-endpoint',
    async serve(context) {
      // Handle file upload endpoint
      if (context.path === '/api/fileupload' && context.request.method === 'POST') {
        // Read the request body
        const chunks = [];
        try {
          for await (const chunk of context.request) {
            chunks.push(chunk);
          }
        } catch (err) {
          console.error('Error reading upload:', err);
        }
        const body = Buffer.concat(chunks);

        // Log the upload (for demo purposes)
        console.log(`📤 Received upload: ${body.length} bytes`);

        // Simulate processing time
        await new Promise((resolve) => {
          setTimeout(resolve, 100);
        });

        // Return success response
        return {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            success: true,
            message: 'File uploaded successfully',
            size: body.length,
          }),
        };
      }
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

    // Used by all themes
    enforceThemePlugin(theme),

    // Lumo / Aura CSS
    ['lumo', 'aura'].includes(theme) && cssImportPlugin(),

    // File upload endpoint for testing
    fileUploadEndpointPlugin(),
  ].filter(Boolean),
};
