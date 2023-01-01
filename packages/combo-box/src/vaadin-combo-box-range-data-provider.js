function getRangeSize(range) {
  return Math.abs(range[1] - range[0]);
}

function isPageInRange(range, page) {
  return page >= range[0] && page <= range[1];
}

export class RangeDataProvider {
  constructor(comboBox, requestRangeCallback, options = {}) {
    this.range = null;
    this.lastFilter = '';
    this.maxRangeSize = options.maxRangeSize ?? Infinity;
    this.requestRangeCallback = requestRangeCallback;
    this.loadedPages = {};
    this.comboBox = comboBox;
    this.comboBox.dataProvider = this.dataProvider.bind(this);
  }

  dataProvider({ page, pageSize, filter }, callback) {
    // The page is already loaded, return it.
    if (this.lastFilter === filter && this.loadedPages[page]) {
      callback(this.loadedPages[page], this.comboBox.size);
      return;
    }

    this.lastFilter = filter;

    this.adjustRangeToIncludePage(page);

    this.cancelPageRequestsOutOfRange();

    this.requestRangeCallback({
      filter,
      pageSize,
      pageRange: this.range,
    });
  }

  adjustRangeToIncludePage(page) {
    // The range doesn't exist, create a range.
    if (this.range === null) {
      this.range = [page, page];
      return;
    }

    // The page is the next below the range start,
    // move the range one page down.
    if (page === this.range[0] - 1) {
      this.range[0] -= 1;

      // The range exceeds the limit, adjust the range end.
      if (getRangeSize(this.range) >= this.maxRangeSize) {
        this.range[1] -= 1;
      }

      return;
    }

    // The page is the next above the range end,
    // move the range one page up.
    if (page === this.range[1] + 1) {
      this.range[1] += 1;

      // The range exceeds the limit, adjust the range start.
      if (getRangeSize(this.range) >= this.maxRangeSize) {
        this.range[0] += 1;
      }

      return;
    }

    // In other cases such as skipping over pages,
    // reset the range.
    this.range = [page, page];
  }

  cancelPageRequestsOutOfRange() {
    const pages = Object.keys(this.comboBox._pendingRequests).filter((page) => {
      return !isPageInRange(this.range, page);
    });

    this.cancelPageRequests(pages);
  }

  cancelPageRequests(pages) {
    pages.forEach((page) => {
      delete this.comboBox._pendingRequests[page];
    });

    if (Object.keys(this.comboBox._pendingRequests).length === 0) {
      this.comboBox.loading = false;
    }
  }

  /**
   * @param {Record<number, unknown[]>} pages
   */
  addLoadedPages(pages) {
    this.loadedPages = { ...this.loadedPages, ...pages };
  }

  /**
   * @param {number[]} pages
   */
  removeLoadedPages(pages) {
    pages.forEach((page) => {
      delete this.loadedPages[page];
    });
  }

  clearLoadedPages() {
    this.loadedPages = {};
  }

  flushLoadedPages() {
    this.comboBox.clearCache();
  }
}
