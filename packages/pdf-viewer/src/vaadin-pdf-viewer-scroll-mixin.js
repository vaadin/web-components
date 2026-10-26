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
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
import { issueWarning } from '@vaadin/component-base/src/warnings.js';

/** The number of pages whose size is requested at a time after loading. */
const PAGE_SIZE_BATCH = 10;

/**
 * A mixin that lays out the pages, keeps `page` in sync with scrolling and
 * renders the visible pages.
 */
export const PdfViewerScrollMixin = (superClass) =>
  class PdfViewerScrollMixinClass extends ResizeMixin(superClass) {
    static get properties() {
      return {
        /**
         * The current page, starting from 1. The viewer updates it while the
         * user scrolls, to the page that takes up most of the visible area.
         * Setting it to another page scrolls to the start of that page.
         * Setting it to the current page does not scroll. A new `src` resets
         * it to 1, unless `page` is set in the same update.
         */
        page: {
          type: Number,
          value: 1,
          notify: true,
        },
      };
    }

    /** The scale of the pages in CSS pixels per PDF unit, or 0 before the pages are laid out. */
    #scale = 0;

    /** The index of the page that takes up most of the view, updated with the visible pages. */
    #currentIndex = 0;

    /** The last page that the viewer set itself, to not scroll to it again. */
    #scrolledPage = 1;

    /**
     * A page that was scrolled to, kept as the current page until the user scrolls.
     * @type {number | null}
     */
    #pinnedPage = null;

    /** The scroll position set when scrolling to the pinned page. */
    #pinnedScrollTop = 0;

    /** A page to scroll to once the pages can be laid out. */
    #pendingPage = 0;

    #scrollFrame = 0;

    /** The scroll position while the viewer had a size, to restore it when shown again. */
    #savedScroll = { top: 0, left: 0 };

    #hadLayout = false;

    #relayoutFrame = 0;

    /** @type {MediaQueryList | null} */
    #pixelRatioQuery = null;

    /** Incremented on every unload, to detect page sizes that belong to an outdated document. */
    #loadId = 0;

    /**
     * Override method from `HTMLElement` to observe the device pixel ratio.
     * @protected
     * @override
     */
    connectedCallback() {
      super.connectedCallback();

      this.#watchPixelRatio();
    }

    /**
     * Override method from `HTMLElement` to stop observing.
     * @protected
     * @override
     */
    disconnectedCallback() {
      super.disconnectedCallback();

      this.#unwatchPixelRatio();
      cancelAnimationFrame(this.#scrollFrame);
      this.#scrollFrame = 0;
      cancelAnimationFrame(this.#relayoutFrame);
      this.#relayoutFrame = 0;
    }

    /**
     * Override method from `LitElement` to follow the scrolling of the pages area.
     * @protected
     * @override
     */
    firstUpdated() {
      super.firstUpdated();

      this.$.content.addEventListener('scroll', () => this.#onScroll(), { passive: true });
    }

    /**
     * Override method from `LitElement` to scroll to a changed page.
     * @protected
     * @override
     */
    updated(props) {
      super.updated(props);

      // A new document starts from the first page, unless a page is set together with it.
      if (props.has('src') && !props.has('page')) {
        this.#setPageFromViewer(1);
      }

      if (props.has('page') && this.page !== this.#scrolledPage && this.__pages.length) {
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

      if (this.__pages.length) {
        this.__idle = false;
      }
      this.#refresh();
    }

    /**
     * Finds the visible pages again and renders the ones that are not
     * rendered at the current scale and device pixel ratio.
     * @private
     */
    #requestRender() {
      if (this.__pages.length) {
        this.__idle = false;
      }
      this.#updateVisiblePages();
    }

    /**
     * Override method from `PdfViewerDocumentMixin` to lay out the pages and
     * to load the sizes of the other pages.
     * @protected
     * @override
     */
    _documentLoaded(firstPage) {
      super._documentLoaded(firstPage);

      this.#pendingPage = this.page;
      this.#refresh();
      const loadId = this.#loadId;
      this.#loadPageSizes(loadId).catch((error) => {
        if (loadId === this.#loadId) {
          issueWarning(`Failed to load the page sizes of the PDF document: ${error.message}`);
        }
      });
    }

    /**
     * Override method from `PdfViewerDocumentMixin` to reset the layout.
     * @protected
     * @override
     */
    _documentUnloaded() {
      super._documentUnloaded();

      this.#loadId += 1;
      this.#scale = 0;
      this.#currentIndex = 0;
      this.#pinnedPage = null;
      this.#pendingPage = 0;
      cancelAnimationFrame(this.#relayoutFrame);
      this.#relayoutFrame = 0;
      this.$.content.scrollTop = 0;
      this.#savedScroll = { top: 0, left: 0 };
    }

    /**
     * Override method from `PdfViewerRenderMixin` to lay out the pages again
     * when the size of a page differs from the estimate.
     * @private
     */
    __setPdfPage(page, pdfPage) {
      const { unscaledWidth, unscaledHeight } = page;
      super.__setPdfPage(page, pdfPage);
      if (page.unscaledWidth !== unscaledWidth || page.unscaledHeight !== unscaledHeight) {
        this.#scheduleRelayout();
      }
    }

    /**
     * Loads the pages after the first one, and corrects their size.
     * @private
     */
    async #loadPageSizes(loadId) {
      const pdfDocument = this._pdfDocument;
      const pages = this.__pages.slice(1);
      // Request a few pages at a time, so that requests for pages to
      // render do not wait behind the requests for all page sizes.
      for (let start = 0; start < pages.length; start += PAGE_SIZE_BATCH) {
        const batch = pages.slice(start, start + PAGE_SIZE_BATCH);
        // A page that fails to load reports the error when it is rendered.
        await Promise.allSettled(
          batch.map((page) =>
            pdfDocument.getPage(page.pageNumber).then((pdfPage) => {
              if (loadId === this.#loadId && !page.pdfPage) {
                this.__setPdfPage(page, pdfPage);
              }
            }),
          ),
        );
        if (loadId !== this.#loadId) {
          return;
        }
      }
      this.__pageSizesLoaded = true;
      // Notify about being idle, unless a relayout will render again.
      if (!this.#relayoutFrame) {
        this.__renderQueue.renderNext();
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
          this.__renderQueue.renderNext();
        }
      });
    }

    /**
     * Applies changes to the size, and scrolls to a page that was set while
     * the pages could not be laid out.
     * @private
     */
    #refresh() {
      const scale = this.__pages.length ? this.#computeScale() : 0;
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
      return width / this.__pages[0].unscaledWidth;
    }

    /**
     * Resizes the pages to the given scale, keeping the same point of the
     * current page at the top of the view, then renders what is visible.
     * @private
     */
    #applyScale(scale) {
      const { content } = this.$;

      if (!this.#hasLayout()) {
        // Page sizes arrived while the viewer is hidden. Positions cannot be
        // measured now, so go back to the current page once shown again.
        this.#scale = scale;
        this.__pages.forEach((page) => page.setScale(scale));
        this.#pendingPage ||= this.page;
        this.__renderQueue.renderNext();
        return;
      }

      const isFirstLayout = this.#scale === 0;
      const anchor = isFirstLayout ? null : this.#captureAnchor();

      this.#scale = scale;
      this.__renderQueue.cancel();
      this.__pages.forEach((page) => page.setScale(scale));
      this.__idle = false;

      if (anchor) {
        this.#restoreAnchor(anchor);
      } else {
        content.scrollTop = 0;
      }

      if (this.#pendingPage) {
        // A page set before the pages could be laid out
        this.#scrollToPage(this.#pendingPage);
      } else {
        this.#updateVisiblePages();
      }
    }

    /**
     * Returns where the middle of the top of the view is on the current page,
     * relative to the size of the page.
     * @private
     */
    #captureAnchor() {
      const { content } = this.$;
      const contentRect = content.getBoundingClientRect();
      // The middle of the visible area, which excludes a vertical scrollbar
      // (on the left in RTL, where clientLeft includes it).
      const viewX = content.clientLeft + content.clientWidth / 2;
      const page = this.__pages[this.#currentIndex];
      const pageRect = page.element.getBoundingClientRect();
      return {
        page,
        x: (contentRect.left + viewX - pageRect.left) / pageRect.width,
        y: (content.scrollTop - page.element.offsetTop) / page.height,
        viewX,
      };
    }

    /**
     * Scrolls so that the anchor point of the page is at the top of the view
     * again. A page that fits the width of the view is centered.
     * @private
     */
    #restoreAnchor({ page, x, y, viewX }) {
      const { content } = this.$;
      content.scrollTop = page.element.offsetTop + y * page.height;

      // Work with rectangles, so that the same code works for any scroll
      // direction (scrollLeft is 0 or negative in RTL).
      const pageRect = page.element.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();
      const ratio = pageRect.width <= content.clientWidth ? 0.5 : x;
      content.scrollLeft += pageRect.left + ratio * pageRect.width - (contentRect.left + viewX);
    }

    /**
     * Scrolls to the start of a page.
     * @private
     */
    #scrollToPage(page) {
      if (!this.#hasLayout() || this.#scale <= 0) {
        // Scroll once the pages can be laid out.
        this.#pendingPage = page;
        this.__renderQueue.renderNext();
        return;
      }
      this.#pendingPage = 0;
      this.__idle = false;

      const { content } = this.$;
      if (!Number.isInteger(page) || page < 1 || page > this.__pages.length) {
        issueWarning(
          `The page ${page} is out of range for <vaadin-pdf-viewer>, the document has ${this.__pages.length} pages.`,
        );
      } else {
        const pageView = this.__pages[page - 1];
        content.scrollTop = pageView.element.offsetTop - Number.parseFloat(getComputedStyle(content).paddingBlockStart);
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
      const pages = this.__pages;
      // Without layout, all pages have no position, so nothing can be visible.
      if (!pages.length || this.#scale <= 0 || !this.#hasLayout()) {
        this.__renderQueue.clear();
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
      this.__renderQueue.update(visible);
    }

    /** @private */
    #updateCurrentPage(visible) {
      // The page that takes up most of the view. The first one wins a tie.
      const mostVisible = visible.reduce((result, item) => (item.height > result.height ? item : result));
      this.#currentIndex = mostVisible.index;

      // Keep a page that was scrolled to as long as the view has not moved.
      // E.g. the last page cannot always be scrolled to the top of the view.
      const pinned = this.#pinnedPage;
      if (pinned !== null && Math.abs(this.$.content.scrollTop - this.#pinnedScrollTop) < 1) {
        if (pinned >= 1 && pinned <= this.__pages.length) {
          this.#currentIndex = pinned - 1;
        }
        return;
      }
      this.#pinnedPage = null;

      const page = mostVisible.index + 1;
      if (page !== this.page) {
        this.#setPageFromViewer(page);
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
      this.#requestRender();
    };
  };
