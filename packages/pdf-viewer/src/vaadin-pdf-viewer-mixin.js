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
import { isSafari } from '@vaadin/component-base/src/browser-utils.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
import { issueWarning } from '@vaadin/component-base/src/warnings.js';
import { PdfViewerDocumentController } from './pdf-viewer-document-controller.js';
import { PdfViewerPage } from './pdf-viewer-page.js';
import { PdfViewerRenderQueue } from './pdf-viewer-render-queue.js';

/** The number of pages whose size is requested at a time after loading. */
const PAGE_SIZE_BATCH = 10;

/** The duration of smooth scrolling in milliseconds, short so that moving between places stays fast. */
const SMOOTH_SCROLL_DURATION = 150;

/**
 * Returns the last part of the path of a URL, e.g. the file name of
 * `/files/report.pdf`, or null for URLs without one, e.g. blob URLs.
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
    return decodeURIComponent(pathname.split('/').pop()) || null;
  } catch {
    return null;
  }
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

        /**
         * The name of the document file. When set, the viewer uses it as the
         * name of the document, e.g. as its accessible name. Otherwise the
         * viewer uses the title of the document when the document asks for
         * it, then the last part of the path of `src`, then the title of the
         * document.
         *
         * @attr {string} file-name
         */
        fileName: {
          type: String,
        },
        /**
         * The reason why the document could not be loaded, or undefined.
         * @type {'invalid' | 'network' | 'password' | undefined}
         * @protected
         */
        _errorReason: {
          type: String,
          attribute: false,
        },

        /**
         * Whether the document is loading.
         * @protected
         */
        _loading: {
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

    /** The title of the loaded document, or an empty string. */
    #documentTitle = '';

    /** Whether the loaded document asks viewers to show its title instead of the file name. */
    #displayDocTitle = false;

    /** The accessible name the viewer set on itself, to know it can replace it. */
    #ownAccessibleName = null;

    /** @type {PdfViewerPage[]} */
    #pages = [];

    /** The scale of the pages in CSS pixels per PDF unit, or 0 before the pages are laid out. */
    #scale = 0;

    /** The index of the page that takes up most of the view, updated with the visible pages. */
    #currentIndex = 0;

    /** Whether the viewer has rendered everything that an action (load, resize, page change) asked for. */
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

    #smoothScrollFrame = 0;

    /** @type {ResizeObserver | null} */
    #contentObserver = null;

    /** The scroll position while the viewer had a size, to restore it when shown again. */
    #savedScroll = { top: 0, left: 0 };

    #hadLayout = false;

    #relayoutFrame = 0;

    #resizeFrame = 0;

    /** Whether all pages have their own size, see `#loadPageSizes()`. */
    #pageSizesLoaded = true;

    /** @type {MediaQueryList | null} */
    #pixelRatioQuery = null;

    /** Incremented on every unload, to detect results that belong to an outdated document. */
    #loadId = 0;

    #renderQueue = new PdfViewerRenderQueue({
      renderPage: (page, outputScale) => this.#renderPage(page, outputScale),
      releasePage: (page) => this.#releasePage(page),
      onIdle: () => this.#notifyIdle(),
    });

    #documentController = new PdfViewerDocumentController(this, {
      onLoadStart: () => {
        this._loading = true;
      },
      onLoad: (pdfDocument, details) => this.#onLoad(pdfDocument, details),
      onError: (error, reason) => this.#onError(error, reason),
      onUnload: () => this.#onUnload(),
    });

    /**
     * Override method from `HTMLElement` to observe the size of the pages area
     * and the device pixel ratio.
     * @protected
     * @override
     */
    connectedCallback() {
      super.connectedCallback();

      this.#watchPixelRatio();
      // The pages area also changes size without the host, e.g. when the sidebar opens.
      if (this.#contentObserver) {
        this.#contentObserver.observe(this.$.content);
      }
    }

    /**
     * Override method from `HTMLElement` to stop observing.
     * @protected
     * @override
     */
    disconnectedCallback() {
      super.disconnectedCallback();

      this.#unwatchPixelRatio();
      this.#contentObserver?.disconnect();
      cancelAnimationFrame(this.#scrollFrame);
      this.#scrollFrame = 0;
      cancelAnimationFrame(this.#resizeFrame);
      this.#resizeFrame = 0;
      this.#cancelSmoothScroll();
    }

    /**
     * Override method from `LitElement` to set the default role, to add the
     * controller that loads the document, and to add the listeners of the
     * pages area.
     * @protected
     * @override
     */
    firstUpdated() {
      super.firstUpdated();

      if (!this.hasAttribute('role')) {
        this.setAttribute('role', 'region');
      }

      this.addController(this.#documentController);

      this.$.content.addEventListener('scroll', () => this.#onScroll(), { passive: true });
      this.#contentObserver = new ResizeObserver(() => this.#onContentResize());
      this.#contentObserver.observe(this.$.content);
      this.$.content.addEventListener('keydown', (event) => this.#onContentKeyDown(event));
      this.addEventListener('keydown', (event) => this.#onKeyDown(event));
    }

    /**
     * Override method from `LitElement` to load the document, and to apply
     * changes to the page, the name and the localization.
     * @protected
     * @override
     */
    updated(props) {
      super.updated(props);

      if (props.has('__effectiveI18n')) {
        this.#updatePageLabels();
      }

      if (props.has('__effectiveI18n') || props.has('fileName')) {
        this._updateAccessibleName();
      }

      // A new document starts from the first page, unless a page is set together with it.
      if (props.has('src') && !props.has('page')) {
        this.#setPageFromViewer(1);
      }

      if (props.has('src')) {
        this.#documentController.load();
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
     * The loaded document, or null.
     * @return {import('pdfjs-dist').PDFDocumentProxy | null}
     * @protected
     */
    get _pdfDocument() {
      return this.#pdfDocument;
    }

    /**
     * Goes to the given page, for page changes caused by the user through
     * the viewer's own controls.
     * @param {number} page
     * @protected
     */
    _goToPage(page) {
      this.page = page;
    }

    /**
     * Returns the view of a page of the loaded document.
     * @param {number} pageNumber
     * @return {PdfViewerPage | undefined}
     * @protected
     */
    _getPageView(pageNumber) {
      return this.#pages[pageNumber - 1];
    }

    /**
     * Finds the visible pages again and renders the ones that are not
     * rendered at the current scale and device pixel ratio.
     * @protected
     */
    _requestRender() {
      if (this.#pages.length) {
        this.#idle = false;
      }
      this.#updateVisiblePages();
    }

    /**
     * Scrolls the pages so that the given client rectangle is in the middle
     * of the view, unless it is well inside the view already.
     * @param {DOMRect} rect
     * @param {{ topInset?: number, smooth?: boolean }} [options]
     *   `topInset`: the height at the top of the view that is covered, e.g. by the find bar.
     *   `smooth`: whether to scroll smoothly. Only short distances are scrolled smoothly.
     * @protected
     */
    _scrollRectIntoView(rect, { topInset = 0, smooth = false } = {}) {
      const { content } = this.$;
      const view = content.getBoundingClientRect();
      const top = view.top + Math.min(topInset, content.clientHeight / 2);
      const height = view.top + content.clientHeight - top;
      // Also scroll when the rectangle is close to an edge, where it is easy to miss.
      const margin = Math.min(64, height / 4);
      let deltaY = 0;
      let deltaX = 0;
      if (rect.top < top + margin || rect.bottom > top + height - margin) {
        deltaY = rect.top + rect.height / 2 - (top + height / 2);
      }
      if (rect.left < view.left || rect.right > view.left + content.clientWidth) {
        deltaX = rect.left + rect.width / 2 - (view.left + content.clientWidth / 2);
      }
      this.#scrollBy(deltaX, deltaY, smooth);
    }

    /**
     * Returns the name of the loaded document to show to the user: the
     * `fileName`, then the title of the document when the document asks for
     * it, then the last part of the path of `src`, then the title of the
     * document. Returns an empty string when the document has none.
     * Unlike `_getFileName()`, it can put the title before the path, as a
     * shown name may have characters that file names cannot have.
     * @return {string}
     * @protected
     */
    _getDocumentName() {
      return (
        this.fileName ||
        (this.#displayDocTitle && this.#documentTitle) ||
        getFileNameFromUrl(this.src) ||
        this.#documentTitle ||
        ''
      );
    }

    /**
     * Returns the name to save the document under: the `fileName` as is, else
     * the last part of the path of `src`, else the title of the document, else
     * `document`, with `.pdf` added when missing. Unlike the document name,
     * the title only comes after the path, as it can have characters that
     * file names cannot have.
     * @return {string}
     * @protected
     */
    _getFileName() {
      if (this.fileName) {
        return this.fileName;
      }
      const name = getFileNameFromUrl(this.src) || this.#documentTitle || 'document';
      return /\.pdf$/iu.test(name) ? name : `${name}.pdf`;
    }

    /**
     * Returns the accessible name of the viewer while a document is loaded,
     * or an empty string to use the localized fallback name.
     * @return {string}
     * @protected
     */
    _getAccessibleName() {
      return this._getDocumentName();
    }

    /**
     * Sets the accessible name of the viewer from `_getAccessibleName()` while a
     * document is loaded, and removes it otherwise. Keeps an accessible name
     * that the application has set.
     * @protected
     */
    _updateAccessibleName() {
      const hasOwnName =
        this.#ownAccessibleName !== null && this.getAttribute('aria-label') === this.#ownAccessibleName;
      if (!hasOwnName && (this.hasAttribute('aria-labelledby') || this.hasAttribute('aria-label'))) {
        return;
      }
      if (this.#pdfDocument) {
        this.#ownAccessibleName = this._getAccessibleName() || this.__effectiveI18n.document;
        this.setAttribute('aria-label', this.#ownAccessibleName);
      } else {
        if (hasOwnName) {
          this.removeAttribute('aria-label');
        }
        this.#ownAccessibleName = null;
      }
    }

    /**
     * Called when a page has been rendered.
     * @param {PdfViewerPage} _page
     * @protected
     */
    _pageRendered(_page) {}

    /**
     * Called when the document is unloaded, e.g. before another one loads.
     * @protected
     */
    _documentUnloaded() {}

    /** @private */
    #onLoad(pdfDocument, { title, displayDocTitle, firstPage }) {
      // All pages start with the size of the first page, and get their own
      // size as they load in the background. This shows the document without
      // waiting for every page of a long document.
      this.#pdfDocument = pdfDocument;
      const size = firstPage.getViewport({ scale: 1 });
      this.#pages = Array.from({ length: pdfDocument.numPages }, (_, index) => new PdfViewerPage(index + 1, size));
      this.#updatePageLabels();
      this.#pages[0].setPdfPage(firstPage);
      this.$.pages.replaceChildren(...this.#pages.map((page) => page.element));
      this.#renderQueue.setPages(this.#pages);
      this._setPageCount(pdfDocument.numPages);
      this._loading = false;
      this.#idle = false;
      this.#pendingPage = this.page;

      // Rendering waits for the page sizes, see #notifyIdle().
      this.#pageSizesLoaded = false;
      this.#refresh();
      const loadId = this.#loadId;
      this.#loadPageSizes(loadId).catch((error) => {
        if (loadId === this.#loadId) {
          issueWarning(`Failed to load the page sizes of the PDF document: ${error.message}`);
        }
      });
      this.#documentTitle = title;
      this.#displayDocTitle = displayDocTitle;
      this._updateAccessibleName();

      this.dispatchEvent(new CustomEvent('document-load', { detail: { pageCount: pdfDocument.numPages, title } }));
    }

    /** @private */
    #onError(error, reason) {
      this.__hasError = true;
      this._errorReason = reason;

      const i18n = this.__effectiveI18n;
      announce(reason === 'password' ? i18n.passwordError : i18n.loadError, { mode: 'alert' });

      this.dispatchEvent(new CustomEvent('document-error', { detail: { reason, error } }));
    }

    /** @private */
    #onUnload() {
      this._loading = false;
      this.__hasError = false;
      this._errorReason = undefined;
      this.#loadId += 1;

      this.#cancelSmoothScroll();
      if (this.#pdfDocument) {
        this._documentUnloaded();
      }
      this.#pages.forEach((page) => page.release());
      this.#pages = [];
      this.#pdfDocument = null;
      this.#documentTitle = '';
      this.#displayDocTitle = false;
      this._setPageCount(0);
      this.#scale = 0;
      this.#currentIndex = 0;
      this.#renderQueue.setPages([]);
      this.#idle = true;
      this.#pinnedPage = 0;
      this.#pendingPage = 0;
      this.#pageSizesLoaded = true;
      cancelAnimationFrame(this.#relayoutFrame);
      this.#relayoutFrame = 0;
      this.$.pages.replaceChildren();
      this.$.content.scrollTop = 0;
      this.#savedScroll = { top: 0, left: 0 };
      this._updateAccessibleName();
    }

    /**
     * Loads the pages after the first one, and corrects their size.
     * @private
     */
    async #loadPageSizes(loadId) {
      const pdfDocument = this.#pdfDocument;
      const pages = this.#pages.slice(1);
      // Request a few pages at a time, so that requests for pages to
      // render do not wait behind the requests for all page sizes.
      for (let start = 0; start < pages.length; start += PAGE_SIZE_BATCH) {
        const batch = pages.slice(start, start + PAGE_SIZE_BATCH);
        // A page that fails to load reports the error when it is rendered.
        await Promise.allSettled(
          batch.map((page) =>
            pdfDocument.getPage(page.pageNumber).then((pdfPage) => {
              if (loadId === this.#loadId && !page.pdfPage) {
                this.#setPdfPage(page, pdfPage);
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
        this.#renderQueue.renderNext();
      }
    }

    /**
     * Sets the loaded page of a page view, and lays out the pages again when
     * its size differs from the estimate.
     * @private
     */
    #setPdfPage(page, pdfPage) {
      const { unscaledWidth, unscaledHeight } = page;
      page.setPdfPage(pdfPage);
      if (page.unscaledWidth !== unscaledWidth || page.unscaledHeight !== unscaledHeight) {
        this.#scheduleRelayout();
      }
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
          this.#renderQueue.renderNext();
        }
      });
    }

    /**
     * Fits the pages to the new size of the content in the next frame. Fitting
     * them right away can make a scrollbar of the content appear or disappear,
     * which resizes the content again before the observer can be notified.
     * @private
     */
    #onContentResize() {
      if (this.#resizeFrame) {
        return;
      }
      this.#resizeFrame = requestAnimationFrame(() => {
        this.#resizeFrame = 0;
        this._onResize();
      });
    }

    /**
     * Applies changes to the size, and scrolls to a page that was set while
     * the pages could not be laid out.
     * @private
     */
    #refresh() {
      const scale = this.#pages.length ? this.#computeScale() : 0;
      if (scale > 0 && scale !== this.#scale) {
        this.#applyScale(scale);
        return;
      }
      if (this.#pendingPage && this.#scale > 0) {
        this.#scrollToPage(this.#pendingPage);
      } else {
        this.#updateVisiblePages();
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
        width:
          content.clientWidth - Number.parseFloat(style.paddingInlineStart) - Number.parseFloat(style.paddingInlineEnd),
        height:
          content.clientHeight - Number.parseFloat(style.paddingBlockStart) - Number.parseFloat(style.paddingBlockEnd),
      };
    }

    /**
     * Returns the scale that fits the width of the first page to the viewer,
     * or 0 when the viewer has no layout.
     * @private
     */
    #computeScale() {
      const { width, height } = this.#getAvailableSize();
      if (!this.#hasLayout() || width <= 0 || height <= 0) {
        return 0;
      }

      // Fit the first page, so that the scale does not depend on which page is
      // current. In most documents all pages have the size of the first one.
      return width / this.#pages[0].unscaledWidth;
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
        this.#renderQueue.renderNext();
        return;
      }

      const isFirstLayout = this.#scale === 0;
      const anchor = isFirstLayout ? null : this.#captureAnchor(null);

      this.#scale = scale;
      this.#renderQueue.cancel();
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
     * Returns where a point of a page is, relative to the size of the page,
     * and where it is in the view. The point is the given client point, or
     * the middle of the top of the view on the current page.
     * @param {{ x: number, y: number } | null} point
     * @private
     */
    #captureAnchor(point) {
      const { content } = this.$;
      const contentRect = content.getBoundingClientRect();
      // The middle of the visible area, which excludes a vertical scrollbar
      // (on the left in RTL, where clientLeft includes it).
      const viewX = point ? point.x - contentRect.left : content.clientLeft + content.clientWidth / 2;
      const viewY = point ? point.y - contentRect.top : 0;
      const page = point ? this.#getPageAt(content.scrollTop + viewY) : this.#pages[this.#currentIndex];
      const pageRect = page.element.getBoundingClientRect();
      return {
        page,
        x: (contentRect.left + viewX - pageRect.left) / pageRect.width,
        y: (content.scrollTop + viewY - page.element.offsetTop) / page.height,
        viewX,
        viewY,
        keepX: !!point,
      };
    }

    /**
     * Scrolls so that the anchor point of the page is in the same place of the
     * view again. Pages that fit the width of the view are centered, unless
     * the point is a given one.
     * @private
     */
    #restoreAnchor({ page, x, y, viewX, viewY, keepX, target }) {
      const { content } = this.$;
      this.#cancelSmoothScroll();
      if (target) {
        // A given point of the view, e.g. between the fingers at the end of a pinch
        const rect = content.getBoundingClientRect();
        viewX = target.x - rect.left;
        viewY = target.y - rect.top;
      }
      content.scrollTop = page.element.offsetTop + y * page.height - viewY;

      // Work with rectangles, so that the same code works for any scroll
      // direction (scrollLeft is 0 or negative in RTL).
      const pageRect = page.element.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();
      const ratio = !keepX && pageRect.width <= content.clientWidth ? 0.5 : x;
      content.scrollLeft += pageRect.left + ratio * pageRect.width - (contentRect.left + viewX);
    }

    /**
     * Returns the page at the given position from the top of the scrolled content.
     * @private
     */
    #getPageAt(top) {
      const page = this.#pages.find(({ element }) => top < element.offsetTop + element.offsetHeight);
      return page || this.#pages[this.#pages.length - 1];
    }

    /**
     * Scrolls to the start of a page, or to a position on it given in PDF
     * units from the bottom of the page, like in link destinations.
     * @private
     */
    #scrollToPage(page, top) {
      if (!this.#hasLayout() || this.#scale <= 0) {
        // Scroll once the pages can be laid out.
        this.#pendingPage = page;
        this.#renderQueue.renderNext();
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
        const pageView = this.#pages[page - 1];
        let offset = -Number.parseFloat(getComputedStyle(content).paddingBlockStart);
        if (top !== undefined) {
          offset = pageView.pdfPage
            ? pageView.pdfPage.getViewport({ scale: this.#scale }).convertToViewportPoint(0, top)[1]
            : (pageView.unscaledHeight - top) * this.#scale;
        }
        this.#cancelSmoothScroll();
        content.scrollTop = pageView.element.offsetTop + (top === undefined ? offset : Math.max(offset, 0));
        this.#scrolledPage = page;
      }

      // Keep the page as set until the user scrolls, also when it is out of range.
      this.#pinnedPage = page;
      this.#pinnedScrollTop = content.scrollTop;
      this.#updateVisiblePages();
    }

    /**
     * Scrolls the pages by the given distance, smoothly when asked and the
     * distance is at most two views, so that the pages in between are not
     * rendered on the way. Not smoothly when the user prefers reduced motion.
     * @private
     */
    #scrollBy(deltaX, deltaY, smooth) {
      const { content } = this.$;
      this.#cancelSmoothScroll();
      const isShort = Math.abs(deltaY) <= content.clientHeight * 2 && Math.abs(deltaX) <= content.clientWidth * 2;
      if (!smooth || !isShort || document.hidden || matchMedia('(prefers-reduced-motion: reduce)').matches) {
        content.scrollTop += deltaY;
        content.scrollLeft += deltaX;
        return;
      }
      const start = { time: 0, top: content.scrollTop, left: content.scrollLeft };
      let last = { top: content.scrollTop, left: content.scrollLeft };
      const step = (time) => {
        // The time of the first frame, which can be before the time of the event that started scrolling
        start.time ||= time;
        // Stop when something else scrolled meanwhile, e.g. going to a page.
        if (Math.abs(content.scrollTop - last.top) > 1 || Math.abs(content.scrollLeft - last.left) > 1) {
          this.#smoothScrollFrame = 0;
          return;
        }
        const progress = Math.min((time - start.time) / SMOOTH_SCROLL_DURATION, 1);
        // Ease out, so that the scrolling starts fast and slows down at the end.
        const eased = 1 - (1 - progress) ** 3;
        content.scrollTop = start.top + deltaY * eased;
        content.scrollLeft = start.left + deltaX * eased;
        last = { top: content.scrollTop, left: content.scrollLeft };
        this.#smoothScrollFrame = progress < 1 ? requestAnimationFrame(step) : 0;
      };
      this.#smoothScrollFrame = requestAnimationFrame(step);
    }

    /** @private */
    #cancelSmoothScroll() {
      cancelAnimationFrame(this.#smoothScrollFrame);
      this.#smoothScrollFrame = 0;
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
        this.#renderQueue.clear();
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
      this.#renderQueue.update(visible);
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

    /** @private */
    async #renderPage(page, outputScale) {
      const loadId = this.#loadId;
      this.#idle = false;
      try {
        if (!page.pdfPage) {
          const pdfPage = await this.#pdfDocument.getPage(page.pageNumber);
          if (loadId !== this.#loadId) {
            return;
          }
          this.#setPdfPage(page, pdfPage);
        }
        await page.render(outputScale);
        // The page may have been released or unloaded meanwhile.
        if (loadId !== this.#loadId || !page.isRendered(outputScale)) {
          return;
        }
        this._pageRendered(page);
      } catch (error) {
        const isCancelled = error && (error.name === 'RenderingCancelledException' || error.name === 'AbortException');
        if (loadId === this.#loadId && !isCancelled) {
          page.renderFailed = true;
          issueWarning(`Failed to render page ${page.pageNumber} of the PDF document: ${error.message}`);
        }
      }
    }

    /**
     * Releases a page, moving focus from inside the page to the pages, so
     * that keyboard users stay in the viewer.
     * @private
     */
    #releasePage(page) {
      if (page.element.contains(this.shadowRoot.activeElement)) {
        // WebKit scrolls the focused scroll container despite preventScroll.
        const { content } = this.$;
        const { scrollTop, scrollLeft } = content;
        content.focus({ preventScroll: true });
        content.scrollTop = scrollTop;
        content.scrollLeft = scrollLeft;
      }
      page.release();
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

    /**
     * Labels the pages, so that assistive technology tells where pages start.
     * @private
     */
    #updatePageLabels() {
      const label = this.__effectiveI18n.pageLabel;
      this.#pages.forEach((page) => page.element.setAttribute('aria-label', label.replace('{page}', page.pageNumber)));
    }

    /**
     * Handles the keyboard shortcuts of the viewer.
     * @private
     */
    #onKeyDown(event) {
      const isShortcut = (event.ctrlKey || event.metaKey) && !event.altKey;
      if (!isShortcut || !this.#pages.length) {
        return;
      }

      if ((event.key === 'Home' || event.key === 'End') && event.composedPath().includes(this.$.content)) {
        this._goToPage(event.key === 'Home' ? 1 : this.#pages.length);
        event.preventDefault();
      }
    }

    /**
     * Scrolls the pages with the keyboard in Safari, which does not do it for
     * a focused scroll container.
     * @private
     */
    #onContentKeyDown(event) {
      // Other browsers scroll natively, which also keeps caret browsing (F7) working.
      if (!isSafari) {
        return;
      }
      // Shift with the arrow keys extends a text selection.
      const isSelecting = event.shiftKey && event.key !== ' ';
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || isSelecting) {
        return;
      }

      const { content } = this.$;
      const lineHeight = 40;
      const pageHeight = content.clientHeight * 0.9;
      const scrolls = {
        ArrowDown: { top: lineHeight },
        ArrowUp: { top: -lineHeight },
        ArrowRight: { left: lineHeight },
        ArrowLeft: { left: -lineHeight },
        PageDown: { top: pageHeight },
        PageUp: { top: -pageHeight },
        ' ': { top: event.shiftKey ? -pageHeight : pageHeight },
      };
      if (event.key === 'Home' || event.key === 'End') {
        content.scrollTop = event.key === 'Home' ? 0 : content.scrollHeight;
      } else if (scrolls[event.key]) {
        content.scrollBy(scrolls[event.key]);
      } else {
        return;
      }
      event.preventDefault();
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
      this._requestRender();
    };
  };
