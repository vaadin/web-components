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

export interface PdfViewerDestination {
  dest?: string | unknown[];
  action?: string;
}

export interface PdfViewerLinkAnnotation extends PdfViewerDestination {
  rect: number[];
  url?: string;
  overlaidText?: string;
  oc?: object;
  quadPoints?: ArrayLike<number> | null;
}

export declare function createLink(
  annotation: PdfViewerLinkAnnotation,
  followLink: (annotation: PdfViewerLinkAnnotation) => void,
): HTMLAnchorElement | null;

export declare function resolveDestination(
  pdfDocument: PDFDocumentProxy,
  destination: PdfViewerDestination,
  position: { page: number; pageCount: number },
): Promise<{ page: number; left?: number; top?: number; right?: number; bottom?: number } | null>;

export declare function getLinkLabel(
  link: { text: string; url?: string; action?: string; targetPage: number | null },
  i18n: { link: string; goToPage: string; externalLink: string; nextPage: string; previousPage: string },
): string;
