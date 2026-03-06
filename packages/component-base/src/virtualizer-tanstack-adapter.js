/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
globalThis.process ||= { env: {} };

import {
  measureElement,
  observeElementOffset,
  observeElementRect,
  Virtualizer as TanStackVirtualizer,
} from '@tanstack/virtual-core';

export class TanStackAdapter {
  #virtualizer;

  constructor({ createElement, updateElement, scrollTarget, scrollContainer, elementsContainer }) {
    this.createElement = createElement;
    this.updateElement = updateElement;
    this.scrollTarget = scrollTarget;
    this.scrollContainer = scrollContainer;
    this.elementsContainer = elementsContainer || scrollContainer;

    this.#virtualizer = new TanStackVirtualizer({
      count: 0,
      getScrollElement: () => this.scrollTarget,
      estimateSize: () => 30,
      measureElement,
      observeElementOffset,
      observeElementRect,
      onChange: () => this.#render(),
      scrollToFn() {},
    });
    this.#render();
  }

  get size() {
    return this.#virtualizer.options.count;
  }

  set size(size) {
    this.#virtualizer.setOptions({ ...this.#virtualizer.options, count: size });
    this.#virtualizer._willUpdate();
    this.#render();
  }

  get adjustedFirstVisibleIndex() {
    return this.#virtualizer.getVirtualIndexes().at(0);
  }

  get adjustedLastVisibleIndex() {
    return this.#virtualizer.getVirtualIndexes().at(-1);
  }

  scrollToIndex(index) {}

  hostConnected() {}

  update() {
    [...this.elementsContainer.children].forEach((element) => {
      if (element.hidden) {
        return;
      }

      this.updateElement(element, element.dataset.index);
    });
  }

  flush() {
    this.#virtualizer._willUpdate();
    this.#render();
  }

  #render() {
    const virtualItems = this.#virtualizer.getVirtualItems();

    const addedElements = [];
    for (let i = 0; i < virtualItems.length - this.elementsContainer.children.length; i++) {
      const element = this.createElement();
      this.elementsContainer.appendChild(element);
      addedElements.push(element);
    }

    [...this.elementsContainer.children].forEach((element, elementIndex) => {
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
    });

    this.scrollContainer.style.height = `${this.#virtualizer.getTotalSize()}px`;

    this.update();

    [...this.elementsContainer.children].forEach((element) => {
      if (element.__lastMeasureKey !== element.key) {
        this.#virtualizer.measureElement(element);
        element.__lastMeasureKey = element.key;
      }
    });

    // [...this.elementsContainer.children].forEach((element) => {
    //   ;
    // });
  }
}
