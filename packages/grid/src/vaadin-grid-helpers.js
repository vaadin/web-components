/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { microTask } from '@vaadin/component-base/src/async.js';
import { Debouncer } from '@vaadin/component-base/src/debounce.js';

/**
 * Returns the cells of the given row, excluding the details cell.
 *
 * @param {HTMLElement} row the grid row element
 * @return {HTMLElement[]} array of cells
 */
export function getBodyRowCells(row) {
  // If available, return the cached cells. Otherwise, query the cells directly from the row.
  return row.__cells || Array.from(row.querySelectorAll('vaadin-grid-cell:not(:state(details))'));
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
 * @param {HTMLElement} row the grid row element
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
 * Toggles an attribute on the element based on the given value type.
 *
 * @param {!HTMLElement} element
 * @param {string} attribute
 * @param {boolean | string | null | undefined} value
 */
export function updateAttribute(element, attribute, value) {
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
 * Toggles a custom state on the element's `ElementInternals` when available,
 * and a CSS class with the same name. The state is what gets exposed via the
 * `:state(...)` pseudo-class, while the class keeps the grid's internal CSS
 * (which still relies on class selectors) working.
 *
 * @param {!HTMLElement} element
 * @param {string} state
 * @param {boolean | string | null | undefined} value
 */
export function updateState(element, state, value) {
  const on = !!value || value === '';
  element.classList.toggle(state, on);
  const internals = element._internals;
  if (internals && internals.states) {
    if (on) {
      internals.states.add(state);
    } else {
      internals.states.delete(state);
    }
  }
}

/**
 * @param {!HTMLElement} element
 * @param {string} part
 * @param {boolean | string | null | undefined} value
 */
export function updatePart(element, part, value) {
  element.classList.toggle(part, value || value === '');
  element.part.toggle(part, value || value === '');
  element.part.length === 0 && element.removeAttribute('part');
}

/**
 * @param {!HTMLElement} row
 * @param {Object} states
 */
export function updateBooleanRowStates(row, states) {
  const cells = getBodyRowCells(row);

  Object.entries(states).forEach(([state, value]) => {
    // Keep mirroring the state as an attribute on the row for selectors like
    // `[loading]`, `[dragstart]`, etc. used by internal CSS.
    updateAttribute(row, state, value);

    updateState(row, `${state}-row`, value);
    cells.forEach((cell) => updateState(cell, `${state}-row-cell`, value));
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

    updateAttribute(row, state, value);

    if (prevValue) {
      const prevState = `${state}-${prevValue}`;
      updateState(row, `${prevState}-row`, false);
      cells.forEach((cell) => updateState(cell, `${prevState}-row-cell`, false));
    }

    if (value) {
      const newState = `${state}-${value}`;
      updateState(row, `${newState}-row`, true);
      cells.forEach((cell) => updateState(cell, `${newState}-row-cell`, true));
    }
  });
}

/**
 * @param {!HTMLElement} cell
 * @param {string} attribute
 * @param {boolean | string | null | undefined} value
 * @param {string} [part]
 * @param {?string} [oldPart]
 */
export function updateCellState(cell, attribute, value, part, oldPart) {
  updateAttribute(cell, attribute, value);

  if (oldPart) {
    updateState(cell, oldPart, false);
  }
  updateState(cell, part || `${attribute}-cell`, value);
}

/**
 * Finds the cell containing the tree toggle element
 * @param {!HTMLElement} row
 * @return {HTMLElement | null}
 */
export function findTreeToggleCell(row) {
  return getBodyRowCells(row).find((cell) => cell._content.querySelector('vaadin-grid-tree-toggle'));
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
