function getRangeSize(range) {
  return Math.abs(range[1] - range[0]);
}

function doesRangeIncludePage(range, page) {
  return page >= range[0] && page <= range[1];
}

export class DataRangeProvider {
  constructor(comboBox, requestRangeCallback, options = {}) {
    this.range = null;
    this.maxRangeSize = options.maxRangeSize ?? Infinity;
    this.requestRangeCallback = requestRangeCallback;

    this.loadedPages = {};
    this.totalCount = null;

    this.comboBox = comboBox;
    this.comboBox.dataProvider = this.dataProvider.bind(this);
  }

  dataProvider({ page, pageSize, filter }, callback) {
    // The page is already loaded, return it.
    if (this.loadedPages[page]) {
      const items = this.loadedPages[page];
      callback(items, this.totalCount);
      return;
    }

    this.adjustRangeToIncludePage(page);

    this.cancelRequestsOutOfRange();

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
      if (getRangeSize(this.range) > this.maxRangeSize) {
        this.range[1] -= 1;
      }

      return;
    }

    // The page is the next above the range end,
    // move the range one page up.
    if (page === this.range[1] + 1) {
      this.range[1] += 1;

      // The range exceeds the limit, adjust the range start.
      if (getRangeSize(this.range) > this.maxRangeSize) {
        this.range[0] += 1;
      }

      return;
    }

    // In other cases such as skipping over pages,
    // reset the range.
    this.range = [page, page];
  }

  cancelRequestsOutOfRange() {
    const pages = this.getPendingRequests()
      .filter(([page]) => !doesRangeIncludePage(this.range, page))
      .map(([page]) => page);

    this.comboBox.cancelPendingRequests(pages);
  }

  setLoadedPages(pages, totalCount) {
    this.loadedPages = pages;
    this.totalCount = totalCount;
    this.comboBox.clearCache();
  }

  clearLoadedPages() {
    this.loadedPages = {};
    this.comboBox.clearCache();
  }
}
