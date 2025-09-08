import fs from 'node:fs';

export function appendStyles(html) {
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

  return html.replace(/<\/body>/u, `${preventFouc}\n</body>`);
}

export function isIndexPage(html) {
  return html.includes('<ul id="listing">');
}

function isSubPage(dir, file) {
  const filePath = `${dir}/${file}`;
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    const indexPath = `${filePath}/index.html`;
    return fs.existsSync(indexPath);
  }
  return false;
}

export function generateListing(html, dir) {
  if (isIndexPage(html)) {
    const listing = `
      <ul id="listing">
        ${fs
          .readdirSync(dir || '.')
          .filter((file) => file !== 'index.html' && file !== 'dist')
          .filter((file) => file.endsWith('.html') || isSubPage(dir, file))
          .map(
            (file) => `<li>
            <a href="${file}${file.endsWith('.html') ? '' : '/'}">${file}</a>
          </li>`,
          )
          .join('')}
      </ul>`;

    return html.replace(/<ul id="listing">.*<\/ul>/u, listing);
  }

  return html;
}
