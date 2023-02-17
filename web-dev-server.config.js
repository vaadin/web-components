/* eslint-env node */
const fs = require('fs');
const { esbuildPlugin } = require('@web/dev-server-esbuild');

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

module.exports = {
  plugins: [
    esbuildPlugin({ ts: true, tsconfig: './tsconfig.json' }),
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
  ],
};
