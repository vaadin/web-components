/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

/**

This is a fork of <iron-list> for <vaadin-grid>'s internal purposes only!
To update:
1. Get the most recent code from https://github.com/PolymerElements/iron-list/
2. Remove `is: 'iron-list'` and `_template` to avoid collisions with actual <iron-list>
3. Change "Polymer({" to "export const PolymerIronList = Class({" to expose the class
4. Optional: Remove all properties and functions not needed by <vaadin-grid>
5. Profit!

*/
import { IronResizableBehavior } from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import { IronScrollTargetBehavior } from '@polymer/iron-scroll-target-behavior/iron-scroll-target-behavior.js';
import { animationFrame, idlePeriod, microTask } from '@polymer/polymer/lib/utils/async.js';
import { Class } from '@polymer/polymer/lib/legacy/class.js';
import { flush } from '@polymer/polymer/lib/utils/flush.js';
import { Debouncer, enqueueDebouncer } from '@polymer/polymer/lib/utils/debounce.js';
const IOS = navigator.userAgent.match(/iP(?:hone|ad;(?: U;)? CPU) OS (\d+)/);
const IOS_TOUCH_SCROLLING = IOS && IOS[1] >= 8;
const DEFAULT_PHYSICAL_COUNT = 3;

/**
 * @private
 */
export const PolymerIronList = Class({
  behaviors: [IronResizableBehavior, IronScrollTargetBehavior],

  /**
   * The ratio of hidden tiles that should remain in the scroll direction.
   * Recommended value ~0.5, so it will distribute tiles evenly in both directions.
   */
  _ratio: 0.5,

  /**
   * The padding-top value for the list.
   */
  _scrollerPaddingTop: 0,

  /**
   * This value is the same as `scrollTop`.
   */
  _scrollPosition: 0,

  /**
   * The sum of the heights of all the tiles in the DOM.
   */
  _physicalSize: 0,

  /**
   * The average `offsetHeight` of the tiles observed till now.
   */
  _physicalAverage: 0,

  /**
   * The number of tiles which `offsetHeight` > 0 observed until now.
   */
  _physicalAverageCount: 0,

  /**
   * The Y position of the item rendered in the `_physicalStart`
   * tile relative to the scrolling list.
   */
  _physicalTop: 0,

  /**
   * The number of items in the list.
   */
  _virtualCount: 0,

  /**
   * The estimated scroll height based on `_physicalAverage`
   */
  _estScrollHeight: 0,

  /**
   * The scroll height of the dom node
   */
  _scrollHeight: 0,

  /**
   * The height of the list. This is referred as the viewport in the context of list.
   */
  _viewportHeight: 0,

  /**
   * The width of the list. This is referred as the viewport in the context of list.
   */
  _viewportWidth: 0,

  /**
   * An array of DOM nodes that are currently in the tree
   * @type {?Array<!TemplateInstanceBase>}
   */
  _physicalItems: null,

  /**
   * An array of heights for each item in `_physicalItems`
   * @type {?Array<number>}
   */
  _physicalSizes: null,

  /**
   * A cached value for the first visible index.
   * See `firstVisibleIndex`
   * @type {?number}
   */
  _firstVisibleIndexVal: null,

  /**
   * A cached value for the last visible index.
   * See `lastVisibleIndex`
   * @type {?number}
   */
  _lastVisibleIndexVal: null,

  /**
   * The max number of pages to render. One page is equivalent to the height of the list.
   */
  _maxPages: 2,

  /**
   * The virtual index of the focused item.
   */
  _focusedVirtualIndex: -1,

  /**
   * The cost of stamping a template in ms.
   */
  _templateCost: 0,

  /**
   * The bottom of the physical content.
   */
  get _physicalBottom() {
    return this._physicalTop + this._physicalSize;
  },

  /**
   * The bottom of the scroll.
   */
  get _scrollBottom() {
    return this._scrollPosition + this._viewportHeight;
  },

  /**
   * The n-th item rendered in the last physical item.
   */
  get _virtualEnd() {
    return this._virtualStart + this._physicalCount - 1;
  },

  /**
   * The height of the physical content that isn't on the screen.
   */
  get _hiddenContentSize() {
    return this._physicalSize - this._viewportHeight;
  },

  /**
   * The maximum scroll top value.
   */
  get _maxScrollTop() {
    return this._estScrollHeight - this._viewportHeight + this._scrollOffset;
  },

  /**
   * The largest n-th value for an item such that it can be rendered in `_physicalStart`.
   */
  get _maxVirtualStart() {
    return Math.max(0, this._virtualCount - this._physicalCount);
  },

  set _virtualStart(val) {
    val = this._clamp(val, 0, this._maxVirtualStart);
    this._virtualStartVal = val;
  },

  get _virtualStart() {
    return this._virtualStartVal || 0;
  },

  /**
   * The k-th tile that is at the top of the scrolling list.
   */
  set _physicalStart(val) {
    val = val % this._physicalCount;
    if (val < 0) {
      val = this._physicalCount + val;
    }
    this._physicalStartVal = val;
  },

  get _physicalStart() {
    return this._physicalStartVal || 0;
  },

  /**
   * The k-th tile that is at the bottom of the scrolling list.
   */
  get _physicalEnd() {
    return (this._physicalStart + this._physicalCount - 1) % this._physicalCount;
  },

  set _physicalCount(val) {
    this._physicalCountVal = val;
  },

  get _physicalCount() {
    return this._physicalCountVal || 0;
  },

  /**
   * An optimal physical size such that we will have enough physical items
   * to fill up the viewport and recycle when the user scrolls.
   *
   * This default value assumes that we will at least have the equivalent
   * to a viewport of physical items above and below the user's viewport.
   */
  get _optPhysicalSize() {
    return this._viewportHeight === 0 ? Infinity : this._viewportHeight * this._maxPages;
  },

  /**
   * True if the current list is visible.
   */
  get _isVisible() {
    return Boolean(this.offsetWidth || this.offsetHeight);
  },

  /**
   * Gets the index of the first visible item in the viewport.
   *
   * @type {number}
   */
  get firstVisibleIndex() {
    let idx = this._firstVisibleIndexVal;
    if (idx == null) {
      let physicalOffset = this._physicalTop + this._scrollOffset;

      idx =
        this._iterateItems(function (pidx, vidx) {
          physicalOffset += this._physicalSizes[pidx];

          if (physicalOffset > this._scrollPosition) {
            return vidx;
          }
        }) || 0;
      this._firstVisibleIndexVal = idx;
    }
    return idx;
  },

  /**
   * Gets the index of the last visible item in the viewport.
   *
   * @type {number}
   */
  get lastVisibleIndex() {
    let idx = this._lastVisibleIndexVal;
    if (idx == null) {
      let physicalOffset = this._physicalTop + this._scrollOffset;
      this._iterateItems(function (pidx, vidx) {
        if (physicalOffset < this._scrollBottom) {
          idx = vidx;
        }
        physicalOffset += this._physicalSizes[pidx];
      });
      this._lastVisibleIndexVal = idx;
    }
    return idx;
  },

  get _scrollOffset() {
    return this._scrollerPaddingTop;
  },

  attached: function () {
    this._debounce('_render', this._render, animationFrame);
    // `iron-resize` is fired when the list is attached if the event is added
    // before attached causing unnecessary work.
    this.listen(this, 'iron-resize', '_resizeHandler');
  },

  detached: function () {
    this.unlisten(this, 'iron-resize', '_resizeHandler');
  },

  /**
   * Invoke this method if you dynamically update the viewport's
   * size or CSS padding.
   *
   * @method updateViewportBoundaries
   */
  updateViewportBoundaries: function () {
    const styles = window.getComputedStyle(this);
    this._scrollerPaddingTop = this.scrollTarget === this ? 0 : parseInt(styles['padding-top'], 10);
    this._isRTL = Boolean(styles.direction === 'rtl');
    this._viewportWidth = this.$.items.offsetWidth;
    this._viewportHeight = this._scrollTargetHeight;
  },

  /**
   * Recycles the physical items when needed.
   */
  _scrollHandler: function () {
    const scrollTop = Math.max(0, Math.min(this._maxScrollTop, this._scrollTop));
    let delta = scrollTop - this._scrollPosition;
    const isScrollingDown = delta >= 0;
    // Track the current scroll position.
    this._scrollPosition = scrollTop;
    // Clear indexes for first and last visible indexes.
    this._firstVisibleIndexVal = null;
    this._lastVisibleIndexVal = null;
    // Random access.
    if (Math.abs(delta) > this._physicalSize && this._physicalSize > 0) {
      delta = delta - this._scrollOffset;
      const idxAdjustment = Math.round(delta / this._physicalAverage);
      this._virtualStart = this._virtualStart + idxAdjustment;
      this._physicalStart = this._physicalStart + idxAdjustment;
      // Estimate new physical offset.
      this._physicalTop = Math.floor(this._virtualStart) * this._physicalAverage;
      this._update();
    } else if (this._physicalCount > 0) {
      const { physicalTop, indexes } = this._getReusables(isScrollingDown);
      if (isScrollingDown) {
        this._physicalTop = physicalTop;
        this._virtualStart = this._virtualStart + indexes.length;
        this._physicalStart = this._physicalStart + indexes.length;
      } else {
        this._virtualStart = this._virtualStart - indexes.length;
        this._physicalStart = this._physicalStart - indexes.length;
      }
      this._update(indexes, isScrollingDown ? null : indexes);
      this._debounce('_increasePoolIfNeeded', this._increasePoolIfNeeded.bind(this, 0), microTask);
    }
  },

  /**
   * Returns an object that contains the indexes of the physical items
   * that might be reused and the physicalTop.
   *
   * @param {boolean} fromTop If the potential reusable items are above the scrolling region.
   */
  _getReusables: function (fromTop) {
    let ith, offsetContent, physicalItemHeight;
    const idxs = [];
    const protectedOffsetContent = this._hiddenContentSize * this._ratio;
    const virtualStart = this._virtualStart;
    const virtualEnd = this._virtualEnd;
    const physicalCount = this._physicalCount;
    let top = this._physicalTop + this._scrollOffset;
    const bottom = this._physicalBottom + this._scrollOffset;
    const scrollTop = this._scrollTop;
    const scrollBottom = this._scrollBottom;

    if (fromTop) {
      ith = this._physicalStart;
      offsetContent = scrollTop - top;
    } else {
      ith = this._physicalEnd;
      offsetContent = bottom - scrollBottom;
    }
    // eslint-disable-next-line no-constant-condition
    while (true) {
      physicalItemHeight = this._physicalSizes[ith];
      offsetContent = offsetContent - physicalItemHeight;
      if (idxs.length >= physicalCount || offsetContent <= protectedOffsetContent) {
        break;
      }
      if (fromTop) {
        // Check that index is within the valid range.
        if (virtualEnd + idxs.length + 1 >= this._virtualCount) {
          break;
        }
        // Check that the index is not visible.
        if (top + physicalItemHeight >= scrollTop - this._scrollOffset) {
          break;
        }
        idxs.push(ith);
        top = top + physicalItemHeight;
        ith = (ith + 1) % physicalCount;
      } else {
        // Check that index is within the valid range.
        if (virtualStart - idxs.length <= 0) {
          break;
        }
        // Check that the index is not visible.
        if (top + this._physicalSize - physicalItemHeight <= scrollBottom) {
          break;
        }
        idxs.push(ith);
        top = top - physicalItemHeight;
        ith = ith === 0 ? physicalCount - 1 : ith - 1;
      }
    }
    return { indexes: idxs, physicalTop: top - this._scrollOffset };
  },

  /**
   * Update the list of items, starting from the `_virtualStart` item.
   * @param {!Array<number>=} itemSet
   * @param {!Array<number>=} movingUp
   */
  _update: function (itemSet, movingUp) {
    if ((itemSet && itemSet.length === 0) || this._physicalCount === 0) {
      return;
    }
    this._assignModels(itemSet);
    this._updateMetrics(itemSet);
    // Adjust offset after measuring.
    if (movingUp) {
      while (movingUp.length) {
        const idx = movingUp.pop();
        this._physicalTop -= this._physicalSizes[idx];
      }
    }
    this._positionItems();
    this._updateScrollerSize();
  },

  _isClientFull: function () {
    return (
      this._scrollBottom != 0 &&
      this._physicalBottom - 1 >= this._scrollBottom &&
      this._physicalTop <= this._scrollPosition
    );
  },

  /**
   * Increases the pool size.
   */
  _increasePoolIfNeeded: function (count) {
    const nextPhysicalCount = this._clamp(
      this._physicalCount + count,
      DEFAULT_PHYSICAL_COUNT,
      this._virtualCount - this._virtualStart
    );
    const delta = nextPhysicalCount - this._physicalCount;
    let nextIncrease = Math.round(this._physicalCount * 0.5);

    if (delta < 0) {
      return;
    }
    if (delta > 0) {
      const ts = window.performance.now();
      // Concat arrays in place.
      [].push.apply(this._physicalItems, this._createPool(delta));
      // Push 0s into physicalSizes. Can't use Array.fill because IE11 doesn't support it.
      for (let i = 0; i < delta; i++) {
        this._physicalSizes.push(0);
      }
      this._physicalCount = this._physicalCount + delta;
      // Update the physical start if it needs to preserve the model of the focused item.
      // In this situation, the focused item is currently rendered and its model would
      // have changed after increasing the pool if the physical start remained unchanged.
      if (
        this._physicalStart > this._physicalEnd &&
        this._isIndexRendered(this._focusedVirtualIndex) &&
        this._getPhysicalIndex(this._focusedVirtualIndex) < this._physicalEnd
      ) {
        this._physicalStart = this._physicalStart + delta;
      }
      this._update();
      this._templateCost = (window.performance.now() - ts) / delta;
      nextIncrease = Math.round(this._physicalCount * 0.5);
    }
    // The upper bounds is not fixed when dealing with a grid that doesn't
    // fill it's last row with the exact number of items per row.
    if (this._virtualEnd >= this._virtualCount - 1 || nextIncrease === 0) {
      // Do nothing.
    } else if (!this._isClientFull()) {
      this._debounce('_increasePoolIfNeeded', this._increasePoolIfNeeded.bind(this, nextIncrease), microTask);
    } else if (this._physicalSize < this._optPhysicalSize) {
      // Yield and increase the pool during idle time until the physical size is optimal.
      this._debounce(
        '_increasePoolIfNeeded',
        this._increasePoolIfNeeded.bind(this, this._clamp(Math.round(50 / this._templateCost), 1, nextIncrease)),
        idlePeriod
      );
    }
  },

  /**
   * Renders the a new list.
   */
  _render: function () {
    if (!this.isAttached || !this._isVisible) {
      return;
    }
    if (this._physicalCount !== 0) {
      const { physicalTop, indexes } = this._getReusables(true);
      this._physicalTop = physicalTop;
      this._virtualStart = this._virtualStart + indexes.length;
      this._physicalStart = this._physicalStart + indexes.length;
      this._update(indexes);
      this._update();
      this._increasePoolIfNeeded(0);
    } else if (this._virtualCount > 0) {
      // Initial render
      this.updateViewportBoundaries();
      this._increasePoolIfNeeded(DEFAULT_PHYSICAL_COUNT);
    }
  },

  /**
   * Called when the items have changed. That is, reassignments
   * to `items`, splices or updates to a single item.
   */
  _itemsChanged: function (change) {
    if (change.path === 'items') {
      this._virtualStart = 0;
      this._physicalTop = 0;
      this._virtualCount = this.items ? this.items.length : 0;
      this._physicalIndexForKey = {};
      this._firstVisibleIndexVal = null;
      this._lastVisibleIndexVal = null;
      this._physicalCount = this._physicalCount || 0;
      this._physicalItems = this._physicalItems || [];
      this._physicalSizes = this._physicalSizes || [];
      this._physicalStart = 0;
      if (this._scrollTop > this._scrollOffset) {
        this._resetScrollPosition(0);
      }
      this._debounce('_render', this._render, animationFrame);
    }
  },

  /**
   * Executes a provided function per every physical index in `itemSet`
   * `itemSet` default value is equivalent to the entire set of physical indexes.
   *
   * @param {!function(number, number)} fn
   * @param {!Array<number>=} itemSet
   */
  _iterateItems: function (fn, itemSet) {
    let pidx, vidx, rtn, i;

    if (arguments.length === 2 && itemSet) {
      for (i = 0; i < itemSet.length; i++) {
        pidx = itemSet[i];
        vidx = this._computeVidx(pidx);
        if ((rtn = fn.call(this, pidx, vidx)) != null) {
          return rtn;
        }
      }
    } else {
      pidx = this._physicalStart;
      vidx = this._virtualStart;
      for (; pidx < this._physicalCount; pidx++, vidx++) {
        if ((rtn = fn.call(this, pidx, vidx)) != null) {
          return rtn;
        }
      }
      for (pidx = 0; pidx < this._physicalStart; pidx++, vidx++) {
        if ((rtn = fn.call(this, pidx, vidx)) != null) {
          return rtn;
        }
      }
    }
  },

  /**
   * Returns the virtual index for a given physical index
   *
   * @param {number} pidx Physical index
   * @return {number}
   */
  _computeVidx: function (pidx) {
    if (pidx >= this._physicalStart) {
      return this._virtualStart + (pidx - this._physicalStart);
    }
    return this._virtualStart + (this._physicalCount - this._physicalStart) + pidx;
  },

  /**
   * Updates the height for a given set of items.
   *
   * @param {!Array<number>=} itemSet
   */
  _updateMetrics: function (itemSet) {
    // Sometimes the call for this method is schedule before Grid is hidden
    // but it happens when Grid is already hidden.
    // When this happens, there might be some issues as described
    // here https://github.com/vaadin/web-components/issues/2127.
    // Skipping any calculation for a hidden Grid.
    if (this.hidden) {
      return;
    }

    // Make sure we distributed all the physical items
    // so we can measure them.
    flush();

    let newPhysicalSize = 0;
    let oldPhysicalSize = 0;
    const prevAvgCount = this._physicalAverageCount;
    const prevPhysicalAvg = this._physicalAverage;

    this._iterateItems(function (pidx) {
      oldPhysicalSize += this._physicalSizes[pidx];
      this._physicalSizes[pidx] = this._physicalItems[pidx].offsetHeight;
      newPhysicalSize += this._physicalSizes[pidx];
      this._physicalAverageCount += this._physicalSizes[pidx] ? 1 : 0;
    }, itemSet);

    this._physicalSize = this._physicalSize + newPhysicalSize - oldPhysicalSize;

    // Update the average if it measured something.
    if (this._physicalAverageCount !== prevAvgCount) {
      this._physicalAverage = Math.round(
        (prevPhysicalAvg * prevAvgCount + newPhysicalSize) / this._physicalAverageCount
      );
    }
  },

  /**
   * Updates the position of the physical items.
   */
  _positionItems: function () {
    this._adjustScrollPosition();

    let y = this._physicalTop;

    this._iterateItems(function (pidx) {
      this.translate3d(0, y + 'px', 0, this._physicalItems[pidx]);
      y += this._physicalSizes[pidx];
    });
  },

  /**
   * Adjusts the scroll position when it was overestimated.
   */
  _adjustScrollPosition: function () {
    const deltaHeight =
      this._virtualStart === 0 ? this._physicalTop : Math.min(this._scrollPosition + this._physicalTop, 0);
    // Note: the delta can be positive or negative.
    if (deltaHeight !== 0) {
      this._physicalTop = this._physicalTop - deltaHeight;
      const scrollTop = this._scrollTop;
      // juking scroll position during interial scrolling on iOS is no bueno
      if (!IOS_TOUCH_SCROLLING && scrollTop > 0) {
        this._resetScrollPosition(scrollTop - deltaHeight);
      }
    }
  },

  /**
   * Sets the position of the scroll.
   */
  _resetScrollPosition: function (pos) {
    if (this.scrollTarget && pos >= 0) {
      this._scrollTop = pos;
      this._scrollPosition = this._scrollTop;
    }
  },

  /**
   * Sets the scroll height, that's the height of the content,
   *
   * @param {boolean=} forceUpdate If true, updates the height no matter what.
   */
  _updateScrollerSize: function (forceUpdate) {
    this._estScrollHeight =
      this._physicalBottom +
      Math.max(this._virtualCount - this._physicalCount - this._virtualStart, 0) * this._physicalAverage;
    forceUpdate = forceUpdate || this._scrollHeight === 0;
    forceUpdate = forceUpdate || this._scrollPosition >= this._estScrollHeight - this._physicalSize;
    // Amortize height adjustment, so it won't trigger large repaints too often.
    if (forceUpdate || Math.abs(this._estScrollHeight - this._scrollHeight) >= this._viewportHeight) {
      this.$.items.style.height = this._estScrollHeight + 'px';
      this._scrollHeight = this._estScrollHeight;
    }
  },

  /**
   * Scroll to a specific index in the virtual list regardless
   * of the physical items in the DOM tree.
   *
   * @method scrollToIndex
   * @param {number} idx The index of the item
   */
  scrollToIndex: function (idx) {
    if (typeof idx !== 'number' || idx < 0 || idx > this.items.length - 1) {
      return;
    }
    flush();
    // Items should have been rendered prior scrolling to an index.
    if (this._physicalCount === 0) {
      return;
    }
    idx = this._clamp(idx, 0, this._virtualCount - 1);
    // Update the virtual start only when needed.
    if (!this._isIndexRendered(idx) || idx >= this._maxVirtualStart) {
      this._virtualStart = idx - 1;
    }
    this._assignModels();
    this._updateMetrics();
    // Estimate new physical offset.
    this._physicalTop = Math.floor(this._virtualStart) * this._physicalAverage;

    let currentTopItem = this._physicalStart;
    let currentVirtualItem = this._virtualStart;
    let targetOffsetTop = 0;
    const hiddenContentSize = this._hiddenContentSize;
    // scroll to the item as much as we can.
    while (currentVirtualItem < idx && targetOffsetTop <= hiddenContentSize) {
      targetOffsetTop = targetOffsetTop + this._physicalSizes[currentTopItem];
      currentTopItem = (currentTopItem + 1) % this._physicalCount;
      currentVirtualItem++;
    }
    this._updateScrollerSize(true);
    this._positionItems();
    this._resetScrollPosition(this._physicalTop + this._scrollOffset + targetOffsetTop);
    this._increasePoolIfNeeded(0);
    // clear cached visible index.
    this._firstVisibleIndexVal = null;
    this._lastVisibleIndexVal = null;
  },

  /**
   * Reset the physical average and the average count.
   */
  _resetAverage: function () {
    this._physicalAverage = 0;
    this._physicalAverageCount = 0;
  },

  /**
   * A handler for the `iron-resize` event triggered by `IronResizableBehavior`
   * when the element is resized.
   */
  _resizeHandler: function () {
    this._debounce(
      '_render',
      function () {
        // clear cached visible index.
        this._firstVisibleIndexVal = null;
        this._lastVisibleIndexVal = null;
        // Skip the resize event on touch devices when the address bar slides up.
        this.updateViewportBoundaries();
        if (this._isVisible) {
          // Reinstall the scroll event listener.
          this.toggleScrollListener(true);
          this._resetAverage();
          this._render();
        } else {
          // Uninstall the scroll event listener.
          this.toggleScrollListener(false);
        }
      },
      animationFrame
    );
  },

  _isIndexRendered: function (idx) {
    return idx >= this._virtualStart && idx <= this._virtualEnd;
  },

  _getPhysicalIndex: function (vidx) {
    return (this._physicalStart + (vidx - this._virtualStart)) % this._physicalCount;
  },

  _clamp: function (v, min, max) {
    return Math.min(max, Math.max(min, v));
  },

  _debounce: function (name, cb, asyncModule) {
    this._debouncers = this._debouncers || {};
    this._debouncers[name] = Debouncer.debounce(this._debouncers[name], asyncModule, cb.bind(this));
    enqueueDebouncer(this._debouncers[name]);
  }
});
