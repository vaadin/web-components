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
import { MAX_CANVAS_PIXELS, PdfViewerPage } from './pdf-viewer-page.js';
import { PdfViewerRenderQueue } from './pdf-viewer-render-queue.js';

/** The number of pages whose size is requested at a time after loading. */
const PAGE_SIZE_BATCH = 10;

/**
 * A mixin that creates the page views of the document, loads their sizes and
 * renders them to canvas.
 */
export const PdfViewerRenderMixin = (superClass) =>
  class PdfViewerRenderMixinClass extends superClass {
    /**
     * The page views of the loaded document.
     * @type {PdfViewerPage[]}
     * @private
     */
    __pages = [];

    /** Whether all pages have their own size. The layout is not final before. */
    #pageSizesLoaded = true;

    #pageSizesFrame = 0;

    /** @type {MediaQueryList | null} */
    #pixelRatioQuery = null;

    #renderQueue = new PdfViewerRenderQueue({
      renderPage: (page, pixelRatio) => this.#renderPage(page, pixelRatio),
      releasePage: (page) => page.release(),
      onIdle: () => this.#notifyIdle(),
      renderAhead: 1,
      keepRendered: 1,
      maxPagePixels: MAX_CANVAS_PIXELS,
      // Mobile Safari limits the total canvas memory of a page.
      maxTotalPixels: 3 * MAX_CANVAS_PIXELS,
    });

    /** @protected */
    connectedCallback() {
      super.connectedCallback();

      this.#watchPixelRatio();
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      this.#unwatchPixelRatio();
    }

    /**
     * Override method from `PdfViewerDocumentMixin` to create one page view
     * per page. All pages start with the size of the first page, and get
     * their own size as they load in the background. This shows the document
     * without waiting for every page of a long document.
     * @protected
     * @override
     */
    _documentLoaded(details) {
      super._documentLoaded(details);

      const { firstPage } = details;
      const size = firstPage.getViewport({ scale: 1 });
      this.__pages = Array.from(
        { length: this._pdfDocument.numPages },
        (_, index) => new PdfViewerPage(index + 1, size),
      );
      this.__pages[0].setPdfPage(firstPage);
      this.$.pages.replaceChildren(...this.__pages.map((page) => page.element));
      this.#renderQueue.setPages(this.__pages);
      // `render-idle` waits for the page sizes, see #notifyIdle().
      this.#pageSizesLoaded = this.__pages.length === 1;
      if (!this.#pageSizesLoaded) {
        const pdfDocument = this._pdfDocument;
        // Start after the layout, so that the pages to render are requested first.
        queueMicrotask(() => {
          this.#loadPageSizes(pdfDocument).catch((error) => {
            if (this._pdfDocument === pdfDocument) {
              issueWarning(`Failed to load the page sizes of the PDF document: ${error.message}`);
            }
          });
        });
      }
    }

    /**
     * Override method from `PdfViewerDocumentMixin` to remove the page views.
     * @protected
     * @override
     */
    _documentUnloaded() {
      super._documentUnloaded();

      this.__pages.forEach((page) => page.release());
      this.__pages = [];
      this.#renderQueue.setPages([]);
      this.#pageSizesLoaded = true;
      cancelAnimationFrame(this.#pageSizesFrame);
      this.#pageSizesFrame = 0;
      this.$.pages.replaceChildren();
    }

    /**
     * Called at most once per frame when pages got their own size, which
     * differs from the estimate.
     * @protected
     */
    _pageSizesChanged() {
      // To be implemented.
    }

    /**
     * Renders the visible pages, the most visible first, then the pages next
     * to them, and frees the canvases of pages far from the view. Stops
     * rendering when no page is visible.
     * @param {Array<{ index: number, height: number }>} visible the indexes of
     *   the visible pages in document order, with their visible height
     * @protected
     */
    _renderVisible(visible) {
      if (visible.length) {
        this.#renderQueue.update(visible);
      } else {
        this.#renderQueue.clear();
      }
    }

    /**
     * Cancels rendering the page being rendered, e.g. before the pages get another size.
     * @protected
     */
    _cancelRender() {
      this.#renderQueue.cancel();
    }

    /**
     * Loads the pages after the first one, and corrects their size.
     * @private
     */
    async #loadPageSizes(pdfDocument) {
      if (this._pdfDocument !== pdfDocument) {
        return;
      }
      const pages = this.__pages.slice(1);
      // Request a few pages at a time, so that requests for pages to
      // render do not wait behind the requests for all page sizes.
      for (let start = 0; start < pages.length; start += PAGE_SIZE_BATCH) {
        const batch = pages.slice(start, start + PAGE_SIZE_BATCH);
        // A page that fails to load reports the error when it is rendered.
        await Promise.allSettled(
          batch.map((page) =>
            pdfDocument.getPage(page.pageNumber).then((pdfPage) => {
              if (this._pdfDocument === pdfDocument && !page.pdfPage) {
                this.#setPdfPage(page, pdfPage);
              }
            }),
          ),
        );
        if (this._pdfDocument !== pdfDocument) {
          return;
        }
      }
      this.#pageSizesLoaded = true;
      // Notify about being idle, unless a size change will render again.
      if (!this.#pageSizesFrame) {
        this.#renderQueue.renderNext();
      }
    }

    /** @private */
    #setPdfPage(page, pdfPage) {
      if (page.setPdfPage(pdfPage)) {
        this.#schedulePageSizesChanged();
      }
    }

    /** @private */
    #schedulePageSizesChanged() {
      if (this.#pageSizesFrame) {
        return;
      }
      this.#pageSizesFrame = requestAnimationFrame(() => {
        this.#pageSizesFrame = 0;
        this._pageSizesChanged();
        // Notify about being idle when nothing renders after the change.
        this.#renderQueue.renderNext();
      });
    }

    /** @private */
    async #renderPage(page, pixelRatio) {
      const pdfDocument = this._pdfDocument;
      try {
        if (!page.pdfPage) {
          const pdfPage = await pdfDocument.getPage(page.pageNumber);
          if (this._pdfDocument !== pdfDocument) {
            return;
          }
          this.#setPdfPage(page, pdfPage);
        }
        await page.render(pixelRatio);
      } catch (error) {
        const isCancelled = error && (error.name === 'RenderingCancelledException' || error.name === 'AbortException');
        if (this._pdfDocument === pdfDocument && !isCancelled) {
          page.renderFailed = true;
          issueWarning(`Failed to render page ${page.pageNumber} of the PDF document: ${error.message}`);
        }
      }
    }

    /**
     * Fires `render-idle` when no page is left to render. Only intended for
     * testing purposes, tests wait for it.
     * @private
     */
    #notifyIdle() {
      // The layout is not final while pages get their own sizes.
      if (this.__pages.length && this.#pageSizesLoaded) {
        /** @internal to not document it in CEM */
        this.dispatchEvent(new CustomEvent('render-idle'));
      }
    }

    /** @private */
    #watchPixelRatio() {
      this.#unwatchPixelRatio();
      const pixelRatio = window.devicePixelRatio || 1;
      this.#renderQueue.setPixelRatio(pixelRatio);
      this.#pixelRatioQuery = window.matchMedia(`(resolution: ${pixelRatio}dppx)`);
      this.#pixelRatioQuery.addEventListener('change', this.#onPixelRatioChange);
    }

    /** @private */
    #unwatchPixelRatio() {
      this.#pixelRatioQuery?.removeEventListener('change', this.#onPixelRatioChange);
      this.#pixelRatioQuery = null;
    }

    /** @private */
    #onPixelRatioChange = () => {
      // The query only matches the previous ratio, so watch the new one.
      this.#watchPixelRatio();
      // Render the visible pages again at the new ratio.
      this.#renderQueue.renderNext();
    };
  };
