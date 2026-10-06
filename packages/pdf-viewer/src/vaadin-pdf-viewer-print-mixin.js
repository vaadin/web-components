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
import { isKeyboardActive } from '@vaadin/a11y-base/src/focus-utils.js';
import { MAX_CANVAS_PIXELS } from './pdf-viewer-page.js';

/** The resolution that pages are printed at. PDF units are 1/72 inch. */
const PRINT_DPI = 150;

/** The styles of the print document. */
const PRINT_STYLES = `
  @page { margin: 0; }
  html, body { margin: 0; padding: 0; }
  img { display: block; break-after: page; }
  img:last-child { break-after: auto; }
`;

/**
 * Returns the file name for downloading a document from its URL, or null
 * when the URL has none. Only URLs with a path are used, not e.g. `blob:`
 * or `data:` URLs.
 * @param {string} src
 * @return {string | null}
 */
function getFileNameFromUrl(src) {
  try {
    const { protocol, pathname } = new URL(src, document.baseURI);
    if (!['http:', 'https:', 'file:'].includes(protocol)) {
      return null;
    }
    return decodeURIComponent(pathname.split('/').pop()) || null;
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
         * the last part of the path of `src`, or the title of the document, with
         * `.pdf` added when missing.
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

    /** @type {import('pdfjs-dist').RenderTask | null} */
    #printRenderTask = null;

    /** @type {HTMLElement | null} */
    #printReturnFocus = null;

    /** @protected */
    firstUpdated() {
      super.firstUpdated();

      this.addEventListener('document-load', (event) => {
        this.#title = event.detail.title;
      });

      this.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && this.__printProgress >= 0) {
          // Don't close a dialog that contains the viewer.
          event.stopPropagation();
          this._cancelPrint();
        }
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
     * and lets the user cancel. Does nothing when no document is loaded, the
     * viewer is not attached, or a print is being prepared already.
     */
    async print() {
      const pdfDocument = this._pdfDocument;
      if (!this.isConnected || !pdfDocument || this.__printProgress >= 0) {
        return;
      }

      // Remove the frame of a previous print, in browsers that don't fire `afterprint`.
      this.#cleanupPrint?.();
      this.#printId += 1;
      const printId = this.#printId;
      const isCancelled = () => printId !== this.#printId || this._pdfDocument !== pdfDocument;
      this.#printReturnFocus = this.#getDeepActiveElement();
      this.__printProgress = 0;
      announce(this.__effectiveI18n.printing);

      const iframe = document.createElement('iframe');
      iframe.setAttribute('aria-hidden', 'true');
      iframe.tabIndex = -1;
      // Not hidden with display or visibility, which would print an empty page in some browsers.
      iframe.style.cssText = 'position: fixed; left: -10000px; top: 0; width: 1px; height: 1px; border: 0;';
      const imageUrls = [];
      const cleanup = () => {
        this.#printRenderTask?.cancel();
        iframe.remove();
        imageUrls.forEach((url) => URL.revokeObjectURL(url));
        if (this.#cleanupPrint === cleanup) {
          this.#cleanupPrint = null;
        }
      };
      this.#cleanupPrint = cleanup;

      try {
        document.body.append(iframe);
        const frameWindow = iframe.contentWindow;
        const frameDocument = iframe.contentDocument;
        // A constructed style sheet, as inline styles may be blocked by a Content Security Policy.
        const styleSheet = new frameWindow.CSSStyleSheet();
        styleSheet.replaceSync(PRINT_STYLES);
        frameDocument.adoptedStyleSheets = [styleSheet];

        // Render one page at a time, so that memory use does not grow with the document.
        for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber++) {
          const url = await this.#renderPageForPrint(pdfDocument, pageNumber, frameDocument, styleSheet);
          if (isCancelled()) {
            URL.revokeObjectURL(url);
            return;
          }
          imageUrls.push(url);
          this.__printProgress = pageNumber / pdfDocument.numPages;
        }

        await Promise.all([...frameDocument.images].map((image) => image.decode().catch(() => {})));
        if (isCancelled()) {
          return;
        }

        this.__printProgress = -1;
        frameWindow.addEventListener('afterprint', cleanup, { once: true });
        frameWindow.focus();
        frameWindow.print();
        this.#restoreFocus();
      } catch {
        if (!isCancelled()) {
          this._cancelPrint();
          announce(this.__effectiveI18n.printError, { mode: 'alert' });
        }
      }
    }

    /**
     * Stops preparing a print, and removes what was prepared.
     * @protected
     */
    _cancelPrint() {
      const wasPrinting = this.__printProgress >= 0;
      this.#printId += 1;
      this.__printProgress = -1;
      this.#cleanupPrint?.();
      if (wasPrinting) {
        this.#restoreFocus();
      }
    }

    /**
     * Returns the focused element, also inside shadow roots.
     * @private
     */
    #getDeepActiveElement() {
      let active = document.activeElement;
      while (active && active.shadowRoot && active.shadowRoot.activeElement) {
        active = active.shadowRoot.activeElement;
      }
      return active && active !== document.body ? active : null;
    }

    /**
     * Returns focus to where it was before printing, when it was in the viewer
     * and has been lost meanwhile, e.g. because the cancel button was removed.
     * @private
     */
    async #restoreFocus() {
      const returnFocus = this.#printReturnFocus;
      this.#printReturnFocus = null;
      await this.updateComplete;
      const active = this.#getDeepActiveElement();
      // Focus is lost when on nothing, on the print frame, or on an element that is gone or hidden.
      const isLost = !active || active.localName === 'iframe' || !active.isConnected || !active.checkVisibility();
      if (!isLost) {
        return;
      }
      if (returnFocus && returnFocus.isConnected && !returnFocus.disabled && returnFocus.checkVisibility()) {
        returnFocus.focus({ focusVisible: isKeyboardActive() });
      }
      if (this.#getDeepActiveElement() !== returnFocus && this.pageCount) {
        this.$.content.focus({ focusVisible: isKeyboardActive() });
      }
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
    async #renderPageForPrint(pdfDocument, pageNumber, frameDocument, styleSheet) {
      const pdfPage = await pdfDocument.getPage(pageNumber);
      const unscaled = pdfPage.getViewport({ scale: 1 });
      // Large pages get a lower resolution, as browsers limit the canvas size.
      const scale = Math.min(PRINT_DPI / 72, Math.sqrt(MAX_CANVAS_PIXELS / (unscaled.width * unscaled.height)));
      const viewport = pdfPage.getViewport({ scale });
      const canvas = document.createElement('canvas');
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      this.#printRenderTask = pdfPage.render({ canvas, viewport, intent: 'print' });
      try {
        await this.#printRenderTask.promise;
      } finally {
        this.#printRenderTask = null;
      }

      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/png');
      });
      canvas.width = 0;
      canvas.height = 0;
      if (!blob) {
        throw new Error(`Failed to print page ${pageNumber}`);
      }

      const url = URL.createObjectURL(blob);
      const image = frameDocument.createElement('img');
      image.src = url;
      image.alt = '';
      // PDF units are points, so the image gets the paper size of the page.
      // A named page per PDF page gives each printed page the size of its PDF page.
      image.style.width = `${unscaled.width}pt`;
      image.style.height = `${unscaled.height}pt`;
      image.style.page = `page${pageNumber}`;
      styleSheet.insertRule(`@page page${pageNumber} { size: ${unscaled.width}pt ${unscaled.height}pt; margin: 0; }`);
      frameDocument.body.append(image);
      return url;
    }
  };
