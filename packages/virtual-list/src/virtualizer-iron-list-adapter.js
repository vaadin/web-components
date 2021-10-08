import { timeOut, animationFrame } from '@vaadin/component-base/src/async.js';
import { Debouncer, flush } from '@vaadin/component-base/src/debounce.js';
import { ironList } from './iron-list.js';

// iron-list can by default handle sizes up to around 100000.
// When the size is larger than MAX_VIRTUAL_COUNT _vidxOffset is used
const MAX_VIRTUAL_COUNT = 100000;
const OFFSET_ADJUST_MIN_THRESHOLD = 1000;

export class IronListAdapter {
  constructor({ createElements, updateElement, scrollTarget, scrollContainer, elementsContainer, reorderElements }) {
    this.isAttached = true;
    this._vidxOffset = 0;
    this.createElements = createElements;
    this.updateElement = updateElement;
    this.scrollTarget = scrollTarget;
    this.scrollContainer = scrollContainer;
    this.elementsContainer = elementsContainer || scrollContainer;
    this.reorderElements = reorderElements;

    this.__safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    this.timeouts = {
      SCROLL_REORDER: 500,
      IGNORE_WHEEL: 500
    };

    this.__resizeObserver = new ResizeObserver(() => this._resizeHandler());

    if (getComputedStyle(this.scrollTarget).overflow === 'visible') {
      this.scrollTarget.style.overflow = 'auto';
    }

    if (getComputedStyle(this.scrollContainer).position === 'static') {
      this.scrollContainer.style.position = 'relative';
    }

    this.__resizeObserver.observe(this.scrollTarget);
    this.scrollTarget.addEventListener('scroll', () => this._scrollHandler());

    this._scrollLineHeight = this._getScrollLineHeight();
    this.scrollTarget.addEventListener('wheel', (e) => this.__onWheel(e));

    if (this.reorderElements) {
      // Reordering the physical elements cancels the user's grab of the scroll bar handle on Safari.
      // Need to defer reordering until the user lets go of the scroll bar handle.
      this.scrollTarget.addEventListener('mousedown', () => (this.__mouseDown = true));
      this.scrollTarget.addEventListener('mouseup', () => {
        this.__mouseDown = false;
        if (this.__pendingReorder) {
          this.__reorderElements();
        }
      });
    }
  }

  _manageFocus() {}

  _removeFocusedItem() {}

  get scrollOffset() {
    return 0;
  }

  get adjustedFirstVisibleIndex() {
    return this.firstVisibleIndex + this._vidxOffset;
  }

  get adjustedLastVisibleIndex() {
    return this.lastVisibleIndex + this._vidxOffset;
  }

  scrollToIndex(index) {
    if (typeof index !== 'number' || isNaN(index) || this.size === 0 || !this.scrollTarget.offsetHeight) {
      return;
    }
    index = this._clamp(index, 0, this.size - 1);

    const visibleElementCount = this.__getVisibleElements().length;
    let targetVirtualIndex = Math.floor((index / this.size) * this._virtualCount);
    if (this._virtualCount - targetVirtualIndex < visibleElementCount) {
      targetVirtualIndex = this._virtualCount - (this.size - index);
      this._vidxOffset = this.size - this._virtualCount;
    } else if (targetVirtualIndex < visibleElementCount) {
      if (index < OFFSET_ADJUST_MIN_THRESHOLD) {
        targetVirtualIndex = index;
        this._vidxOffset = 0;
      } else {
        targetVirtualIndex = OFFSET_ADJUST_MIN_THRESHOLD;
        this._vidxOffset = index - targetVirtualIndex;
      }
    } else {
      this._vidxOffset = index - targetVirtualIndex;
    }

    this.__skipNextVirtualIndexAdjust = true;
    super.scrollToIndex(targetVirtualIndex);
    if (this.firstVisibleIndex !== index - this._vidxOffset && this._scrollTop < this._maxScrollTop && !this.grid) {
      // Second invocation to scrollToIndex may be needed to workaround an issue in iron-list
      super.scrollToIndex(targetVirtualIndex);
    }
    this._scrollHandler();
  }

  flush() {
    // The scroll target is hidden.
    if (this.scrollTarget.offsetHeight === 0) {
      return;
    }

    this._resizeHandler();
    flush();
    this._scrollHandler();
    this.__scrollReorderDebouncer && this.__scrollReorderDebouncer.flush();
    this.__debouncerWheelAnimationFrame && this.__debouncerWheelAnimationFrame.flush();
  }

  update(startIndex = 0, endIndex = this.size - 1) {
    this.__getVisibleElements().forEach((el) => {
      if (el.__virtualIndex >= startIndex && el.__virtualIndex <= endIndex) {
        this.__updateElement(el, el.__virtualIndex);
      }
    });
  }

  __updateElement(el, index) {
    // Clean up temporary min height
    if (el.style.minHeight) {
      el.style.minHeight = '';
    }

    this.updateElement(el, index);

    if (el.offsetHeight === 0) {
      // If the elements have 0 height after update (for example due to lazy rendering),
      // it results in iron-list requesting to create an unlimited count of elements.
      // Assign a temporary min height to elements that would otherwise end up having
      // no height.
      el.style.minHeight = '200px';
    }
  }

  __getIndexScrollOffset(index) {
    const element = this.__getVisibleElements().find((el) => el.__virtualIndex === index);
    return element ? this.scrollTarget.getBoundingClientRect().top - element.getBoundingClientRect().top : undefined;
  }

  set size(size) {
    if (size === this.size) {
      return;
    }

    // Record the scroll position before changing the size
    let fvi; // first visible index
    let fviOffsetBefore; // scroll offset of the first visible index
    if (size > 0) {
      fvi = this.firstVisibleIndex + this._vidxOffset;
      fviOffsetBefore = this.__getIndexScrollOffset(fvi);
    }

    // Change the size
    this.__size = size;

    // Flush before invoking items change to avoid
    // creating excess elements on the following flush()
    flush();

    this._itemsChanged({
      path: 'items'
    });
    flush();

    // Try to restore the scroll position if the new size is larger than 0
    if (size > 0) {
      fvi = Math.min(fvi, size - 1);
      this.scrollToIndex(fvi);

      const fviOffsetAfter = this.__getIndexScrollOffset(fvi);
      if (fviOffsetBefore !== undefined && fviOffsetAfter !== undefined) {
        this._scrollTop += fviOffsetBefore - fviOffsetAfter;
      }
    }

    if (!this.elementsContainer.children.length) {
      requestAnimationFrame(() => this._resizeHandler());
    }
  }

  get size() {
    return this.__size;
  }

  /** @private */
  get _scrollTop() {
    return this.scrollTarget.scrollTop;
  }

  /** @private */
  set _scrollTop(top) {
    this.scrollTarget.scrollTop = top;
  }

  /** @private */
  get items() {
    return {
      length: Math.min(this.size, MAX_VIRTUAL_COUNT)
    };
  }

  /** @private */
  get offsetHeight() {
    return this.scrollTarget.offsetHeight;
  }

  /** @private */
  get $() {
    return {
      items: this.scrollContainer
    };
  }

  /** @private */
  updateViewportBoundaries() {
    const styles = window.getComputedStyle(this.scrollTarget);
    this._scrollerPaddingTop = this.scrollTarget === this ? 0 : parseInt(styles['padding-top'], 10);
    this._isRTL = Boolean(styles.direction === 'rtl');
    this._viewportWidth = this.elementsContainer.offsetWidth;
    this._viewportHeight = this.scrollTarget.offsetHeight;
    this._scrollPageHeight = this._viewportHeight - this._scrollLineHeight;
    this.grid && this._updateGridMetrics();
  }

  /** @private */
  setAttribute() {}

  /** @private */
  _createPool(size) {
    const physicalItems = this.createElements(size);
    const fragment = document.createDocumentFragment();
    physicalItems.forEach((el) => {
      el.style.position = 'absolute';
      fragment.appendChild(el);
      this.__resizeObserver.observe(el);
    });
    this.elementsContainer.appendChild(fragment);
    return physicalItems;
  }

  /** @private */
  _assignModels(itemSet) {
    this._iterateItems((pidx, vidx) => {
      const el = this._physicalItems[pidx];
      el.hidden = vidx >= this.size;
      if (!el.hidden) {
        el.__virtualIndex = vidx + (this._vidxOffset || 0);
        this.__updateElement(el, el.__virtualIndex);
      }
    }, itemSet);
  }

  /** @private */
  _isClientFull() {
    // Workaround an issue in iron-list that can cause it to freeze on fast scroll
    setTimeout(() => (this.__clientFull = true));
    return this.__clientFull || super._isClientFull();
  }

  /** @private */
  translate3d(_x, y, _z, el) {
    el.style.transform = `translateY(${y})`;
  }

  /** @private */
  toggleScrollListener() {}

  _scrollHandler() {
    this._adjustVirtualIndexOffset(this._scrollTop - (this.__previousScrollTop || 0));

    super._scrollHandler();

    if (this.reorderElements) {
      this.__scrollReorderDebouncer = Debouncer.debounce(
        this.__scrollReorderDebouncer,
        timeOut.after(this.timeouts.SCROLL_REORDER),
        () => this.__reorderElements()
      );
    }

    this.__previousScrollTop = this._scrollTop;
  }

  /** @private */
  __onWheel(e) {
    if (e.ctrlKey || this._hasScrolledAncestor(e.target, e.deltaX, e.deltaY)) {
      return;
    }

    let deltaY = e.deltaY;
    if (e.deltaMode === WheelEvent.DOM_DELTA_LINE) {
      // Scrolling by "lines of text" instead of pixels
      deltaY *= this._scrollLineHeight;
    } else if (e.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
      // Scrolling by "pages" instead of pixels
      deltaY *= this._scrollPageHeight;
    }

    this._deltaYAcc = this._deltaYAcc || 0;

    if (this._wheelAnimationFrame) {
      // Accumulate wheel delta while a frame is being processed
      this._deltaYAcc += deltaY;
      e.preventDefault();
      return;
    }

    deltaY += this._deltaYAcc;
    this._deltaYAcc = 0;

    this._wheelAnimationFrame = true;
    this.__debouncerWheelAnimationFrame = Debouncer.debounce(
      this.__debouncerWheelAnimationFrame,
      animationFrame,
      () => (this._wheelAnimationFrame = false)
    );

    const momentum = Math.abs(e.deltaX) + Math.abs(deltaY);

    if (this._canScroll(this.scrollTarget, e.deltaX, deltaY)) {
      e.preventDefault();
      this.scrollTarget.scrollTop += deltaY;
      this.scrollTarget.scrollLeft += e.deltaX;

      this._hasResidualMomentum = true;

      this._ignoreNewWheel = true;
      this._debouncerIgnoreNewWheel = Debouncer.debounce(
        this._debouncerIgnoreNewWheel,
        timeOut.after(this.timeouts.IGNORE_WHEEL),
        () => (this._ignoreNewWheel = false)
      );
    } else if ((this._hasResidualMomentum && momentum <= this._previousMomentum) || this._ignoreNewWheel) {
      e.preventDefault();
    } else if (momentum > this._previousMomentum) {
      this._hasResidualMomentum = false;
    }
    this._previousMomentum = momentum;
  }

  /**
   * Determines if the element has an ancestor that handles the scroll delta prior to this
   *
   * @private
   */
  _hasScrolledAncestor(el, deltaX, deltaY) {
    if (el === this.scrollTarget || el === this.scrollTarget.getRootNode().host) {
      return false;
    } else if (
      this._canScroll(el, deltaX, deltaY) &&
      ['auto', 'scroll'].indexOf(getComputedStyle(el).overflow) !== -1
    ) {
      return true;
    } else if (el !== this && el.parentElement) {
      return this._hasScrolledAncestor(el.parentElement, deltaX, deltaY);
    }
  }

  _canScroll(el, deltaX, deltaY) {
    return (
      (deltaY > 0 && el.scrollTop < el.scrollHeight - el.offsetHeight) ||
      (deltaY < 0 && el.scrollTop > 0) ||
      (deltaX > 0 && el.scrollLeft < el.scrollWidth - el.offsetWidth) ||
      (deltaX < 0 && el.scrollLeft > 0)
    );
  }

  /**
   * @returns {Number|undefined} - The browser's default font-size in pixels
   * @private
   */
  _getScrollLineHeight() {
    const el = document.createElement('div');
    el.style.fontSize = 'initial';
    el.style.display = 'none';
    document.body.appendChild(el);
    const fontSize = window.getComputedStyle(el).fontSize;
    document.body.removeChild(el);
    return fontSize ? window.parseInt(fontSize) : undefined;
  }

  __getVisibleElements() {
    return Array.from(this.elementsContainer.children).filter((element) => !element.hidden);
  }

  /** @private */
  __reorderElements() {
    if (this.__mouseDown) {
      this.__pendingReorder = true;
      return;
    }
    this.__pendingReorder = false;

    const adjustedVirtualStart = this._virtualStart + (this._vidxOffset || 0);

    // Which row to use as a target?
    const visibleElements = this.__getVisibleElements();

    const elementWithFocus = visibleElements.find(
      (element) =>
        element.contains(this.elementsContainer.getRootNode().activeElement) ||
        element.contains(this.scrollTarget.getRootNode().activeElement)
    );
    const targetElement = elementWithFocus || visibleElements[0];
    if (!targetElement) {
      // All elements are hidden, don't reorder
      return;
    }

    // Where the target row should be?
    const targetPhysicalIndex = targetElement.__virtualIndex - adjustedVirtualStart;

    // Reodrer the DOM elements to keep the target row at the target physical index
    const delta = visibleElements.indexOf(targetElement) - targetPhysicalIndex;
    if (delta > 0) {
      for (let i = 0; i < delta; i++) {
        this.elementsContainer.appendChild(visibleElements[i]);
      }
    } else if (delta < 0) {
      for (let i = visibleElements.length + delta; i < visibleElements.length; i++) {
        this.elementsContainer.insertBefore(visibleElements[i], visibleElements[0]);
      }
    }

    // Due to a rendering bug, reordering the rows can make parts of the scroll target disappear
    // on Safari when using sticky positioning in case the scroll target is inside a flexbox.
    // This issue manifests with grid (the header can disappear if grid is used inside a flexbox)
    if (this.__safari) {
      const { transform } = this.scrollTarget.style;
      this.scrollTarget.style.transform = 'translateZ(0)';
      setTimeout(() => (this.scrollTarget.style.transform = transform));
    }
  }

  /** @private */
  _adjustVirtualIndexOffset(delta) {
    if (this._virtualCount >= this.size) {
      this._vidxOffset = 0;
    } else if (this.__skipNextVirtualIndexAdjust) {
      this.__skipNextVirtualIndexAdjust = false;
      return;
    } else if (Math.abs(delta) > 10000) {
      // Process a large scroll position change
      const scale = this._scrollTop / (this.scrollTarget.scrollHeight - this.scrollTarget.offsetHeight);
      const offset = scale * this.size;
      this._vidxOffset = Math.round(offset - scale * this._virtualCount);
    } else {
      // Make sure user can always swipe/wheel scroll to the start and end
      const oldOffset = this._vidxOffset;
      const threshold = OFFSET_ADJUST_MIN_THRESHOLD;
      const maxShift = 100;

      // Near start
      if (this._scrollTop === 0) {
        this._vidxOffset = 0;
        if (oldOffset !== this._vidxOffset) {
          super.scrollToIndex(0);
        }
      } else if (this.firstVisibleIndex < threshold && this._vidxOffset > 0) {
        this._vidxOffset -= Math.min(this._vidxOffset, maxShift);
        super.scrollToIndex(this.firstVisibleIndex + (oldOffset - this._vidxOffset));
      }

      // Near end
      const maxOffset = this.size - this._virtualCount;
      if (this._scrollTop >= this._maxScrollTop && this._maxScrollTop > 0) {
        this._vidxOffset = maxOffset;
        if (oldOffset !== this._vidxOffset) {
          super.scrollToIndex(this._virtualCount - 1);
        }
      } else if (this.firstVisibleIndex > this._virtualCount - threshold && this._vidxOffset < maxOffset) {
        this._vidxOffset += Math.min(maxOffset - this._vidxOffset, maxShift);
        super.scrollToIndex(this.firstVisibleIndex - (this._vidxOffset - oldOffset));
      }
    }
  }
}

Object.setPrototypeOf(IronListAdapter.prototype, ironList);
