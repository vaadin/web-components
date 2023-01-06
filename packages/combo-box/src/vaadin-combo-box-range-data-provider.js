import { adjustRangeToIncludePage, isPageInRange } from './vaadin-combo-box-range-data-provider-helpers.js';

export class RangeDataProvider {
  constructor(requestRangeCallback, options = {}) {
    this.range = null;
    this.maxRangeSize = options.maxRangeSize ?? Infinity;
    this.requestRangeCallback = requestRangeCallback;
    this.dataProvider = this.dataProvider.bind(this);
  }

  dataProvider({ page, ...params }, _callback, comboBox) {
    this.comboBox = comboBox;

    this.range = adjustRangeToIncludePage(this.range, page, this.maxRangeSize);

    this.cancelPageRequestsOutOfRange();

    this.disposeOfRenderedItemsOutOfRange();

    this.requestRangeCallback(
      {
        ...params,
        pageRange: this.range,
      },
      this.onRangeLoaded.bind(this),
    );
  }

  cancelPageRequestsOutOfRange() {
    Object.keys(this.comboBox._pendingRequests).forEach((page) => {
      if (!isPageInRange(this.range, page)) {
        this.comboBox._cancelPendingRequest(page);
      }
    });
  }

  disposeOfRenderedItemsOutOfRange() {
    this.comboBox.filteredItems = this.comboBox.filteredItems.map((item, i) => {
      const page = Math.floor(i / this.comboBox.pageSize);

      if (!isPageInRange(this.range, page)) {
        return this.comboBox.__placeHolder;
      }

      return item;
    });
  }

  /**
   * @param {Record<number, object[]>} pages
   * @param {number} size
   */
  onRangeLoaded(pages, size) {
    Object.entries(pages).forEach(([page, items]) => {
      this.comboBox._pendingRequests[page]?.(items, size);
    });
  }
}

export function createRangeDataProvider(...args) {
  return new RangeDataProvider(...args).dataProvider;
}
