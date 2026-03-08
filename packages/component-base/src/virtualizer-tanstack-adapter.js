/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { microTask } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';

globalThis.process ||= { env: {} };

import {
  measureElement,
  observeElementOffset,
  observeElementRect,
  Virtualizer as TanStackVirtualizer,
} from '@tanstack/virtual-core';

export class TanStackAdapter {
  #virtualizer;
  #averageSize = 60;
  #resizeObserver;
  #renderDebouncer;

  constructor({ createElements, updateElement, scrollTarget, scrollContainer, elementsContainer }) {
    this.createElements = createElements;
    this.updateElement = updateElement;
    this.scrollTarget = scrollTarget;
    this.scrollContainer = scrollContainer;
    this.elementsContainer = elementsContainer || scrollContainer;

    this.#virtualizer = new TanStackVirtualizer({
      count: 0,
      getScrollElement: () => this.scrollTarget,
      estimateSize: () => this.#averageSize,
      overscan: 6,
      measureElement,
      observeElementOffset,
      observeElementRect,
      onChange: (instance, sync) => {
        this.#render();

        if (sync) {
          this.flush();
        }
      },
      scrollToFn() {},
    });

    this.#resizeObserver = new ResizeObserver((entries) => {
      entries.forEach(({ target, contentRect }) => {
        if (target.hidden) {
          return;
        }

        const index = parseInt(target.dataset.index);
        this.#virtualizer.resizeItem(index, contentRect.height);
      });

      this.#recalculateAverageSize();
    });
  }

  get size() {
    return this.#virtualizer.options.count;
  }

  set size(size) {
    this.#virtualizer.setOptions({ ...this.#virtualizer.options, count: size });
    this.flush();
  }

  get adjustedFirstVisibleIndex() {
    return this.#virtualizer.getVirtualIndexes().at(0);
  }

  get adjustedLastVisibleIndex() {
    return this.#virtualizer.getVirtualIndexes().at(-1);
  }

  scrollToIndex(index) {}

  hostConnected() {
    this.#virtualizer._willUpdate();
  }

  update(startIndex = 0, endIndex = this.size - 1) {
    this.#physicalElements.forEach((element) => {
      const index = parseInt(element.dataset.index);
      if (!element.hidden && index >= startIndex && index <= endIndex) {
        this.updateElement(element, index);
      }
    });
  }

  flush() {
    this.#renderDebouncer?.flush();
  }

  #recalculateAverageSize() {
    const sizes = this.#virtualItems.map((item) => item.size);
    const averageSize = sizes.reduce((a, b) => a + b, 0) / sizes.length;
    this.#averageSize = averageSize;
  }

  #render() {
    this.#renderDebouncer = Debouncer.debounce(this.#renderDebouncer, microTask, () => {
      this.scrollContainer.style.height = `${this.#virtualizer.getTotalSize()}px`;

      this.#createPhysicalElementsIfNeeded();
      this.#renderPhysicalElements();
    });
  }

  #createPhysicalElementsIfNeeded() {
    const missingCount = this.#virtualItems.length - this.elementsContainer.children.length;
    if (missingCount > 0) {
      this.createElements(missingCount).forEach((element) => {
        this.elementsContainer.appendChild(element);
      });
    }
  }

  #renderPhysicalElements() {
    const virtualItems = this.#virtualItems;
    const physicalElements = this.#physicalElements;

    const virtualItemKeyMap = new Map(virtualItems.map((item) => [item.key, item]));
    const physicalElementKeyMap = new Map(physicalElements.map((el) => [el.key, el]));

    const sharedKeys = virtualItems.filter(({ key }) => physicalElementKeyMap.has(key)).map(({ key }) => key);
    const sharedKeySet = new Set(sharedKeys);

    const sortedVirtualItems = [
      ...sharedKeys.map((key) => virtualItemKeyMap.get(key)),
      ...virtualItems.filter((item) => !sharedKeySet.has(item.key)),
    ];

    const sortedPhysicalElements = [
      ...sharedKeys.map((key) => physicalElementKeyMap.get(key)),
      ...physicalElements.filter((el) => !sharedKeySet.has(el.key)),
    ];

    sortedPhysicalElements.forEach((el, index) => {
      const virtualItem = sortedVirtualItems[index];
      if (!virtualItem) {
        el.hidden = true;
        return;
      }

      el.hidden = false;
      el.style.position = 'absolute';
      el.style.top = '0';
      el.style.left = '0';
      el.style.transform = `translateY(${virtualItem.start}px)`;

      if (virtualItem.index !== parseInt(el.dataset.index)) {
        this.#resizeObserver.unobserve(el);
        this.updateElement(el, virtualItem.index);
      }

      el.key = virtualItem.key;
      el.dataset.index = virtualItem.index;

      this.#resizeObserver.observe(el);
    });
  }

  get #virtualItems() {
    return this.#virtualizer.getVirtualItems();
  }

  get #physicalElements() {
    return [...this.elementsContainer.children];
  }
}
