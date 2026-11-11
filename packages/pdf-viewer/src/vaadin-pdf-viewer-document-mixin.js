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

    /** The `src` of the last update, so that a newer `src` counts as loading. */
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
     * Returns a promise that resolves with the document of `src` once no document
     * is loading, or with null when detached.
     * @return {Promise<import('pdfjs-dist').PDFDocumentProxy | null>}
     * @protected
     */
    _whenDocumentReady() {
      if (!this.isConnected) {
        return Promise.resolve(null);
      }
      return new Promise((resolve) => {
        this.#readyCallbacks.push(resolve);
        // Check once the calling code has run, as it may still set `src`. Detaching meanwhile
        // keeps the document, as the document controller unloads it only after that check.
        Promise.resolve().then(() => this.#resolveReadyCallbacks(this.#pdfDocument));
      });
    }

    /**
     * Called when a document has loaded, before `document-load` is fired.
     * @param {import('./pdf-viewer-document-controller.js').PdfViewerDocumentDetails} _details
     * @protected
     */
    _documentLoaded(_details) {
      // To be implemented.
    }

    /**
     * Called when the document is unloaded.
     * @protected
     */
    _documentUnloaded() {
      // To be implemented.
    }

    /**
     * Returns `fileName`, else the PDF file name from the `Content-Disposition` header or `src`, else an empty string.
     * @return {string}
     * @protected
     */
    _getDocumentName() {
      return this.fileName || this.#details?.dispositionFileName || getFileNameFromUrl(this.src) || '';
    }

    /**
     * Resolves the `_whenDocumentReady()` calls once no document is loading.
     * @param {import('pdfjs-dist').PDFDocumentProxy | null} pdfDocument the document to resolve with
     * @private
     */
    #resolveReadyCallbacks(pdfDocument = this.isConnected ? this.#pdfDocument : null) {
      if (this.__loading || this.src !== this.#updatedSrc || !this.#readyCallbacks.length) {
        return;
      }
      const callbacks = this.#readyCallbacks;
      this.#readyCallbacks = [];
      callbacks.forEach((resolve) => resolve(pdfDocument));
    }

    /** @private */
    #onLoad(pdfDocument, details) {
      this.#pdfDocument = pdfDocument;
      this.#details = details;
      this._documentLoaded(details);
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
