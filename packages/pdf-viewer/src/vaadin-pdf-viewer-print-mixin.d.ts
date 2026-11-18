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
 * A mixin that adds printing the document.
 */
export declare function PdfViewerPrintMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<PdfViewerPrintMixinClass> & T;

export declare class PdfViewerPrintMixinClass {
  /**
   * Prints the document with the print dialog of the browser, each page on paper of its own size.
   *
   * A document that is loading is printed once it has loaded. Does nothing
   * without a document, when the viewer is not attached, or while a print is
   * prepared. The returned promise resolves after the print dialog opens, or
   * when printing stops, and never rejects.
   */
  print(): Promise<void>;

  /**
   * Whether the pages are prepared for printing.
   */
  protected readonly _printing: boolean;
}
