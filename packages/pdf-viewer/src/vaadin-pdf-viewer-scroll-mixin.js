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
import {
  getAnchor,
  getAnchorScrollLeftDelta,
  getAnchorScrollTop,
  getFitScale,
  getMostVisibleIndex,
  getVisiblePages,
} from './pdf-viewer-layout.js';

/**
 * A mixin that lays out the pages, keeps `page` in sync with scrolling and
 * asks for the visible pages to render.
 */
export const PdfViewerScrollMixin = (superClass) =>
  class PdfViewerScrollMixinClass extends ResizeMixin(superClass) {
    static get properties() {
      return {
        /**
         * The current page, starting from 1. The viewer updates it while the
         * user scrolls, to the page that takes up most of the visible area.
         * Setting it to another page scrolls to the start of that page.
         * Setting it to the current page does not scroll. A value that is not
         * a page of the document logs a warning and does not scroll. A set
         * value stays as it is until the user scrolls. A new `src` resets it
         * to 1, unless `page` is set in the same update.
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

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      cancelAnimationFrame(this.#scrollFrame);
      this.#scrollFrame = 0;
    }

    /** @protected */
    firstUpdated() {
      super.firstUpdated();

      this.$.content.addEventListener('scroll', () => this.#onScroll(), { passive: true });
    }

    /** @protected */
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

      this._beginRenderAction();
      this.#refresh();
    }

    /**
     * Override method from `PdfViewerDocumentMixin` to lay out the pages.
     * @protected
     * @override
     */
    _documentLoaded(details) {
      super._documentLoaded(details);

      this.#pendingPage = this.page;
      this.#refresh();
    }

    /**
     * Override method from `PdfViewerDocumentMixin` to reset the layout.
     * @protected
     * @override
     */
    _documentUnloaded() {
      super._documentUnloaded();

      this.#scale = 0;
      this.#currentIndex = 0;
      this.#pinnedPage = null;
      this.#pendingPage = 0;
      this.$.content.scrollTop = 0;
      this.#savedScroll = { top: 0, left: 0 };
    }

    /**
     * Override method from `PdfViewerRenderMixin` to lay out the pages again,
     * keeping the current page in view.
     * @protected
     * @override
     */
    _pageSizesChanged() {
      super._pageSizesChanged();

      if (this.#scale > 0) {
        this.#applyScale(this.#scale);
      }
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
      if (!this.#hasLayout()) {
        return 0;
      }

      // Fit the first page, so that the scale does not depend on which page is
      // current. In most documents all pages have the size of the first one.
      return getFitScale(this.#getAvailableSize(), this.__pages[0].unscaledWidth);
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
        return;
      }

      const isFirstLayout = this.#scale === 0;
      const anchor = isFirstLayout ? null : this.#captureAnchor();

      this.#scale = scale;
      this._cancelRender();
      this.__pages.forEach((page) => page.setScale(scale));
      this._beginRenderAction();

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
      // The middle of the visible area, which excludes a vertical scrollbar
      // (on the left in RTL, where clientLeft includes it).
      const viewX = content.clientLeft + content.clientWidth / 2;
      const page = this.__pages[this.#currentIndex];
      const view = { scrollTop: content.scrollTop, center: content.getBoundingClientRect().left + viewX };
      return { page, viewX, ...getAnchor(view, this.#getPageBox(page)) };
    }

    /**
     * Scrolls so that the anchor point of the page is at the top of the view
     * again. A page that fits the width of the view is centered.
     * @private
     */
    #restoreAnchor({ page, viewX, ...anchor }) {
      const { content } = this.$;
      content.scrollTop = getAnchorScrollTop(anchor, this.#getPageBox(page));
      const view = { center: content.getBoundingClientRect().left + viewX, width: content.clientWidth };
      content.scrollLeft += getAnchorScrollLeftDelta(anchor, view, this.#getPageBox(page));
    }

    /**
     * Returns the position of a page in the content and its rectangle in the viewport.
     * @private
     */
    #getPageBox(page) {
      const { left, width } = page.element.getBoundingClientRect();
      return { top: page.element.offsetTop, height: page.height, left, width };
    }

    /**
     * Scrolls to the start of a page.
     * @private
     */
    #scrollToPage(page) {
      if (!this.#hasLayout() || this.#scale <= 0) {
        // Scroll once the pages can be laid out.
        this.#pendingPage = page;
        this._renderVisible([]);
        return;
      }
      this.#pendingPage = 0;
      this._beginRenderAction();

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
        this._renderVisible([]);
        return;
      }

      const { content } = this.$;
      const viewTop = content.scrollTop;
      this.#savedScroll = { top: viewTop, left: content.scrollLeft };

      const visible = getVisiblePages(
        pages.length,
        (index) => ({ top: pages[index].element.offsetTop, height: pages[index].element.offsetHeight }),
        viewTop,
        viewTop + content.clientHeight,
      );
      this.#updateCurrentPage(visible);
      this._renderVisible(visible);
    }

    /** @private */
    #updateCurrentPage(visible) {
      const mostVisibleIndex = getMostVisibleIndex(visible);
      this.#currentIndex = mostVisibleIndex;

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

      const page = mostVisibleIndex + 1;
      if (page !== this.page) {
        this.#setPageFromViewer(page);
      }
    }
  };
