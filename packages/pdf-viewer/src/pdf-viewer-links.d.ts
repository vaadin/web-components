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
import type * as pdfjs from 'pdfjs-dist';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import type { PdfViewerPage } from './pdf-viewer-page.js';

/**
 * The destination of an internal link or an outline item.
 */
export interface PdfViewerDestination {
  dest?: string | unknown[];
  action?: string;
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
 * Adds the links of a page to a layer over the page, positioned relative
 * to the page size so that they need no update when the scale changes.
 * Like the text layer, the layer has the size of the page without its
 * rotation, and is rotated with the page, so that links keep their place
 * when they are moved into the text layer. Returns the links with their
 * annotations.
 */
export declare function renderLinks<T extends { rect: number[] }>(
  pdfjsModule: typeof pdfjs,
  page: PdfViewerPage,
  annotations: T[],
  create: (annotation: T) => HTMLAnchorElement | null,
): Array<{ link: HTMLAnchorElement; annotation: T }>;

/**
 * Returns the text of a text layer that is inside the given element, e.g.
 * the text of a link, as the text layer elements with the offsets of their
 * words whose center is inside the element. Whole words are used, as the
 * text layer only places each element exactly, not each of its characters.
 */
export declare function getTextInside(textDivs: HTMLElement[], element: Element): PdfViewerTextPart[];

/**
 * Moves links into the text layer, next to the text they cover, so that
 * assistive technology reads each link once, in reading order. The text
 * layer elements with links stay for selecting and finding text, but are
 * hidden from assistive technology. Their text outside the links is added
 * next to the links, for assistive technology only. A link that covers the
 * text of several elements is placed with the first one. Links over text
 * that is hidden from assistive technology, e.g. page headers marked as
 * artifacts, stay in the link layer, as links must not be hidden.
 */
export declare function placeLinks(
  textDivs: HTMLElement[],
  links: Array<{ link: HTMLElement; parts: PdfViewerTextPart[] }>,
): void;

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
 * goes to when it has none. Names of external links tell that they open in a
 * new tab.
 */
export declare function getLinkLabel(
  link: { text: string; url?: string; targetPage: number | null },
  i18n: { link: string; goToPage: string; externalLink: string },
): string;
