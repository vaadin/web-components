import { fire } from '@vaadin/testing-helpers';

export const getDataProvider = (allItems) => (params, callback) => {
  const offset = params.page * params.pageSize;
  const filteredItems = allItems.filter((item) => item.indexOf(params.filter) > -1);
  const size = filteredItems.length;
  const items = filteredItems.slice(offset, offset + params.pageSize);
  callback(items, size);
};

export const getAsyncDataProvider = (allItems) => {
  const dataProvider = getDataProvider(allItems);

  return (params, callback) => {
    setTimeout(() => {
      dataProvider(params, callback);
    }, 0);
  };
};

/**
 * Returns all the items of the combo box dropdown.
 */
export const getAllItems = (comboBox) => {
  return Array.from(comboBox._scroller.querySelectorAll('vaadin-multi-select-combo-box-item'))
    .filter((item) => !item.hidden)
    .sort((a, b) => a.index - b.index);
};

/**
 * Returns the items that are inside the bounds of the given combo box's dropdown viewport.
 */
export const getViewportItems = (comboBox) => {
  const overlayRect = comboBox.$.overlay.$.content.getBoundingClientRect();

  // Take the default 4px border width into account
  const scrollerTop = parseInt(getComputedStyle(comboBox._scroller.$.selector).borderTopWidth);

  // Firefox can produce values like 19.199996948242188
  const top = Math.round(overlayRect.top) + scrollerTop;
  const bottom = Math.round(overlayRect.bottom);

  return getAllItems(comboBox).filter((item) => {
    const itemRect = item.getBoundingClientRect();
    return Math.round(itemRect.bottom) > top && Math.round(itemRect.top) < bottom;
  });
};

/**
 * Flush the combo box scroller to mitigate timing issues.
 */
export const flushComboBox = (comboBox) => {
  comboBox._scroller.__virtualizer.flush();
};

/**
 * Returns first item of the combo box dropdown.
 */
export const getFirstItem = (comboBox) => {
  return comboBox._scroller.querySelector('vaadin-multi-select-combo-box-item');
};

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
 * Returns all the chips of the combo-box.
 */
export const getChips = (comboBox) => comboBox.querySelectorAll('vaadin-multi-select-combo-box-chip');
