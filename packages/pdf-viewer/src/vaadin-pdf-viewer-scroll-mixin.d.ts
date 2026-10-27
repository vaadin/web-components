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
import type { ResizeMixinClass } from '@vaadin/component-base/src/resize-mixin.js';

/**
 * A mixin that lays out the pages, keeps `page` in sync with scrolling and
 * asks for the visible pages to render.
 */
export declare function PdfViewerScrollMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<PdfViewerScrollMixinClass> & Constructor<ResizeMixinClass> & T;

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
   * Scrolls to the start of the given page and makes it the current page,
   * also when it is the current page already.
   */
  protected _scrollToPage(page: number): void;
}
