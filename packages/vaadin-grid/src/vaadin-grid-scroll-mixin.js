/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Debouncer } from '@polymer/polymer/lib/utils/debounce.js';
import { animationFrame, timeOut, microTask } from '@polymer/polymer/lib/utils/async.js';

const timeouts = {
  SCROLLING: 500
};

/**
 * @polymerMixin
 */
export const ScrollMixin = (superClass) =>
  class ScrollMixin extends superClass {
    static get properties() {
      return {
        /**
         * Cached array of frozen cells
         * @private
         */
        _frozenCells: {
          type: Array,
          value: () => []
        },

        /** @private */
        _rowWithFocusedElement: Element,

        /** @private */
        _useSticky: {
          type: Boolean,
          value:
            window.CSS &&
            window.CSS.supports &&
            (window.CSS.supports('position', 'sticky') || window.CSS.supports('position', '-webkit-sticky'))
        }
      };
    }

    /**
     * Override (from iron-scroll-target-behavior) to avoid document scroll
     * @private
     */
    set _scrollTop(top) {
      this.$.table.scrollTop = top;
    }

    /** @private */
    get _scrollTop() {
      return this.$.table.scrollTop;
    }

    /** @private */
    get _scrollLeft() {
      return this.$.table.scrollLeft;
    }

    /** @protected */
    ready() {
      super.ready();

      // Preserve accessor to the legacy scrolling functionality
      this.$.outerscroller = document.createElement('div');

      this.scrollTarget = this.$.table;

      this.$.items.addEventListener('focusin', (e) => {
        const itemsIndex = e.composedPath().indexOf(this.$.items);
        this._rowWithFocusedElement = e.composedPath()[itemsIndex - 1];
      });
      this.$.items.addEventListener('focusout', () => (this._rowWithFocusedElement = undefined));

      this.$.table.addEventListener('scroll', () => this._afterScroll());
    }

    /**
     * Scroll to a specific row index in the virtual list. Note that the row index is
     * not always the same for any particular item. For example, sorting/filtering/expanding
     * or collapsing hierarchical items can affect the row index related to an item.
     *
     * @param {number} index Row index to scroll to
     */
    scrollToIndex(index) {
      index = Math.min(this._effectiveSize - 1, Math.max(0, index));
      this.__virtualizer.scrollToIndex(index);

      // Fine tune the scroll position taking header/footer into account
      const row = Array.from(this.$.items.children).find((child) => child.index === index);
      if (row) {
        const headerOffset = row.getBoundingClientRect().top - this.$.header.getBoundingClientRect().bottom;
        if (Math.abs(headerOffset) >= 1) {
          this.$.table.scrollTop += headerOffset;
        }
      }
    }

    /** @private */
    _scheduleScrolling() {
      if (!this._scrollingFrame) {
        // Defer setting state attributes to avoid Edge hiccups
        this._scrollingFrame = requestAnimationFrame(() => this._toggleAttribute('scrolling', true, this.$.scroller));
      }
      this._debounceScrolling = Debouncer.debounce(this._debounceScrolling, timeOut.after(timeouts.SCROLLING), () => {
        cancelAnimationFrame(this._scrollingFrame);
        delete this._scrollingFrame;
        this._toggleAttribute('scrolling', false, this.$.scroller);
      });
    }

    /** @private */
    _afterScroll() {
      this._translateStationaryElements();

      if (!this.hasAttribute('reordering')) {
        this._scheduleScrolling();
      }

      this._updateOverflow();
    }

    /** @private */
    _updateOverflow() {
      // Set overflow styling attributes
      let overflow = '';
      const table = this.$.table;
      if (table.scrollTop < table.scrollHeight - table.clientHeight) {
        overflow += ' bottom';
      }

      if (table.scrollTop > 0) {
        overflow += ' top';
      }

      if (table.scrollLeft < table.scrollWidth - table.clientWidth) {
        overflow += ' right';
      }

      if (table.scrollLeft > 0) {
        overflow += ' left';
      }

      this._debounceOverflow = Debouncer.debounce(this._debounceOverflow, animationFrame, () => {
        const value = overflow.trim();
        if (value.length > 0 && this.getAttribute('overflow') !== value) {
          this.setAttribute('overflow', value);
        } else if (value.length == 0 && this.hasAttribute('overflow')) {
          this.removeAttribute('overflow');
        }
      });
    }

    /** @protected */
    _frozenCellsChanged() {
      this._debouncerCacheElements = Debouncer.debounce(this._debouncerCacheElements, microTask, () => {
        Array.from(this.shadowRoot.querySelectorAll('[part~="cell"]')).forEach(function (cell) {
          cell.style.transform = '';
        });
        this._frozenCells = Array.prototype.slice.call(this.$.table.querySelectorAll('[frozen]'));
        this._updateScrollerMeasurements();
        this._translateStationaryElements();
      });
      this._updateLastFrozen();
    }

    /** @protected */
    _updateScrollerMeasurements() {
      if (this._frozenCells.length > 0 && this.__isRTL) {
        this.__scrollerMetrics = {
          scrollWidth: this.$.table.scrollWidth,
          clientWidth: this.$.table.clientWidth
        };
      }
    }

    /** @protected */
    _updateLastFrozen() {
      if (!this._columnTree) {
        return;
      }

      const columnsRow = this._columnTree[this._columnTree.length - 1].slice(0);
      columnsRow.sort((a, b) => {
        return a._order - b._order;
      });
      const lastFrozen = columnsRow.reduce((prev, col, index) => {
        col._lastFrozen = false;
        return col.frozen && !col.hidden ? index : prev;
      }, undefined);
      if (lastFrozen !== undefined) {
        columnsRow[lastFrozen]._lastFrozen = true;
      }
    }

    /** @private */
    _translateStationaryElements() {
      const scrollLeft = Math.max(0, this._scrollLeft);
      const scrollTop = Math.max(0, this._scrollTop);

      let leftOffset = 0;
      let topOffset = 0;
      let footerOffset = 0;
      if (!this._useSticky) {
        leftOffset = scrollLeft;
        topOffset = scrollTop;
        footerOffset = this.$.table.clientHeight - this.$.footer.offsetHeight - this.$.footer.offsetTop;
      }

      this.$.header.style.transform = this._getTranslate(-scrollLeft + leftOffset, topOffset);
      this.$.footer.style.transform = this._getTranslate(-scrollLeft + leftOffset, topOffset + footerOffset);
      this.$.items.style.transform = this._getTranslate(-scrollLeft + leftOffset, 0);

      if (this._frozenCells.length > 0) {
        const x = this.__isRTL
          ? this.__getNormalizedScrollLeft(this.$.table) +
            this.__scrollerMetrics.clientWidth -
            this.__scrollerMetrics.scrollWidth
          : this._scrollLeft;
        const frozenCellTransform = this._getTranslate(x, 0);

        for (let i = 0; i < this._frozenCells.length; i++) {
          this._frozenCells[i].style.transform = frozenCellTransform;
        }
      }
    }

    /** @private */
    _getTranslate(x, y) {
      return `translate(${x}px, ${y}px)`;
    }
  };
