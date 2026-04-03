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

export class TanStackAdapter {
  #virtualizer;
  #averageSize = 100;
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
        return this.#averageSize;
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
      const index = parseInt(element.dataset.index);
      if (!element.hidden && index >= startIndex && index <= endIndex) {
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
        el.style.position = 'absolute';
        el.style.top = '0';
        el.style.left = '0';
        this.elementsContainer.appendChild(el);
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

    const updatedPhysicalElements = [];

    sortedPhysicalElements.forEach((el, index) => {
      const virtualItem = sortedVirtualItems[index];
      if (!virtualItem) {
        el.key = null;
        el.hidden = true;
        el.dataset.index = null;
        return;
      }

      const oldIndex = parseInt(el.dataset.index);
      const newIndex = virtualItem.index;

      el.hidden = false;
      el.key = virtualItem.key;
      el.dataset.index = newIndex;
      el.style.translate = `0px ${virtualItem.start}px`;

      if (oldIndex !== newIndex) {
        this.updateElement(el, newIndex);
        updatedPhysicalElements.push(el);
      }
    });

    updatedPhysicalElements.forEach((el) => {
      this.#virtualizer.measureElement(el);
    });
  }

  get #virtualItems() {
    return this.#virtualizer.getVirtualItems();
  }

  get #physicalElements() {
    return [...this.elementsContainer.children];
  }
}
