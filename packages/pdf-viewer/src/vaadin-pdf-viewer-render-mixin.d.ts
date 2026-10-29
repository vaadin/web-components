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
   * e.g. the text layer. Overrides await `super` first, so that the layers
   * render in the order of the mixins.
   */
  protected _renderPageLayers(page: PdfViewerPage): Promise<void>;

  /**
   * Loads the page of the document for a page view that has none yet, and
   * sizes the page view. Rejects when the page fails to load.
   */
  protected _loadPdfPage(page: PdfViewerPage): Promise<void>;

  /**
   * Renders the visible pages, the most visible first, then the pages next
   * to them, and frees the canvases of pages far from the view. Stops
   * rendering when no page is visible.
   */
  protected _renderVisible(visible: Array<{ index: number; height: number }>): void;

  /**
   * Cancels rendering the page being rendered, e.g. before the pages get another size.
   */
  protected _cancelRender(): void;
}
