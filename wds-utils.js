import fs from 'node:fs';

export function appendStyles(html) {
  const preventFouc = `
    <style>
      body:not(.resolved) {
        display: none;
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
  return html.includes('<!-- LISTING -->');
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
    const files = fs.readdirSync(dir || '.').filter((file) => file !== 'index.html' && file !== 'dist');

    // Separate sub pages (folders with index.html) from HTML files
    const subPages = files.filter((file) => isSubPage(dir, file));
    const htmlFiles = files.filter((file) => file.endsWith('.html'));

    let listing = '';

    // Add sub pages section if there are any
    if (subPages.length > 0) {
      listing += `
        <h2>Sub pages</h2>
        <ul>
          ${subPages
            .map(
              (file) => `<li>
              <a href="${file}/">${file}/</a>
            </li>`,
            )
            .join('')}
        </ul>`;
    }

    // Add HTML files section if there are any
    if (htmlFiles.length > 0) {
      listing += `
        <h2>Pages</h2>
        <ul>
          ${htmlFiles
            .map(
              (file) => `<li>
              <a href="${file}">${file}</a>
            </li>`,
            )
            .join('')}
        </ul>`;
    }

    return html.replace(/<!-- LISTING -->/u, listing);
  }

  return html;
}
