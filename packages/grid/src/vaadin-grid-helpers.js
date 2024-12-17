/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { microTask } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';
import { addValueToAttribute, removeValueFromAttribute } from '@vaadin/component-base/src/dom-utils.js';

/**
 * Returns the cells of the given row, excluding the details cell.
 *
 * @param {HTMLTableRowElement} row the table row
 * @return {HTMLTableCellElement[]} array of cells
 */
export function getBodyRowCells(row) {
  // If available, return the cached cells. Otherwise, query the cells directly from the row.
  return row.__cells || Array.from(row.querySelectorAll('[part~="cell"]:not([part~="details-cell"])'));
}

/**
 * @param {HTMLElement} container the DOM element with children
 * @param {Function} callback function to call on each child
 */
export function iterateChildren(container, callback) {
  [...container.children].forEach(callback);
}

/**
 * Iterates over the cells of a row. This includes the details cell if
 * present and any other cell that may be physically detached from the row
 * due to lazy column reordering.
 *
 * @param {HTMLTableRowElement} row the table row
 * @param {Function} callback function to call on each cell
 */
export function iterateRowCells(row, callback) {
  getBodyRowCells(row).forEach(callback);
  if (row.__detailsCell) {
    callback(row.__detailsCell);
  }
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

/**
 * A helper for observing flattened child column list of an element.
 */
export class ColumnObserver {
  constructor(host, callback) {
    this.__host = host;
    this.__callback = callback;
    this.__currentSlots = [];

    this.__onMutation = this.__onMutation.bind(this);
    this.__observer = new MutationObserver(this.__onMutation);
    this.__observer.observe(host, {
      childList: true,
    });

    // The observer callback is invoked once initially.
    this.__initialCallDebouncer = Debouncer.debounce(this.__initialCallDebouncer, microTask, () => this.__onMutation());
  }

  disconnect() {
    this.__observer.disconnect();
    this.__initialCallDebouncer.cancel();
    this.__toggleSlotChangeListeners(false);
  }

  flush() {
    this.__onMutation();
  }

  __toggleSlotChangeListeners(add) {
    this.__currentSlots.forEach((slot) => {
      if (add) {
        slot.addEventListener('slotchange', this.__onMutation);
      } else {
        slot.removeEventListener('slotchange', this.__onMutation);
      }
    });
  }

  __onMutation() {
    // Detect if this is the initial call
    const initialCall = !this.__currentColumns;
    this.__currentColumns ||= [];

    // Detect added and removed columns or if the columns order has changed
    const columns = ColumnObserver.getColumns(this.__host);
    const addedColumns = columns.filter((column) => !this.__currentColumns.includes(column));
    const removedColumns = this.__currentColumns.filter((column) => !columns.includes(column));
    const orderChanged = this.__currentColumns.some((column, index) => column !== columns[index]);
    this.__currentColumns = columns;

    // Update the list of child slots and toggle their slotchange listeners
    this.__toggleSlotChangeListeners(false);
    this.__currentSlots = [...this.__host.children].filter((child) => child instanceof HTMLSlotElement);
    this.__toggleSlotChangeListeners(true);

    // Invoke the callback if there are changes in the child columns or if this is the initial call
    const invokeCallback = initialCall || addedColumns.length || removedColumns.length || orderChanged;
    if (invokeCallback) {
      this.__callback(addedColumns, removedColumns);
    }
  }

  /**
   * Default filter for column elements.
   */
  static __isColumnElement(node) {
    return node.nodeType === Node.ELEMENT_NODE && /\bcolumn\b/u.test(node.localName);
  }

  static getColumns(host) {
    const columns = [];

    // A temporary workaround for backwards compatibility
    const isColumnElement = host._isColumnElement || ColumnObserver.__isColumnElement;

    [...host.children].forEach((child) => {
      if (isColumnElement(child)) {
        // The child is a column element, add it to the list
        columns.push(child);
      } else if (child instanceof HTMLSlotElement) {
        // The child is a slot, add all assigned column elements to the list
        [...child.assignedElements({ flatten: true })]
          .filter((assignedElement) => isColumnElement(assignedElement))
          .forEach((assignedElement) => columns.push(assignedElement));
      }
    });

    return columns;
  }
}
