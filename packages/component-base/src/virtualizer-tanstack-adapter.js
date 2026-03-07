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
      estimateSize: () => 33.5,
      overscan: 6,
      measureElement,
      observeElementOffset,
      observeElementRect,
      onChange: () => this.#render(),
      scrollToFn() {},
    });

    this.#resizeObserver = new ResizeObserver((entries) => {
      // console.warn(entries);
      entries.forEach((entry) => {
        const { index } = entry.target.dataset;
        if (index !== undefined) {
          this.#virtualizer.resizeItem(index, entry.contentRect.height);
        }
      });
    });
  }

  get size() {
    return this.#virtualizer.options.count;
  }

  set size(size) {
    this.#virtualizer.setOptions({ ...this.#virtualizer.options, count: size });
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

  update() {
    [...this.elementsContainer.children].forEach((element) => {
      this.updateElement(element, parseInt(element.dataset.index));
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
    const missingCount = this.#virtualItems.length - this.elementsContainer.children.length;
    if (missingCount > 0) {
      // this.#physicalElementsPool.push(...this.createElements(missingCount));
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

      if (virtualItem.key !== el.key) {
        this.updateElement(el, virtualItem.index);
      }

      el.key = virtualItem.key;
      el.dataset.index = virtualItem.index;
    });

    // let virtualItem = virtualItemKeyMap.get(el.__virtualKey);
    // if (!virtualItem) {
    //   console.log([...virtualItemKeyMap.values()]);
    //   virtualItem = [...virtualItemKeyMap.values()][0];
    // }

    // if (!virtualItem) {
    //   console.log('hidden');
    //   el.hidden = true;
    //   el.__virtualKey = null;
    //   return;
    // }

    // el.hidden = false;

    // if (virtualItem.index !== el.__virtualKey) {
    //   // console.log(el.__virtualKey, virtualItem.index);
    //   this.#resizeObserver.unobserve(el);
    //   this.updateel(el, virtualItem.index);
    // }

    // el.dataset.index = virtualItem.index;
    // el.__virtualKey = virtualItem.index;

    // virtualItemKeyMap.delete(virtualItem.index);

    // this.#resizeObserver.observe(el);
    // }
  }

  get #virtualItems() {
    return this.#virtualizer.getVirtualItems();
  }

  get #physicalElements() {
    return [...this.elementsContainer.children];
  }
}
