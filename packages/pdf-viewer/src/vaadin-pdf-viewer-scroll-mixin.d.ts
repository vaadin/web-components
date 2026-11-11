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
   * user scrolls, to the page with the largest part of it in view, or,
   * for a page taller than the view, the largest part of the view.
   * A page scrolled to stays current until the user scrolls. A new
   * `src` resets it to 1. Use `scrollToPage()` to go to another page.
   */
  readonly page: number;

  /**
   * The scale of the pages in CSS pixels per PDF unit, or 0 before the
   * pages are laid out.
   */
  protected _scale: number;

  /**
   * Scrolls to the start of the given page and makes it the current page,
   * also when it is the current page already. A value that is not a page
   * of the document logs a warning and does not scroll.
   *
   * Right after setting `src`, it scrolls once the document has loaded, and
   * in a hidden viewer, once the viewer is shown. Does nothing without a
   * document or when the viewer is not attached.
   */
  scrollToPage(page: number): void;

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
