import { adjustRangeToIncludePage, isPageInRange } from './vaadin-combo-box-range-data-provider-helpers.js';

export class RangeDataProvider {
  #range;
  #options;
  #comboBox;
  #requestRangeCallback;

  constructor(requestRangeCallback, options = {}) {
    this.#range = null;
    this.#options = { maxRangeSize: Infinity, ...options };
    this.#requestRangeCallback = requestRangeCallback;
    this.dataProvider = this.dataProvider.bind(this);
  }

  dataProvider({ page, ...params }, _callback, comboBox) {
    this.#comboBox = comboBox;

    this.#range = adjustRangeToIncludePage(this.#range, page, this.#options.maxRangeSize);

    this.#cancelPageRequestsOutOfRange();

    this.#unloadPagesOutOfRange();

    this.#requestRangeCallback(
      {
        ...params,
        pageRange: this.#range,
      },
      this.#onRangeLoaded.bind(this),
    );
  }

  /**
   * Cancels active requests to pages that are out of the current range
   * so that those pages can be requested again.
   *
   * @private
   */
  #cancelPageRequestsOutOfRange() {
    Object.keys(this.#comboBox._pendingRequests).forEach((page) => {
      if (!isPageInRange(this.#range, page)) {
        this.#comboBox._cancelPendingRequest(page);
      }
    });
  }

  /**
   * Unloads filtered items associated with pages that are out of
   * the current range by replacing those items with placeholders.
   *
   * @private
   */
  #unloadPagesOutOfRange() {
    this.#comboBox.filteredItems = this.#comboBox.filteredItems.map((item, i) => {
      const page = Math.floor(i / this.#comboBox.pageSize);

      if (!isPageInRange(this.#range, page)) {
        return this.#comboBox.__placeHolder;
      }

      return item;
    });
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
