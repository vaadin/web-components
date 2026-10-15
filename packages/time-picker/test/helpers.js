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
 * A 12-hour clock i18n that only accepts text produced by its own `formatTime`
 * function, e.g. "8:00 AM". Used to verify that the component never passes the
 * ISO 8601 `value`, `min` or `max` to the `i18n.parseTime` function.
 */
export const strictAmPmI18n = {
  formatTime(time) {
    if (!time) {
      return '';
    }
    const hours = Number(time.hours);
    const minutes = String(Number(time.minutes) || 0).padStart(2, '0');
    return `${hours % 12 || 12}:${minutes} ${hours < 12 ? 'AM' : 'PM'}`;
  },

  parseTime(text) {
    const parts = /^(\d{1,2}):(\d{2}) (AM|PM)$/u.exec(text);
    if (!parts) {
      return undefined;
    }
    return {
      hours: (parseInt(parts[1]) % 12) + (parts[3] === 'PM' ? 12 : 0),
      minutes: parseInt(parts[2]),
    };
  },
};

/**
 * Returns all the items of the time-picker dropdown.
 */
export const getAllItems = (timePicker) => {
  return Array.from(timePicker._scroller.querySelectorAll('vaadin-time-picker-item'))
    .filter((item) => !item.hidden)
    .sort((a, b) => a.index - b.index);
};
