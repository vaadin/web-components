import { adjustRangeToIncludePage, isPageInRange } from './range-data-provider-utils.js';

export class RangeDataProvider {
  #range;
  #options;
  #host;
  #requestRangeCallback;

  constructor(requestRangeCallback, options = {}) {
    this.#range = null;
    this.#options = { maxRangeSize: Infinity, ...options };
    this.#requestRangeCallback = requestRangeCallback;
    this.dataProvider = this.dataProvider.bind(this);
    this.onPagesLoaded = this.onPagesLoaded.bind(this);
  }

  dataProvider({ page, ...params }, _callback, host) {
    this.#host = host;

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
      this.#host._resolvePendingRequest(page, items, size);
    });
  }

  /**
   * Discards out-of-range pages from the host component's cache.
   *
   * Effectively, this replaces items of out-of-range pages with placeholders
   * and cancels any active requests to those pages. Discarded pages
   * can be requested again once they are back into the viewport.
   *
   * @private
   */
  #discardPagesOutOfRange() {
    const pagesCount = Math.ceil((this.#host.size || 0) / this.#host.pageSize);
    const pages = [];

    for (let page = 0; page < pagesCount; page++) {
      if (!isPageInRange(this.#range, page)) {
        pages.push(page);
      }
    }

    if (pages.length > 0) {
      this.#host.clearCache(pages, false);
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
