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
import { announce } from '@vaadin/a11y-base/src/announce.js';

/** The resolution that pages are printed at. PDF units are 1/72 inch. */
const PRINT_DPI = 150;

/**
 * Returns the file name for downloading a document from its URL, or null
 * when the URL has none.
 * @param {string} src
 * @return {string | null}
 */
function getFileNameFromUrl(src) {
  try {
    const { pathname } = new URL(src, document.baseURI);
    const name = decodeURIComponent(pathname.split('/').pop());
    return name || null;
  } catch {
    return null;
  }
}

/**
 * Downloads and prints the document.
 *
 * @polymerMixin
 */
export const PdfViewerPrintMixin = (superClass) =>
  class PdfViewerPrintMixinClass extends superClass {
    static get properties() {
      return {
        /**
         * The file name used when the user downloads the document. Defaults to
         * the last part of the path of `src`, or the title of the document.
         *
         * @attr {string} file-name
         */
        fileName: {
          type: String,
        },

        /** @private */
        __printProgress: {
          type: Number,
          value: -1,
        },
      };
    }

    /** The title of the loaded document, for the default file name. */
    #title = '';

    /** Incremented on every print, to stop an outdated or cancelled print. */
    #printId = 0;

    /** Cleans up the current print, if any. */
    #cleanupPrint = null;

    /** @protected */
    firstUpdated() {
      super.firstUpdated();

      this.addEventListener('document-load', (event) => {
        this.#title = event.detail.title;
      });
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();
      this._cancelPrint();
    }

    /**
     * Prints the document. The pages are rendered for printing first, which
     * can take a while for long documents, so the viewer shows the progress
     * and lets the user cancel. Does nothing when no document is loaded or
     * the viewer is not attached.
     */
    async print() {
      const pdfDocument = this._pdfDocument;
      if (!this.isConnected || !pdfDocument || this.__printProgress >= 0) {
        return;
      }

      this.#printId += 1;
      const printId = this.#printId;
      const isCancelled = () => printId !== this.#printId || this._pdfDocument !== pdfDocument;
      this.__printProgress = 0;
      announce(this.__effectiveI18n.printing);

      const iframe = document.createElement('iframe');
      iframe.setAttribute('aria-hidden', 'true');
      iframe.tabIndex = -1;
      // Not hidden with display or visibility, which would print an empty page in some browsers.
      iframe.style.cssText = 'position: fixed; left: -10000px; top: 0; width: 1px; height: 1px; border: 0;';
      document.body.append(iframe);
      const imageUrls = [];
      this.#cleanupPrint = () => {
        iframe.remove();
        imageUrls.forEach((url) => URL.revokeObjectURL(url));
        this.#cleanupPrint = null;
      };

      const frameDocument = iframe.contentDocument;
      frameDocument.open();
      frameDocument.write(
        '<!doctype html><html><head><style>' +
          '@page { margin: 0; } html, body { margin: 0; padding: 0; } ' +
          'img { display: block; break-after: page; } img:last-child { break-after: auto; }' +
          '</style></head><body></body></html>',
      );
      frameDocument.close();

      try {
        // Render one page at a time, so that memory use does not grow with the document.
        for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber++) {
          const url = await this.#renderPageForPrint(pdfDocument, pageNumber, frameDocument);
          if (isCancelled()) {
            return;
          }
          imageUrls.push(url);
          this.__printProgress = pageNumber / pdfDocument.numPages;
        }

        await Promise.all([...frameDocument.images].map((image) => image.decode().catch(() => {})));
        if (isCancelled()) {
          return;
        }
      } catch {
        if (!isCancelled()) {
          this._cancelPrint();
        }
        return;
      }

      this.__printProgress = -1;
      const frameWindow = iframe.contentWindow;
      const cleanup = this.#cleanupPrint;
      frameWindow.addEventListener('afterprint', () => cleanup(), { once: true });
      frameWindow.focus();
      frameWindow.print();
    }

    /**
     * Stops preparing a print, and removes what was prepared.
     * @protected
     */
    _cancelPrint() {
      this.#printId += 1;
      this.__printProgress = -1;
      this.#cleanupPrint?.();
    }

    /**
     * Downloads the document with the original bytes of the file, so that
     * it also works for documents from other origins.
     * @protected
     */
    async _download() {
      const pdfDocument = this._pdfDocument;
      if (!pdfDocument) {
        return;
      }
      const data = await pdfDocument.getData();
      const url = URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = this.#getFileName();
      link.click();
      // Give the browser time to start the download before releasing the data.
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    }

    /**
     * Override method from `PdfViewerMixin` to stop printing the previous document.
     * @protected
     * @override
     */
    _documentUnloaded() {
      super._documentUnloaded();
      this._cancelPrint();
      this.#title = '';
    }

    /** @private */
    #getFileName() {
      if (this.fileName) {
        return this.fileName;
      }
      const name = getFileNameFromUrl(this.src) || this.#title || 'document';
      return /\.pdf$/iu.test(name) ? name : `${name}.pdf`;
    }

    /**
     * Renders a page as an image into the print document, sized to the paper
     * size of the page. Returns the object URL of the image.
     * @private
     */
    async #renderPageForPrint(pdfDocument, pageNumber, frameDocument) {
      const pdfPage = await pdfDocument.getPage(pageNumber);
      const unscaled = pdfPage.getViewport({ scale: 1 });
      const viewport = pdfPage.getViewport({ scale: PRINT_DPI / 72 });
      const canvas = document.createElement('canvas');
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      await pdfPage.render({ canvas, viewport, intent: 'print' }).promise;

      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/png');
      });
      canvas.width = 0;
      canvas.height = 0;

      const url = URL.createObjectURL(blob);
      const image = frameDocument.createElement('img');
      image.src = url;
      image.alt = '';
      // PDF units are points, so the image gets the paper size of the page.
      // A named page per PDF page gives each printed page the size of its PDF page.
      const size = `${unscaled.width}pt ${unscaled.height}pt`;
      image.style.width = `${unscaled.width}pt`;
      image.style.height = `${unscaled.height}pt`;
      image.style.page = `page${pageNumber}`;
      const style = frameDocument.createElement('style');
      style.textContent = `@page page${pageNumber} { size: ${size}; margin: 0; }`;
      frameDocument.head.append(style);
      frameDocument.body.append(image);
      return url;
    }
  };
