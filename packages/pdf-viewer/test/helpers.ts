import { nextFrame, oneEvent } from '@vaadin/testing-helpers';
import { acquireWorker, loadPdfjs, releaseWorker } from '../src/pdfjs-loader.js';
import type { PdfViewer } from '../vaadin-pdf-viewer.js';

export type Fixture =
  | 'encrypted.pdf'
  | 'inline-links.pdf'
  | 'invalid.pdf'
  | 'javascript.pdf'
  | 'links.pdf'
  | 'multi-page.pdf'
  | 'outline.pdf'
  | 'rotated.pdf'
  | 'standard-font.pdf'
  | 'tagged.pdf'
  | 'unsafe-links.pdf';

export function fixtureUrl(name: Fixture): string {
  return new URL(`./fixtures/${name}`, import.meta.url).href;
}

/**
 * Returns the prototype of the documents of pdf.js, which pdf.js does not export,
 * for stubbing the methods that the viewer calls.
 */
export async function getPdfDocumentPrototype(): Promise<any> {
  const pdfjs = await loadPdfjs();
  const handle = acquireWorker(pdfjs);
  const task = pdfjs.getDocument({ url: fixtureUrl('multi-page.pdf'), worker: handle.worker! });
  try {
    return Object.getPrototypeOf(await task.promise);
  } finally {
    await task.destroy();
    releaseWorker(handle);
  }
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
 * Waits until a scroll, which can be animated, has settled.
 */
export async function scrollSettled(element: HTMLElement): Promise<void> {
  let last = -1;
  let stableFrames = 0;
  for (let i = 0; i < 120 && stableFrames < 3; i++) {
    await nextFrame();
    stableFrames = element.scrollTop === last ? stableFrames + 1 : 0;
    last = element.scrollTop;
  }
}

/**
 * Waits until the current match of a search is highlighted and scrolled to.
 */
export async function currentMatchShown(viewer: PdfViewer): Promise<void> {
  for (let i = 0; i < 50 && !viewer.shadowRoot!.querySelector('.find-match.current'); i++) {
    await nextFrame();
  }
  await scrollSettled(viewer.shadowRoot!.querySelector<HTMLElement>('[part="content"]')!);
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
 * An item of the outline of a PDF created with `createPdf()`.
 */
export type PdfOutlineItem = {
  title: string;
  /** The action dictionary of the item, e.g. `<< /S /URI /URI (https://vaadin.com/) >>`. */
  action: string;
};

/**
 * Creates a PDF with the given pages in memory, and returns an object URL for it.
 * `dests` is the content of the dictionary of named destinations, e.g. `/name [0 /Fit]`.
 * `lang` is the language of the document, e.g. `sv`.
 * `outline` is the list of the top-level outline items.
 */
export function createPdf(
  pages: PdfPage[],
  { dests = '', lang = '', outline = [] }: { dests?: string; lang?: string; outline?: PdfOutlineItem[] } = {},
): string {
  // Object 1 is the catalog, 2 the page tree, 3 and 4 the fonts, then the page, its content and its annotations,
  // then the outline.
  const objects = [
    '',
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

  let outlines = '';
  if (outline.length) {
    const outlinesId = objects.length + 1;
    const itemIds = outline.map((_, index) => outlinesId + 1 + index);
    objects.push(
      `<< /Type /Outlines /First ${itemIds[0]} 0 R /Last ${itemIds[itemIds.length - 1]} 0 R /Count ${outline.length} >>`,
    );
    outline.forEach(({ title, action }, index) => {
      const prev = index > 0 ? ` /Prev ${itemIds[index - 1]} 0 R` : '';
      const next = index < outline.length - 1 ? ` /Next ${itemIds[index + 1]} 0 R` : '';
      objects.push(`<< /Title (${title}) /Parent ${outlinesId} 0 R${prev}${next} /A ${action} >>`);
    });
    outlines = ` /Outlines ${outlinesId} 0 R`;
  }
  objects[0] = `<< /Type /Catalog /Pages 2 0 R${dests ? ` /Dests << ${dests} >>` : ''}${lang ? ` /Lang (${lang})` : ''}${outlines} >>`;

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
