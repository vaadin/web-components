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

/**
 * A mixin that lays out the pages, keeps `page` in sync with scrolling and
 * asks for the visible pages to render.
 */
export declare function PdfViewerScrollMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<PdfViewerScrollMixinClass> & T;

export declare class PdfViewerScrollMixinClass {
  /**
   * The current page, starting from 1. The viewer updates it while the
   * user scrolls, to the page that takes up most of the visible area.
   * Setting it to another page scrolls to the start of that page.
   * Setting it to the current page does not scroll. A value that is not
   * a page of the document logs a warning and does not scroll. A set
   * value stays as it is until the user scrolls. A new `src` resets it
   * to 1, unless `page` is set in the same update.
   */
  page: number;

  /**
   * The scale of the pages in CSS pixels per PDF unit, or 0 before the
   * pages are laid out.
   */
  protected _scale: number;

  /**
   * Scrolls to the start of the given page, or to an offset on it in CSS
   * pixels from the top left corner of the page, and makes it the current
   * page, also when it is the current page already. While the pages have no
   * layout, e.g. in a hidden viewer, only the page is kept, and the offset
   * is dropped.
   */
  protected _scrollToPage(page: number, offset?: { left: number; top: number }): void;

  /**
   * Returns the scale of the pages in CSS pixels per PDF unit for the given
   * available size: the scale that fits the width of the current page.
   */
  protected _getScaleForSize(
    width: number,
    height: number,
    page: { unscaledWidth: number; unscaledHeight: number },
  ): number;

  /**
   * Lays out the pages again, e.g. after a change of the size or of the
   * scale, and scrolls to a page that was set while the pages could not be
   * laid out.
   */
  protected _refreshLayout(): void;
}
