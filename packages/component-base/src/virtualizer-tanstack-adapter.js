/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import {
  elementScroll,
  measureElement,
  observeElementOffset,
  observeElementRect,
  Virtualizer,
} from '@tanstack/virtual-core';
import { microTask } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';

globalThis.process ||= { env: {} };

function matchElementsToItemsByKey(elements, items) {
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
  #averageSize;
  #renderDebouncer;

  constructor({ createElements, updateElement, scrollTarget, scrollContainer, elementsContainer }) {
    this.createElements = createElements;
    this.updateElement = updateElement;
    this.scrollTarget = scrollTarget;
    this.scrollContainer = scrollContainer;
    this.elementsContainer = elementsContainer || scrollContainer;

    this.#virtualizer = new Virtualizer({
      count: 0,
      overscan: 6,
      measureElement,
      observeElementRect,
      observeElementOffset,
      scrollToFn: elementScroll,
      onChange: (_instance, sync) => {
        this.#render();

        if (sync) {
          this.flush();
        }
      },
      estimateSize: () => {
        return this.#averageSize ?? 60;
      },
      getScrollElement: () => {
        return this.scrollTarget;
      },
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
    return this.#virtualizer.getVirtualIndexes().at(0);
  }

  get adjustedLastVisibleIndex() {
    return this.#virtualizer.getVirtualIndexes().at(-1);
  }

  scrollToIndex(index) {
    this.#virtualizer.scrollToIndex(index, { align: 'start' });
    this.flush();
  }

  hostConnected() {
    this.#virtualizer._willUpdate();
  }

  update(startIndex = 0, endIndex = this.size - 1) {
    this.#physicalElements.forEach((element) => {
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
  }

  #render() {
    this.#renderDebouncer = Debouncer.debounce(this.#renderDebouncer, microTask, () => {
      this.scrollContainer.style.height = `${this.#virtualizer.getTotalSize()}px`;
      this.#createPhysicalElementsIfNeeded();
      this.#renderPhysicalElements();
    });
  }

  #createPhysicalElementsIfNeeded() {
    const missingCount = this.#virtualItems.length - this.#physicalElements.length;
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

  #renderPhysicalElements() {
    const updatedPhysicalElements = [];

    matchElementsToItemsByKey(this.#physicalElements, this.#virtualItems).forEach(([el, item]) => {
      if (!item) {
        el.key = null;
        el.hidden = true;
        el.dataset.index = null;
        return;
      }

      const oldIndex = parseInt(el.dataset.index);
      const newIndex = item.index;

      el.hidden = false;
      el.key = item.key;
      el.dataset.index = newIndex;
      el.style.translate = `0px ${item.start}px`;

      if (oldIndex !== newIndex) {
        this.updateElement(el, newIndex);
        updatedPhysicalElements.push(el);
      }
    });

    updatedPhysicalElements.forEach((el) => {
      this.#virtualizer.measureElement(el);
    });

    this.#updateAverageSize();
  }

  #updateAverageSize() {
    const sizes = this.#virtualItems.map((item) => this.#measurementsCache[item.index].size);
    this.#averageSize = sizes.reduce((acc, size) => acc + size, 0) / sizes.length;
  }

  get #virtualItems() {
    return this.#virtualizer.getVirtualItems();
  }

  get #physicalElements() {
    return [...this.elementsContainer.children];
  }

  get #measurementsCache() {
    return this.#virtualizer.measurementsCache;
  }
}
