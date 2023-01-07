import { ComboBoxPlaceholder } from './vaadin-combo-box-placeholder.js';
import { adjustRangeToIncludePage, isPageInRange } from './vaadin-combo-box-range-data-provider-helpers.js';

const ITEM_PLACEHOLDER = new ComboBoxPlaceholder();

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
   * so that those pages can be requested again once they are back in the viewport.
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
   * Unloads items of pages that are out of the current range
   * from memory by replacing them with placeholders.
   *
   * @private
   */
  #unloadPagesOutOfRange() {
    this.#comboBox.filteredItems = this.#comboBox.filteredItems.map((item, i) => {
      const page = Math.floor(i / this.#comboBox.pageSize);

      if (!isPageInRange(this.#range, page)) {
        return ITEM_PLACEHOLDER;
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
