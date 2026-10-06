/**
 * Generates the PDF fixtures in this folder. Run from the repository root:
 *
 *   node packages/pdf-viewer/test/fixtures/generate-fixtures.js
 *
 * Most fixtures are printed from HTML with Playwright's Chromium, which embeds
 * the fonts and can write tagged PDFs with an outline. See README.md.
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const dir = dirname(fileURLToPath(import.meta.url));

const baseStyles = `
  body { font-family: Arial, Helvetica, sans-serif; font-size: 14pt; line-height: 1.4; margin: 0; }
  h1 { font-size: 28pt; }
  .page { break-after: page; }
  .page:last-child { break-after: auto; }
`;

const paragraph =
  'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. ' +
  'How vexingly quick daft zebras jump. Sphinx of black quartz, judge my vow.';

const fixtures = {
  'multi-page.pdf': {
    html: `
      <title>Multi-page fixture</title>
      <style>
        ${baseStyles}
        @page wide { size: A4 landscape; }
        .wide { page: wide; }
      </style>
      ${[1, 2, 3, 4, 5]
        .map(
          (n) => `
          <section class="page">
            <h1>Page ${n}</h1>
            <p>${paragraph}</p>
            <p>Unique word on this page: marker${n}.</p>
          </section>`,
        )
        .join('')}
      <section class="page wide">
        <h1>Page 6</h1>
        <p>This page is in landscape orientation.</p>
        <p>${paragraph}</p>
      </section>
    `,
  },
  'links.pdf': {
    html: `
      <title>Links fixture</title>
      <style>${baseStyles}</style>
      <section class="page">
        <h1>Links</h1>
        <p><a href="#target">Internal link to page 2</a></p>
        <p><a href="https://vaadin.com/">External link to vaadin.com</a></p>
      </section>
      <section class="page">
        <h1 id="target">Link target</h1>
        <p>${paragraph}</p>
      </section>
      <section class="page"><p>Page 3</p></section>
      <section class="page"><p>Page 4</p></section>
    `,
  },
  'outline.pdf': {
    tagged: true,
    outline: true,
    html: `
      <title>Outline fixture</title>
      <style>${baseStyles}</style>
      <section class="page">
        <h1>Chapter 1</h1>
        <h2>Section 1.1</h2>
        <p>${paragraph}</p>
        <h2>Section 1.2</h2>
        <h3>Section 1.2.1</h3>
        <p>${paragraph}</p>
      </section>
      <section class="page">
        <h1>Chapter 2</h1>
        <p>${paragraph}</p>
      </section>
      <section class="page">
        <h1>Chapter 3</h1>
        <h2>Section 3.1</h2>
        <p>${paragraph}</p>
      </section>
    `,
  },
  'tagged.pdf': {
    tagged: true,
    html: `
      <title>Tagged fixture</title>
      <style>${baseStyles} table { border-collapse: collapse; } td, th { border: 1px solid #000; padding: 4px; }</style>
      <h1>Tagged document</h1>
      <h2>A list</h2>
      <ul><li>First item</li><li>Second item</li></ul>
      <h2>A table</h2>
      <table>
        <tr><th>Name</th><th>Value</th></tr>
        <tr><td>Alpha</td><td>1</td></tr>
        <tr><td>Beta</td><td>2</td></tr>
      </table>
      <h2>A figure</h2>
      <img alt="A blue square" width="100" height="100"
        src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect width='100' height='100' fill='blue'/></svg>">
    `,
  },
};

/**
 * Assembles a PDF file from a list of object bodies, numbered from 1.
 */
function assemblePdf(objects, trailer) {
  let body = '%PDF-1.4\n';
  const offsets = [];
  objects.forEach((object, index) => {
    offsets.push(body.length);
    body += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = body.length;
  body += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((offset) => {
    body += `${String(offset).padStart(10, '0')} 00000 n \n`;
  });
  body += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R ${trailer} >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return body;
}

/**
 * Builds a PDF that uses the standard Helvetica font without embedding it,
 * as many report generators do.
 */
function createStandardFontPdf() {
  const content =
    'BT /F1 28 Tf 72 720 Td (Standard font) Tj /F1 14 Tf 0 -40 Td (Helvetica, not embedded in the file.) Tj ET';
  return assemblePdf(
    [
      '<< /Type /Catalog /Pages 2 0 R >>',
      '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
      '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',
      `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
      '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
    ],
    '',
  );
}

/**
 * Builds a PDF with link annotations to URLs that the viewer must not open,
 * next to one safe link.
 */
function createUnsafeLinksPdf() {
  // The viewer must not create links for these URLs, except the first one.
  // eslint-disable-next-line no-script-url
  const urls = ['https://vaadin.com/', 'javascript:alert(1)', 'ftp://example.com/', 'tel:123456'];
  const content = urls.map((url, index) => `BT /F1 14 Tf 72 ${720 - index * 40} Td (${url}) Tj ET`).join(' ');
  const links = urls.map(
    (url, index) =>
      `<< /Type /Annot /Subtype /Link /Rect [72 ${715 - index * 40} 300 ${735 - index * 40}] /Border [0 0 0] /A << /S /URI /URI (${url}) >> >>`,
  );
  return assemblePdf(
    [
      '<< /Type /Catalog /Pages 2 0 R >>',
      '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R /Annots [${links.map((_, index) => `${index + 6} 0 R`).join(' ')}] >>`,
      `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
      '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
      ...links,
    ],
    '',
  );
}

/**
 * Builds a PDF that uses the standard security handler with a user password,
 * so that pdf.js asks for a password. The document itself is never readable.
 */
function createEncryptedPdf() {
  return assemblePdf(
    [
      '<< /Type /Catalog /Pages 2 0 R >>',
      '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
      '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>',
      `<< /Filter /Standard /V 1 /R 2 /O <${'a'.repeat(64)}> /U <${'b'.repeat(64)}> /P -4 >>`,
    ],
    `/Encrypt 4 0 R /ID [<${'0'.repeat(32)}> <${'0'.repeat(32)}>]`,
  );
}

const browser = await chromium.launch();
const page = await browser.newPage();
for (const [name, { html, tagged = false, outline = false }] of Object.entries(fixtures)) {
  await page.setContent(`<!doctype html><html lang="en">${html}</html>`);
  await page.pdf({
    path: join(dir, name),
    format: 'A4',
    printBackground: true,
    margin: { top: '20mm', bottom: '20mm', left: '20mm', right: '20mm' },
    tagged,
    outline,
  });
}
await browser.close();

writeFileSync(join(dir, 'encrypted.pdf'), createEncryptedPdf(), 'latin1');
writeFileSync(join(dir, 'standard-font.pdf'), createStandardFontPdf(), 'latin1');
writeFileSync(join(dir, 'unsafe-links.pdf'), createUnsafeLinksPdf(), 'latin1');
writeFileSync(join(dir, 'invalid.pdf'), 'This file is not a PDF document.\n');
