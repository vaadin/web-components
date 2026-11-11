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
 * A mixin that adds downloading the document. The toolbar has a button that
 * calls `download()`.
 */
export declare function PdfViewerDownloadMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<PdfViewerDownloadMixinClass> & T;

export declare class PdfViewerDownloadMixinClass {
  /**
   * Downloads the document with its original bytes, without requesting it
   * again, under the name described in `fileName`. While the document
   * loads, it is downloaded once loaded, also when `src` changes meanwhile.
   * Does nothing without a document, or when the viewer is not attached.
   */
  download(): void;
}
