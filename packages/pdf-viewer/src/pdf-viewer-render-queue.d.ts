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

/**
 * A page that the queue can render. `PdfViewerPage` implements it.
 */
export type PdfViewerRenderQueuePage = {
  /** The number of the page, starting from 1. */
  pageNumber: number;
  /** The number of canvas pixels the page uses. */
  canvasPixels: number;
  /** Whether the last render failed. */
  renderFailed: boolean;
  /** Whether the page is rendered at its current scale and the given device pixel ratio. */
  isRendered(pixelRatio: number): boolean;
  /** Cancels a pending render. */
  cancel(): void;
};

export type PdfViewerRenderQueueOptions<TPage extends PdfViewerRenderQueuePage> = {
  /** Renders a page at the given device pixel ratio. The returned promise never rejects. */
  renderPage(page: TPage, pixelRatio: number): Promise<void>;
  /** Frees the canvas of a page. */
  releasePage(page: TPage): void;
  /** Called when no page is left to render. */
  onIdle(): void;
  /** The number of pages before and after the visible ones that are rendered in advance. */
  renderAhead: number;
  /** The number of pages before and after the visible ones that keep their canvas. */
  keepRendered: number;
  /** The maximum number of canvas pixels of one page. */
  maxPagePixels: number;
  /**
   * The number of canvas pixels that all pages may use together before pages
   * outside the view are released, or not rendered ahead.
   */
  maxTotalPixels: number;
};

/**
 * Decides which pages of the document to render and in which order, renders
 * them one at a time, and frees the canvases of pages far from the view.
 */
export declare class PdfViewerRenderQueue<TPage extends PdfViewerRenderQueuePage = PdfViewerRenderQueuePage> {
  constructor(options: PdfViewerRenderQueueOptions<TPage>);

  /**
   * Sets the pages of the document, e.g. when another document loads, and
   * forgets the page being rendered.
   */
  setPages(pages: TPage[]): void;

  /**
   * Sets the device pixel ratio to render at. Pages rendered at another
   * ratio render again when they are next in the queue.
   */
  setPixelRatio(pixelRatio: number): void;

  /**
   * Renders the visible pages, the most visible first, then the pages next to
   * them, and frees the canvases of pages that are far from the view.
   */
  update(visible: Array<{ index: number; height: number }>): void;

  /**
   * Stops rendering pages, e.g. when no page is visible. The page being rendered finishes.
   */
  clear(): void;

  /**
   * Cancels rendering the page being rendered, e.g. when its size changes.
   */
  cancel(): void;

  /**
   * Renders the next page in the queue that is not rendered yet, one page at a time.
   */
  renderNext(): void;
}
