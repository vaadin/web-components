/* eslint-env node */
const fs = require('fs');

module.exports = {
  plugins: [
    {
      name: 'dev-page-listing',
      transform(context) {
        if (context.path === '/dev/index.html') {
          const listing = `
            <ul id="listing">
              ${fs
                .readdirSync('./dev')
                .map((file) => `<li><a href="/dev/${file}">${file}</a></li>`)
                .join('')}
            </ul>`;

          return { body: context.body.replace(/<ul id="listing">.*<\/ul>/, listing) };
        }
      },
    },
  ],
};
