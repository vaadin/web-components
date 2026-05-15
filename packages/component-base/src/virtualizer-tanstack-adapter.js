/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { elementScroll, observeElementOffset, observeElementRect, Virtualizer } from '@tanstack/virtual-core';
import { microTask, timeOut } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { reorderChildren } from '@vaadin/component-base/src/dom-utils.js';

globalThis.process ||= { env: {} };

function mapElementsToVirtualItems(elements, items) {
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

  return new Map(sortedElements.map((el, index) => [el, sortedItems[index]]));
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
    this.scrollTarget = scrollTarget;
    this.scrollContainer = scrollContainer;
    this.elementsContainer = elementsContainer || scrollContainer;
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
      overscan: 1,
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
          const index = this.#getElementIndex(entry.target);
          if (index == null) {
            return;
          }

          const height = entry.borderBoxSize[0].blockSize;
          if (height === 0) {
            return;
          }

          this.#virtualizer.resizeItem(index, height);
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
      this.flush();
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
    this.#elements.forEach((el) => {
      if (el.hidden) {
        return;
      }

      const index = this.#getElementIndex(el);
      if (startIndex <= index && index <= endIndex) {
        this.updateElement(el, index);
      }
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

    this.#updateEstimatedSize();
    this.#updateOverscan();

    this.#scheduleReorderElements();
  }

  #createElementsIfNeeded() {
    const missingCount = this.#virtualItems.length - this.#elements.length;
    if (missingCount > 0) {
      this.createElements(missingCount).forEach((el) => {
        el.hidden = true;
        el.style.top = '0';
        el.style.left = '0';
        el.style.position = 'absolute';
        this.elementsContainer.appendChild(el);
      });
    }
  }

  #renderElements() {
    const elementToVirtualItemMap = mapElementsToVirtualItems(this.#elements, this.#virtualItems);

    const updatedElements = [];

    this.#elements.forEach((el) => {
      const item = elementToVirtualItemMap.get(el);
      if (!item) {
        el.key = null;
        el.hidden = true;
        el.style.translate = '';
        this.#setElementIndex(el, null);
        this.#resizeObserver.unobserve(el);
        return;
      }

      const oldIndex = this.#getElementIndex(el);
      const newIndex = item.index;

      el.key = item.key;
      el.hidden = false;
      el.style.translate = `0px ${item.start}px`;
      this.#setElementIndex(el, newIndex);
      this.#resizeObserver.observe(el, { box: 'border-box' });

      if (oldIndex !== newIndex) {
        this.updateElement(el, newIndex);
        updatedElements.push(el);
      }
    });

    updatedElements.forEach((el) => {
      const index = this.#getElementIndex(el);
      const { height } = el.getBoundingClientRect();
      if (height > 0) {
        this.#virtualizer.resizeItem(index, height);
      }
    });
  }

  #updateEstimatedSize() {
    const sizes = [...this.#virtualizer.itemSizeCache.values()];
    if (sizes.length > 0) {
      this.#estimatedSize = sizes.reduce((acc, size) => acc + size, 0) / sizes.length;
    }
  }

  #updateOverscan() {
    const { scrollRect, options } = this.#virtualizer;

    const visibleCount = Math.ceil(scrollRect.height / this.#estimatedSize);
    const overscan = Math.max(1, Math.ceil(visibleCount * 0.25));

    this.#virtualizer.setOptions({ ...options, overscan });
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
      const aIndex = this.#getElementIndex(a);
      const bIndex = this.#getElementIndex(b);
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

  #getElementIndex(element) {
    const { indexAttribute } = this.#virtualizer.options;
    if (element.hasAttribute(indexAttribute)) {
      return parseInt(element.getAttribute(indexAttribute));
    }
  }

  #setElementIndex(element, index) {
    const { indexAttribute } = this.#virtualizer.options;
    if (index !== null) {
      element.setAttribute(indexAttribute, index);
    } else {
      element.removeAttribute(indexAttribute);
    }
  }
}
