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
import { PdfViewerDocumentController } from './pdf-viewer-document-controller.js';

/**
 * A mixin that loads the document of `src` and reports the result.
 */
export const PdfViewerDocumentMixin = (superClass) =>
  class PdfViewerDocumentMixinClass extends superClass {
    static get properties() {
      return {
        /**
         * The URL of the PDF document to show.
         */
        src: {
          type: String,
        },

        /**
         * The number of pages in the loaded document, or 0 when no document
         * is loaded.
         */
        pageCount: {
          type: Number,
          value: 0,
          readOnly: true,
          notify: true,
          attribute: false,
        },

        /** @private */
        __loading: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
          attribute: 'loading',
        },

        /** @private */
        __hasError: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
          attribute: 'has-error',
        },
      };
    }

    /** @type {import('pdfjs-dist').PDFDocumentProxy | null} */
    #pdfDocument = null;

    #documentController = new PdfViewerDocumentController(this, {
      onLoadStart: () => {
        this.__loading = true;
      },
      onLoad: (pdfDocument, title) => this.#onLoad(pdfDocument, title),
      onError: (error, reason) => this.#onError(error, reason),
      onUnload: () => this.#onUnload(),
    });

    /** @protected */
    firstUpdated() {
      super.firstUpdated();

      this.addController(this.#documentController);
    }

    /** @protected */
    updated(props) {
      super.updated(props);

      if (props.has('src')) {
        this.#documentController.load();
      }
    }

    /**
     * Called when the document is unloaded, e.g. before another one loads.
     * @protected
     */
    _documentUnloaded() {}

    /** @private */
    #onLoad(pdfDocument, title) {
      this.#pdfDocument = pdfDocument;
      this._setPageCount(pdfDocument.numPages);
      this.__loading = false;
      this.dispatchEvent(new CustomEvent('document-load', { detail: { pageCount: pdfDocument.numPages, title } }));
    }

    /** @private */
    #onError(error, reason) {
      this.__hasError = true;
      this.dispatchEvent(new CustomEvent('document-error', { detail: { reason, error } }));
    }

    /** @private */
    #onUnload() {
      this.__loading = false;
      this.__hasError = false;
      if (this.#pdfDocument) {
        this.#pdfDocument = null;
        this._setPageCount(0);
        this._documentUnloaded();
      }
    }
  };
