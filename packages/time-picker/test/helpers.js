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
