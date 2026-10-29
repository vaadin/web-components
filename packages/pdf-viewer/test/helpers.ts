import { nextFrame, oneEvent } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import type { PDFDocumentProxy } from 'pdfjs-dist';
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
 * Sets the `src` of the viewer and waits until the document has loaded and
 * the viewer has rendered the pages it shows.
 */
export async function loadAndRender(viewer: PdfViewer, src: string): Promise<void> {
  const idle = nextRenderIdle(viewer);
  const loaded = oneEvent(viewer, 'document-load');
  viewer.src = src;
  await loaded;
  await idle;
}

/**
 * Sets the `src` of the viewer to a URL that serves `multi-page.pdf` with
 * extra response headers, and waits until the document has loaded. Stubs
 * `fetch` until then.
 */
export async function loadFixtureFrom(
  viewer: PdfViewer,
  url: string,
  headers: Record<string, string> = {},
): Promise<void> {
  const fetch = window.fetch;
  const stub = sinon.stub(window, 'fetch').callsFake(async (input, init) => {
    if (String(input) !== url) {
      return fetch(input, init);
    }
    const response = await fetch(fixtureUrl('multi-page.pdf'), init);
    const responseHeaders = new Headers(response.headers);
    Object.entries(headers).forEach(([name, value]) => responseHeaders.set(name, value));
    return new Response(response.body, { status: response.status, headers: responseHeaders });
  });
  try {
    const loaded = oneEvent(viewer, 'document-load');
    viewer.src = url;
    await loaded;
  } finally {
    stub.restore();
  }
}

/**
 * Returns the size of the content area of the viewer without its padding.
 */
export function getContentBoxSize(content: HTMLElement): { width: number; height: number } {
  const style = getComputedStyle(content);
  return {
    width: content.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight),
    height: content.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom),
  };
}

/**
 * Returns the horizontal middle of the visible content area in viewport
 * coordinates. It leaves out a vertical scrollbar, which is on the left in
 * RTL, where `clientLeft` includes it.
 */
export function getViewCenter(content: HTMLElement): number {
  return content.getBoundingClientRect().left + content.clientLeft + content.clientWidth / 2;
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
 * A page of a PDF created with `createPdf()`.
 */
export type PdfPage = {
  /** The content stream of the page. Font `/F1` is Helvetica. */
  content: string;
  /** The size of the page in PDF units, A4 by default. */
  mediaBox?: [number, number, number, number];
};

/**
 * Creates a PDF with the given pages in memory, and returns an object URL for it.
 */
export function createPdf(pages: PdfPage[]): string {
  // Object 1 is the catalog, 2 the page tree, 3 the font, then each page and its content.
  const objects = ['<< /Type /Catalog /Pages 2 0 R >>', '', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'];
  const pageIds: number[] = [];
  pages.forEach(({ content, mediaBox = [0, 0, 595, 842] }) => {
    const id = objects.length + 1;
    pageIds.push(id);
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [${mediaBox.join(' ')}] /Resources << /Font << /F1 3 0 R >> >> /Contents ${id + 1} 0 R >>`,
      `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
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

/**
 * Returns the prototype of every pdf.js document, including the documents of
 * the viewer, through a document loaded for that.
 */
export async function getPdfDocumentPrototype(): Promise<PDFDocumentProxy> {
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
