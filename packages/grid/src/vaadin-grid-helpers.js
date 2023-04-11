/**
 * @license
 * Copyright (c) 2000 - 2023 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */

/**
 * @param {Array<Object>} columns array of columns to be modified
 * @param {number} scope multiplier added to base order for each column
 * @param {number} baseOrder base number used for order
 */
export function updateColumnOrders(columns, scope, baseOrder) {
  let c = 1;
  columns.forEach((column) => {
    // avoid multiples of 10 because they introduce and extra zero and
    // causes the underlying calculations for child order goes wrong
    if (c % 10 === 0) {
      c++;
    }
    column._order = baseOrder + c * scope;
    c++;
  });
}
