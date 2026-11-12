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
   * the number of matches.
   *
   * The search waits while the document loads. It fires no `find-result`
   * without a document, when the viewer is not attached, when another
   * `find()` call follows, or when `src` changes during the search.
   */
  find(text: string): void;
}
