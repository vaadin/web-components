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
import { microTask, timeOut } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';

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
  #averageSize;
  #renderDebouncer;
  #reorderElementsDebouncer;

  constructor({ createElements, updateElement, scrollTarget, scrollContainer, elementsContainer, reorderElements }) {
    this.createElements = createElements;
    this.updateElement = updateElement;
    this.scrollTarget = scrollTarget;
    this.scrollContainer = scrollContainer;
    this.elementsContainer = elementsContainer || scrollContainer;
    this.reorderElements = reorderElements;

    this.#virtualizer = new Virtualizer({
      count: 0,
      overscan: 6,
      measureElement,
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
  }

  get adjustedFirstVisibleIndex() {
    return this.#virtualizer.getVirtualIndexes().at(0);
  }

  get adjustedLastVisibleIndex() {
    return this.#virtualizer.getVirtualIndexes().at(-1);
  }

  scrollToIndex(index) {
    this.#virtualizer.scrollToIndex(index, { align: 'start' });
    this.#render();
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
    this.#renderElements();
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
        updatedElements.push(el);
      }
    });

    updatedElements.forEach((el) => {
      this.#virtualizer.measureElement(el);
    });

    this.#updateAverageSize();
  }

  #updateAverageSize() {
    const sizes = this.#virtualItems.map((item) => {
      const { size } = this.#virtualizer.measurementsCache[item.index];
      return size;
    });

    this.#averageSize = sizes.reduce((acc, size) => acc + size, 0) / sizes.length;
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

    const sortedElements = this.#elements.toSorted((a, b) => parseInt(a.dataset.index) - parseInt(b.dataset.index));

    // Use the focused element as the anchor to avoid losing focus, or the first element otherwise.
    const anchorIndex = Math.max(
      0,
      sortedElements.findIndex((el) => el.matches(':focus-within')),
    );

    // Place elements after the anchor into correct DOM order, going forward.
    // Each element is moved to right after its predecessor if not already there.
    for (let i = anchorIndex + 1; i < sortedElements.length; i++) {
      if (sortedElements[i - 1].nextElementSibling !== sortedElements[i]) {
        sortedElements[i - 1].after(sortedElements[i]);
      }
    }

    // Place elements before the anchor into correct DOM order, going backward.
    // Each element is moved to right before its successor if not already there.
    for (let i = anchorIndex - 1; i >= 0; i--) {
      if (sortedElements[i + 1].previousElementSibling !== sortedElements[i]) {
        sortedElements[i + 1].before(sortedElements[i]);
      }
    }
  }

  get #virtualItems() {
    return this.#virtualizer.getVirtualItems();
  }

  get #elements() {
    return [...this.elementsContainer.children];
  }
}
