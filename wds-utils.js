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

export function generateListing(html, dir) {
  if (html.includes('<ul id="listing">')) {
    const listing = `
      <ul id="listing">
        ${fs
          .readdirSync(dir || '.')
          .filter((file) => file !== 'index.html')
          .filter((file) => file.endsWith('.html'))
          .map((file) => `<li><a href="${dir || ''}${file}">${file}</a></li>`)
          .join('')}
      </ul>`;

    return html.replace(/<ul id="listing">.*<\/ul>/u, listing);
  }

  return html;
}
