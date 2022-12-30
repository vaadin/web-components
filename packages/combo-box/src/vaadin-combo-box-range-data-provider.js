import { adjustRangeToIncludePage, isPageInRange } from './vaadin-combo-box-range-data-provider-helpers.js';

export class RangeDataProvider {
  #range;
  #options;
  #comboBox;
  #requestRangeCallback;

  // TODO: Provider addPages, removePages, flushPages, setPages API to clean the connector as much as possible.
  constructor(requestRangeCallback, options = {}) {
    this.#range = null;
    this.#options = { maxRangeSize: Infinity, ...options };
    this.#requestRangeCallback = requestRangeCallback;
    this.dataProvider = this.dataProvider.bind(this);
  }

  dataProvider({ page, ...params }, _callback, comboBox) {
    this.#comboBox = comboBox;

    this.#range = adjustRangeToIncludePage(this.#range, page, this.#options.maxRangeSize);

    this.#unloadOutOfRangePages();

    this.#requestRangeCallback(
      {
        ...params,
        pageRange: this.#range,
      },
      this.#onRangeLoaded.bind(this),
    );
  }

  /**
   * Unloads out-of-range pages from memory.
   *
   * Effectively, this replaces items of those pages with placeholders
   * and cancels any active requests to those pages. Unloaded pages
   * can be requested again once they are back into the viewport.
   *
   * @private
   */
  #unloadOutOfRangePages() {
    const pagesCount = Math.ceil((this.#comboBox.size || 0) / this.#comboBox.pageSize);
    const pages = [];

    for (let page = 0; page < pagesCount; page++) {
      if (!isPageInRange(this.#range, page)) {
        pages.push(page);
      }
    }

    if (pages.length > 0) {
      this.#comboBox.clearCache(pages, false);
    }
  }

  /**
   * @param {Record<number, object[]>} pages
   * @param {number} size
   * @private
   */
  #onRangeLoaded(pages, size) {
    Object.entries(pages).forEach(([page, items]) => {
      this.#comboBox._pendingRequests[page]?.(items, size);
    });
  }
}

export function createRangeDataProvider(...args) {
  return new RangeDataProvider(...args).dataProvider;
}
