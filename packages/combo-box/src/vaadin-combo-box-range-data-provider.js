import { adjustRangeToIncludePage, isPageInRange } from './vaadin-combo-box-range-data-provider-helpers.js';

export class RangeDataProvider {
  constructor(requestRangeCallback, options = {}) {
    this.range = null;
    this.pages = {};
    this.lastFilter = '';
    this.maxRangeSize = options.maxRangeSize ?? Infinity;
    this.requestRangeCallback = requestRangeCallback;
  }

  dataProvider({ page, pageSize, filter }, callback, comboBox) {
    this.comboBox = comboBox;

    // The page is already loaded, return it.
    if (this.lastFilter === filter && this.pages[page]) {
      callback(this.pages[page], this.comboBox.size);
      return;
    }

    this.lastFilter = filter;

    this.range = adjustRangeToIncludePage(this.range, page, this.maxRangeSize);

    this.cancelPageRequestsOutOfRange();

    // this.disposeOfRenderedItemsOutOfRange();

    this.requestRangeCallback(
      {
        filter,
        pageSize,
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
      const page = Math.ceil(i / this.comboBox.pageSize);

      if (!isPageInRange(this.range, page)) {
        return this.comboBox.__placeHolder;
      }

      return item;
    });
  }

  /**
   * @param {Record<number, object[]>} pages
   */
  onRangeLoaded(pages) {
    this.pages = pages;
    this.comboBox.clearCache();
  }

  clearCache() {
    this.pages = {};
    this.comboBox.clearCache();
  }
}

export function createRangeDataProvider(...options) {
  const instance = new RangeDataProvider(...options);
  return instance.dataProvider.bind(instance);
}
