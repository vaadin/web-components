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

export type PdfViewerRenderQueuePage = {
  pageNumber: number;
  canvasPixels: number;
  renderFailed: boolean;
  isRendered(pixelRatio: number): boolean;
  cancel(): void;
};

export type PdfViewerRenderQueueOptions<TPage extends PdfViewerRenderQueuePage> = {
  renderPage(page: TPage, pixelRatio: number): Promise<void>;
  releasePage(page: TPage): void;
  onIdle(): void;
  renderAhead: number;
  keepRendered: number;
  maxPagePixels: number;
  maxTotalPixels: number;
};

export declare class PdfViewerRenderQueue<TPage extends PdfViewerRenderQueuePage = PdfViewerRenderQueuePage> {
  constructor(options: PdfViewerRenderQueueOptions<TPage>);

  setPages(pages: TPage[]): void;

  setPixelRatio(pixelRatio: number): void;

  update(visible: Array<{ index: number; ratio: number }>): void;

  clear(): void;

  cancel(): void;

  renderNext(): void;
}
