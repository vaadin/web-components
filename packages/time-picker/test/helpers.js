import { fire } from '@vaadin/testing-helpers';

/**
 * Emulates the user filling in something in the time-picker input.
 *
 * @param {Element} timePicker
 * @param {string} value
 */
export function setInputValue(timePicker, value) {
  timePicker.inputElement.value = value;
  fire(timePicker.inputElement, 'input');
}

/**
 * Returns all the items of the time-picker dropdown.
 */
export const getAllItems = (timePicker) => {
  return Array.from(timePicker._scroller.querySelectorAll('vaadin-time-picker-item'))
    .filter((item) => !item.hidden)
    .sort((a, b) => a.index - b.index);
};
