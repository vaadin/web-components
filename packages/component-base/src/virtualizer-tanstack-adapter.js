/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import {
  defaultRangeExtractor,
  elementScroll,
  observeElementOffset,
  observeElementRect,
  Virtualizer,
} from '@tanstack/virtual-core';
import { animationFrame, microTask, timeOut } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { getBorderBoxBlockSize, reorderChildren } from '@vaadin/component-base/src/dom-utils.js';

globalThis.process ||= { env: {} };

const OVERSCAN_RATIO = 0.25;

const DEFAULT_ESTIMATED_SIZE = 200;

// The underlying virtualizer computes the scroll container height as the sum
// of all item sizes, which for a large enough count would exceed the maximum
// element height supported by browsers. When size is larger than
// MAX_VIRTUAL_COUNT, the underlying virtualizer is given MAX_VIRTUAL_COUNT
// items and a virtual index offset is used to map the indexes it works with
// ("virtual indexes") to the actual index range.
const MAX_VIRTUAL_COUNT = 100000;
const OFFSET_ADJUST_MIN_THRESHOLD = 1000;

/**
 * Pairs each element with a virtual item, reusing the element that already
 * renders an item with the same key. Returns an array of [element, item] pairs:
 * leftover elements are recycled for leftover items in order, and any element
 * with no item left is paired with undefined.
 */
function reconcileByKey(elements, items) {
  const itemByKey = new Map(items.map((item) => [item.key, item]));
  const elementByKey = new Map(elements.map((el) => [el.key, el]));

  const sharedKeySet = new Set(itemByKey.keys()).intersection(new Set(elementByKey.keys()));
  const sharedKeys = [...sharedKeySet];

  const sortedItems = [
    ...sharedKeys.map((key) => itemByKey.get(key)),
    ...items.filter((item) => !sharedKeySet.has(item.key)),
  ];
  const sortedElements = [
    ...sharedKeys.map((key) => elementByKey.get(key)),
    ...elements.filter((el) => !sharedKeySet.has(el.key)),
  ];

  return sortedElements.map((el, index) => [el, sortedItems[index]]);
}

export class TanStackAdapter {
  /** @type {Function} */
  #cleanup;

  /** @type {boolean} */
  #isVisible;

  /** @type {boolean} */
  #mouseDown;

  /** @type {Virtualizer} */
  #virtualizer;

  /** @type {ResizeObserver} */
  #resizeObserver;

  /** @type {Debouncer} */
  #renderDebouncer;

  /** @type {Debouncer} */
  #reorderElementsDebouncer;

  /** @type {number} */
  #size = 0;

  /** @type {number} */
  #indexOffset = 0;

  /** @type {number} */
  #scrollPosition = 0;

  /** @type {boolean} */
  #skipIndexOffsetAdjust = false;

  constructor({ createElements, updateElement, scrollTarget, scrollContainer, elementsContainer, reorderElements }) {
    this.createElements = createElements;
    this.updateElement = updateElement;

    /** @type {HTMLElement} */
    this.scrollTarget = scrollTarget;

    /** @type {HTMLElement} */
    this.scrollContainer = scrollContainer;

    /** @type {HTMLElement} */
    this.elementsContainer = elementsContainer || scrollContainer;

    /** @type {boolean} */
    this.reorderElements = reorderElements;

    const scrollTargetRect = this.scrollTarget.getBoundingClientRect();
    const scrollTargetComputedStyle = getComputedStyle(this.scrollTarget);
    const scrollContainerComputedStyle = getComputedStyle(this.scrollContainer);

    if (scrollTargetComputedStyle.overflow === 'visible') {
      this.scrollTarget.style.overflow = 'auto';
    }

    if (scrollContainerComputedStyle.position === 'static') {
      this.scrollContainer.style.position = 'relative';
    }

    this.#virtualizer = new Virtualizer({
      count: 0,
      initialRect: scrollTargetRect,
      observeElementRect,
      observeElementOffset,
      scrollToFn: elementScroll,
      onChange: (_instance, sync) => {
        this.#onChange(sync);
      },
      estimateSize: () => {
        return this.#averageSize;
      },
      rangeExtractor: (range) => {
        return defaultRangeExtractor({ ...range, overscan: this.#overscan });
      },
      getScrollElement: () => {
        return this.scrollTarget;
      },
    });

    this.#resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        this.#measureElement(entry.target, entry);
      });

      // Rendering in the same frame would re-trigger the observer and cause
      // a "ResizeObserver loop" error. Push the render to the next frame.
      if (this.#renderDebouncer?.isActive()) {
        this.#renderDebouncer.cancel();
        this.#renderDebouncer = Debouncer.debounce(this.#renderDebouncer, animationFrame, () => this.#render());
      }
    });

    if (this.reorderElements) {
      // Reordering the physical elements cancels the user's grab of the scroll bar handle on Safari.
      // Need to defer reordering until the user lets go of the scroll bar handle.
      // Related: https://github.com/vaadin/web-components/issues/12099
      this.scrollTarget.addEventListener('mousedown', (event) => {
        if (event.target !== this.scrollTarget) {
          return;
        }
        this.#mouseDown = true;
      });

      this.scrollTarget.addEventListener('mouseup', () => {
        this.#mouseDown = false;
        this.flush();
      });

      this.elementsContainer.addEventListener('focusin', () => {
        this.#onElementFocused();
      });
    }
  }

  get size() {
    return this.#size;
  }

  set size(size) {
    if (size === this.size) {
      return;
    }

    // Record the scroll position before changing the size
    const shouldRestoreScrollPosition = size > 0 && this.scrollTarget.scrollTop > 0;
    let fvi; // First visible index
    let fviOffsetBefore; // Scroll offset of the first visible index
    if (shouldRestoreScrollPosition) {
      fvi = this.adjustedFirstVisibleIndex;
      fviOffsetBefore = this.#getIndexScrollOffset(fvi);
    }

    this.#size = size;
    this.#virtualizer.setOptions({ ...this.#virtualizer.options, count: Math.min(size, MAX_VIRTUAL_COUNT) });
    this.#indexOffset = Math.max(0, Math.min(this.#indexOffset, this.#maxIndexOffset));

    this.#render();

    if (shouldRestoreScrollPosition) {
      // Note, calling scrollToIndex also updates the virtual index offset,
      // causing the virtualizer to add more items when size is increased,
      // and remove exceeding items when size is decreased.
      fvi = Math.min(fvi, size - 1);
      this.scrollToIndex(fvi);
      this.#restoreScrollOffset(fvi, fviOffsetBefore);
    }

    this.flush();
  }

  get adjustedFirstVisibleIndex() {
    return this.#virtualizer.range.startIndex + this.#indexOffset;
  }

  get adjustedLastVisibleIndex() {
    return this.#virtualizer.range.endIndex + this.#indexOffset;
  }

  scrollToIndex(index) {
    if (typeof index !== 'number' || isNaN(index) || this.size === 0 || !this.scrollTarget.offsetHeight) {
      return;
    }

    index = Math.max(0, Math.min(index, this.size - 1));

    // Pick a virtual index to scroll to and a virtual index offset that maps
    // it to the requested index, in a way that leaves the user room to scroll
    // to the actual first and last index (see #adjustIndexOffset).
    const visibleElementCount = this.#visibleElements.length;
    let targetVirtualIndex = Math.floor((index / this.size) * this.#virtualCount);
    if (this.#virtualCount - targetVirtualIndex < visibleElementCount) {
      targetVirtualIndex = this.#virtualCount - (this.size - index);
      this.#indexOffset = this.#maxIndexOffset;
    } else if (targetVirtualIndex < visibleElementCount) {
      if (index < OFFSET_ADJUST_MIN_THRESHOLD) {
        targetVirtualIndex = index;
        this.#indexOffset = 0;
      } else {
        targetVirtualIndex = OFFSET_ADJUST_MIN_THRESHOLD;
        this.#indexOffset = index - targetVirtualIndex;
      }
    } else {
      this.#indexOffset = index - targetVirtualIndex;
    }

    // The scroll position change originates from the virtualizer itself,
    // so it must not affect the virtual index offset computed above.
    this.#skipIndexOffsetAdjust = true;
    try {
      this.#virtualizer.scrollToIndex(targetVirtualIndex, { align: 'start' });

      // TanStack normally settles the scroll position asynchronously via rAF
      // (scheduleScrollReconcile). Drive that loop synchronously: sync the
      // scroll offset, render so newly visible items get measured, then let
      // reconcileScroll recompute the target and re-scroll. Repeat until
      // reconcileScroll clears scrollState.
      while (this.#virtualizer.scrollState) {
        this.#virtualizer.scrollOffset = this.scrollTarget.scrollTop;
        this.#render();
        this.#renderDebouncer?.flush();
        this.#virtualizer.reconcileScroll();
      }
    } finally {
      this.#skipIndexOffsetAdjust = false;
    }
  }

  hostConnected() {
    this.#cleanup = this.#virtualizer._didMount();
    this.#virtualizer._willUpdate();
  }

  hostDisconnected() {
    this.#cleanup?.();
    this.#resizeObserver.disconnect();
  }

  update(startIndex = 0, endIndex = this.size - 1) {
    const updatedElements = [];

    this.#elements.forEach((el) => {
      if (el.hidden) {
        return;
      }

      const index = parseInt(el.dataset.index);
      if (startIndex <= index && index <= endIndex) {
        this.updateElement(el, index);
        updatedElements.push(el);
      }
    });

    updatedElements.forEach((el) => {
      this.#measureElement(el);
    });
  }

  #onChange(sync) {
    const { scrollRect } = this.#virtualizer;

    const isVisible = scrollRect.width > 0 || scrollRect.height > 0;
    if (isVisible !== this.#isVisible) {
      this.#isVisible = isVisible;

      if (isVisible) {
        // The browser resets scrollTop to 0 when the scroll target is moved
        // in the DOM. If that happens while the scroll target is hidden,
        // the position can't be restored right away since a hidden element
        // ignores scrollTop writes, so restore it once visible again.
        this.#restoreScrollPosition();
      }
    }

    if (sync) {
      this.#render();
    } else {
      this.#renderDebouncer = Debouncer.debounce(this.#renderDebouncer, microTask, () => this.#render());
    }
  }

  #restoreScrollPosition() {
    const scrollOffset = this.#virtualizer.getScrollOffset();
    if (this.scrollTarget.scrollTop !== scrollOffset) {
      this.#virtualizer.scrollToOffset(scrollOffset);
    }
  }

  #render() {
    this.#renderDebouncer?.cancel();

    const scrollPosition = this.#virtualizer.scrollOffset ?? 0;
    const delta = scrollPosition - this.#scrollPosition;
    this.#scrollPosition = scrollPosition;
    if (delta !== 0 && !this.#skipIndexOffsetAdjust) {
      this.#adjustIndexOffset(delta);
    }

    this.scrollContainer.style.height = `${this.#virtualizer.getTotalSize()}px`;

    if (this.#virtualizer.isScrolling) {
      this.scrollTarget.style.overscrollBehavior = 'none';
    } else {
      this.scrollTarget.style.overscrollBehavior = null;
    }

    this.#createElementsIfNeeded();
    this.#renderElements();
    this.#scheduleReorderElements();
  }

  #measureElement(element, entry) {
    if (element.hidden) {
      return;
    }

    const height = Math.ceil(entry ? entry.borderBoxSize[0].blockSize : getBorderBoxBlockSize(element));
    if (height > 0) {
      // The element's key equals the virtual index of the item it renders,
      // regardless of the current virtual index offset.
      this.#virtualizer.resizeItem(element.key, height);
    }
  }

  #createElementsIfNeeded() {
    const missingCount = this.#virtualItems.length - this.#elements.length;
    if (missingCount > 0) {
      const fragment = document.createDocumentFragment();

      this.createElements(missingCount).forEach((el) => {
        el.hidden = true;
        el.style.top = '0';
        el.style.left = '0';
        el.style.position = 'absolute';
        fragment.appendChild(el);
      });

      this.elementsContainer.appendChild(fragment);
    }
  }

  #renderElements() {
    const updatedElements = [];

    reconcileByKey(this.#elements, this.#virtualItems).forEach(([el, item]) => {
      if (!item) {
        el.key = null;
        el.hidden = true;
        el.style.translate = '';
        delete el.dataset.index;
        this.#resizeObserver.unobserve(el);
        return;
      }

      const oldIndex = parseInt(el.dataset.index);
      const newIndex = item.index + this.#indexOffset;

      el.key = item.key;
      el.hidden = false;
      el.dataset.index = newIndex;
      el.style.translate = `0px ${item.start}px`;
      this.#resizeObserver.observe(el, { box: 'border-box' });

      if (oldIndex !== newIndex) {
        this.updateElement(el, newIndex);
        updatedElements.push(el);
      }
    });

    updatedElements.forEach((el) => {
      this.#measureElement(el);
    });
  }

  #scheduleReorderElements() {
    if (!this.reorderElements) {
      return;
    }

    this.#reorderElementsDebouncer = Debouncer.debounce(this.#reorderElementsDebouncer, timeOut.after(500), () => {
      if (this.#mouseDown) {
        this.#scheduleReorderElements();
        return;
      }

      this.#reorderElements();
    });
  }

  #reorderElements() {
    reorderChildren(this.elementsContainer, (a, b) => {
      const aIndex = parseInt(a.dataset.index);
      const bIndex = parseInt(b.dataset.index);
      return aIndex - bIndex;
    });
  }

  #onElementFocused() {
    const focusedElement = this.#visibleElements.find((el) => el.matches(':focus-within'));
    if (!focusedElement) {
      return;
    }

    // The focusable sibling in the given direction (1 = next, -1 = previous)
    // is missing when there is an item available in that direction while the
    // element rendering its index is not the focused element's DOM-order
    // neighbor (out of order or not rendered at all).
    const focusableSiblingMissing = (direction) => {
      const siblingIndex = parseInt(focusedElement.dataset.index) + direction;
      const visibleElements = this.#visibleElements;
      const siblingElement = visibleElements[visibleElements.indexOf(focusedElement) + direction];
      return (
        siblingIndex >= 0 &&
        siblingIndex < this.size &&
        (!siblingElement || parseInt(siblingElement.dataset.index) !== siblingIndex)
      );
    };

    // The user has tabbed to or within a virtualizer element. Check if a next
    // or previous focusable sibling is missing while it should be there (so
    // the user can continue tabbing). The sibling might be missing because
    // the elements are not yet in the correct DOM order. First try rendering
    // and reordering at the current scroll position.
    if (focusableSiblingMissing(1) || focusableSiblingMissing(-1)) {
      this.flush();
    }

    // If the focusable sibling is still missing (because the focused element
    // is at the edge of the viewport and the virtualizer hasn't had the need
    // to recycle elements), scroll by how far the focused element sticks out
    // of the viewport, plus a pixel to reveal the sibling and force the
    // virtualizer to recycle. Rounding up keeps the sibling revealed with
    // fractional element positions.
    if (focusableSiblingMissing(1)) {
      const overflow = focusedElement.getBoundingClientRect().bottom - this.scrollTarget.getBoundingClientRect().bottom;
      this.scrollTarget.scrollTop += Math.ceil(overflow) + 1;
      this.flush();
    } else if (focusableSiblingMissing(-1)) {
      const overflow = this.scrollTarget.getBoundingClientRect().top - focusedElement.getBoundingClientRect().top;
      this.scrollTarget.scrollTop -= Math.ceil(overflow) + 1;
      this.flush();
    }
  }

  flush() {
    // The scroll position may have changed (e.g. by the browser scrolling
    // the focused element into view) with the scroll event not fired yet,
    // so sync the scroll offset and render in that case. Skip this for a
    // hidden scroll target whose scrollTop reads 0, to preserve the offset
    // for restoring once the target becomes visible again.
    if (this.scrollTarget.offsetHeight > 0 && this.#virtualizer.scrollOffset !== this.scrollTarget.scrollTop) {
      this.#virtualizer.scrollOffset = this.scrollTarget.scrollTop;
      this.#render();
    }

    this.#renderDebouncer?.flush();
    this.#reorderElementsDebouncer?.flush();
  }

  get #averageSize() {
    const sizes = [...this.#virtualizer.itemSizeCache.values()];
    if (sizes.length === 0) {
      return DEFAULT_ESTIMATED_SIZE;
    }
    return sizes.reduce((acc, size) => acc + size, 0) / sizes.length;
  }

  get #overscan() {
    const averageVisibleCount = Math.ceil(this.#virtualizer.scrollRect.height / this.#averageSize);
    return Math.max(1, Math.ceil(averageVisibleCount * OVERSCAN_RATIO));
  }

  /** The item count the underlying virtualizer works with */
  get #virtualCount() {
    return this.#virtualizer.options.count;
  }

  /** The maximum valid virtual index offset for the current size */
  get #maxIndexOffset() {
    return this.size - this.#virtualCount;
  }

  /**
   * Adjusts the virtual index offset based on a scroll position change so
   * that a scroll bar drag maps the full scroll range to the full index
   * range, and the user can always slowly scroll to the actual first and
   * last index.
   *
   * @param {number} delta - The scroll offset change
   */
  #adjustIndexOffset(delta) {
    const maxOffset = this.#maxIndexOffset;

    if (maxOffset <= 0) {
      this.#indexOffset = 0;
      return;
    }

    const scrollTop = this.scrollTarget.scrollTop;
    const maxScrollTop = this.scrollTarget.scrollHeight - this.scrollTarget.clientHeight;

    if (Math.abs(delta) > 10000) {
      // Process a large scroll position change (e.g. a scroll bar drag)
      const scale = maxScrollTop > 0 ? scrollTop / maxScrollTop : 0;
      this.#indexOffset = Math.round(scale * maxOffset);
      return;
    }

    // Make sure the user can always swipe/wheel scroll to the start and end
    const threshold = OFFSET_ADJUST_MIN_THRESHOLD;
    const maxShift = 100;
    const firstVisibleVirtualIndex = this.#virtualizer.range?.startIndex ?? 0;

    // Near start
    if (scrollTop === 0) {
      // At the actual start, drop the remaining offset so the actual
      // first indexes are rendered
      this.#indexOffset = 0;
    } else if (firstVisibleVirtualIndex < threshold && this.#indexOffset > 0) {
      this.#shiftIndexOffset(-Math.min(this.#indexOffset, maxShift));
    }

    // Near end
    if (scrollTop >= maxScrollTop && maxScrollTop > 0) {
      // At the actual end, use the max offset so the actual last indexes
      // are rendered
      this.#indexOffset = maxOffset;
    } else if (this.#virtualCount - firstVisibleVirtualIndex < threshold && this.#indexOffset < maxOffset) {
      this.#shiftIndexOffset(Math.min(maxOffset - this.#indexOffset, maxShift));
    }
  }

  /**
   * Shifts the virtual index offset by the given amount while keeping the
   * currently visible items in place. Changing the offset relabels each
   * virtual index to a new actual index, so the scroll position is adjusted
   * by the distance between the anchor item's old and new virtual index.
   *
   * @param {number} shift - The amount to shift the virtual index offset by
   */
  #shiftIndexOffset(shift) {
    const anchorVirtualIndex = this.#virtualizer.range?.startIndex;
    this.#indexOffset += shift;

    const measurements = this.#virtualizer.measurementsCache;
    const anchorBefore = measurements[anchorVirtualIndex];
    const anchorAfter = measurements[anchorVirtualIndex - shift];
    if (anchorBefore && anchorAfter) {
      this.scrollTarget.scrollTop += anchorAfter.start - anchorBefore.start;
      this.#virtualizer.scrollOffset = this.scrollTarget.scrollTop;
      this.#scrollPosition = this.#virtualizer.scrollOffset;
    }
  }

  /**
   * Returns the scroll offset of the element rendering the given index,
   * relative to the scroll target's top, or undefined if not rendered.
   *
   * @param {number} index
   */
  #getIndexScrollOffset(index) {
    const element = this.#visibleElements.find((el) => parseInt(el.dataset.index) === index);
    return element ? this.scrollTarget.getBoundingClientRect().top - element.getBoundingClientRect().top : undefined;
  }

  /**
   * Adjusts the scroll position to compensate for any offset change of a given index.
   *
   * @param {number} index - The index whose scroll offset to restore
   * @param {number | undefined} offsetBefore - The scroll offset of the index before the change
   */
  #restoreScrollOffset(index, offsetBefore) {
    const offsetAfter = this.#getIndexScrollOffset(index);
    if (offsetBefore !== undefined && offsetAfter !== undefined) {
      this.scrollTarget.scrollTop += offsetBefore - offsetAfter;
    }
  }

  get #virtualItems() {
    return this.#virtualizer.getVirtualItems();
  }

  get #elements() {
    return [...this.elementsContainer.children];
  }

  get #visibleElements() {
    return this.#elements.filter((el) => !el.hidden);
  }
}
