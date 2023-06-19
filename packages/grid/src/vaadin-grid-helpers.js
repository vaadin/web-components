/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { addValueToAttribute, removeValueFromAttribute } from '@vaadin/component-base/src/dom-utils.js';

/**
 * @param {HTMLTableRowElement} row the table row
 * @return {HTMLTableCellElement[]} array of cells
 */
export function getBodyRowCells(row) {
  return Array.from(row.querySelectorAll('[part~="cell"]:not([part~="details-cell"])'));
}

/**
 * @param {HTMLElement} container the DOM element with children
 * @param {Function} callback function to call on each child
 */
export function iterateChildren(container, callback) {
  [...container.children].forEach(callback);
}

/**
 * @param {Array<Object>} columns array of columns to be modified
 * @param {number} scope multiplier added to base order for each column
 * @param {number} baseOrder base number used for order
 */
export function updateColumnOrders(columns, scope, baseOrder) {
  let c = 1;
  columns.forEach((column) => {
    // Avoid multiples of 10 because they introduce and extra zero and
    // causes the underlying calculations for child order goes wrong
    if (c % 10 === 0) {
      c += 1;
    }
    column._order = baseOrder + c * scope;
    c += 1;
  });
}

/**
 * @param {!HTMLElement} element
 * @param {string} attribute
 * @param {boolean | string | null | undefined} value
 */
export function updateState(element, attribute, value) {
  switch (typeof value) {
    case 'boolean':
      element.toggleAttribute(attribute, value);
      break;
    case 'string':
      element.setAttribute(attribute, value);
      break;
    default:
      // Value set to null / undefined
      element.removeAttribute(attribute);
      break;
  }
}

/**
 * @param {!HTMLElement} element
 * @param {boolean | string | null | undefined} value
 * @param {string} part
 */
export function updatePart(element, value, part) {
  if (value || value === '') {
    addValueToAttribute(element, 'part', part);
  } else {
    removeValueFromAttribute(element, 'part', part);
  }
}

/**
 * @param {HTMLTableCellElement[]} cells
 * @param {string} part
 * @param {boolean | string | null | undefined} value
 */
export function updateCellsPart(cells, part, value) {
  cells.forEach((cell) => {
    updatePart(cell, value, part);
  });
}

/**
 * @param {!HTMLElement} row
 * @param {Object} states
 */
export function updateBooleanRowStates(row, states) {
  const cells = getBodyRowCells(row);

  Object.entries(states).forEach(([state, value]) => {
    // Row state attribute
    updateState(row, state, value);

    const rowPart = `${state}-row`;

    // Row part attribute
    updatePart(row, value, rowPart);

    // Cells part attribute
    updateCellsPart(cells, `${rowPart}-cell`, value);
  });
}

/**
 * @param {!HTMLElement} row
 * @param {Object} states
 */
export function updateStringRowStates(row, states) {
  const cells = getBodyRowCells(row);

  Object.entries(states).forEach(([state, value]) => {
    const prevValue = row.getAttribute(state);

    // Row state attribute
    updateState(row, state, value);

    // remove previous part from row and cells if there was any
    if (prevValue) {
      const prevRowPart = `${state}-${prevValue}-row`;
      updatePart(row, false, prevRowPart);
      updateCellsPart(cells, `${prevRowPart}-cell`, false);
    }

    // set new part to rows and cells if there is a value
    if (value) {
      const rowPart = `${state}-${value}-row`;
      updatePart(row, value, rowPart);
      updateCellsPart(cells, `${rowPart}-cell`, value);
    }
  });
}

/**
 * @param {!HTMLElement} cell
 * @param {string} attribute
 * @param {boolean | string | null | undefined} value
 * @param {string} part
 * @param {?string} oldPart
 */
export function updateCellState(cell, attribute, value, part, oldPart) {
  // Toggle state attribute on the cell
  updateState(cell, attribute, value);

  // Remove old part from the attribute
  if (oldPart) {
    updatePart(cell, false, oldPart);
  }

  // Add new part to the cell attribute
  updatePart(cell, value, part || `${attribute}-cell`);
}
