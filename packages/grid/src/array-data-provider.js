/**
 * Returns a sub-property of an object
 *
 * @param {string} path dot-separated path to the sub property
 * @param {*} object
 * @returns {*}
 */
function get(path, object) {
  return path.split('.').reduce((obj, property) => obj[property], object);
}

/**
 * Check array of filters/sorters for paths validity, console.warn invalid items
 * @param {!Array<!GridFilterDefinition | !GridSorterDefinition>} arrayToCheck The array of filters/sorters to check
 * @param {string} action The name of action to include in warning (filtering, sorting)
 * @param {!Array<!GridItem>} items
 */
function checkPaths(arrayToCheck, action, items) {
  if (items.length === 0) {
    return false;
  }

  let result = true;

  for (const i in arrayToCheck) {
    const path = arrayToCheck[i].path;

    // Skip simple paths
    if (!path || path.indexOf('.') === -1) {
      continue;
    }

    const parentProperty = path.replace(/\.[^.]*$/, ''); // A.b.c -> a.b
    if (get(parentProperty, items[0]) === undefined) {
      console.warn(`Path "${path}" used for ${action} does not exist in all of the items, ${action} is disabled.`);
      result = false;
    }
  }

  return result;
}

/**
 * Sorts the given array of items based on the sorting rules and returns the result.
 *
 * @param {Array<any>} items
 * @param {Array<GridSorterDefinition>} items
 * @return {Array<any>}
 */
function multiSort(items, sortOrders) {
  return items.sort((a, b) => {
    return sortOrders
      .map((sortOrder) => {
        if (sortOrder.direction === 'asc') {
          return compare(get(sortOrder.path, a), get(sortOrder.path, b));
        } else if (sortOrder.direction === 'desc') {
          return compare(get(sortOrder.path, b), get(sortOrder.path, a));
        }
        return 0;
      })
      .reduce((p, n) => {
        return p !== 0 ? p : n;
      }, 0);
  });
}

/**
 * @param {unknown} value
 * @return {string}
 */
function normalizeEmptyValue(value) {
  if ([undefined, null].indexOf(value) >= 0) {
    return '';
  } else if (isNaN(value)) {
    return value.toString();
  }
  return value;
}

/**
 * @param {unknown} a
 * @param {unknown} b
 * @return {number}
 */
function compare(a, b) {
  a = normalizeEmptyValue(a);
  b = normalizeEmptyValue(b);

  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}

/**
 * @param {!Array<!GridItem>} items
 * @return {!Array<!GridItem>}
 */
function filter(items, filters) {
  return items.filter((item) => {
    return filters.every((filter) => {
      const value = normalizeEmptyValue(get(filter.path, item));
      const filterValueLowercase = normalizeEmptyValue(filter.value).toString().toLowerCase();
      return value.toString().toLowerCase().includes(filterValueLowercase);
    });
  });
}

/**
 * WARNING: This API is still intended for internal purposes only and
 * may change any time.
 *
 * Creates a new grid compatible data provider that serves the items
 * from the given array as data when requested by the grid.
 *
 * @param {Array<any>} items
 * @return {GridDataProvider<any>}
 */
export const createArrayDataProvider = (allItems) => {
  return (params, callback) => {
    let items = allItems ? [...allItems] : [];

    if (params.filters && checkPaths(params.filters, 'filtering', items)) {
      items = filter(items, params.filters);
    }

    if (
      Array.isArray(params.sortOrders) &&
      params.sortOrders.length &&
      checkPaths(params.sortOrders, 'sorting', items)
    ) {
      items = multiSort(items, params.sortOrders);
    }

    const count = Math.min(items.length, params.pageSize);
    const start = params.page * count;
    const end = start + count;
    const slice = items.slice(start, end);
    callback(slice, items.length);
  };
};
