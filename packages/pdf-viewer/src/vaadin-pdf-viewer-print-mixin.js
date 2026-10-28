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
import '@vaadin/button/src/vaadin-button.js';
import '@vaadin/progress-bar/src/vaadin-progress-bar.js';
import { html, nothing } from 'lit';
import { getDeepActiveElement, isKeyboardActive } from '@vaadin/a11y-base/src/focus-utils.js';
import { issueWarning } from '@vaadin/component-base/src/warnings.js';
import { PdfViewerButtonController } from './pdf-viewer-button-controller.js';
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
 * A mixin that adds printing the document, with a button in the toolbar.
 * An application can replace the button with its own component in the
 * `print-button` slot.
 */
export const PdfViewerPrintMixin = (superClass) =>
  class PdfViewerPrintMixinClass extends superClass {
    static get properties() {
      return {
        /**
         * Whether the button that prints the document is hidden from the
         * toolbar. The `print()` method works also while it is hidden.
         *
         * @attr {boolean} print-button-hidden
         */
        printButtonHidden: {
          type: Boolean,
          value: false,
        },
      };
    }

    /**
     * The part of the pages that are prepared for printing, from 0 to 1, or
     * null when no print is prepared.
     * @type {number | null}
     */
    #progress = null;

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

    #buttonController = new PdfViewerButtonController(this, 'print-button', 'print', () => this.print());

    /** @protected */
    firstUpdated() {
      super.firstUpdated();

      // The controller observes the slot, which exists after the first render.
      this.addController(this.#buttonController);

      this.addEventListener('keydown', (event) => this.#onKeyDown(event));
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      this.#cancelPrint();
    }

    /** @protected */
    updated(props) {
      super.updated(props);

      this.#buttonController.updateButton(!this.pageCount || this.#progress !== null, this.__effectiveI18n.print);

      if (this.#progress !== null) {
        // Printing disables the default print button. Focus the cancel button instead.
        const button = this.#buttonController.node;
        if (button?.disabled && button.matches(':focus-within')) {
          this.querySelector(':scope > vaadin-button[slot="print-progress"]').focus({
            focusVisible: isKeyboardActive(),
          });
        }
      } else if (this.#restoreFocusPending) {
        this.#restoreFocusPending = false;
        this.#restoreFocus();
      }
    }

    /**
     * Prints the document with the print dialog of the browser. The viewer
     * prepares the pages for printing first, which can take a while for long
     * documents. Meanwhile, it shows the progress with a button that cancels
     * printing, and Escape cancels it too. Each page prints on paper of its
     * own size. While the document loads, it is printed once loaded. Does
     * nothing without a document, when the viewer is not attached, or while
     * a print is prepared already. The returned promise resolves when
     * printing ends or is cancelled.
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
     * Returns the template of the progress of printing, which shows the
     * progress bar and the cancel button of `_renderToolbarControls()` in its slot.
     * @protected
     */
    _renderPrintProgress() {
      return html`
        <div part="print-progress" ?hidden="${this.#progress === null}">
          <span>${this.__effectiveI18n.printing}</span>
          <slot name="print-progress"></slot>
        </div>
      `;
    }

    /**
     * Override method from `PdfViewerToolbarMixin` to add the slot of the
     * print button after the download button.
     * @protected
     * @override
     */
    _renderToolbarActionSlots() {
      return html`
        ${super._renderToolbarActionSlots()}
        <slot name="print-button" ?hidden="${this.printButtonHidden}"></slot>
      `;
    }

    /**
     * Override method from `PdfViewerToolbarMixin` to add the controls of
     * the print progress.
     * @protected
     * @override
     */
    _renderToolbarControls() {
      return html`${super._renderToolbarControls()}${this.#renderProgressControls()}`;
    }

    /**
     * Renders the progress bar and the cancel button while a print is prepared.
     * @private
     */
    #renderProgressControls() {
      if (this.#progress === null) {
        return nothing;
      }
      const i18n = this.__effectiveI18n;
      return html`
        <vaadin-progress-bar
          slot="print-progress"
          aria-label="${i18n.printing}"
          .value="${this.#progress}"
        ></vaadin-progress-bar>
        <vaadin-button slot="print-progress" theme="small" @click="${this.#onCancelClick}">
          ${i18n.cancelPrint}
        </vaadin-button>
      `;
    }

    /**
     * Prints the loaded document, and resolves when printing ends or is
     * cancelled. The pages print from the bytes that are loaded already.
     * @private
     */
    async #print(pdfDocument) {
      if (!this.isConnected || this.#progress !== null) {
        return;
      }

      // Remove the frame of a previous print, in browsers that don't fire `afterprint`.
      this.#printFrame?.remove();
      const printFrame = new PdfViewerPrintFrame();
      this.#printFrame = printFrame;
      this.#returnFocus = getFocusedElement();
      this.#setProgress(0);

      try {
        await printFrame.renderPages(pdfDocument, (progress) => this.#setProgress(progress));
        if (printFrame.removed) {
          return;
        }
        this.#stopProgress();
        printFrame.print();
        await this.updateComplete;
      } catch (error) {
        // Rendering fails when the print is cancelled meanwhile.
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
      if (this.#progress !== null) {
        this.#stopProgress();
      }
    }

    /** @private */
    #setProgress(progress) {
      this.#progress = progress;
      this.requestUpdate();
    }

    /**
     * Hides the progress, and returns focus after the next update.
     * @private
     */
    #stopProgress() {
      this.#setProgress(null);
      this.#restoreFocusPending = true;
    }

    /**
     * Returns focus to where it was before printing, when it was in the viewer
     * and has been lost meanwhile, e.g. because the cancel button was removed.
     * @private
     */
    #restoreFocus() {
      const returnFocus = this.#returnFocus;
      this.#returnFocus = null;
      const active = getFocusedElement();
      // Focus is lost when on nothing, on the print frame, or on an element that is gone or hidden.
      const isLost = !active || active.localName === 'iframe' || !active.isConnected || !active.checkVisibility();
      if (!isLost || !this.isConnected) {
        return;
      }

      // Firefox keeps the element that was focused before the print frame as the
      // focused element of this window, and does not focus it again until the
      // window itself has focus. Newer versions also keep focus in the print
      // frame until the frame is blurred.
      if (active?.localName === 'iframe') {
        active.blur();
      }
      window.focus();
      const options = { focusVisible: isKeyboardActive() };
      if (returnFocus && returnFocus.isConnected && !returnFocus.disabled && returnFocus.checkVisibility()) {
        returnFocus.focus(options);
      }
      if (getFocusedElement() !== returnFocus && this.pageCount) {
        this.$.content.focus(options);
      }
    }

    /**
     * Cancels printing with Escape, unless something else handled it
     * already. Prevents the default, so that a dialog that contains the
     * viewer stays open.
     * @private
     */
    #onKeyDown(event) {
      if (event.key === 'Escape' && this.#progress !== null && !event.defaultPrevented) {
        event.preventDefault();
        this.#cancelPrint();
      }
    }

    /** @private */
    #onCancelClick() {
      this.#cancelPrint();
    }
  };
