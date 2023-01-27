import { adjustRangeToIncludePage, isPageInRange } from './range-data-provider-helpers.js';

export class RangeDataProvider {
  #options;
  #requestRangeCallback;
  #contexts;

  constructor(requestRangeCallback, options = {}) {
    this.#options = { maxRangeSize: Infinity, ...options };
    this.#requestRangeCallback = requestRangeCallback;
    this.dataProvider = this.dataProvider.bind(this);
    this.#contexts = {};
  }

  dataProvider({ page, ...params }, _callback) {
    const contextId = params.parentItem || null;
    let context = this.#contexts[contextId];
    if (!context) {
      context = new DataRequestContext(this.#requestRangeCallback, this.#options);
      this.#contexts[contextId] = context;
    }
    context.dataProvider({ page, ...params }, _callback);
  }
}

class DataRequestContext {
  #range;
  #options;
  #owner;
  #requestRangeCallback;
  #pendingRequests;
  #pages;

  constructor(requestRangeCallback, options = {}) {
    this.#range = null;
    this.#options = { maxRangeSize: Infinity, ...options };
    this.#owner = options.owner;
    this.#requestRangeCallback = requestRangeCallback;
    this.dataProvider = this.dataProvider.bind(this);
    this.onPagesLoaded = this.onPagesLoaded.bind(this);
    this.#pendingRequests = {};
    this.#pages = {};
  }

  dataProvider({ page, ...params }, callback) {
    this.#range = adjustRangeToIncludePage(this.#range, page, this.#computeMaxRangeSize(params.pageSize));

    this.#pendingRequests[page] = callback;

    this.#requestRangeCallback(
      {
        ...params,
        pageRange: this.#range,
      },
      (pages, size) => {
        this.#discardPagesOutOfRange(size, params.pageSize);

        this.onPagesLoaded(pages, size);
      },
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
      this.#pages[parseInt(page)] = items;
      const callback = this.#pendingRequests[parseInt(page)];
      if (callback) {
        callback(items, size);
      }
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
    const discardedPages = Object.keys(this.#pages).filter((page) => !isPageInRange(this.#range, page));

    if (discardedPages.length > 0) {
      discardedPages.forEach((page) => {
        delete this.#pages[page];
      });

      this.#owner.clearCache();
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
