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
import { acquireWorker, loadPdfjs, releaseWorker } from './pdfjs-loader.js';

/**
 * Maps a pdf.js loading error to the `reason` reported in the `error` event.
 * @param {Error} error
 * @return {'invalid' | 'network' | 'password'}
 */
function getErrorReason(error) {
  if (error && error.name === 'PasswordException') {
    return 'password';
  }
  if (error && error.name === 'InvalidPDFException') {
    return 'invalid';
  }
  return 'network';
}

/**
 * @polymerMixin
 */
export const PdfViewerMixin = (superClass) =>
  class PdfViewerMixinClass extends superClass {
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
        },

        /** @private */
        __loading: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
          attribute: 'loading',
        },

        /** @private */
        __errorReason: {
          type: String,
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

    /** @type {import('pdfjs-dist').PDFDocumentLoadingTask | null} */
    #loadingTask = null;

    /** @type {import('pdfjs-dist').PDFDocumentProxy | null} */
    #document = null;

    /** @type {import('pdfjs-dist').RenderTask | null} */
    #renderTask = null;

    /** Incremented on every load, to detect results that belong to an outdated load. */
    #loadId = 0;

    /** Set when the document was released on disconnect, to load it again on reconnect. */
    #released = false;

    /** @protected */
    connectedCallback() {
      super.connectedCallback();

      if (this.#released) {
        this.#released = false;
        this.#load();
      }
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      // Wait a microtask so that moving the element in the DOM does not reload the document.
      queueMicrotask(() => {
        if (!this.isConnected && this.#loadingTask) {
          this.#released = true;
          this.#loadId += 1;
          this.#unload();
        }
      });
    }

    /** @protected */
    updated(props) {
      super.updated(props);

      if (props.has('src')) {
        this.#load();
      }
    }

    /** @private */
    async #load() {
      this.#loadId += 1;
      const loadId = this.#loadId;
      this.#unload();

      this._setPageCount(0);
      this.__hasError = false;
      this.__errorReason = undefined;
      this.__loading = !!this.src;

      if (!this.src) {
        return;
      }

      try {
        const pdfjs = await loadPdfjs();
        if (loadId !== this.#loadId) {
          return;
        }

        const { worker, failed } = acquireWorker(pdfjs);
        const loadingTask = pdfjs.getDocument({
          url: this.src,
          worker,
          // Security, see D9 in plans/pdf-viewer.md.
          enableXfa: false,
        });
        this.#loadingTask = loadingTask;

        const pdfDocument = await Promise.race([loadingTask.promise, failed]);
        if (loadId !== this.#loadId) {
          return;
        }
        this.#document = pdfDocument;

        const { info } = await pdfDocument.getMetadata();
        if (loadId !== this.#loadId) {
          return;
        }

        this._setPageCount(pdfDocument.numPages);
        this.__loading = false;
        this.dispatchEvent(
          new CustomEvent('document-load', {
            detail: { pageCount: pdfDocument.numPages, title: (info && info.Title) || '' },
          }),
        );

        await this.#renderFirstPage(loadId);
        if (loadId === this.#loadId) {
          /** @internal to not document it in CEM */
          this.dispatchEvent(new CustomEvent('render-idle'));
        }
      } catch (error) {
        if (loadId !== this.#loadId || (error && error.name === 'RenderingCancelledException')) {
          return;
        }
        this.__loading = false;
        this.__hasError = true;
        this.__errorReason = getErrorReason(error);
        this.dispatchEvent(new CustomEvent('document-error', { detail: { reason: this.__errorReason, error } }));
      }
    }

    /** @private */
    #unload() {
      this.#renderTask?.cancel();
      this.#renderTask = null;
      this.#document = null;
      this.$.pages.replaceChildren();

      const loadingTask = this.#loadingTask;
      if (loadingTask) {
        this.#loadingTask = null;
        // Destroying the loading task also destroys its document. Release
        // the worker only afterwards, as destroying talks to the worker.
        loadingTask.destroy().finally(() => releaseWorker());
      }
    }

    /**
     * Returns the width that pages can use inside the scrollable content area.
     * @private
     */
    #getAvailableWidth() {
      const { content } = this.$;
      const style = getComputedStyle(content);
      return content.clientWidth - parseFloat(style.paddingInlineStart) - parseFloat(style.paddingInlineEnd);
    }

    /** @private */
    async #renderFirstPage(loadId) {
      const page = await this.#document.getPage(1);
      if (loadId !== this.#loadId) {
        return;
      }

      const unscaledViewport = page.getViewport({ scale: 1 });
      const scale = this.#getAvailableWidth() / unscaledViewport.width;
      const viewport = page.getViewport({ scale });
      const outputScale = window.devicePixelRatio || 1;

      const pageElement = document.createElement('div');
      pageElement.setAttribute('part', 'page');
      pageElement.style.width = `${viewport.width}px`;
      pageElement.style.height = `${viewport.height}px`;

      const canvas = document.createElement('canvas');
      canvas.setAttribute('aria-hidden', 'true');
      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);
      pageElement.append(canvas);
      this.$.pages.append(pageElement);

      this.#renderTask = page.render({
        canvas,
        viewport,
        transform: outputScale === 1 ? undefined : [outputScale, 0, 0, outputScale, 0, 0],
      });
      await this.#renderTask.promise;
      this.#renderTask = null;
    }
  };
