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
 * A mixin that adds downloading the document.
 */
export declare function PdfViewerDownloadMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<PdfViewerDownloadMixinClass> & T;

export declare class PdfViewerDownloadMixinClass {
  /**
   * Downloads the document with its original bytes, under the file name described in `fileName`.
   *
   * A document that is loading is downloaded once it has loaded. Does
   * nothing without a document, or when the viewer is not attached.
   */
  download(): void;
}
