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
 * A mixin that adds printing the document, with a button in the toolbar.
 * An application can replace the button with its own component in the
 * `print-button` slot.
 */
export declare function PdfViewerPrintMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<PdfViewerPrintMixinClass> & T;

export declare class PdfViewerPrintMixinClass {
  /**
   * Whether the button that prints the document is hidden from the
   * toolbar. The `print()` method works also while it is hidden.
   *
   * @attr {boolean} print-button-hidden
   */
  printButtonHidden: boolean;

  /**
   * Prints the document with the print dialog of the browser. The viewer
   * prepares the pages for printing first, which can take a while for long
   * documents. Meanwhile, it shows the progress with a button that cancels
   * printing, and Escape cancels it too. Each page prints on paper of its
   * own size. While the document loads, it is printed once loaded. Does
   * nothing without a document, when the viewer is not attached, or while
   * a print is prepared already. The returned promise resolves when
   * printing ends or is cancelled.
   */
  print(): Promise<void>;

  /**
   * Returns the template of the progress of printing, which shows the
   * progress bar and the cancel button of `_renderToolbarControls()` in its slot.
   */
  protected _renderPrintProgress(): TemplateResult;
}
