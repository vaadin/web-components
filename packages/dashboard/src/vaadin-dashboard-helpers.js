/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

export const WRAPPER_LOCAL_NAME = 'vaadin-dashboard-widget-wrapper';

// Wrapper proeprties that should be synchronized as widget/section attributes
export const SYNCHRONIZED_ATTRIBUTES = ['editable', 'dragging', 'first-child', 'last-child'];

/**
 * Returns the array of items that contains the given item.
 * Might be the dashboard items or the items of a section.
 *
 * @param {Object} item the item element
 * @param {Object[]} items the root level items array
 * @return {Object[]} the items array
 */
export function getItemsArrayOfItem(item, items) {
  if (items.includes(item)) {
    return items;
  }
  const parentItem = items.find((i) => i.items && getItemsArrayOfItem(item, i.items));
  return parentItem ? parentItem.items : null;
}

/**
 * Returns the item associated with the given element.
 *
 * @param {HTMLElement} element the element
 */
export function getElementItem(element) {
  return element.closest(WRAPPER_LOCAL_NAME).__item;
}

/**
 * Dispatches a custom event to notify about a move operation.
 *
 * @param {HTMLElement} element
 * @param {Number} delta
 */
export function fireMove(element, delta) {
  element.dispatchEvent(
    new CustomEvent('item-move', {
      bubbles: true,
      detail: { delta },
    }),
  );
}

/**
 * Dispatches a custom event to notify about a resize operation.
 *
 * @param {HTMLElement} element
 * @param {Number} colspanDelta
 * @param {Number} rowspanDelta
 */
export function fireResize(element, colspanDelta, rowspanDelta) {
  element.dispatchEvent(
    new CustomEvent('item-resize', {
      bubbles: true,
      detail: {
        colspanDelta,
        rowspanDelta,
      },
    }),
  );
}

/**
 * Dispatches a custom event to notify about a remove operation.
 *
 * @param {HTMLElement} element
 */
export function fireRemove(element) {
  element.dispatchEvent(new CustomEvent('item-remove', { bubbles: true }));
}
