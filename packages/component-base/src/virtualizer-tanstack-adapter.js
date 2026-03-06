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
      estimateSize: () => 20,
      measureElement,
      observeElementOffset,
      observeElementRect,
      onChange: () => this.#render(),
      scrollToFn() {},
    });

    this.#resizeObserver = new ResizeObserver((entries) => {
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
    this.#physicalElements.forEach((element) => {
      if (!element.hidden) {
        this.updateElement(element, element.dataset.index);
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
      this.#updatePhysicalElements();
    });
  }

  #createPhysicalElementsIfNeeded() {
    const count = this.#virtualItems.length - this.#physicalElements.length;
    if (count > 0) {
      this.createElements(count).forEach((element) => {
        this.elementsContainer.appendChild(element);
      });
    }
  }

  #updatePhysicalElements() {
    const virtualItems = this.#virtualItems;

    this.#physicalElements.forEach((element, elementIndex) => {
      this.#resizeObserver.unobserve(element);

      const virtualItem = virtualItems[elementIndex];
      if (!virtualItem) {
        element.hidden = true;
        return;
      }

      element.key = virtualItem.key;
      element.hidden = false;
      element.style.position = 'absolute';
      element.style.top = '0';
      element.style.left = '0';
      element.style.transform = `translateY(${virtualItem.start}px)`;
      element.dataset.index = virtualItem.index;

      this.updateElement(element, virtualItem.index);

      this.#resizeObserver.observe(element);
    });
  }

  get #virtualItems() {
    return this.#virtualizer.getVirtualItems();
  }

  get #physicalElements() {
    return [...this.elementsContainer.children];
  }
}
