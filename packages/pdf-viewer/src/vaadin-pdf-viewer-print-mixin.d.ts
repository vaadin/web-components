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

export declare function PdfViewerPrintMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<PdfViewerPrintMixinClass> & T;

export declare class PdfViewerPrintMixinClass {
  /**
   * The file name used when the user downloads the document. Defaults to
   * the last part of the path of `src`, or the title of the document, with
   * `.pdf` added when missing.
   *
   * @attr {string} file-name
   */
  fileName: string | null | undefined;

  /**
   * Whether the name of the document is shown above the toolbar: the
   * `fileName`, else the last part of the path of `src`, else the title
   * of the document.
   *
   * @attr {boolean} file-name-visible
   */
  fileNameVisible: boolean;

  /**
   * Prints the document. The pages are rendered for printing first, which
   * can take a while for long documents, so the viewer shows the progress
   * and lets the user cancel. Does nothing when no document is loaded, the
   * viewer is not attached, or a print is being prepared already.
   */
  print(): Promise<void>;
}
