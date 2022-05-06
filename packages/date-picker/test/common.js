import { listenOnce, nextRender, oneEvent } from '@vaadin/testing-helpers';
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
    clear: 'Clear',
    today: 'Today',
    cancel: 'Cancel',
    formatDate: function (d) {
      return `${d.month + 1}/${d.day}/${d.year}`;
    },
    formatTitle: function (monthName, fullYear) {
      return `${monthName} ${fullYear}`;
    },
  };
}

export function open(datepicker) {
  return new Promise((resolve) => {
    listenOnce(datepicker.$.overlay, 'vaadin-overlay-open', resolve);
    datepicker.open();
  });
}

export function close(datepicker) {
  return new Promise((resolve) => {
    listenOnce(datepicker.$.overlay, 'vaadin-overlay-close', resolve);
    datepicker.close();
  });
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

export function monthsEqual(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth();
}

export function getFirstVisibleItem(scroller, bufferOffset) {
  var children = [];
  bufferOffset = bufferOffset || 0;

  scroller._buffers.forEach((buffer) => {
    [].forEach.call(buffer.children, (insertionPoint) => {
      children.push(insertionPoint._itemWrapper);
    });
  });
  var scrollerRect = scroller.getBoundingClientRect();
  return children.reduce((prev, current) => {
    return Math.floor(current.getBoundingClientRect().top) - Math.floor(scrollerRect.top + bufferOffset) <= 0
      ? current
      : prev;
  });
}

export function isFullscreen(datepicker) {
  return datepicker.$.overlay.getAttribute('fullscreen') !== null;
}

// As a side-effect has to toggle the overlay once to initialize it
export function getOverlayContent(datepicker) {
  if (datepicker.$.overlay.hasAttribute('disable-upgrade')) {
    datepicker.open();
    datepicker.close();
  }
  const overlayContent = datepicker.$.overlay.content.querySelector('#overlay-content');
  overlayContent.$.monthScroller.bufferSize = 0;
  overlayContent.$.yearScroller.bufferSize = 0;
  return overlayContent;
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
  if (overlayContent._targetPosition) {
    // The overlay content is scrolling.
    await oneEvent(overlayContent, 'scroll-animation-finished');
  }

  await nextRender();
}
