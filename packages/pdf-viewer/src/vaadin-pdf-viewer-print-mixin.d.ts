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
import type { TemplateResult } from 'lit';

/**
 * A mixin that adds printing the document, with its progress over the pages.
 * The toolbar has a button that calls `print()`.
 */
export declare function PdfViewerPrintMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<PdfViewerPrintMixinClass> & T;

export declare class PdfViewerPrintMixinClass {
  /**
   * Prints the document with the print dialog of the browser. The viewer
   * prepares the pages for printing first, which can take a while for long
   * documents. Meanwhile, it shows the progress with a button that cancels
   * printing, and Escape in the viewer cancels it too. Each page prints on
   * paper of its own size. While the document loads, it is printed once
   * loaded. Does nothing without a document, when the viewer is not
   * attached, or while a print is prepared already. The returned promise
   * resolves when the print dialog closes or printing is cancelled. In
   * browsers whose print dialog does not block the page, it resolves once
   * the dialog opens.
   */
  print(): Promise<void>;

  /**
   * Whether the pages are prepared for printing.
   */
  protected readonly _printing: boolean;

  /**
   * Returns the template of the progress of printing, with the progress bar
   * and the cancel button in the `print-progress` slot.
   */
  protected _renderPrintProgress(): TemplateResult;
}
