import { aTimeout, fire, nextFrame, oneEvent } from '@vaadin/testing-helpers';

export async function onceOpened(element) {
  await oneEvent(element, 'opened-changed');
  await nextFrame();
}

export async function onceScrolled(comboBox) {
  await oneEvent(comboBox._scroller, 'scroll');
  await aTimeout(0);
}

export const makeItems = (length) => {
  return Array.from({ length }, (_, i) => `item ${i}`);
};

/**
 * Returns first item of the combo box dropdown.
 */
export const getFirstItem = (comboBox) => {
  return comboBox._scroller.querySelector('vaadin-combo-box-item');
};

/**
 * Returns selected item in the combo box dropdown.
 */
export const getSelectedItem = (comboBox) => {
  return comboBox._scroller.querySelector('[selected]');
};

/**
 * Returns all the items of the combo box dropdown.
 */
export const getAllItems = (comboBox) => {
  return Array.from(comboBox._scroller.querySelectorAll('vaadin-combo-box-item'))
    .filter((item) => !item.hidden)
    .sort((a, b) => a.index - b.index);
};

/**
 * Returns the items that are inside the bounds of the given combo box's dropdown viewport.
 */
export const getViewportItems = (comboBox) => {
  const overlayRect = comboBox.$.overlay.$.content.getBoundingClientRect();

  // Firefox can produce values like 19.199996948242188
  const top = Math.round(overlayRect.top);
  const bottom = Math.round(overlayRect.bottom);

  return getAllItems(comboBox).filter((item) => {
    const itemRect = item.getBoundingClientRect();
    return Math.round(itemRect.bottom) > top && Math.round(itemRect.top) < bottom;
  });
};

export const getVisibleItemsCount = (comboBox) => {
  return comboBox._scroller._visibleItemsCount();
};

/**
 * Scrolls the combo box dropdown to the given index.
 */
export const scrollToIndex = (comboBox, index) => {
  comboBox._scroller.__virtualizer.scrollToIndex(index);
};

/**
 * Flush the combo box scroller to mitigate timing issues.
 */
export const flushComboBox = (comboBox) => {
  comboBox._scroller.__virtualizer.flush();
};

/**
 * Emulates selecting an item at the given index.
 */
export const selectItem = (comboBox, index) => {
  // Simulates clicking on the overlay items, but it more reliable in tests.
  fire(comboBox._scroller, 'selection-changed', {
    item: comboBox.items[index],
  });
};

/**
 * Emulates clicking outside the dropdown overlay
 */
export function outsideClick() {
  // Move focus to body
  document.body.tabIndex = 0;
  document.body.focus();
  document.body.tabIndex = -1;
  // Outside click
  document.body.click();
}

/**
 * Emulates the user filling in something in the combo-box input.
 *
 * @param {Element} comboBox
 * @param {string} value
 */
export function setInputValue(comboBox, value) {
  comboBox.inputElement.value = value;
  fire(comboBox.inputElement, 'input');
}

/**
 * Returns the index of the currently focused item for a combo-box.
 *
 * @param {Element} comboBox
 * @return {number}
 */
export function getFocusedItemIndex(comboBox) {
  return getAllItems(comboBox).findIndex((item) => {
    return item.hasAttribute('focused');
  });
}
