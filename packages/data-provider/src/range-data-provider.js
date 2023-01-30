import { adjustRangeToIncludePage, isPageInRange } from './range-data-provider-helpers.js';

const ROOT_CONTEXT = {};

class RangeDataProvider {
  #range;
  #options;
  #pendingRequests;
  #requestRangeCallback;

  constructor(requestRangeCallback, options = {}) {
    this.#range = null;
    this.#options = { maxRangeSize: Infinity, ...options };
    this.#pendingRequests = {};
    this.#requestRangeCallback = requestRangeCallback;
  }

  get #host() {
    return this.#options.host;
  }

  get #pagesCount() {
    return Math.ceil((this.#host.size || 0) / this.#host.pageSize);
  }

  get #maxRangeSize() {
    let { maxRangeSize } = this.#options;
    if (typeof maxRangeSize === 'function') {
      maxRangeSize = maxRangeSize(this.#host.pageSize);
    }
    return maxRangeSize;
  }

  dataProvider({ page, ...params }, callback) {
    this.#pendingRequests[page] = callback;

    this.#range = adjustRangeToIncludePage(this.#range, page, this.#maxRangeSize);

    this.#discardPagesOutOfRange();

    this.#requestRangeCallback(
      {
        ...params,
        pageRange: this.#range,
      },
      this.#onPagesLoaded.bind(this),
    );
  }

  /**
   * Resolves pending page requests with the provided items.
   *
   * @param {Record<number, object[]>} pages
   * @param {number} size
   * @private
   */
  #onPagesLoaded(pages, size) {
    Object.entries(pages).forEach(([page, items]) => {
      this.#pendingRequests[page]?.(items, size);
      this.#pendingRequests[page] = null;
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
    for (let page = 0; page < this.#pagesCount; page++) {
      if (!isPageInRange(this.#range, page)) {
        this.#pendingRequests[page] = null;
        // TODO: Call an API from the web component to remove the page from the cache as well.
      }
    }
  }
}

export function createRangeDataProvider(...initOptions) {
  const contexts = new WeakMap();

  return (params, callback) => {
    const contextId = params.parentItem ?? ROOT_CONTEXT;
    let context = contexts.get(contextId);
    if (!context) {
      context = new RangeDataProvider(...initOptions);
      contexts.set(contextId, context);
    }
    context.dataProvider(params, callback);
  };
}
