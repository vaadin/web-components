/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { animationFrame, microTask, timeOut } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';

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

        /**
         * Cached array of cells frozen to end
         * @private
         */
        _frozenToEndCells: {
          type: Array,
          value: () => []
        },

        /** @private */
        _rowWithFocusedElement: Element
      };
    }

    /** @private */
    get _scrollTop() {
      return this.$.table.scrollTop;
    }

    /**
     * Override (from iron-scroll-target-behavior) to avoid document scroll
     * @private
     */
    set _scrollTop(top) {
      this.$.table.scrollTop = top;
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
      this.__scrollIntoViewport(index);
    }

    /**
     * Makes sure the row with the given index (if found in the DOM) is fully
     * inside the visible viewport, taking header/footer into account.
     * @private
     */
    __scrollIntoViewport(index) {
      const rowElement = [...this.$.items.children].find((child) => child.index === index);
      if (rowElement) {
        const dstRect = rowElement.getBoundingClientRect();
        const footerTop = this.$.footer.getBoundingClientRect().top;
        const headerBottom = this.$.header.getBoundingClientRect().bottom;
        if (dstRect.bottom > footerTop) {
          this.$.table.scrollTop += dstRect.bottom - footerTop;
        } else if (dstRect.top < headerBottom) {
          this.$.table.scrollTop -= headerBottom - dstRect.top;
        }
      }
    }

    /** @private */
    _scheduleScrolling() {
      if (!this._scrollingFrame) {
        // Defer setting state attributes to avoid Edge hiccups
        this._scrollingFrame = requestAnimationFrame(() => this.$.scroller.toggleAttribute('scrolling', true));
      }
      this._debounceScrolling = Debouncer.debounce(this._debounceScrolling, timeOut.after(timeouts.SCROLLING), () => {
        cancelAnimationFrame(this._scrollingFrame);
        delete this._scrollingFrame;
        this.$.scroller.toggleAttribute('scrolling', false);
      });
    }

    /** @private */
    _afterScroll() {
      this.__updateHorizontalScrollPosition();

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

      const scrollLeft = this.__getNormalizedScrollLeft(table);
      if (scrollLeft > 0) {
        overflow += ' start';
      }

      if (scrollLeft < table.scrollWidth - table.clientWidth) {
        overflow += ' end';
      }

      if (this.__isRTL) {
        overflow = overflow.replace(/start|end/gi, (matched) => {
          return matched === 'start' ? 'end' : 'start';
        });
      }

      // TODO: Remove "right" and "left" values in the next major.
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
        this._frozenToEndCells = Array.prototype.slice.call(this.$.table.querySelectorAll('[frozen-to-end]'));
        this.__updateHorizontalScrollPosition();
      });
      this._updateFrozenColumn();
    }

    /** @protected */
    _updateFrozenColumn() {
      if (!this._columnTree) {
        return;
      }

      const columnsRow = this._columnTree[this._columnTree.length - 1].slice(0);
      columnsRow.sort((a, b) => {
        return a._order - b._order;
      });

      let lastFrozen;
      let firstFrozenToEnd;

      // Use for loop to only iterate columns once
      for (let i = 0; i < columnsRow.length; i++) {
        const col = columnsRow[i];

        col._lastFrozen = false;
        col._firstFrozenToEnd = false;

        if (firstFrozenToEnd === undefined && col.frozenToEnd && !col.hidden) {
          firstFrozenToEnd = i;
        }

        if (col.frozen && !col.hidden) {
          lastFrozen = i;
        }
      }

      if (lastFrozen !== undefined) {
        columnsRow[lastFrozen]._lastFrozen = true;
      }

      if (firstFrozenToEnd !== undefined) {
        columnsRow[firstFrozenToEnd]._firstFrozenToEnd = true;
      }
    }

    /** @private */
    __updateHorizontalScrollPosition() {
      const scrollWidth = this.$.table.scrollWidth;
      const clientWidth = this.$.table.clientWidth;
      const scrollLeft = this.__getNormalizedScrollLeft(this.$.table);

      // Position cells frozen to end
      const remaining = scrollLeft + clientWidth - scrollWidth;

      this.$.table.style.setProperty('--_grid-horizontal-scroll-remaining', remaining + 'px');
      this.$.table.style.setProperty('--_grid-horizontal-scroll-position', -scrollLeft + 'px');

      if (this.__isRTL) {
        // Translating the sticky sections using a CSS variable works nicely on LTR.
        // On RTL, it causes jumpy behavior (on Desktop Safari) so we need to translate manually.
        const transformFrozen = `translate(${remaining}px, 0)`;
        for (let i = 0; i < this._frozenCells.length; i++) {
          this._frozenCells[i].style.transform = transformFrozen;
        }

        const transformFrozenToEnd = `translate(${scrollLeft}px, 0)`;
        for (let i = 0; i < this._frozenToEndCells.length; i++) {
          this._frozenToEndCells[i].style.transform = transformFrozenToEnd;
        }
      }
    }
  };
