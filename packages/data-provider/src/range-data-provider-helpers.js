export function getRangeSize(range) {
  return Math.abs(range[1] - range[0]);
}

export function isPageInRange(range, page) {
  return range[0] <= page && page <= range[1];
}

export function adjustRangeToIncludePage(range, page, maxRangeSize) {
  // The range doesn't exist, create a range.
  if (!range) {
    return [page, page];
  }

  // The page is the next below the range start,
  // move the range one page down.
  if (page === range[0] - 1) {
    range[0] -= 1;

    // The range exceeds the limit, adjust the range end.
    if (getRangeSize(range) >= maxRangeSize) {
      range[1] -= 1;
    }

    return range;
  }

  // The page is the next above the range end,
  // move the range one page up.
  if (page === range[1] + 1) {
    range[1] += 1;

    // The range exceeds the limit, adjust the range start.
    if (getRangeSize(range) >= maxRangeSize) {
      range[0] += 1;
    }

    return range;
  }

  // In other cases such as skipping over pages,
  // reset the range.
  return [page, page];
}
