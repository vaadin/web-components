function getRangeSize(range) {
  return Math.abs(range[1] - range[0]);
}

export class DataRangeProvider {
  constructor(comboBox, rangeCallback, options = {}) {
    this.range = null;
    this.rangeCallback = rangeCallback;
    this.maxRangeSize = options.maxRangeSize ?? Infinity;

    this.comboBox = comboBox;
    this.comboBox.dataProvider = this.dataProvider.bind(this);
  }

  dataProvider(_params, _callback) {
    // TODO: To be implemented.
  }

  adjustRangeToInclude(page) {
    this.range ||= [page, page];

    // The page is included in the range.
    if (page >= this.range[0] && page <= this.range[1]) {
      return;
    }

    // The page is below the range start.
    if (page < this.range[0]) {
      this.range[0] = page;

      // The range exceeds the limit.
      if (getRangeSize(this.range) > this.maxRangeSize) {
        this.range[1] = this.range[0] + this.maxRangeSize;
      }

      return;
    }

    // The page is above the range end.
    if (page > this.range[1]) {
      this.range[1] = page;

      // The range exceeds the limit.
      if (getRangeSize(this.range) > this.maxRangeSize) {
        this.range[0] = this.range[1] - this.maxRangeSize;
      }
    }
  }
}
