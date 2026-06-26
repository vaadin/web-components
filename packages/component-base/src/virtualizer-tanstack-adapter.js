/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { elementScroll, observeElementOffset, observeElementRect, Virtualizer } from '@tanstack/virtual-core';
import { microTask, timeOut } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { getBorderBoxBlockSize, reorderChildren } from '@vaadin/component-base/src/dom-utils.js';

globalThis.process ||= { env: {} };

// Mirrors the iron-list adapter's `_maxPages`: the pool keeps roughly one
// viewport of items plus a buffer above and below, so the list can recycle
// while scrolling without leaving empty space.
const MAX_PAGES = 1.3;

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
  #cleanup;
  #isVisible;
  #resizeRaf;
  #virtualizer;
  #estimatedSize = 200;
  #resizeObserver;
  #renderDebouncer;
  #reorderElementsDebouncer;

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
      rangeExtractor: ({ startIndex, count }) => {
        // Render a fixed-size pool of items, like iron-list, instead of padding
        // the visible range with overscan. TanStack's default overscan is
        // symmetric and clamped at the top, so it renders fewer items near the
        // start of the list. A fixed pool keeps the count stable everywhere.
        const poolSize = Math.min(count, this.#getPoolSize());
        const start = Math.min(startIndex, count - poolSize);
        return Array.from({ length: poolSize }, (_, i) => start + i);
      },
      initialRect: scrollTargetRect,
      observeElementRect,
      observeElementOffset,
      scrollToFn: elementScroll,
      onChange: (_instance, sync) => {
        this.#onChange(sync);
      },
      estimateSize: () => {
        return this.#estimatedSize;
      },
      getScrollElement: () => {
        return this.scrollTarget;
      },
    });

    this.#resizeObserver = new ResizeObserver((entries) => {
      cancelAnimationFrame(this.#resizeRaf);

      this.#resizeRaf = requestAnimationFrame(() => {
        entries.forEach((entry) => {
          this.#measureElement(entry.target, entry);
        });
      });
    });
  }

  get size() {
    return this.#virtualizer.options.count;
  }

  set size(size) {
    this.#virtualizer.setOptions({ ...this.#virtualizer.options, count: size });
    this.#render();
    this.flush();
  }

  get adjustedFirstVisibleIndex() {
    return this.#virtualizer.range.startIndex;
  }

  get adjustedLastVisibleIndex() {
    return this.#virtualizer.range.endIndex;
  }

  scrollToIndex(index) {
    this.#virtualizer.scrollToIndex(index, { align: 'start' });

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
      this.#onVisibilityChange(isVisible);
      this.#isVisible = isVisible;
    }

    this.#updateOverscrollBehavior();
    this.#updateEstimatedSize();

    if (sync) {
      this.#render();
    } else {
      this.#scheduleRender();
    }
  }

  #onVisibilityChange(isVisible) {
    if (isVisible) {
      this.#virtualizer.scrollToOffset(this.#virtualizer.scrollOffset);
    }
  }

  #scheduleRender() {
    this.#renderDebouncer = Debouncer.debounce(this.#renderDebouncer, microTask, () => this.#render());
  }

  #render() {
    this.#renderDebouncer?.cancel();
    this.scrollContainer.style.height = `${this.#virtualizer.getTotalSize()}px`;

    this.#createElementsIfNeeded();
    this.#renderElements();
    this.#scheduleReorderElements();
  }

  #measureElement(element, entry) {
    if (element.hidden) {
      return;
    }

    const index = parseInt(element.dataset.index);
    const height = Math.ceil(entry ? entry.borderBoxSize[0].blockSize : getBorderBoxBlockSize(element));
    if (height > 0) {
      this.#virtualizer.resizeItem(index, height);
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
      const newIndex = item.index;

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

  #updateOverscrollBehavior() {
    const { isScrolling } = this.#virtualizer;

    this.scrollTarget.style.overscrollBehavior = isScrolling ? 'none' : null;
  }

  #updateEstimatedSize() {
    const { itemSizeCache } = this.#virtualizer;

    const sizes = [...itemSizeCache.values()];
    if (sizes.length > 0) {
      this.#estimatedSize = sizes.reduce((acc, size) => acc + size, 0) / sizes.length;
    }
  }

  #getPoolSize() {
    const { scrollRect } = this.#virtualizer;

    // The optimal physical size keeps a viewport of items plus a buffer above
    // and below, matching the iron-list adapter's `_optPhysicalSize`.
    const optPhysicalSize = scrollRect.height * MAX_PAGES;
    return Math.max(1, Math.ceil(optPhysicalSize / this.#estimatedSize));
  }

  #scheduleReorderElements() {
    if (!this.reorderElements) {
      return;
    }

    this.#reorderElementsDebouncer = Debouncer.debounce(this.#reorderElementsDebouncer, timeOut.after(500), () => {
      this.#reorderElements();
    });
  }

  #reorderElements() {
    // Remove hidden elements from the DOM
    // TODO: Do we need this?
    this.#elements.forEach((el) => {
      if (el.hidden) {
        el.remove();
      }
    });

    reorderChildren(this.elementsContainer, (a, b) => {
      const aIndex = parseInt(a.dataset.index);
      const bIndex = parseInt(b.dataset.index);
      return aIndex - bIndex;
    });
  }

  flush() {
    this.#renderDebouncer?.flush();
    this.#reorderElementsDebouncer?.flush();
  }

  get #virtualItems() {
    return this.#virtualizer.getVirtualItems();
  }

  get #elements() {
    return [...this.elementsContainer.children];
  }
}
