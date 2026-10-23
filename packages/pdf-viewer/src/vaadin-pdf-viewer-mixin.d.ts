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

export type PdfViewerZoom = 'page-fit' | 'page-width' | number;

export declare function PdfViewerMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<PdfViewerMixinClass> & Constructor<ResizeMixinClass> & T;

export declare class PdfViewerMixinClass {
  /**
   * The URL of the PDF document to show.
   */
  src: string | null | undefined;

  /**
   * The current page, starting from 1. The viewer updates it while the
   * user scrolls, to the page that takes up most of the visible area.
   * Setting it scrolls to the start of that page.
   */
  page: number;

  /**
   * The zoom level of the pages:
   * - `page-width` (default) fits the width of the first page to the viewer.
   * - `page-fit` fits the whole first page into the viewer.
   * - A number scales the pages relative to their actual size, e.g. `1` for 100%.
   */
  zoom: PdfViewerZoom;

  /**
   * The number of pages in the loaded document, or 0 when no document
   * is loaded.
   */
  readonly pageCount: number;
}
