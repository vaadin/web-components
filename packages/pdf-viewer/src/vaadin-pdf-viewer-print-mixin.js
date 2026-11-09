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
import { getDeepActiveElement, isKeyboardActive } from '@vaadin/a11y-base/src/focus-utils.js';
import { issueWarning } from '@vaadin/component-base/src/warnings.js';
import { PdfViewerPrintFrame } from './pdf-viewer-print-frame.js';

/**
 * Returns the focused element, also inside shadow roots, or null when
 * nothing is focused.
 * @return {HTMLElement | null}
 */
function getFocusedElement() {
  const active = getDeepActiveElement();
  return active !== document.body ? active : null;
}

/**
 * Returns whether the element is inside the host, also inside shadow roots.
 * @param {HTMLElement} host
 * @param {Node | null} element
 * @return {boolean}
 */
function isInside(host, element) {
  for (let node = element; node; node = node.parentNode || node.host) {
    if (node === host) {
      return true;
    }
  }
  return false;
}

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

    /**
     * The element that had focus when printing started.
     * @type {HTMLElement | null}
     */
    #returnFocus = null;

    /** Set when focus returns to where it was before printing, after the next update. */
    #restoreFocusPending = false;

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      this.#cancelPrint();
    }

    /** @protected */
    updated(props) {
      super.updated(props);

      if (this.#restoreFocusPending) {
        this.#restoreFocusPending = false;
        this.#restoreFocus();
      }
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
     * the page, it resolves once the dialog opens.
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
      this.#returnFocus = getFocusedElement();
      this._printing = true;

      try {
        await printFrame.renderPages(pdfDocument);
        if (printFrame.removed) {
          return;
        }
        this.#stopPrinting();
        printFrame.print();
        await this.updateComplete;
      } catch (error) {
        // Rendering fails when printing stops meanwhile.
        if (!printFrame.removed) {
          this.#cancelPrint();
          issueWarning(`Failed to print the PDF document: ${error.message}`);
        }
      }
    }

    /**
     * Stops preparing a print, and removes the frame of the current or last print.
     * @private
     */
    #cancelPrint() {
      this.#printFrame?.remove();
      this.#printFrame = null;
      if (this._printing) {
        this.#stopPrinting();
      }
    }

    /**
     * Hides the loader, and returns focus after the next update.
     * @private
     */
    #stopPrinting() {
      this._printing = false;
      this.#restoreFocusPending = true;
    }

    /**
     * Returns focus to where it was before printing, when it has been lost
     * meanwhile. Moves focus to the pages instead when it was in the viewer
     * and that element is gone.
     * @private
     */
    #restoreFocus() {
      const returnFocus = this.#returnFocus;
      this.#returnFocus = null;
      const active = getFocusedElement();
      // Focus is lost when on nothing, or on an element that is gone or hidden.
      const isLost = !active || !active.isConnected || !active.checkVisibility();
      if (!isLost || !this.isConnected) {
        return;
      }

      const options = { focusVisible: isKeyboardActive() };
      if (returnFocus && returnFocus.isConnected && !returnFocus.disabled && returnFocus.checkVisibility()) {
        returnFocus.focus(options);
      }
      if (getFocusedElement() !== returnFocus && isInside(this, returnFocus) && this.pageCount) {
        this.$.content.focus(options);
      }
    }
  };
