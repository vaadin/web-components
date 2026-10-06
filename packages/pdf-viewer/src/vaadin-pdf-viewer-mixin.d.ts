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

export declare function PdfViewerMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<PdfViewerMixinClass> & T;

export declare class PdfViewerMixinClass {
  /**
   * The URL of the PDF document to show.
   */
  src: string | null | undefined;

  /**
   * The number of pages in the loaded document, or 0 when no document
   * is loaded.
   */
  readonly pageCount: number;
}
