/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { addValueToAttribute, removeValueFromAttribute } from '@vaadin/component-base/src/dom-utils.js';

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
function updateState(element, attribute, value) {
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
function updatePart(element, value, part) {
  if (value || value === '') {
    addValueToAttribute(element, 'part', part);
  } else {
    removeValueFromAttribute(element, 'part', part);
  }
}

/**
 * @param {!HTMLElement} row
 * @param {string} part
 * @param {boolean | string | null | undefined} value
 */
export function updateRowBodyCellsPart(row, part, value) {
  Array.from(row.querySelectorAll('[part~="cell"]:not([part~="details-cell"])')).forEach((cell) => {
    updatePart(cell, value, part);
  });
}

/**
 * @param {!HTMLElement} row
 * @param {string} state
 * @param {boolean | string | null | undefined} value
 * @param {boolean} appendValue
 * @param {string | null} setRowPart
 */
export function updateRowAndCells(row, state, value, appendValue, setRowPart = true) {
  // Toggle state attribute on the row
  updateState(row, state, value);

  const rowPart = appendValue ? `${state}-${value}-row` : `${state}-row`;

  // Toggle part on the row if needed
  if (setRowPart) {
    updatePart(row, value, rowPart);
  }

  // Toggle part on the row body cells
  updateRowBodyCellsPart(row, `${rowPart}-cell`, value);
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
