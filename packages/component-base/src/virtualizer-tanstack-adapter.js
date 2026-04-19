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

function mapElementsToItems(elements, items) {
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
  #virtualizer;
  #estimatedSize;
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
      overscan: 6,
      observeElementRect,
      observeElementOffset,
      scrollToFn: elementScroll,
      onChange: (_instance, sync) => {
        if (sync) {
          this.#render();
        } else {
          this.#scheduleRender();
        }
      },
      estimateSize: () => {
        return this.#estimatedSize ?? 60;
      },
      getScrollElement: () => {
        return this.scrollTarget;
      },
    });

    this.#resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        this.#measureElement(entry.target);
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
    return this.#virtualizer.calculateRange().startIndex;
  }

  get adjustedLastVisibleIndex() {
    return this.#virtualizer.calculateRange().endIndex;
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
    this.#virtualizer._willUpdate();
  }

  update(startIndex = 0, endIndex = this.size - 1) {
    this.#elements.forEach((element) => {
      if (element.hidden) {
        return;
      }

      const index = parseInt(element.dataset.index);
      if (startIndex <= index && index <= endIndex) {
        this.updateElement(element, index);
      }
    });
  }

  flush() {
    this.#renderDebouncer?.flush();
    this.#reorderElementsDebouncer?.flush();
  }

  #scheduleRender() {
    this.#renderDebouncer = Debouncer.debounce(this.#renderDebouncer, microTask, () => this.#render());
  }

  #render() {
    this.#renderDebouncer?.cancel();
    this.scrollContainer.style.height = `${this.#virtualizer.getTotalSize()}px`;
    this.#createElementsIfNeeded();

    const updatedElements = this.#renderElements();
    updatedElements.forEach((element) => this.#measureElement(element));

    this.#updateEstimatedSize();
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
    const updatedElements = [];

    mapElementsToItems(this.#elements, this.#virtualItems).forEach(([el, item]) => {
      if (!item) {
        el.key = null;
        el.hidden = true;
        this.#setElementIndex(el, null);
        this.#resizeObserver.unobserve(el);
        return;
      }

      const oldIndex = this.#getElementIndex(el);
      const newIndex = item.index;

      el.hidden = false;
      el.key = item.key;
      el.style.translate = `0px ${item.start}px`;
      this.#setElementIndex(el, newIndex);

      if (oldIndex !== newIndex) {
        this.updateElement(el, newIndex);
        this.#resizeObserver.observe(el);
        updatedElements.push(el);
      }
    });

    return updatedElements;
  }

  #measureElement(element) {
    const index = this.#getElementIndex(element);
    if (index == null) {
      return;
    }

    const { height } = element.getBoundingClientRect();
    this.#virtualizer.resizeItem(index, height);
  }

  #updateEstimatedSize() {
    const sizes = [...this.#virtualizer.itemSizeCache.values()];
    if (sizes.length > 0) {
      this.#estimatedSize = sizes.reduce((acc, size) => acc + size, 0) / sizes.length;
    }
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
      return this.#getElementIndex(a) - this.#getElementIndex(b);
    });
  }

  get #virtualItems() {
    return this.#virtualizer.getVirtualItems();
  }

  get #elements() {
    return [...this.elementsContainer.children];
  }

  #getElementIndex(element) {
    if (element.hasAttribute('data-index')) {
      return parseInt(element.getAttribute('data-index'));
    }
  }

  #setElementIndex(element, index) {
    if (index !== null) {
      element.setAttribute('data-index', index);
    } else {
      element.removeAttribute('data-index');
    }
  }
}
