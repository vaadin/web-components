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
 * Adds downloading and printing the document to the PDF viewer, with buttons
 * in the toolbar.
 */
export declare function PdfViewerPrintMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<PdfViewerPrintMixinClass> & T;

export declare class PdfViewerPrintMixinClass {
  /**
   * Whether the button that downloads the document is hidden from the
   * toolbar. The `download()` method works also while it is hidden.
   *
   * @attr {boolean} download-button-hidden
   */
  downloadButtonHidden: boolean;

  /**
   * Whether the button that prints the document is hidden from the
   * toolbar. The `print()` method works also while it is hidden.
   *
   * @attr {boolean} print-button-hidden
   */
  printButtonHidden: boolean;

  /**
   * Downloads the document. The file has the original bytes of the
   * document, so the viewer does not request it again, and signatures stay
   * intact. The file name is `fileName`, else the last part of the path of
   * `src`, else the title of the document, with `.pdf` added when missing.
   * While the document loads, it is downloaded once loaded. Does nothing
   * without a document, or when the viewer is not attached.
   */
  download(): void;

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
   * controls of `_renderPrintControls()` in its slot.
   */
  protected _renderPrintProgress(): TemplateResult;

  /**
   * Returns the template of the download and print buttons and of the
   * controls of the print progress, which are rendered into the light DOM.
   */
  protected _renderPrintControls(): TemplateResult;
}
