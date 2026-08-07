import { fire, makeSoloTouchEvent, nextRender } from '@vaadin/testing-helpers';

export function activateScroller(scroller) {
  scroller.active = true;
  // Setting `active` triggers `_finishInit` using requestAnimationFrame
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      scroller._debouncerUpdateClones.flush();
      resolve();
    });
  });
}

export function getDefaultI18n() {
  return {
    monthNames: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    firstDayOfWeek: 0,
    today: 'Today',
    cancel: 'Cancel',
    dialogAccessibleName: 'Calendar',
    formatDate(d) {
      return `${d.month + 1}/${d.day}/${d.year}`;
    },
    formatTitle(monthName, fullYear) {
      return `${monthName} ${fullYear}`;
    },
  };
}

/**
 * Waits until the overlay content finishes scrolling.
 *
 * @param {HTMLElement} datePickerOrOverlayContent vaadin-date-picker or vaadin-date-picker-overlay-content
 * @return {Promise<void>}
 */
export async function untilOverlayScrolled(datePickerOrOverlayContent) {
  const overlayContent = datePickerOrOverlayContent._overlayContent ?? datePickerOrOverlayContent;

  if (overlayContent._revealPromise) {
    // The overlay content is scrolling.
    await overlayContent._revealPromise;
  }

  await nextRender();

  // Flush the ignoreTaps debouncer to make sure taps are not ignored.
  overlayContent._debouncer?.flush();
}

/**
 * Waits until the overlay is rendered.
 *
 * @param {HTMLElement} datePicker vaadin-date-picker
 * @return {Promise<void>}
 */
export async function untilOverlayRendered(datePicker) {
  // First, wait for vaadin-overlay-open event
  await nextRender();

  // Then wait for scrollers to fully render
  await nextRender();

  await untilOverlayScrolled(datePicker);
}

export async function open(datePicker) {
  datePicker.open();
  await untilOverlayRendered(datePicker);
}

export function idleCallback() {
  return new Promise((resolve) => {
    if (window.requestIdleCallback) {
      window.requestIdleCallback(resolve);
    } else {
      setTimeout(resolve, 16);
    }
  });
}

/**
 * Emulates a touch on the target resulting in clicking and focusing it.
 */
export function touchTap(target) {
  const start = makeSoloTouchEvent('touchstart', null, target);
  const end = makeSoloTouchEvent('touchend', null, target);
  if (!start.defaultPrevented && !end.defaultPrevented) {
    target.click();
    target.focus();
  }
}

export function monthsEqual(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth();
}

export function getFirstVisibleItem(scroller, bufferOffset = 0) {
  const children = [];

  scroller._buffers.forEach((buffer) => {
    [...buffer.children].forEach((slot) => {
      children.push(slot._itemWrapper);
    });
  });
  const scrollerRect = scroller.getBoundingClientRect();
  return children.reduce((prev, current) => {
    return Math.floor(current.getBoundingClientRect().top) - Math.floor(scrollerRect.top + bufferOffset) <= 0
      ? current
      : prev;
  });
}

/**
 * The month calendars the overlay content currently holds. The month scroller keeps a fixed pool of
 * them and reassigns which month each one shows, so the list includes calendars that are scrolled out
 * of view, and ones with no `month` assigned yet. Filter by `month` to get the rendered ones.
 *
 * @param {HTMLElement} root vaadin-date-picker or vaadin-date-picker-overlay-content
 * @return {HTMLElement[]}
 */
export function getCalendars(root) {
  const overlayContent = root._overlayContent ?? root;
  return [...overlayContent.querySelectorAll('vaadin-month-calendar')];
}

/**
 * The month calendar showing the given year and month, or `undefined` when none of the rendered
 * calendars shows it.
 *
 * @param {HTMLElement} root vaadin-date-picker or vaadin-date-picker-overlay-content
 * @param {number} year
 * @param {number} month 0-based, like `Date#getMonth()`
 * @return {HTMLElement | undefined}
 */
export function getMonthCalendar(root, year, month) {
  return getCalendars(root).find(
    (calendar) => calendar.month && calendar.month.getFullYear() === year && calendar.month.getMonth() === month,
  );
}

/**
 * The date cells of a month calendar, without the empty ones padding the first and last week.
 *
 * @param {HTMLElement} calendar vaadin-month-calendar
 * @return {HTMLElement[]}
 */
export function getDateCells(calendar) {
  return [...calendar.shadowRoot.querySelectorAll('[part~="date"]:not(:empty)')];
}

/**
 * The date cell of a month calendar showing the given day of the month, or `undefined` when the
 * calendar does not show it.
 *
 * @param {HTMLElement} calendar vaadin-month-calendar
 * @param {number} day
 * @return {HTMLElement | undefined}
 */
export function getDateCell(calendar, day) {
  return getDateCells(calendar).find((cell) => cell.date.getDate() === day);
}

/**
 * The weekday header cells of a month calendar, without the empty one above the week numbers.
 *
 * @param {HTMLElement} calendar vaadin-month-calendar
 * @return {HTMLElement[]}
 */
export function getWeekDayCells(calendar) {
  return [...calendar.shadowRoot.querySelectorAll('[part="weekday"]:not(:empty)')];
}

/**
 * @param {HTMLElement} root vaadin-date-picker or vaadin-date-picker-overlay-content
 */
export function getFocusableCell(root) {
  const focusableMonth = getCalendars(root).find((month) => {
    return !!month.shadowRoot.querySelector('[tabindex="0"]');
  });

  if (focusableMonth) {
    return focusableMonth.shadowRoot.querySelector('[tabindex="0"]');
  }
}

/**
 * @param {HTMLElement} root vaadin-date-picker or vaadin-date-picker-overlay-content
 */
export function getFocusedCell(root) {
  const focusableCell = getFocusableCell(root);
  if (focusableCell?.matches(':focus')) {
    return focusableCell;
  }
}

/**
 * Emulates the user filling in something in the date-picker input.
 *
 * @param {Element} datePicker
 * @param {string} value
 */
export function setInputValue(datePicker, value) {
  datePicker.inputElement.value = value;
  fire(datePicker.inputElement, 'input');
}
