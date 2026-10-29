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
  /** The text that the link covers. */
  overlaidText?: string;
}

/**
 * Creates the link element for a link annotation, or returns null for
 * links that the viewer does not support or does not consider safe.
 * External links open in a new tab without access to the page.
 */
export declare function createLink(
  annotation: PdfViewerLinkAnnotation,
  followLink: (annotation: PdfViewerLinkAnnotation) => void,
): HTMLAnchorElement | null;

/**
 * Returns the page and the position on the page that an internal link or
 * an outline item points to, or null when it cannot be resolved. The
 * position is in PDF units from the bottom left corner of the unrotated page.
 */
export declare function resolveDestination(
  pdfDocument: PDFDocumentProxy,
  destination: PdfViewerDestination,
  position: { page: number; pageCount: number },
): Promise<{ page: number; left?: number; top?: number } | null>;

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
