/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

export const WRAPPER_LOCAL_NAME = 'vaadin-dashboard-widget-wrapper';

// The attributes that should be synchronized between the wrapper and the widget/section
export const SYNCHRONIZED_ATTRIBUTES = ['editable', 'dragging'];

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
