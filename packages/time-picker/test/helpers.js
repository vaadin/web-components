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
