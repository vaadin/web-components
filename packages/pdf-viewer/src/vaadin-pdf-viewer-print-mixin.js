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
import '@vaadin/tooltip/src/vaadin-tooltip.js';
import { html, nothing } from 'lit';
import { announce } from '@vaadin/a11y-base/src/announce.js';
import { getDeepActiveElement, isKeyboardActive } from '@vaadin/a11y-base/src/focus-utils.js';
import { issueWarning } from '@vaadin/component-base/src/warnings.js';
import { downloadDocument } from './pdf-viewer-download.js';
import { PdfViewerPrintFrame } from './pdf-viewer-print-frame.js';
import { renderButtonTooltip } from './vaadin-pdf-viewer-button.js';

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
 * Adds downloading and printing the document to the PDF viewer, with buttons
 * in the toolbar.
 *
 * @polymerMixin
 */
export const PdfViewerPrintMixin = (superClass) =>
  class PdfViewerPrintMixinClass extends superClass {
    static get properties() {
      return {
        /**
         * Whether the button that downloads the document is hidden from the
         * toolbar. The `download()` method works also while it is hidden.
         *
         * @attr {boolean} download-button-hidden
         */
        downloadButtonHidden: {
          type: Boolean,
          value: false,
        },

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

    /** Set when `download()` waits for the document to load. */
    #downloadPending = false;

    /** The `src` of the last update. A different `src` starts loading in the next update. */
    #updatedSrc;

    /**
     * Aborted when the viewer is detached, to stop the downloads in progress
     * and release their data.
     * @type {AbortController | null}
     */
    #downloadsController = null;

    /**
     * The promise of a `print()` call that waits for the document to load,
     * and the function that resolves it.
     * @type {{ promise: Promise<void>, resolve: (value: Promise<void>) => void } | null}
     */
    #pendingPrint = null;

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

    /**
     * Override method from `LitElement` to cancel printing with Escape.
     * @protected
     * @override
     */
    firstUpdated() {
      super.firstUpdated();

      this.addEventListener('keydown', (event) => this.#onKeyDown(event));
    }

    /**
     * Override method from `HTMLElement` to stop the downloads in progress
     * and to cancel printing.
     * @protected
     * @override
     */
    disconnectedCallback() {
      super.disconnectedCallback();

      this.#downloadsController?.abort();
      this.#downloadsController = null;
      this.#cancelPrint();
    }

    /**
     * Override method from `LitElement` to download or print the document
     * once it has loaded, when `download()` or `print()` was called while it
     * loaded, and to keep focus while printing.
     * @protected
     * @override
     */
    updated(props) {
      super.updated(props);

      if (props.has('src')) {
        this.#updatedSrc = this.src;
      }

      if (this.#downloadPending && !this._loading) {
        this.#downloadPending = false;
        this.#download();
      }

      if (this.#pendingPrint && !this._loading) {
        const { resolve } = this.#pendingPrint;
        this.#pendingPrint = null;
        resolve(this.#print());
      }

      if (this.#progress !== null) {
        // Printing disables the print button. Focus the cancel button instead.
        if (this.querySelector(':scope > [slot="print-button"][disabled]:focus')) {
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
     * Downloads the document. The file has the original bytes of the
     * document, so the viewer does not request it again, and signatures stay
     * intact. The file name is `fileName`, else the last part of the path of
     * `src`, else the title of the document, with `.pdf` added when missing.
     * While the document loads, it is downloaded once loaded. Does nothing
     * without a document, or when the viewer is not attached.
     */
    download() {
      if (!this.isConnected) {
        return;
      }

      if (this._loading || this.src !== this.#updatedSrc) {
        this.#downloadPending = true;
      } else {
        this.#download();
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
      if (!this.isConnected) {
        return Promise.resolve();
      }

      if (!this._loading && this.src === this.#updatedSrc) {
        return this.#print();
      }
      if (!this.#pendingPrint) {
        let resolve;
        const promise = new Promise((resolvePromise) => {
          resolve = resolvePromise;
        });
        this.#pendingPrint = { promise, resolve };
      }
      return this.#pendingPrint.promise;
    }

    /**
     * Override method from `PdfViewerMixin` to stop printing the previous document.
     * @protected
     * @override
     */
    _documentUnloaded() {
      super._documentUnloaded();
      this.#cancelPrint();
    }

    /**
     * Returns the template of the progress of printing, which shows the
     * controls of `_renderPrintControls()` in its slot.
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
     * Returns the template of the download and print buttons and of the
     * controls of the print progress, which are rendered into the light DOM.
     * @protected
     */
    _renderPrintControls() {
      const i18n = this.__effectiveI18n;
      return html`${this.#renderDownloadButton(i18n)}${this.#renderPrintButton(i18n)}${this.#renderProgressControls(i18n)}`;
    }

    /**
     * Renders the download button, unless it is hidden.
     * @private
     */
    #renderDownloadButton(i18n) {
      if (this.downloadButtonHidden) {
        return nothing;
      }
      return html`
        <vaadin-pdf-viewer-button
          slot="download-button"
          icon="download"
          theme="tertiary icon"
          aria-label="${i18n.download}"
          .disabled="${!this.pageCount}"
          @click="${this.#onDownloadClick}"
        >
          ${renderButtonTooltip(i18n.download)}
        </vaadin-pdf-viewer-button>
      `;
    }

    /**
     * Renders the print button, unless it is hidden.
     * @private
     */
    #renderPrintButton(i18n) {
      if (this.printButtonHidden) {
        return nothing;
      }
      return html`
        <vaadin-pdf-viewer-button
          slot="print-button"
          icon="print"
          theme="tertiary icon"
          aria-label="${i18n.print}"
          .disabled="${!this.pageCount || this.#progress !== null}"
          @click="${this.#onPrintClick}"
        >
          ${renderButtonTooltip(i18n.print)}
        </vaadin-pdf-viewer-button>
      `;
    }

    /**
     * Renders the progress bar and the cancel button while a print is prepared.
     * @private
     */
    #renderProgressControls(i18n) {
      if (this.#progress === null) {
        return nothing;
      }
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
     * Downloads the loaded document under the file name it has now, also
     * when another document loads or `fileName` changes while its bytes
     * are read.
     * @private
     */
    #download() {
      const pdfDocument = this._pdfDocument;
      if (!pdfDocument || !this.isConnected) {
        return;
      }

      this.#downloadsController ??= new AbortController();
      downloadDocument(pdfDocument, this._getFileName(), this.#downloadsController.signal).catch((error) => {
        // Reading the bytes fails when the document is unloaded meanwhile.
        if (this._pdfDocument === pdfDocument) {
          issueWarning(`Failed to download the PDF document: ${error.message}`);
        }
      });
    }

    /**
     * Prints the loaded document, and resolves when printing ends or is
     * cancelled. The pages print from the bytes that are loaded already.
     * @private
     */
    async #print() {
      const pdfDocument = this._pdfDocument;
      if (!pdfDocument || !this.isConnected || this.#progress !== null) {
        return;
      }

      // Remove the frame of a previous print, in browsers that don't fire `afterprint`.
      this.#printFrame?.remove();
      const printFrame = new PdfViewerPrintFrame();
      this.#printFrame = printFrame;
      this.#returnFocus = getFocusedElement();
      this.#setProgress(0);
      announce(this.__effectiveI18n.printing);

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
          announce(this.__effectiveI18n.printError, { mode: 'alert' });
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
      if (active && active.localName === 'iframe') {
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
    #onDownloadClick() {
      this.download();
    }

    /** @private */
    #onPrintClick() {
      this.print();
    }

    /** @private */
    #onCancelClick() {
      this.#cancelPrint();
    }
  };
