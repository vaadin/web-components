/* eslint-env node */
const fs = require('fs');

const indexFile = fs.readFileSync('./dev/index.html', 'utf8');

module.exports = {
  plugins: [
    {
      name: 'dev-page-listing',
      transform(context) {
        if (['/dev/index.html', '/dev', '/dev/'].includes(context.path)) {
          const listing = `
            <ul id="listing">
              ${fs
                .readdirSync('./dev')
                .filter((file) => file !== 'index.html')
                .map((file) => `<li><a href="/dev/${file}">${file}</a></li>`)
                .join('')}
            </ul>`;

          return { body: indexFile.replace(/<ul id="listing">.*<\/ul>/, listing) };
        }
      }
    }
  ]
};
