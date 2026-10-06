import { oneEvent } from '@vaadin/testing-helpers';
import type { PdfViewer } from '../vaadin-pdf-viewer.js';

export type Fixture =
  | 'encrypted.pdf'
  | 'invalid.pdf'
  | 'links.pdf'
  | 'multi-page.pdf'
  | 'outline.pdf'
  | 'standard-font.pdf'
  | 'tagged.pdf'
  | 'unsafe-links.pdf';

export function fixtureUrl(name: Fixture): string {
  return new URL(`./fixtures/${name}`, import.meta.url).href;
}

/**
 * Sets the `src` of the viewer and waits until the document has loaded.
 */
export async function loadDocument(viewer: PdfViewer, name: Fixture): Promise<void> {
  const loaded = oneEvent(viewer, 'document-load');
  viewer.src = fixtureUrl(name);
  await loaded;
}

/**
 * Waits until the viewer has finished rendering the pages it currently shows.
 */
export async function nextRenderIdle(viewer: PdfViewer): Promise<void> {
  await oneEvent(viewer, 'render-idle');
}

/**
 * Creates a PDF with the given number of pages in memory, and returns an
 * object URL for it. Each page shows its page number.
 */
export function createPdfUrl(pageCount: number): string {
  // Object 1 is the catalog, 2 the page tree, 3 the font, then a page and its content for each page.
  const pageIds = Array.from({ length: pageCount }, (_, index) => 4 + index * 2);
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageCount} >>`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ];
  pageIds.forEach((id, index) => {
    const content = `BT /F1 48 Tf 72 700 Td (Page ${index + 1}) Tj ET`;
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R >> >> /Contents ${id + 1} 0 R >>`,
      `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    );
  });

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((offset) => {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return URL.createObjectURL(new Blob([pdf], { type: 'application/pdf' }));
}
