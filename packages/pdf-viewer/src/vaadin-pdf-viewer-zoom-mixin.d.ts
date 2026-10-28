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

export type PdfViewerZoom = 'page-fit' | 'page-width' | number;

/**
 * A mixin that scales the pages to the `zoom` level.
 */
export declare function PdfViewerZoomMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<PdfViewerZoomMixinClass> & T;

export declare class PdfViewerZoomMixinClass {
  /**
   * The zoom level of the pages:
   * - `page-width` (default) fits the width of the current page to the viewer.
   * - `page-fit` fits the whole current page into the viewer.
   *
   * The fit follows the current page when the zoom is set, when the viewer
   * resizes and when the page gets its own size. Scrolling to a page of
   * another size keeps the scale.
   * - A number scales the pages relative to their actual size, e.g. `1` for 100%.
   *
   * An invalid value logs a warning and is replaced with `page-width`.
   */
  zoom: PdfViewerZoom;

  /**
   * The zoom level the pages are shown at, as a factor of their actual
   * size, or 0 while no pages are laid out.
   */
  protected readonly _zoomFactor: number;

  /**
   * Zooms in or out to the next zoom level.
   */
  protected _stepZoom(direction: -1 | 1): void;

  /**
   * Sets the zoom back to `page-width`.
   */
  protected _resetZoom(): void;
}
