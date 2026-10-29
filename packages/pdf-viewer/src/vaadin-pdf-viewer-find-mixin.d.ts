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
 * A mixin that finds text in the document and highlights the matches on
 * the rendered pages.
 */
export declare function PdfViewerFindMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<PdfViewerFindMixinClass> & T;

export declare class PdfViewerFindMixinClass {
  /**
   * Searches the document for the given text and scrolls to the first
   * match. The matches are highlighted on the pages. Fires `find-result`
   * with the number of matches. While the document loads, it runs once
   * loaded. Does nothing without a document, or when the viewer is not
   * attached. Of several `find()` and `highlight()` calls in a row, only
   * the last one runs.
   */
  find(text: string): void;

  /**
   * Highlights the given text on the given page and scrolls to it, for
   * a passage that the application has located. The next `highlight()` or
   * `find()` clears it. While the document loads, it runs once loaded.
   * Does nothing without a document, or when the viewer is not attached.
   * Of several `find()` and `highlight()` calls in a row, only the last
   * one runs.
   *
   * @param page the page number, starting from 1
   */
  highlight(page: number, text: string): void;
}
