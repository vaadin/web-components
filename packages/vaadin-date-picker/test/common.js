import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';

export const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

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
      'December'
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
      return d.month + 1 + '/' + d.day + '/' + d.year;
    },
    formatTitle: function (monthName, fullYear) {
      return monthName + ' ' + fullYear;
    }
  };
}

export function listenForEvent(elem, type, callback) {
  var listener = function () {
    elem.removeEventListener(type, listener);
    callback();
  };
  elem.addEventListener(type, listener);
}

export function open(datepicker, callback) {
  listenForEvent(datepicker.$.overlay, 'vaadin-overlay-open', callback);
  datepicker.open();
}

export function close(datepicker, callback) {
  listenForEvent(datepicker.$.overlay, 'vaadin-overlay-close', callback);
  datepicker.close();
}

export function tap(element) {
  element.dispatchEvent(new CustomEvent('tap', { bubbles: true, detail: {}, composed: true }));
}

export function click(element) {
  element.dispatchEvent(new CustomEvent('click', { bubbles: true, detail: {}, composed: true }));
}

export function monthsEqual(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth();
}

export function getFirstVisibleItem(scroller, bufferOffset) {
  var children = [];
  bufferOffset = bufferOffset || 0;

  scroller._buffers.forEach(function (buffer) {
    [].forEach.call(buffer.children, function (insertionPoint) {
      children.push(insertionPoint._itemWrapper);
    });
  });
  var scrollerRect = scroller.getBoundingClientRect();
  return children.reduce(function (prev, current) {
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

// TODO: validate if the statement below is still valid when running in GitHub actions.
// FF and Chrome are unable to focus input/button when tests are run in the headless window manager used in Travis
function monkeyPatchNativeFocus() {
  customElements.whenDefined('vaadin-text-field').then(() => {
    const TextFieldElement = customElements.get('vaadin-text-field');
    TextFieldElement.prototype.focus = function () {
      this._setFocused(true);
    };
    TextFieldElement.prototype.blur = function () {
      this._setFocused(false);
    };
  });

  customElements.whenDefined('vaadin-button').then(() => {
    const ButtonElement = customElements.get('vaadin-button');
    ButtonElement.prototype.focus = function () {
      this._setFocused(true);
    };
  });

  customElements.whenDefined('vaadin-date-picker').then(() => {
    const DatePickerElement = customElements.get('vaadin-date-picker');
    DatePickerElement.prototype.blur = function () {
      this._inputElement._setFocused(false);
    };
  });
}

window.addEventListener('WebComponentsReady', monkeyPatchNativeFocus);
