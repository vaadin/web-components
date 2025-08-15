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

export function generateListing(html, dir, path) {
  if (html.includes('<ul id="listing">')) {
    // Add <base> to make index.html work when opening
    // http://localhost:8000/dev or http://localhost:8000/dev/charts without trailing slash
    const match = /\/(?<section>dev|charts)$/u.exec(path);
    if (match) {
      html = html.replace('<head>', `<head>\n<base href="${match.groups.section}/">`);
    }

    const listing = `
      <ul id="listing">
        ${fs
          .readdirSync(dir || '.')
          .filter((file) => file !== 'index.html')
          .filter((file) => file.endsWith('.html'))
          .map((file) => `<li><a href="${file}">${file}</a></li>`)
          .join('')}
      </ul>`;

    return html.replace(/<ul id="listing">.*<\/ul>/u, listing);
  }

  return html;
}
