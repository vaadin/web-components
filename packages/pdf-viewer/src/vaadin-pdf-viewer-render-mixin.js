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
import { issueWarning } from '@vaadin/component-base/src/warnings.js';
import { PdfViewerPage } from './pdf-viewer-page.js';
import { PdfViewerRenderQueue } from './pdf-viewer-render-queue.js';

/**
 * A mixin that creates the page views of the document and renders them to canvas.
 */
export const PdfViewerRenderMixin = (superClass) =>
  class PdfViewerRenderMixinClass extends superClass {
    /**
     * The page views of the loaded document.
     * @type {PdfViewerPage[]}
     * @private
     */
    __pages = [];

    /**
     * Whether the viewer has rendered everything that an action (load, resize, page change) asked for.
     * @private
     */
    __idle = true;

    /**
     * Whether all pages have their own size. The layout is not final before.
     * @private
     */
    __pageSizesLoaded = true;

    /** @private */
    __renderQueue = new PdfViewerRenderQueue({
      renderPage: (page, outputScale) => this.#renderPage(page, outputScale),
      releasePage: (page) => this.#releasePage(page),
      onIdle: () => this.#notifyIdle(),
    });

    /** Incremented on every unload, to detect results that belong to an outdated document. */
    #loadId = 0;

    /**
     * Override method from `PdfViewerDocumentMixin` to create one page view
     * per page. All pages start with the size of the first page, and get
     * their own size as they load in the background. This shows the document
     * without waiting for every page of a long document.
     * @protected
     * @override
     */
    _documentLoaded(firstPage) {
      super._documentLoaded(firstPage);

      const size = firstPage.getViewport({ scale: 1 });
      this.__pages = Array.from(
        { length: this._pdfDocument.numPages },
        (_, index) => new PdfViewerPage(index + 1, size),
      );
      this.__pages[0].setPdfPage(firstPage);
      this.$.pages.replaceChildren(...this.__pages.map((page) => page.element));
      this.__renderQueue.setPages(this.__pages);
      this.__idle = false;
      // `render-idle` waits for the page sizes, see #notifyIdle().
      this.__pageSizesLoaded = false;
    }

    /**
     * Override method from `PdfViewerDocumentMixin` to remove the page views.
     * @protected
     * @override
     */
    _documentUnloaded() {
      super._documentUnloaded();

      this.#loadId += 1;
      this.__pages.forEach((page) => page.release());
      this.__pages = [];
      this.__renderQueue.setPages([]);
      this.__idle = true;
      this.__pageSizesLoaded = true;
      this.$.pages.replaceChildren();
    }

    /**
     * Sets the loaded page of a page view.
     * @param {PdfViewerPage} page
     * @param {import('pdfjs-dist').PDFPageProxy} pdfPage
     * @private
     */
    __setPdfPage(page, pdfPage) {
      page.setPdfPage(pdfPage);
    }

    /** @private */
    async #renderPage(page, outputScale) {
      const loadId = this.#loadId;
      this.__idle = false;
      try {
        if (!page.pdfPage) {
          const pdfPage = await this._pdfDocument.getPage(page.pageNumber);
          if (loadId !== this.#loadId) {
            return;
          }
          this.__setPdfPage(page, pdfPage);
        }
        await page.render(outputScale);
      } catch (error) {
        const isCancelled = error && (error.name === 'RenderingCancelledException' || error.name === 'AbortException');
        if (loadId === this.#loadId && !isCancelled) {
          page.renderFailed = true;
          issueWarning(`Failed to render page ${page.pageNumber} of the PDF document: ${error.message}`);
        }
      }
    }

    /** @private */
    #releasePage(page) {
      page.release();
    }

    /** @private */
    #notifyIdle() {
      // The layout is not final while pages get their own sizes.
      if (!this.__idle && this.__pageSizesLoaded) {
        this.__idle = true;
        /** @internal to not document it in CEM */
        this.dispatchEvent(new CustomEvent('render-idle'));
      }
    }
  };
