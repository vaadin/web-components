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
import { issueWarning } from '@vaadin/component-base/src/warnings.js';
import { PdfViewerPrintFrame } from './pdf-viewer-print-frame.js';

/**
 * A mixin that adds printing the document. The toolbar has a button that
 * calls `print()`.
 */
export const PdfViewerPrintMixin = (superClass) =>
  class PdfViewerPrintMixinClass extends superClass {
    static get properties() {
      return {
        /**
         * Whether the pages are prepared for printing.
         * @protected
         */
        _printing: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
          attribute: 'printing',
        },
      };
    }

    /**
     * The frame of the current or last print.
     * @type {PdfViewerPrintFrame | null}
     */
    #printFrame = null;

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      this.#cancelPrint();
    }

    /**
     * Prints the document with the print dialog of the browser. The viewer
     * prepares the pages for printing first, which can take a while for long
     * documents, and shows its loader meanwhile. Each page prints on paper of
     * its own size. While the document loads, it is printed once loaded. Does
     * nothing without a document, when the viewer is not attached, or while a
     * print is prepared already. The returned promise resolves when the print
     * dialog closes, or when printing stops because the viewer is detached or
     * another document loads. In browsers whose print dialog does not block
     * the page, it resolves once the dialog opens. The promise never rejects.
     * A failed print logs a warning.
     *
     * @return {Promise<void>}
     */
    print() {
      return this._whenDocumentReady().then((pdfDocument) => (pdfDocument ? this.#print(pdfDocument) : undefined));
    }

    /**
     * Override method from `PdfViewerDocumentMixin` to stop printing the
     * previous document.
     * @protected
     * @override
     */
    _documentUnloaded() {
      super._documentUnloaded();
      this.#cancelPrint();
    }

    /**
     * Prints the loaded document, and resolves when printing ends or is
     * cancelled. The pages print from the bytes that are loaded already.
     * @private
     */
    async #print(pdfDocument) {
      if (!this.isConnected || this._printing) {
        return;
      }

      // Remove the frame of a previous print, in browsers that don't fire `afterprint`.
      this.#printFrame?.remove();
      const printFrame = new PdfViewerPrintFrame();
      this.#printFrame = printFrame;
      this._printing = true;

      try {
        await printFrame.renderPages(pdfDocument);
        if (printFrame.removed) {
          return;
        }
        this._printing = false;
        printFrame.print();
      } catch (error) {
        // Rendering fails when printing stops meanwhile.
        if (printFrame.removed) {
          return;
        }
        this.#cancelPrint();
        issueWarning(`Failed to print the PDF document: ${error.message}`);
      }
      // Resolve once the `printing` state is removed.
      await this.updateComplete;
    }

    /**
     * Stops preparing a print, and removes the frame of the current or last print.
     * @private
     */
    #cancelPrint() {
      this.#printFrame?.remove();
      this.#printFrame = null;
      this._printing = false;
    }
  };
