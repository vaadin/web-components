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
    this.onPagesLoaded = this.onPagesLoaded.bind(this);
  }

  dataProvider({ page, ...params }, _callback, comboBox) {
    this.#comboBox = comboBox;

    this.#range = adjustRangeToIncludePage(this.#range, page, this.#computeMaxRangeSize(params.pageSize));

    this.#discardPagesOutOfRange();

    this.#requestRangeCallback(
      {
        ...params,
        pageRange: this.#range,
      },
      this.onPagesLoaded,
    );
  }

  /**
   * Resolves pending page requests with the provided items.
   *
   * @param {Record<number, object[]>} pages
   * @param {number} size
   */
  onPagesLoaded(pages, size) {
    Object.entries(pages).forEach(([page, items]) => {
      this.#comboBox._resolvePendingRequest(page, items, size);
    });
  }

  /**
   * Discards out-of-range pages from the combo-box cache.
   *
   * Effectively, this replaces items of out-of-range pages with placeholders
   * and cancels any active requests to those pages. Discarded pages
   * can be requested again once they are back into the viewport.
   *
   * @private
   */
  #discardPagesOutOfRange() {
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

  #computeMaxRangeSize(pageSize) {
    let maxRangeSize = this.#options.maxRangeSize;
    if (typeof maxRangeSize === 'function') {
      maxRangeSize = maxRangeSize(pageSize);
    }
    return maxRangeSize;
  }
}

export function createRangeDataProvider(...args) {
  const { dataProvider, onPagesLoaded } = new RangeDataProvider(...args);
  dataProvider.onPagesLoaded = onPagesLoaded;
  return dataProvider;
}
