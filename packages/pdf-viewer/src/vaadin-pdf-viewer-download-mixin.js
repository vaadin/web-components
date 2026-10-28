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
import { html } from 'lit';
import { issueWarning } from '@vaadin/component-base/src/warnings.js';
import { downloadDocument } from './pdf-viewer-download.js';

/**
 * A mixin that adds downloading the document, with a button in the toolbar.
 */
export const PdfViewerDownloadMixin = (superClass) =>
  class PdfViewerDownloadMixinClass extends superClass {
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

    /**
     * Aborted when the viewer is detached, to stop the downloads in progress
     * and release their data.
     * @type {AbortController | null}
     */
    #downloadsController = null;

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      this.#downloadsController?.abort();
      this.#downloadsController = null;
    }

    /** @protected */
    updated(props) {
      super.updated(props);

      if (this.#downloadPending && !this._documentPending) {
        this.#downloadPending = false;
        this.#download();
      }
    }

    /**
     * Downloads the document. The file has the original bytes of the
     * document, so the viewer does not request it again, and signatures stay
     * intact. The file name is `fileName` when set, else the name from the
     * response or `src`, see `fileName`.
     * While the document loads, it is downloaded once loaded. Does nothing
     * without a document, or when the viewer is not attached.
     */
    download() {
      if (!this.isConnected) {
        return;
      }

      if (this._documentPending) {
        this.#downloadPending = true;
      } else {
        this.#download();
      }
    }

    /**
     * Override method from `PdfViewerToolbarMixin` to add the download
     * button after the application controls.
     * @protected
     * @override
     */
    _renderToolbarControls() {
      return html`${super._renderToolbarControls()}${this.#renderDownloadButton()}`;
    }

    /** @private */
    #renderDownloadButton() {
      return html`
        <vaadin-pdf-viewer-button
          slot="toolbar-default-actions"
          icon="download"
          theme="tertiary icon"
          ?hidden="${this.downloadButtonHidden}"
          .disabled="${!this.pageCount}"
          @click="${this.#onDownloadClick}"
        >
          <vaadin-tooltip slot="tooltip" .text="${this.__effectiveI18n.download}"></vaadin-tooltip>
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
