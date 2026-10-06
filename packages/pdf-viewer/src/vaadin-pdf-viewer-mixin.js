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
import { issueWarning } from '@vaadin/component-base/src/warnings.js';
import { acquireWorker, loadPdfjs, releaseWorker } from './pdfjs-loader.js';

/**
 * Maps a pdf.js loading error to the `reason` reported in the `document-error`
 * event. Any failure other than a password or an invalid file is reported as
 * `network`, since the file could not be fetched or read.
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

    /** @type {ReturnType<typeof acquireWorker> | null} */
    #workerHandle = null;

    /** @type {import('pdfjs-dist').PDFDocumentProxy | null} */
    #document = null;

    /** @type {import('pdfjs-dist').RenderTask | null} */
    #renderTask = null;

    /** Incremented on every load, to detect results that belong to an outdated load. */
    #loadId = 0;

    /** Set when the document is not loaded because the element is detached, to load it on attach. */
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
        if (!this.isConnected && this.src && !this.#released) {
          this.#loadId += 1;
          this.#unload();
          this.#released = true;
          this.__loading = false;
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

      // A detached element does not hold on to a document. It loads it once attached.
      this.#released = !!this.src && !this.isConnected;
      this.__loading = !!this.src && !this.#released;
      if (!this.__loading) {
        return;
      }

      let pdfDocument;
      try {
        const pdfjs = await loadPdfjs();
        if (loadId !== this.#loadId) {
          return;
        }

        this.#workerHandle = acquireWorker(pdfjs);
        this.#loadingTask = pdfjs.getDocument({
          url: this.src,
          worker: this.#workerHandle.worker,
          // Security, see D9 in plans/pdf-viewer.md.
          enableXfa: false,
        });

        pdfDocument = await Promise.race([this.#loadingTask.promise, this.#workerHandle.failed]);
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
      } catch (error) {
        if (loadId === this.#loadId) {
          this.#unload();
          this.#onLoadError(error);
        }
        return;
      }

      try {
        await this.#renderFirstPage(loadId);
      } catch (error) {
        if (loadId !== this.#loadId || (error && error.name === 'RenderingCancelledException')) {
          return;
        }
        issueWarning(`Failed to render the PDF document: ${error && error.message}`);
      }

      if (loadId === this.#loadId) {
        /** @internal to not document it in CEM */
        this.dispatchEvent(new CustomEvent('render-idle'));
      }
    }

    /** @private */
    #onLoadError(error) {
      this.__loading = false;
      this.__hasError = true;
      this.__errorReason = getErrorReason(error);

      const i18n = this.__effectiveI18n;
      announce(this.__errorReason === 'password' ? i18n.passwordError : i18n.loadError, { mode: 'alert' });

      this.dispatchEvent(new CustomEvent('document-error', { detail: { reason: this.__errorReason, error } }));
    }

    /** @private */
    #unload() {
      this.#renderTask?.cancel();
      this.#renderTask = null;
      this.#document = null;
      this.$.pages.replaceChildren();

      const loadingTask = this.#loadingTask;
      const workerHandle = this.#workerHandle;
      this.#loadingTask = null;
      this.#workerHandle = null;
      if (loadingTask) {
        // Destroying the loading task also destroys its document. Release
        // the worker only afterwards, as destroying talks to the worker.
        loadingTask.destroy().finally(() => releaseWorker(workerHandle));
      } else if (workerHandle) {
        releaseWorker(workerHandle);
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
      const availableWidth = this.#getAvailableWidth();
      // Nothing to render into while the viewer has no layout, e.g. inside a hidden tab.
      if (loadId !== this.#loadId || availableWidth <= 0) {
        return;
      }

      const unscaledViewport = page.getViewport({ scale: 1 });
      const scale = availableWidth / unscaledViewport.width;
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
