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
 * Returns the PDF file name at the end of the path of a URL, e.g.
 * `report.pdf` of `/files/report.pdf`, or null for URLs without one, e.g.
 * blob URLs or `/files/123`.
 * @param {string | null | undefined} src
 * @return {string | null}
 */
function getFileNameFromUrl(src) {
  if (!src) {
    return null;
  }
  try {
    const { protocol, pathname } = new URL(src, document.baseURI);
    if (!['http:', 'https:', 'file:'].includes(protocol)) {
      return null;
    }
    const name = decodeURIComponent(pathname.split('/').pop());
    return /\.pdf$/iu.test(name) ? name : null;
  } catch {
    return null;
  }
}

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
         * The name of the file that `download()` saves, used as given, which
         * the header also shows. When not set, the name is the PDF file name
         * from the `Content-Disposition` header of the response, else the PDF
         * file name at the end of the path of `src`, else `document.pdf`.
         *
         * @attr {string} file-name
         */
        fileName: {
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

    /** @type {import('./pdf-viewer-document-controller.js').PdfViewerDocumentDetails | null} */
    #details = null;

    /** The `src` of the last update. A different `src` starts loading in the next update. */
    #updatedSrc;

    /**
     * The resolve functions of `_whenDocumentReady()` calls that wait for the document.
     * @type {Array<(pdfDocument: import('pdfjs-dist').PDFDocumentProxy | null) => void>}
     */
    #readyCallbacks = [];

    #documentController = new PdfViewerDocumentController(this, {
      onLoadStart: () => {
        this.__loading = true;
      },
      onLoad: (pdfDocument, details) => this.#onLoad(pdfDocument, details),
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
        this.#updatedSrc = this.src;
        this.#documentController.load();
      }

      this.#resolveReadyCallbacks();
    }

    /**
     * The loaded document, or null.
     * @return {import('pdfjs-dist').PDFDocumentProxy | null}
     * @protected
     */
    get _pdfDocument() {
      return this.#pdfDocument;
    }

    /**
     * Returns a promise for the document of `src`. It resolves once the
     * document has loaded, also when `src` changes meanwhile, and right away
     * when no document is loading. It resolves with null without a document,
     * or when the viewer is not attached.
     * @return {Promise<import('pdfjs-dist').PDFDocumentProxy | null>}
     * @protected
     */
    _whenDocumentReady() {
      if (!this.isConnected) {
        return Promise.resolve(null);
      }
      return new Promise((resolve) => {
        this.#readyCallbacks.push(resolve);
        this.#resolveReadyCallbacks();
      });
    }

    /**
     * Called when a document has loaded, before `document-load` is fired.
     * @param {{ firstPage: import('pdfjs-dist').PDFPageProxy }} _details
     * @protected
     */
    _documentLoaded(_details) {
      // To be implemented.
    }

    /**
     * Called when the document is unloaded, e.g. before another one loads.
     * @protected
     */
    _documentUnloaded() {
      // To be implemented.
    }

    /**
     * Returns the name of the document: `fileName`, else the PDF file name
     * from the `Content-Disposition` header, else the PDF file name at the
     * end of the path of `src`, else an empty string.
     * @return {string}
     * @protected
     */
    _getDocumentName() {
      return this.fileName || this.#details?.dispositionFileName || getFileNameFromUrl(this.src) || '';
    }

    /**
     * Returns the name to save the document under: `fileName` as given,
     * else the name of the document, else `document`, with `.pdf` added
     * when missing.
     * @return {string}
     * @protected
     */
    _getFileName() {
      if (this.fileName) {
        return this.fileName;
      }
      const name = this._getDocumentName() || 'document';
      return /\.pdf$/iu.test(name) ? name : `${name}.pdf`;
    }

    /**
     * Resolves the `_whenDocumentReady()` calls once no document is loading.
     * @private
     */
    #resolveReadyCallbacks() {
      if (this.__loading || this.src !== this.#updatedSrc || !this.#readyCallbacks.length) {
        return;
      }
      const callbacks = this.#readyCallbacks;
      this.#readyCallbacks = [];
      const pdfDocument = this.isConnected ? this.#pdfDocument : null;
      callbacks.forEach((resolve) => resolve(pdfDocument));
    }

    /** @private */
    #onLoad(pdfDocument, details) {
      this.#pdfDocument = pdfDocument;
      this.#details = details;
      this._documentLoaded({ firstPage: details.firstPage });
      this._setPageCount(pdfDocument.numPages);
      this.__loading = false;
      this.dispatchEvent(
        new CustomEvent('document-load', { detail: { pageCount: pdfDocument.numPages, title: details.title } }),
      );
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
        this.#details = null;
        this._setPageCount(0);
        this._documentUnloaded();
      }
    }
  };
