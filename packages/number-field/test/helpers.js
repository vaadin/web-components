import { fire } from '@vaadin/testing-helpers';

/**
 * Emulates the user filling in something in the combo-box input.
 *
 * @param {Element} field
 * @param {string} value
 */
export function setInputValue(field, value) {
  field.inputElement.value = value;
  fire(field.inputElement, 'input');
}
