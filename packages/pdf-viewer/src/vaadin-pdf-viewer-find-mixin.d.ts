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
 * A mixin that finds text in the document.
 */
export declare function PdfViewerFindMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<PdfViewerFindMixinClass> & T;

export declare class PdfViewerFindMixinClass {
  /**
   * Searches the document for the given text and fires `find-result` with
   * the number of matches. While the document loads, it runs once loaded.
   * Does nothing without a document, or when the viewer is not attached.
   * Of several `find()` calls in a row, only the last one runs. A new `src`
   * stops a running search, which then fires no `find-result`.
   */
  find(text: string): void;
}
