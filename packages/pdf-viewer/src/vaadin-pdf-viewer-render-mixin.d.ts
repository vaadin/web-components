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
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { PdfViewerPage } from './pdf-viewer-page.js';

/**
 * A mixin that creates the page views of the document, loads their sizes and
 * renders them to canvas.
 */
export declare function PdfViewerRenderMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<PdfViewerRenderMixinClass> & T;

export declare class PdfViewerRenderMixinClass {
  /**
   * Called at most once per frame when pages got their own size, which
   * differs from the estimate.
   */
  protected _pageSizesChanged(): void;

  /**
   * Renders the layers over the canvas of a page that has just rendered,
   * where overrides await `super` first to keep the mixin order.
   */
  protected _renderPageLayers(page: PdfViewerPage): Promise<void>;

  /**
   * Loads the PDF page of a page view that has none yet, and sizes the page view.
   * @return rejects when the page fails to load
   */
  protected _loadPdfPage(page: PdfViewerPage): Promise<void>;

  /**
   * Renders the visible pages and the pages next to them, or stops
   * rendering when no page is visible.
   * @param visible the indexes of the visible pages in document order, with
   *   the part of their height in view
   */
  protected _renderVisible(visible: Array<{ index: number; ratio: number }>): void;

  /**
   * Cancels rendering the page being rendered.
   */
  protected _cancelRender(): void;
}
