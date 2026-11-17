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
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';
import type { PdfViewerLinkAnnotation } from './pdf-viewer-links.js';

export declare class PdfViewerLinkLayer {
  readonly element: HTMLElement;

  links: HTMLAnchorElement[];

  render(
    pdfPage: PDFPageProxy,
    followLink: (annotation: PdfViewerLinkAnnotation) => void,
    optionalContentConfig?: Awaited<ReturnType<PDFDocumentProxy['getOptionalContentConfig']>>,
  ): Promise<Array<{ link: HTMLAnchorElement; annotation: PdfViewerLinkAnnotation }>>;
}
