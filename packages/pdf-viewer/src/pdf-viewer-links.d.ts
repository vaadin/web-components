/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import type { PDFDocumentProxy } from 'pdfjs-dist';

/**
 * The destination of an internal link or an outline item.
 */
export interface PdfViewerDestination {
  dest?: string | unknown[];
  action?: string;
}

/**
 * A link annotation of a page, as pdf.js returns it.
 */
export interface PdfViewerLinkAnnotation extends PdfViewerDestination {
  rect: number[];
  url?: string;
}

/**
 * A part of the text of a text layer element, see `getTextInside()`.
 */
export interface PdfViewerTextPart {
  element: HTMLElement;
  start: number;
  end: number;
}

/**
 * Creates the link element for a link annotation, or returns null for
 * links that the viewer does not support or does not consider safe.
 * External links open in a new tab without access to the page.
 */
export declare function createLink(
  annotation: PdfViewerDestination & { url?: string },
  followLink: (annotation: object) => void,
): HTMLAnchorElement | null;

/**
 * Returns the text of a text layer that is inside the given element, e.g.
 * the text of a link, as the text layer elements with the offsets of their
 * words whose center is inside the element. Whole words are used, as the
 * text layer only places each element exactly, not each of its characters.
 */
export declare function getTextInside(textDivs: HTMLElement[], element: Element): PdfViewerTextPart[];

/**
 * Returns the page and the position on the page that an internal link or
 * an outline item points to, or null when it cannot be resolved. The
 * position is in PDF units from the bottom of the page.
 */
export declare function resolveDestination(
  pdfDocument: PDFDocumentProxy,
  destination: PdfViewerDestination,
  position: { page: number; pageCount: number },
): Promise<{ page: number; top?: number } | null>;

/**
 * Returns the accessible name of a link: its text, or the URL or the page it
 * goes to when it has none. Links to the next or previous page are named so,
 * as that page depends on the current page. Names of external links tell that
 * they open in a new tab.
 */
export declare function getLinkLabel(
  link: { text: string; url?: string; action?: string; targetPage: number | null },
  i18n: { link: string; goToPage: string; externalLink: string; nextPage: string; previousPage: string },
): string;
