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
import type { PageViewport, PDFPageProxy } from 'pdfjs-dist';

export declare class PdfViewerTextLayer {
  readonly element: HTMLElement;

  endOfContent: HTMLElement | null;

  readonly rendered: boolean;

  readonly textDivs: HTMLElement[];

  render(pdfPage: PDFPageProxy, viewport: PageViewport, signal: AbortSignal): Promise<void>;

  getContentSpans(contentIds: Set<string>): Map<string, string[]>;

  bindLinks(links: HTMLElement[], linkTextIds?: Set<string>): void;

  update(viewport: PageViewport): void;

  cancel(): void;
}
