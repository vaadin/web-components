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
import '@vaadin/tooltip/src/vaadin-tooltip.js';
import './vaadin-pdf-viewer-button.js';
import { html, nothing } from 'lit';
import { issueWarning } from '@vaadin/component-base/src/warnings.js';
import { downloadDocument } from './pdf-viewer-download.js';

/**
 * Adds downloading the document to the PDF viewer, with a button in the
 * toolbar.
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
     * Override method from `HTMLElement` to stop the downloads in progress.
     * @protected
     * @override
     */
    disconnectedCallback() {
      super.disconnectedCallback();

      this.#downloadsController?.abort();
      this.#downloadsController = null;
    }

    /**
     * Override method from `LitElement` to download the document once it has
     * loaded, when `download()` was called while it loaded.
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
     * Returns the template of the download button, which is rendered into
     * the light DOM.
     * @protected
     */
    _renderPrintControls() {
      return html`${this.#renderDownloadButton(this.__effectiveI18n)}`;
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
          <vaadin-tooltip slot="tooltip" .text="${i18n.download}" .ariaLinkMode="${'none'}"></vaadin-tooltip>
        </vaadin-pdf-viewer-button>
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

    /** @private */
    #onDownloadClick() {
      this.download();
    }
  };
