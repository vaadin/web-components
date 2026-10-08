import { oneEvent } from '@vaadin/testing-helpers';
import type { PdfViewer } from '../vaadin-pdf-viewer.js';

export type Fixture =
  | 'encrypted.pdf'
  | 'inline-links.pdf'
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
 * A page of a PDF created with `createPdf()`.
 */
export type PdfPage = {
  /** The content stream of the page. Font `/F1` is Helvetica, `/F2` is Courier. */
  content: string;
  /** The rotation of the page in degrees. */
  rotate?: number;
  /** Annotation dictionaries, e.g. links. */
  annotations?: string[];
  /** The size of the page in PDF units, A4 by default. */
  mediaBox?: [number, number, number, number];
};

/**
 * Creates a PDF with the given pages in memory, and returns an object URL for it.
 * `dests` is the content of the dictionary of named destinations, e.g. `/name [0 /Fit]`.
 */
export function createPdf(pages: PdfPage[], { dests = '' } = {}): string {
  // Object 1 is the catalog, 2 the page tree, 3 and 4 the fonts, then the page, its content and its annotations.
  const objects = [
    `<< /Type /Catalog /Pages 2 0 R${dests ? ` /Dests << ${dests} >>` : ''} >>`,
    '',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>',
  ];
  const pageIds: number[] = [];
  pages.forEach(({ content, rotate = 0, annotations = [], mediaBox = [0, 0, 595, 842] }) => {
    const id = objects.length + 1;
    pageIds.push(id);
    const annotationIds = annotations.map((_, index) => id + 2 + index);
    const annots = annotationIds.length ? ` /Annots [${annotationIds.map((ref) => `${ref} 0 R`).join(' ')}]` : '';
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [${mediaBox.join(' ')}] /Rotate ${rotate} /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${id + 1} 0 R${annots} >>`,
      `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
      ...annotations,
    );
  });
  objects[1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pages.length} >>`;

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

/**
 * Creates a PDF with the given number of US Letter pages in memory, and
 * returns an object URL for it. Each page shows its page number.
 */
export function createPdfUrl(pageCount: number): string {
  return createPdf(
    Array.from({ length: pageCount }, (_, index) => ({
      content: `BT /F1 48 Tf 72 700 Td (Page ${index + 1}) Tj ET`,
      mediaBox: [0, 0, 612, 792],
    })),
  );
}
