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
import { PdfViewerPage } from './pdf-viewer-page.js';
import { acquireWorker, loadPdfjs, releaseWorker } from './pdfjs-loader.js';

/** PDF units are points (1/72 inch), CSS pixels are 1/96 inch. */
const PDF_TO_CSS_UNITS = 96 / 72;

/** The number of pages before and after the visible ones that are rendered in advance. */
const RENDER_AHEAD = 1;

/** The number of pages before and after the visible ones that keep their canvas. */
const KEEP_RENDERED = 2;

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

    /** @type {PdfViewerPage[]} */
    #pages = [];

    /** The scale of the pages in CSS pixels per PDF unit, or 0 before the pages are laid out. */
    #scale = 0;

    /** The pages to render, in order of priority. */
    #renderQueue = [];

    /** @type {PdfViewerPage | null} */
    #renderingPage = null;

    /** Whether the viewer is known to have nothing left to render. */
    #idle = true;

    /** The last page that the viewer set from scrolling, to not scroll to it again. */
    #scrolledPage = 1;

    /** A page that was scrolled to, kept as the current page while it is visible. */
    #pinnedPage = 0;

    #scrollFrame = 0;

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
        this.#updateScale();
      }

      if (props.has('page') && this.page !== this.#scrolledPage && this.#scale > 0) {
        this.#scrollToPage(this.page);
      }
    }

    /**
     * Override method from `ResizeMixin` to fit the pages to the new size.
     * @protected
     * @override
     */
    _onResize() {
      if (!this.#updateScale()) {
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
      let pdfPages;
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

        const [{ info }, ...pages] = await Promise.all([
          pdfDocument.getMetadata(),
          ...Array.from({ length: pdfDocument.numPages }, (_, index) => pdfDocument.getPage(index + 1)),
        ]);
        if (loadId !== this.#loadId) {
          return;
        }
        title = (info && info.Title) || '';
        pdfPages = pages;
      } catch (error) {
        if (loadId === this.#loadId) {
          this.#unload();
          this.#onLoadError(error);
        }
        return;
      }

      this.#pages = pdfPages.map((pdfPage) => new PdfViewerPage(pdfPage));
      this.$.pages.replaceChildren(...this.#pages.map((page) => page.element));
      this._setPageCount(pdfDocument.numPages);
      this.__loading = false;
      this.#idle = false;

      if (!this.#updateScale()) {
        this.#updateVisiblePages();
      }

      this.dispatchEvent(new CustomEvent('document-load', { detail: { pageCount: pdfDocument.numPages, title } }));
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
      this.#scale = 0;
      this.#renderQueue = [];
      this.#renderingPage = null;
      this.#pinnedPage = 0;
      this.$.pages.replaceChildren();
      this.$.content.scrollTop = 0;

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
      // Nothing to lay out while the viewer has no size, e.g. inside a hidden tab.
      if (width <= 0 || height <= 0) {
        return 0;
      }

      let zoom = this.zoom;
      if (zoom !== 'page-width' && zoom !== 'page-fit' && !(Number(zoom) > 0)) {
        issueWarning(`Invalid zoom value "${zoom}" for <vaadin-pdf-viewer>, using "page-width" instead.`);
        zoom = 'page-width';
      }

      if (zoom === 'page-width' || zoom === 'page-fit') {
        const page = this.#pages[this.page - 1] || this.#pages[0];
        const widthScale = width / page.unscaledWidth;
        return zoom === 'page-width' ? widthScale : Math.min(widthScale, height / page.unscaledHeight);
      }

      return Number(zoom) * PDF_TO_CSS_UNITS;
    }

    /**
     * Applies the scale for the current `zoom` and size to the pages, keeping
     * the same part of the current page in view. Returns whether the pages are
     * laid out with a new scale.
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

      const { content } = this.$;
      const anchorPage = this.#scale > 0 ? this.#pages[this.#getCurrentPageIndex()] : null;
      const offsetInPage = anchorPage ? (content.scrollTop - anchorPage.element.offsetTop) / anchorPage.height : 0;
      const horizontalCenter = content.scrollWidth
        ? (content.scrollLeft + content.clientWidth / 2) / content.scrollWidth
        : 0.5;

      const isFirstLayout = this.#scale === 0;
      this.#scale = scale;
      this.#renderingPage?.cancel();
      this.#pages.forEach((page) => page.setScale(scale));
      this.#idle = false;

      if (anchorPage) {
        content.scrollTop = anchorPage.element.offsetTop + offsetInPage * anchorPage.height;
        content.scrollLeft = horizontalCenter * content.scrollWidth - content.clientWidth / 2;
      } else if (isFirstLayout && this.page !== 1) {
        // A page set before the pages could be laid out
        this.#scrollToPage(this.page);
        return true;
      }

      this.#updateVisiblePages();
      return true;
    }

    /**
     * Returns the index of the page that `page` refers to, falling back to the first page.
     * @private
     */
    #getCurrentPageIndex() {
      const index = this.page - 1;
      return index >= 0 && index < this.#pages.length ? index : 0;
    }

    /** @private */
    #scrollToPage(page) {
      if (!Number.isInteger(page) || page < 1 || page > this.#pages.length) {
        issueWarning(
          `The page ${page} is out of range for <vaadin-pdf-viewer>, the document has ${this.#pages.length} pages.`,
        );
        return;
      }

      const { content } = this.$;
      content.scrollTop =
        this.#pages[page - 1].element.offsetTop - parseFloat(getComputedStyle(content).paddingBlockStart);
      this.#scrolledPage = page;
      this.#pinnedPage = page;
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
      if (!pages.length || this.#scale <= 0) {
        this.#renderQueue = [];
        this.#renderNext();
        return;
      }

      const { content } = this.$;
      const viewTop = content.scrollTop;
      const viewBottom = viewTop + content.clientHeight;

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

      pages.forEach((page, index) => {
        if (page.canvas && (index < first - KEEP_RENDERED || index > last + KEEP_RENDERED)) {
          page.release();
        }
      });

      this.#renderNext();
    }

    /** @private */
    #updateCurrentPage(visible) {
      const pinned = this.#pinnedPage;
      if (pinned && visible.some(({ index }) => index === pinned - 1)) {
        return;
      }
      this.#pinnedPage = 0;

      // The page that takes up most of the view. The first one wins a tie.
      const mostVisible = visible.reduce((result, item) => (item.height > result.height ? item : result));
      const page = mostVisible.index + 1;
      if (page !== this.page) {
        this.#setPageFromViewer(page);
      }
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
      const page = this.#renderQueue.find((item) => !item.isRendered(outputScale) && !item.renderFailed);
      if (!page) {
        this.#notifyIdle();
        return;
      }

      this.#renderingPage = page;
      this.#idle = false;
      page
        .render(outputScale)
        .catch((error) => {
          if (error && error.name !== 'RenderingCancelledException') {
            page.renderFailed = true;
            issueWarning(`Failed to render page ${page.pageNumber} of the PDF document: ${error.message}`);
          }
        })
        .finally(() => {
          if (this.#renderingPage === page) {
            this.#renderingPage = null;
            this.#renderNext();
          }
        });
    }

    /** @private */
    #notifyIdle() {
      if (!this.#idle) {
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
      this.#idle = false;
      this.#updateVisiblePages();
    };
  };
