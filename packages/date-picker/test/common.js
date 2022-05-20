import { aTimeout, fire, listenOnce, mousedown, nextRender } from '@vaadin/testing-helpers';
import { flush } from '@polymer/polymer/lib/utils/flush.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';

export function activateScroller(scroller) {
  scroller.active = true;
  // Setting `active` triggers `_finishInit` using afterNextRender + setTimeout(1).
  return new Promise((resolve) => {
    setTimeout(() => {
      afterNextRender(scroller, () => {
        scroller._debouncerUpdateClones.flush();
        resolve();
      });
    }, 1);
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
    week: 'Week',
    calendar: 'Calendar',
    today: 'Today',
    cancel: 'Cancel',
    formatDate(d) {
      return `${d.month + 1}/${d.day}/${d.year}`;
    },
    formatTitle(monthName, fullYear) {
      return `${monthName} ${fullYear}`;
    },
  };
}

export function open(datepicker) {
  return new Promise((resolve) => {
    listenOnce(datepicker.$.overlay, 'vaadin-overlay-open', async () => {
      // Wait until infinite scrollers are rendered
      await waitForOverlayRender();

      resolve();
    });
    datepicker.open();
  });
}

export async function waitForOverlayRender() {
  // Wait until infinite scrollers are rendered
  await aTimeout(1);
  await nextRender();

  // Force dom-repeat to render table elements
  flush();
}

export function close(datepicker) {
  return new Promise((resolve) => {
    listenOnce(datepicker.$.overlay, 'vaadin-overlay-close', resolve);
    datepicker.close();
  });
}

export function idleCallback() {
  return new Promise((resolve) => {
    window.requestIdleCallback ? window.requestIdleCallback(resolve) : setTimeout(resolve, 16);
  });
}

/**
 * Emulates clicking outside the dropdown overlay
 */
export function outsideClick() {
  // Move focus to body
  document.body.tabIndex = 0;
  // Clear keyboardActive flag
  mousedown(document.body);
  document.body.focus();
  document.body.tabIndex = -1;
  // Outside click
  document.body.click();
}

export function monthsEqual(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth();
}

export function getFirstVisibleItem(scroller, bufferOffset) {
  const children = [];
  bufferOffset = bufferOffset || 0;

  scroller._buffers.forEach((buffer) => {
    [].forEach.call(buffer.children, (insertionPoint) => {
      children.push(insertionPoint._itemWrapper);
    });
  });
  const scrollerRect = scroller.getBoundingClientRect();
  return children.reduce((prev, current) => {
    return Math.floor(current.getBoundingClientRect().top) - Math.floor(scrollerRect.top + bufferOffset) <= 0
      ? current
      : prev;
  });
}

export function isFullscreen(datepicker) {
  return datepicker.$.overlay.getAttribute('fullscreen') !== null;
}

export function getOverlayContent(datepicker) {
  // Ensure overlay content is rendered
  if (!datepicker._overlayContent) {
    datepicker.$.overlay.requestContentUpdate();
  }
  return datepicker._overlayContent;
}

export function getFocusedMonth(overlayContent) {
  const months = Array.from(overlayContent.shadowRoot.querySelectorAll('vaadin-month-calendar'));
  return months.find((month) => {
    const focused = month.shadowRoot.querySelector('[part="date"][focused]');
    return !!focused;
  });
}

export function getFocusedCell(overlayContent) {
  const months = Array.from(overlayContent.shadowRoot.querySelectorAll('vaadin-month-calendar'));

  // Date that is currently focused
  let focusedCell;

  for (let i = 0; i < months.length; i++) {
    focusedCell = months[i].shadowRoot.querySelector('[part="date"][focused]');

    if (focusedCell) {
      break;
    }
  }

  return focusedCell;
}

/**
 * Waits for the scroll to finish in the date-picker overlay content.
 *
 * @param {HTMLElement} overlayContent
 */
export async function waitForScrollToFinish(overlayContent) {
  if (overlayContent._revealPromise) {
    // The overlay content is scrolling.
    await overlayContent._revealPromise;
  }

  await nextRender(overlayContent);
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
