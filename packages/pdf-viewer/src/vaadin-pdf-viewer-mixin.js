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
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
import { issueWarning } from '@vaadin/component-base/src/warnings.js';
import { MAX_CANVAS_PIXELS, PdfViewerPage } from './pdf-viewer-page.js';
import { acquireWorker, loadPdfjs, releaseWorker } from './pdfjs-loader.js';

/** PDF units are points (1/72 inch), CSS pixels are 1/96 inch. */
const PDF_TO_CSS_UNITS = 96 / 72;

/** The number of pages before and after the visible ones that are rendered in advance. */
const RENDER_AHEAD = 1;

/** The number of pages before and after the visible ones that keep their canvas. */
const KEEP_RENDERED = 1;

/**
 * The number of canvas pixels that all pages may use together before pages
 * outside the view are released, or not rendered ahead. Mobile Safari limits
 * the total canvas memory of a page.
 */
const MAX_TOTAL_CANVAS_PIXELS = 3 * MAX_CANVAS_PIXELS;

/** The number of pages whose size is requested at a time after loading. */
const PAGE_SIZE_BATCH = 10;

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
 * @mixes ResizeMixin
 */
export const PdfViewerMixin = (superClass) =>
  class PdfViewerMixinClass extends ResizeMixin(superClass) {
    static get properties() {
      return {
        /**
         * The URL of the PDF document to show.
         */
        src: {
          type: String,
        },

        /**
         * The current page, starting from 1. The viewer updates it while the
         * user scrolls, to the page that takes up most of the visible area.
         * Setting it scrolls to the start of that page.
         */
        page: {
          type: Number,
          value: 1,
          notify: true,
        },

        /**
         * The zoom level of the pages:
         * - `page-width` (default) fits the width of the current page to the viewer.
         * - `page-fit` fits the whole current page into the viewer.
         * - A number scales the pages relative to their actual size, e.g. `1` for 100%.
         *
         * @type {string | number}
         */
        zoom: {
          value: 'page-width',
          notify: true,
        },

        /**
         * The zoom level the pages are shown at, as a factor of their actual
         * size, or 0 while no pages are laid out.
         * @protected
         */
        _zoomFactor: {
          type: Number,
          value: 0,
          attribute: false,
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

    /** @type {PdfViewerPage[]} */
    #pages = [];

    /** The scale of the pages in CSS pixels per PDF unit, or 0 before the pages are laid out. */
    #scale = 0;

    /** The index of the page that takes up most of the view, updated with the visible pages. */
    #currentIndex = 0;

    /** The pages to render, in order of priority. */
    #renderQueue = [];

    /** The number of visible pages at the start of the render queue. */
    #visibleQueueLength = 0;

    /** @type {PdfViewerPage | null} */
    #renderingPage = null;

    /** Whether the viewer has rendered everything that an action (load, zoom, resize, page change) asked for. */
    #idle = true;

    /** The last page that the viewer set itself, to not scroll to it again. */
    #scrolledPage = 1;

    /** A page that was scrolled to, kept as the current page until the user scrolls. */
    #pinnedPage = 0;

    /** The scroll position set when scrolling to the pinned page. */
    #pinnedScrollTop = 0;

    /** A page to scroll to once the pages can be laid out. */
    #pendingPage = 0;

    #scrollFrame = 0;

    /** The scroll position while the viewer had a size, to restore it when shown again. */
    #savedScroll = { top: 0, left: 0 };

    #hadLayout = false;

    #relayoutFrame = 0;

    /** Whether all pages have their own size, see `#loadPageSizes()`. */
    #pageSizesLoaded = true;

    /** @type {MediaQueryList | null} */
    #pixelRatioQuery = null;

    /** Incremented on every load, to detect results that belong to an outdated load. */
    #loadId = 0;

    /** Set when the document is not loaded because the element is detached, to load it on attach. */
    #released = false;

    /** @protected */
    connectedCallback() {
      super.connectedCallback();

      this.#watchPixelRatio();

      if (this.#released) {
        this.#released = false;
        this.#load();
      }
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      this.#unwatchPixelRatio();
      cancelAnimationFrame(this.#scrollFrame);
      this.#scrollFrame = 0;

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
    firstUpdated() {
      super.firstUpdated();

      this.$.content.addEventListener('scroll', () => this.#onScroll(), { passive: true });
    }

    /** @protected */
    updated(props) {
      super.updated(props);

      if (props.has('src')) {
        // A new document starts from the first page, unless a page is set together with it.
        if (!props.has('page')) {
          this.#setPageFromViewer(1);
        }
        this.#load();
      }

      if (props.has('zoom') && this.#pages.length) {
        this.#idle = false;
        this.#refresh();
      }

      if (props.has('page') && this.page !== this.#scrolledPage && this.#pages.length) {
        this.#scrollToPage(this.page);
      }
    }

    /**
     * Override method from `ResizeMixin` to fit the pages to the new size.
     * @protected
     * @override
     */
    _onResize() {
      // Hiding the viewer (e.g. in an inactive tab) resets its scroll position.
      const hasLayout = this.#hasLayout();
      if (hasLayout && !this.#hadLayout) {
        this.$.content.scrollTop = this.#savedScroll.top;
        this.$.content.scrollLeft = this.#savedScroll.left;
      }
      this.#hadLayout = hasLayout;

      if (this.#pages.length) {
        this.#idle = false;
      }
      this.#refresh();
    }

    /**
     * Applies changes to the zoom or size, and scrolls to a page that was set
     * while the pages could not be laid out.
     * @private
     */
    #refresh() {
      if (this.#updateScale()) {
        return;
      }
      if (this.#pendingPage && this.#scale > 0) {
        this.#scrollToPage(this.#pendingPage);
      } else {
        this.#updateVisiblePages();
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
      let title;
      let firstPage;
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

        const [{ info }, page] = await Promise.all([pdfDocument.getMetadata(), pdfDocument.getPage(1)]);
        if (loadId !== this.#loadId) {
          return;
        }
        title = (info && info.Title) || '';
        firstPage = page;
      } catch (error) {
        if (loadId === this.#loadId) {
          this.#unload();
          this.#onLoadError(error);
        }
        return;
      }

      // All pages start with the size of the first page, and get their own
      // size as they load in the background. This shows the document without
      // waiting for every page of a long document.
      this.#document = pdfDocument;
      const size = firstPage.getViewport({ scale: 1 });
      this.#pages = Array.from({ length: pdfDocument.numPages }, (_, index) => new PdfViewerPage(index + 1, size));
      this.#pages[0].setPdfPage(firstPage);
      this.$.pages.replaceChildren(...this.#pages.map((page) => page.element));
      this._setPageCount(pdfDocument.numPages);
      this.__loading = false;
      this.#idle = false;
      this.#pendingPage = this.page;

      this.#loadPageSizes(loadId);
      this.#refresh();

      this.dispatchEvent(new CustomEvent('document-load', { detail: { pageCount: pdfDocument.numPages, title } }));
    }

    /**
     * Loads the pages after the first one, and corrects their size.
     * @private
     */
    #loadPageSizes(loadId) {
      this.#pageSizesLoaded = false;
      const pdfDocument = this.#document;
      const pages = this.#pages.slice(1);
      (async () => {
        // Request a few pages at a time, so that requests for pages to
        // render do not wait behind the requests for all page sizes.
        for (let start = 0; start < pages.length; start += PAGE_SIZE_BATCH) {
          const batch = pages.slice(start, start + PAGE_SIZE_BATCH);
          // A page that fails to load reports the error when it is rendered.

          await Promise.allSettled(
            batch.map((page) =>
              pdfDocument.getPage(page.pageNumber).then((pdfPage) => {
                if (loadId === this.#loadId && !page.pdfPage && page.setPdfPage(pdfPage)) {
                  this.#scheduleRelayout();
                }
              }),
            ),
          );
          if (loadId !== this.#loadId) {
            return;
          }
        }
        this.#pageSizesLoaded = true;
        // Notify about being idle, unless a relayout will render again.
        if (!this.#relayoutFrame) {
          this.#renderNext();
        }
      })();
    }

    /**
     * Applies changed page sizes once per frame, keeping the current page in view.
     * @private
     */
    #scheduleRelayout() {
      if (this.#relayoutFrame) {
        return;
      }
      this.#relayoutFrame = requestAnimationFrame(() => {
        this.#relayoutFrame = 0;
        if (this.#scale > 0) {
          this.#applyScale(this.#scale);
        } else {
          this.#renderNext();
        }
      });
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
      this.#pages.forEach((page) => page.release());
      this.#pages = [];
      this.#document = null;
      this.#scale = 0;
      this._zoomFactor = 0;
      this.#currentIndex = 0;
      this.#renderQueue = [];
      this.#visibleQueueLength = 0;
      this.#renderingPage = null;
      this.#idle = true;
      this.#pinnedPage = 0;
      this.#pendingPage = 0;
      this.#pageSizesLoaded = true;
      cancelAnimationFrame(this.#relayoutFrame);
      this.#relayoutFrame = 0;
      this.$.pages.replaceChildren();
      this.$.content.scrollTop = 0;
      this.#savedScroll = { top: 0, left: 0 };

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
     * Sets the current page without scrolling to it.
     * @private
     */
    #setPageFromViewer(page) {
      this.#scrolledPage = page;
      this.page = page;
    }

    /**
     * Whether the viewer has a size, so that pages can be laid out. It has
     * none e.g. inside a hidden tab.
     * @private
     */
    #hasLayout() {
      const { content } = this.$;
      return content.clientWidth > 0 && content.clientHeight > 0;
    }

    /**
     * Returns the size that pages can use inside the scrollable content area.
     * @private
     */
    #getAvailableSize() {
      const { content } = this.$;
      const style = getComputedStyle(content);
      return {
        width: content.clientWidth - parseFloat(style.paddingInlineStart) - parseFloat(style.paddingInlineEnd),
        height: content.clientHeight - parseFloat(style.paddingBlockStart) - parseFloat(style.paddingBlockEnd),
      };
    }

    /**
     * Returns the scale for the current `zoom`, or 0 when the viewer has no layout.
     * @private
     */
    #computeScale() {
      const { width, height } = this.#getAvailableSize();
      if (!this.#hasLayout() || width <= 0 || height <= 0) {
        return 0;
      }

      let zoom = this.zoom;
      if (zoom !== 'page-width' && zoom !== 'page-fit' && !(Number(zoom) > 0)) {
        issueWarning(`Invalid zoom value "${zoom}" for <vaadin-pdf-viewer>, using "page-width" instead.`);
        zoom = 'page-width';
      }

      if (zoom === 'page-width' || zoom === 'page-fit') {
        // Fit the first page, so that the scale does not depend on which page is
        // current. In most documents all pages have the size of the first one.
        const page = this.#pages[0];
        const widthScale = width / page.unscaledWidth;
        return zoom === 'page-width' ? widthScale : Math.min(widthScale, height / page.unscaledHeight);
      }

      return Number(zoom) * PDF_TO_CSS_UNITS;
    }

    /**
     * Applies the scale for the current `zoom` and size to the pages. Returns
     * whether the pages are laid out with a new scale.
     * @private
     */
    #updateScale() {
      if (!this.#pages.length) {
        return false;
      }

      const scale = this.#computeScale();
      if (scale <= 0 || scale === this.#scale) {
        return false;
      }

      this.#applyScale(scale);
      return true;
    }

    /**
     * Resizes the pages to the given scale, keeping the same point of the
     * current page in the middle of the view, then renders what is visible.
     * @private
     */
    #applyScale(scale) {
      const { content } = this.$;

      if (!this.#hasLayout()) {
        // Page sizes arrived while the viewer is hidden. Positions cannot be
        // measured now, so go back to the current page once shown again.
        this.#scale = scale;
        this.#pages.forEach((page) => page.setScale(scale));
        this.#pendingPage ||= this.page;
        this.#renderNext();
        return;
      }

      const isFirstLayout = this.#scale === 0;
      const anchor = isFirstLayout ? null : this.#captureAnchor();

      this.#scale = scale;
      this._zoomFactor = scale / PDF_TO_CSS_UNITS;
      this.#renderingPage?.cancel();
      this.#pages.forEach((page) => page.setScale(scale));
      this.#idle = false;

      if (anchor) {
        this.#restoreAnchor(anchor);
      } else {
        content.scrollTop = 0;
      }

      if (this.#pendingPage) {
        // A page set before the pages could be laid out
        this.#scrollToPage(this.#pendingPage);
      } else {
        this.#pendingPage = 0;
        this.#updateVisiblePages();
      }
    }

    /**
     * Returns the point of the current page that is in the middle of the view,
     * relative to the size of the page.
     * @private
     */
    #captureAnchor() {
      const page = this.#pages[this.#currentIndex];
      const pageRect = page.element.getBoundingClientRect();
      const contentRect = this.$.content.getBoundingClientRect();
      return {
        page,
        x: (contentRect.left + contentRect.width / 2 - pageRect.left) / pageRect.width,
        y: (this.$.content.scrollTop - page.element.offsetTop) / page.height,
      };
    }

    /**
     * Scrolls so that the anchor point of the page is in the same place again.
     * Pages that fit the width of the view are centered.
     * @private
     */
    #restoreAnchor({ page, x, y }) {
      const { content } = this.$;
      content.scrollTop = page.element.offsetTop + y * page.height;

      // Work with rectangles, so that the same code works for any scroll
      // direction (scrollLeft is 0 or negative in RTL).
      const pageRect = page.element.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();
      const ratio = pageRect.width <= content.clientWidth ? 0.5 : x;
      content.scrollLeft += pageRect.left + ratio * pageRect.width - (contentRect.left + content.clientWidth / 2);
    }

    /** @private */
    #scrollToPage(page) {
      if (!this.#hasLayout() || this.#scale <= 0) {
        // Scroll once the pages can be laid out.
        this.#pendingPage = page;
        this.#renderNext();
        return;
      }
      this.#pendingPage = 0;
      this.#idle = false;

      const { content } = this.$;
      if (!Number.isInteger(page) || page < 1 || page > this.#pages.length) {
        issueWarning(
          `The page ${page} is out of range for <vaadin-pdf-viewer>, the document has ${this.#pages.length} pages.`,
        );
      } else {
        content.scrollTop =
          this.#pages[page - 1].element.offsetTop - parseFloat(getComputedStyle(content).paddingBlockStart);
        this.#scrolledPage = page;
      }

      // Keep the page as set until the user scrolls, also when it is out of range.
      this.#pinnedPage = page;
      this.#pinnedScrollTop = content.scrollTop;
      this.#updateVisiblePages();
    }

    /** @private */
    #onScroll() {
      if (this.#scrollFrame) {
        return;
      }
      this.#scrollFrame = requestAnimationFrame(() => {
        this.#scrollFrame = 0;
        this.#updateVisiblePages();
      });
    }

    /**
     * Finds the visible pages, updates the current page, and renders the
     * pages that are visible or about to become visible.
     * @private
     */
    #updateVisiblePages() {
      const pages = this.#pages;
      // Without layout, all pages have no position, so nothing can be visible.
      if (!pages.length || this.#scale <= 0 || !this.#hasLayout()) {
        this.#renderQueue = [];
        this.#renderNext();
        return;
      }

      const { content } = this.$;
      const viewTop = content.scrollTop;
      const viewBottom = viewTop + content.clientHeight;
      this.#savedScroll = { top: viewTop, left: content.scrollLeft };

      // Binary search for the first page that ends below the top of the view.
      let low = 0;
      let high = pages.length - 1;
      while (low < high) {
        const middle = (low + high) >> 1;
        const { offsetTop, offsetHeight } = pages[middle].element;
        if (offsetTop + offsetHeight <= viewTop) {
          low = middle + 1;
        } else {
          high = middle;
        }
      }

      const visible = [];
      for (let index = low; index < pages.length; index++) {
        const { offsetTop, offsetHeight } = pages[index].element;
        if (offsetTop >= viewBottom) {
          break;
        }
        visible.push({ index, height: Math.min(viewBottom, offsetTop + offsetHeight) - Math.max(viewTop, offsetTop) });
      }
      if (!visible.length) {
        visible.push({ index: low, height: 0 });
      }

      this.#updateCurrentPage(visible);

      const first = visible[0].index;
      const last = visible[visible.length - 1].index;
      const byVisibility = [...visible].sort((a, b) => b.height - a.height).map(({ index }) => pages[index]);
      const ahead = [];
      for (let distance = 1; distance <= RENDER_AHEAD; distance++) {
        ahead.push(pages[last + distance], pages[first - distance]);
      }
      this.#renderQueue = [...byVisibility, ...ahead.filter(Boolean)];
      this.#visibleQueueLength = byVisibility.length;

      this.#releaseCanvases(first, last);
      this.#renderNext();
    }

    /** @private */
    #updateCurrentPage(visible) {
      // The page that takes up most of the view. The first one wins a tie.
      const mostVisible = visible.reduce((result, item) => (item.height > result.height ? item : result));
      this.#currentIndex = mostVisible.index;

      // Keep a page that was scrolled to as long as the view has not moved.
      // E.g. the last page cannot always be scrolled to the top of the view.
      const pinned = this.#pinnedPage;
      if (pinned && Math.abs(this.$.content.scrollTop - this.#pinnedScrollTop) < 1) {
        if (pinned >= 1 && pinned <= this.#pages.length) {
          this.#currentIndex = pinned - 1;
        }
        return;
      }
      this.#pinnedPage = 0;

      const page = mostVisible.index + 1;
      if (page !== this.page) {
        this.#setPageFromViewer(page);
      }
    }

    /**
     * Frees the canvases of pages that are far from the view, and of the
     * pages furthest away when the canvases use too much memory in total.
     * @private
     */
    #releaseCanvases(first, last) {
      const distance = (index) => (index < first ? first - index : Math.max(0, index - last));
      const rendered = this.#pages.filter((page) => page.canvas);
      rendered.sort((a, b) => distance(b.pageNumber - 1) - distance(a.pageNumber - 1));

      let totalPixels = this.#getTotalCanvasPixels();
      rendered.forEach((page) => {
        const pageDistance = distance(page.pageNumber - 1);
        if (pageDistance > KEEP_RENDERED || (pageDistance > 0 && totalPixels > MAX_TOTAL_CANVAS_PIXELS)) {
          totalPixels -= page.canvasPixels;
          page.release();
        }
      });
    }

    /**
     * Renders the next page in the render queue that is not rendered yet,
     * one page at a time.
     * @private
     */
    #renderNext() {
      if (this.#renderingPage) {
        return;
      }

      const outputScale = window.devicePixelRatio || 1;
      const index = this.#renderQueue.findIndex((item) => !item.isRendered(outputScale) && !item.renderFailed);
      const page = this.#renderQueue[index];
      // Render pages ahead of the view only while memory allows it.
      const isAhead = index >= this.#visibleQueueLength;
      if (!page || (isAhead && this.#getTotalCanvasPixels() > MAX_TOTAL_CANVAS_PIXELS - MAX_CANVAS_PIXELS)) {
        this.#notifyIdle();
        return;
      }

      this.#renderingPage = page;
      this.#idle = false;
      this.#renderPage(page, outputScale).finally(() => {
        if (this.#renderingPage === page) {
          this.#renderingPage = null;
          this.#renderNext();
        }
      });
    }

    /** @private */
    async #renderPage(page, outputScale) {
      const loadId = this.#loadId;
      try {
        if (!page.pdfPage) {
          const pdfPage = await this.#document.getPage(page.pageNumber);
          if (loadId !== this.#loadId) {
            return;
          }
          if (page.setPdfPage(pdfPage)) {
            this.#scheduleRelayout();
          }
        }
        await page.render(outputScale);
      } catch (error) {
        if (loadId === this.#loadId && error && error.name !== 'RenderingCancelledException') {
          page.renderFailed = true;
          issueWarning(`Failed to render page ${page.pageNumber} of the PDF document: ${error.message}`);
        }
      }
    }

    /** @private */
    #getTotalCanvasPixels() {
      return this.#pages.reduce((total, page) => total + page.canvasPixels, 0);
    }

    /** @private */
    #notifyIdle() {
      // The layout is not final while pages get their own sizes.
      if (!this.#idle && this.#pageSizesLoaded) {
        this.#idle = true;
        /** @internal to not document it in CEM */
        this.dispatchEvent(new CustomEvent('render-idle'));
      }
    }

    /** @private */
    #watchPixelRatio() {
      this.#unwatchPixelRatio();
      this.#pixelRatioQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`);
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
      if (this.#pages.length) {
        this.#idle = false;
      }
      this.#updateVisiblePages();
    };
  };
