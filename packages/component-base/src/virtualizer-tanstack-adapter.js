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
    }
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

    if (sync) {
      this.#render();
    } else {
      this.#renderDebouncer = Debouncer.debounce(this.#renderDebouncer, microTask, () => this.#render());
    }
  }

  #onVisibilityChange(isVisible) {
    if (isVisible) {
      this.#virtualizer.scrollToOffset(this.#virtualizer.scrollOffset);
    }
  }

  #render() {
    this.#renderDebouncer?.cancel();

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

  flush() {
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

  get #virtualItems() {
    return this.#virtualizer.getVirtualItems();
  }

  get #elements() {
    return [...this.elementsContainer.children];
  }
}
