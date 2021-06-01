/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { IronA11yKeysBehavior } from '@polymer/iron-a11y-keys-behavior/iron-a11y-keys-behavior.js';
import { IronResizableBehavior } from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import { dateAllowed, dateEquals, extractDateParts, getClosestDate } from './vaadin-date-picker-helper.js';
import { addListener } from '@polymer/polymer/lib/utils/gestures.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';

/**
 * @polymerMixin
 */
export const DatePickerMixin = (subclass) =>
  class VaadinDatePickerMixin extends mixinBehaviors([IronResizableBehavior], subclass) {
    static get properties() {
      return {
        /**
         * The current selected date.
         * @type {Date | undefined}
         * @protected
         */
        _selectedDate: {
          type: Date
        },

        /**
         * @type {Date | undefined}
         * @protected
         */
        _focusedDate: Date,

        /**
         * The value for this element.
         *
         * Supported date formats:
         * - ISO 8601 `"YYYY-MM-DD"` (default)
         * - 6-digit extended ISO 8601 `"+YYYYYY-MM-DD"`, `"-YYYYYY-MM-DD"`
         *
         * @type {string}
         */
        value: {
          type: String,
          observer: '_valueChanged',
          notify: true,
          value: ''
        },

        /**
         * Set to true to mark the input as required.
         * @type {boolean}
         */
        required: {
          type: Boolean,
          value: false
        },

        /**
         * The name of this element.
         */
        name: {
          type: String
        },

        /**
         * Date which should be visible when there is no value selected.
         *
         * The same date formats as for the `value` property are supported.
         * @attr {string} initial-position
         */
        initialPosition: String,

        /**
         * The label for this element.
         */
        label: String,

        /**
         * Set true to open the date selector overlay.
         */
        opened: {
          type: Boolean,
          reflectToAttribute: true,
          notify: true,
          observer: '_openedChanged'
        },

        /**
         * Set true to prevent the overlay from opening automatically.
         * @attr {boolean} auto-open-disabled
         */
        autoOpenDisabled: Boolean,

        /**
         * Set true to display ISO-8601 week numbers in the calendar. Notice that
         * displaying week numbers is only supported when `i18n.firstDayOfWeek`
         * is 1 (Monday).
         * @attr {boolean} show-week-numbers
         */
        showWeekNumbers: {
          type: Boolean
        },

        /**
         * @type {boolean}
         * @protected
         */
        _fullscreen: {
          value: false,
          observer: '_fullscreenChanged'
        },

        /**
         * @type {string}
         * @protected
         */
        _fullscreenMediaQuery: {
          value: '(max-width: 420px), (max-height: 420px)'
        },

        /**
         * An array of ancestor elements whose -webkit-overflow-scrolling is forced from value
         * 'touch' to value 'auto' in order to prevent them from clipping the dropdown. iOS only.
         * @private
         */
        _touchPrevented: Array,

        /**
         * The object used to localize this component.
         * To change the default localization, replace the entire
         * `i18n` object with a custom one.
         *
         * To update individual properties, extend the existing i18n object like so:
         * ```
         * datePicker.i18n = { ...datePicker.i18n, {
         *   formatDate: date => { ... },
         *   parseDate: value => { ... },
         * }};
         * ```
         *
         * The object has the following JSON structure and default values:
         *
         * ```
         * {
         *   // An array with the full names of months starting
         *   // with January.
         *   monthNames: [
         *     'January', 'February', 'March', 'April', 'May',
         *     'June', 'July', 'August', 'September',
         *     'October', 'November', 'December'
         *   ],
         *
         *   // An array of weekday names starting with Sunday. Used
         *   // in screen reader announcements.
         *   weekdays: [
         *     'Sunday', 'Monday', 'Tuesday', 'Wednesday',
         *     'Thursday', 'Friday', 'Saturday'
         *   ],
         *
         *   // An array of short weekday names starting with Sunday.
         *   // Displayed in the calendar.
         *   weekdaysShort: [
         *     'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
         *   ],
         *
         *   // An integer indicating the first day of the week
         *   // (0 = Sunday, 1 = Monday, etc.).
         *   firstDayOfWeek: 0,
         *
         *   // Used in screen reader announcements along with week
         *   // numbers, if they are displayed.
         *   week: 'Week',
         *
         *   // Translation of the Calendar icon button title.
         *   calendar: 'Calendar',
         *
         *   // Translation of the Clear icon button title.
         *   lear: 'Clear',
         *
         *   // Translation of the Today shortcut button text.
         *   today: 'Today',
         *
         *   // Translation of the Cancel button text.
         *   cancel: 'Cancel',
         *
         *   // A function to format given `Object` as
         *   // date string. Object is in the format `{ day: ..., month: ..., year: ... }`
         *   // Note: The argument month is 0-based. This means that January = 0 and December = 11.
         *   formatDate: d => {
         *     // returns a string representation of the given
         *     // object in 'MM/DD/YYYY' -format
         *   },
         *
         *   // A function to parse the given text to an `Object` in the format `{ day: ..., month: ..., year: ... }`.
         *   // Must properly parse (at least) text formatted by `formatDate`.
         *   // Setting the property to null will disable keyboard input feature.
         *   // Note: The argument month is 0-based. This means that January = 0 and December = 11.
         *   parseDate: text => {
         *     // Parses a string in 'MM/DD/YY', 'MM/DD' or 'DD' -format to
         *     // an `Object` in the format `{ day: ..., month: ..., year: ... }`.
         *   }
         *
         *   // A function to format given `monthName` and
         *   // `fullYear` integer as calendar title string.
         *   formatTitle: (monthName, fullYear) => {
         *     return monthName + ' ' + fullYear;
         *   }
         * }
         * ```
         *
         * @type {!DatePickerI18n}
         * @default {English/US}
         */
        i18n: {
          type: Object,
          value: () => {
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
              formatDate: (d) => {
                const yearStr = String(d.year).replace(/\d+/, (y) => '0000'.substr(y.length) + y);
                return [d.month + 1, d.day, yearStr].join('/');
              },
              parseDate: (text) => {
                const parts = text.split('/');
                const today = new Date();
                let date,
                  month = today.getMonth(),
                  year = today.getFullYear();

                if (parts.length === 3) {
                  year = parseInt(parts[2]);
                  if (parts[2].length < 3 && year >= 0) {
                    year += year < 50 ? 2000 : 1900;
                  }
                  month = parseInt(parts[0]) - 1;
                  date = parseInt(parts[1]);
                } else if (parts.length === 2) {
                  month = parseInt(parts[0]) - 1;
                  date = parseInt(parts[1]);
                } else if (parts.length === 1) {
                  date = parseInt(parts[0]);
                }

                if (date !== undefined) {
                  return { day: date, month, year };
                }
              },
              formatTitle: (monthName, fullYear) => {
                return monthName + ' ' + fullYear;
              }
            };
          }
        },

        /**
         * The earliest date that can be selected. All earlier dates will be disabled.
         *
         * Supported date formats:
         * - ISO 8601 `"YYYY-MM-DD"` (default)
         * - 6-digit extended ISO 8601 `"+YYYYYY-MM-DD"`, `"-YYYYYY-MM-DD"`
         *
         * @type {string | undefined}
         */
        min: {
          type: String,
          observer: '_minChanged'
        },

        /**
         * The latest date that can be selected. All later dates will be disabled.
         *
         * Supported date formats:
         * - ISO 8601 `"YYYY-MM-DD"` (default)
         * - 6-digit extended ISO 8601 `"+YYYYYY-MM-DD"`, `"-YYYYYY-MM-DD"`
         *
         * @type {string | undefined}
         */
        max: {
          type: String,
          observer: '_maxChanged'
        },

        /**
         * The earliest date that can be selected. All earlier dates will be disabled.
         * @type {Date | string}
         * @protected
         */
        _minDate: {
          type: Date,
          // null does not work here because minimizer passes undefined to overlay (#351)
          value: ''
        },

        /**
         * The latest date that can be selected. All later dates will be disabled.
         * @type {Date | string}
         * @protected
         */
        _maxDate: {
          type: Date,
          value: ''
        },

        /** @private */
        _noInput: {
          type: Boolean,
          computed: '_isNoInput(_fullscreen, _ios, i18n, i18n.*)'
        },

        /** @private */
        _ios: {
          type: Boolean,
          value: navigator.userAgent.match(/iP(?:hone|ad;(?: U;)? CPU) OS (\d+)/)
        },

        /** @private */
        _webkitOverflowScroll: {
          type: Boolean,
          value: document.createElement('div').style.webkitOverflowScrolling === ''
        },

        /** @private */
        _ignoreAnnounce: {
          value: true
        },

        /** @private */
        _focusOverlayOnOpen: Boolean,

        /** @protected */
        _overlayInitialized: Boolean
      };
    }

    static get observers() {
      return [
        '_updateHasValue(value)',
        '_selectedDateChanged(_selectedDate, i18n.formatDate)',
        '_focusedDateChanged(_focusedDate, i18n.formatDate)',
        '_announceFocusedDate(_focusedDate, opened, _ignoreAnnounce)'
      ];
    }

    /** @protected */
    ready() {
      super.ready();
      this._boundOnScroll = this._onScroll.bind(this);
      this._boundFocus = this._focus.bind(this);
      this._boundUpdateAlignmentAndPosition = this._updateAlignmentAndPosition.bind(this);

      const isClearButton = (e) => {
        const path = e.composedPath();
        const inputIndex = path.indexOf(this._inputElement);
        return (
          path.slice(0, inputIndex).filter((el) => el.getAttribute && el.getAttribute('part') === 'clear-button')
            .length === 1
        );
      };

      addListener(this, 'tap', (e) => {
        // FIXME(platosha): use preventDefault in the text field clear button,
        // then the following composedPath check could be simplified down
        // to `if (!e.defaultPrevented)`.
        // https://github.com/vaadin/vaadin-text-field/issues/352
        if (!isClearButton(e) && (!this.autoOpenDisabled || this._noInput)) {
          this.open();
        }
      });

      this.addEventListener('touchend', (e) => {
        if (!isClearButton(e)) {
          e.preventDefault();
        }
      });
      this.addEventListener('keydown', this._onKeydown.bind(this));
      this.addEventListener('input', this._onUserInput.bind(this));
      this.addEventListener('focus', (e) => this._noInput && e.target.blur());
      this.addEventListener('blur', () => {
        if (!this.opened) {
          if (this.autoOpenDisabled) {
            const parsedDate = this._getParsedDate();
            if (this._isValidDate(parsedDate)) {
              this._selectedDate = parsedDate;
            }
          }

          if (this._inputElement.value === '' && this.__dispatchChange) {
            this.validate();
            this.value = '';
            this.__dispatchChange = false;
          } else {
            this.validate();
          }
        }
      });
    }

    /** @private */
    _initOverlay() {
      this.$.overlay.removeAttribute('disable-upgrade');
      this._overlayInitialized = true;

      this.$.overlay.addEventListener('opened-changed', (e) => (this.opened = e.detail.value));

      this._overlayContent.addEventListener('close', this._close.bind(this));
      this._overlayContent.addEventListener('focus-input', this._focusAndSelect.bind(this));
      this.$.overlay.addEventListener('vaadin-overlay-escape-press', this._boundFocus);

      // Keep focus attribute in focusElement for styling
      this._overlayContent.addEventListener('focus', () => this.focusElement._setFocused(true));

      this.$.overlay.addEventListener('vaadin-overlay-close', this._onVaadinOverlayClose.bind(this));

      const bringToFrontListener = () => {
        requestAnimationFrame(() => {
          this.$.overlay.bringToFront();
        });
      };

      this.addEventListener('mousedown', bringToFrontListener);
      this.addEventListener('touchstart', bringToFrontListener);
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      if (this._overlayInitialized) {
        this.$.overlay.removeEventListener('vaadin-overlay-escape-press', this._boundFocus);
      }

      this.opened = false;
    }

    /**
     * Opens the dropdown.
     */
    open() {
      if (!this.disabled && !this.readonly) {
        this.opened = true;
      }
    }

    /** @private */
    _close(e) {
      if (e) {
        e.stopPropagation();
      }
      this._focus();
      this.close();
    }

    /**
     * Closes the dropdown.
     */
    close() {
      if (this._overlayInitialized || this.autoOpenDisabled) {
        this.$.overlay.close();
      }
    }

    /**
     * @return {HTMLElement}
     * @protected
     */
    get _inputElement() {
      return this._input();
    }

    /** @private */
    get _nativeInput() {
      if (this._inputElement) {
        // vaadin-text-field's input is focusElement
        // iron-input's input is inputElement
        return this._inputElement.focusElement
          ? this._inputElement.focusElement
          : this._inputElement.inputElement
          ? this._inputElement.inputElement
          : this._inputElement;
      }
      return null;
    }

    /** @private */
    _parseDate(str) {
      // Parsing with RegExp to ensure correct format
      var parts = /^([-+]\d{1}|\d{2,4}|[-+]\d{6})-(\d{1,2})-(\d{1,2})$/.exec(str);
      if (!parts) {
        return;
      }

      var date = new Date(0, 0); // Wrong date (1900-01-01), but with midnight in local time
      date.setFullYear(parseInt(parts[1], 10));
      date.setMonth(parseInt(parts[2], 10) - 1);
      date.setDate(parseInt(parts[3], 10));
      return date;
    }

    /** @private */
    _isNoInput(fullscreen, ios, i18n) {
      return !this._inputElement || fullscreen || ios || !i18n.parseDate;
    }

    /** @private */
    _formatISO(date) {
      if (!(date instanceof Date)) {
        return '';
      }

      const pad = (num, fmt = '00') => (fmt + num).substr((fmt + num).length - fmt.length);

      let yearSign = '';
      let yearFmt = '0000';
      let yearAbs = date.getFullYear();
      if (yearAbs < 0) {
        yearAbs = -yearAbs;
        yearSign = '-';
        yearFmt = '000000';
      } else if (date.getFullYear() >= 10000) {
        yearSign = '+';
        yearFmt = '000000';
      }

      const year = yearSign + pad(yearAbs, yearFmt);
      const month = pad(date.getMonth() + 1);
      const day = pad(date.getDate());
      return [year, month, day].join('-');
    }

    /** @private */
    _openedChanged(opened) {
      if (opened && !this._overlayInitialized) {
        this._initOverlay();
      }
      if (this._overlayInitialized) {
        this.$.overlay.opened = opened;
      }
      if (opened) {
        this._updateAlignmentAndPosition();
      }
    }

    /** @private */
    _selectedDateChanged(selectedDate, formatDate) {
      if (selectedDate === undefined || formatDate === undefined) {
        return;
      }
      if (this.__userInputOccurred) {
        this.__dispatchChange = true;
      }
      const value = this._formatISO(selectedDate);

      this.__keepInputValue || this._applyInputValue(selectedDate);

      if (value !== this.value) {
        this.validate();
        this.value = value;
      }
      this.__userInputOccurred = false;
      this.__dispatchChange = false;
      this._ignoreFocusedDateChange = true;
      this._focusedDate = selectedDate;
      this._ignoreFocusedDateChange = false;
    }

    /** @private */
    _focusedDateChanged(focusedDate, formatDate) {
      if (focusedDate === undefined || formatDate === undefined) {
        return;
      }
      this.__userInputOccurred = true;
      if (!this._ignoreFocusedDateChange && !this._noInput) {
        this._applyInputValue(focusedDate);
      }
    }

    /** @private */
    _updateHasValue(value) {
      if (value) {
        this.setAttribute('has-value', '');
      } else {
        this.removeAttribute('has-value');
      }
    }

    /** @private */
    __getOverlayTheme(theme, overlayInitialized) {
      if (overlayInitialized) {
        return theme;
      }
    }

    /** @private */
    _handleDateChange(property, value, oldValue) {
      if (!value) {
        this[property] = '';
        return;
      }

      var date = this._parseDate(value);
      if (!date) {
        this.value = oldValue;
        return;
      }
      if (!dateEquals(this[property], date)) {
        this[property] = date;
        this.value && this.validate();
      }
    }

    /** @private */
    _valueChanged(value, oldValue) {
      if (this.__dispatchChange) {
        this.dispatchEvent(new CustomEvent('change', { bubbles: true }));
      }
      this._handleDateChange('_selectedDate', value, oldValue);
    }

    /** @private */
    _minChanged(value, oldValue) {
      this._handleDateChange('_minDate', value, oldValue);
    }

    /** @private */
    _maxChanged(value, oldValue) {
      this._handleDateChange('_maxDate', value, oldValue);
    }

    /** @private */
    _updateAlignmentAndPosition() {
      if (!this._overlayInitialized) {
        return;
      }
      if (!this._fullscreen) {
        const inputRect = this._inputElement.getBoundingClientRect();

        const bottomAlign = inputRect.top > window.innerHeight / 2;
        const rightAlign = inputRect.left + this.clientWidth / 2 > window.innerWidth / 2;

        if (rightAlign) {
          const viewportWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);
          this.$.overlay.setAttribute('right-aligned', '');
          this.$.overlay.style.removeProperty('left');
          this.$.overlay.style.right = viewportWidth - inputRect.right + 'px';
        } else {
          this.$.overlay.removeAttribute('right-aligned');
          this.$.overlay.style.removeProperty('right');
          this.$.overlay.style.left = inputRect.left + 'px';
        }

        if (bottomAlign) {
          const viewportHeight = Math.min(window.innerHeight, document.documentElement.clientHeight);
          this.$.overlay.setAttribute('bottom-aligned', '');
          this.$.overlay.style.removeProperty('top');
          this.$.overlay.style.bottom = viewportHeight - inputRect.top + 'px';
        } else {
          this.$.overlay.removeAttribute('bottom-aligned');
          this.$.overlay.style.removeProperty('bottom');
          this.$.overlay.style.top = inputRect.bottom + 'px';
        }
      }

      this.$.overlay.setAttribute('dir', getComputedStyle(this._inputElement).getPropertyValue('direction'));
      this._overlayContent._repositionYearScroller();
    }

    /** @private */
    _fullscreenChanged() {
      if (this._overlayInitialized && this.$.overlay.opened) {
        this._updateAlignmentAndPosition();
      }
    }

    /** @protected */
    _onOverlayOpened() {
      this._openedWithFocusRing =
        this.hasAttribute('focus-ring') || (this.focusElement && this.focusElement.hasAttribute('focus-ring'));

      var parsedInitialPosition = this._parseDate(this.initialPosition);

      var initialPosition =
        this._selectedDate || this._overlayContent.initialPosition || parsedInitialPosition || new Date();

      if (parsedInitialPosition || dateAllowed(initialPosition, this._minDate, this._maxDate)) {
        this._overlayContent.initialPosition = initialPosition;
      } else {
        this._overlayContent.initialPosition = getClosestDate(initialPosition, [this._minDate, this._maxDate]);
      }

      this._overlayContent.scrollToDate(this._overlayContent.focusedDate || this._overlayContent.initialPosition);
      // Have a default focused date
      this._ignoreFocusedDateChange = true;
      this._overlayContent.focusedDate = this._overlayContent.focusedDate || this._overlayContent.initialPosition;
      this._ignoreFocusedDateChange = false;

      window.addEventListener('scroll', this._boundOnScroll, true);
      this.addEventListener('iron-resize', this._boundUpdateAlignmentAndPosition);

      if (this._webkitOverflowScroll) {
        this._touchPrevented = this._preventWebkitOverflowScrollingTouch(this.parentElement);
      }

      if (this._focusOverlayOnOpen) {
        this._overlayContent.focus();
        this._focusOverlayOnOpen = false;
      } else {
        this._focus();
      }

      if (this._noInput && this.focusElement) {
        this.focusElement.blur();
      }

      this.updateStyles();

      this._ignoreAnnounce = false;
    }

    // A hack needed for iOS to prevent dropdown from being clipped in an
    // ancestor container with -webkit-overflow-scrolling: touch;
    /** @private */
    _preventWebkitOverflowScrollingTouch(element) {
      var result = [];
      while (element) {
        if (window.getComputedStyle(element).webkitOverflowScrolling === 'touch') {
          var oldInlineValue = element.style.webkitOverflowScrolling;
          element.style.webkitOverflowScrolling = 'auto';
          result.push({
            element: element,
            oldInlineValue: oldInlineValue
          });
        }
        element = element.parentElement;
      }
      return result;
    }

    /** @private */
    _selectParsedOrFocusedDate() {
      // Select the parsed input or focused date
      this._ignoreFocusedDateChange = true;
      if (this.i18n.parseDate) {
        const inputValue = this._inputValue || '';
        const parsedDate = this._getParsedDate(inputValue);

        if (this._isValidDate(parsedDate)) {
          this._selectedDate = parsedDate;
        } else {
          this.__keepInputValue = true;
          this._selectedDate = null;
          this.__keepInputValue = false;
        }
      } else if (this._focusedDate) {
        this._selectedDate = this._focusedDate;
      }
      this._ignoreFocusedDateChange = false;
    }

    /** @protected */
    _onOverlayClosed() {
      this._ignoreAnnounce = true;

      window.removeEventListener('scroll', this._boundOnScroll, true);
      this.removeEventListener('iron-resize', this._boundUpdateAlignmentAndPosition);

      if (this._touchPrevented) {
        this._touchPrevented.forEach(
          (prevented) => (prevented.element.style.webkitOverflowScrolling = prevented.oldInlineValue)
        );
        this._touchPrevented = [];
      }

      this.updateStyles();

      this._selectParsedOrFocusedDate();

      if (this._nativeInput && this._nativeInput.selectionStart) {
        this._nativeInput.selectionStart = this._nativeInput.selectionEnd;
      }
      // No need to revalidate the value after `_selectedDateChanged`
      // Needed in case the value was not changed: open and close dropdown.
      if (!this.value) {
        this.validate();
      }
    }

    /**
     * Returns true if `value` is valid, and sets the `invalid` flag appropriately.
     *
     * @param {string=} value Value to validate. Optional, defaults to user's input value.
     * @return {boolean} True if the value is valid and sets the `invalid` flag appropriately
     */
    validate() {
      // Note (Yuriy): Workaround `this._inputValue` is used in order
      // to avoid breaking change on custom `checkValidity`.
      // Can be removed with next major.
      return !(this.invalid = !this.checkValidity(this._inputValue));
    }

    /**
     * Returns true if the current input value satisfies all constraints (if any)
     *
     * Override the `checkValidity` method for custom validations.
     *
     * @param {string=} value Value to validate. Optional, defaults to the selected date.
     * @return {boolean} True if the value is valid
     */
    checkValidity() {
      const inputValid =
        !this._inputValue ||
        (this._selectedDate && this._inputValue === this._getFormattedDate(this.i18n.formatDate, this._selectedDate));
      const minMaxValid = !this._selectedDate || dateAllowed(this._selectedDate, this._minDate, this._maxDate);

      let inputValidity = true;
      if (this._inputElement) {
        if (this._inputElement.checkValidity) {
          // vaadin native input elements have the checkValidity method
          this._inputElement.__forceCheckValidity = true;
          inputValidity = this._inputElement.checkValidity();
          this._inputElement.__forceCheckValidity = false;
        } else if (this._inputElement.validate) {
          // iron-form-elements have the validate API
          inputValidity = this._inputElement.validate();
        }
      }

      return inputValid && minMaxValid && inputValidity;
    }

    /** @private */
    _onScroll(e) {
      if (e.target === window || !this._overlayContent.contains(e.target)) {
        this._updateAlignmentAndPosition();
      }
    }

    /** @protected */
    _focus() {
      if (this._noInput) {
        this._overlayInitialized && this._overlayContent.focus();
      } else {
        this._inputElement.focus();
      }
    }

    /** @private */
    _focusAndSelect() {
      this._focus();
      this._setSelectionRange(0, this._inputValue.length);
    }

    /** @private */
    _applyInputValue(date) {
      this._inputValue = date ? this._getFormattedDate(this.i18n.formatDate, date) : '';
    }

    /** @private */
    _getFormattedDate(formatDate, date) {
      return formatDate(extractDateParts(date));
    }

    /** @private */
    _setSelectionRange(a, b) {
      if (this._nativeInput && this._nativeInput.setSelectionRange) {
        this._nativeInput.setSelectionRange(a, b);
      }
    }

    /**
     * Keyboard Navigation
     * @private
     */
    _eventKey(e) {
      var keys = ['down', 'up', 'enter', 'esc', 'tab'];

      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (IronA11yKeysBehavior.keyboardEventMatchesKeys(e, k)) {
          return k;
        }
      }
    }

    /** @private */
    _isValidDate(d) {
      return d && !isNaN(d.getTime());
    }

    /** @private */
    _onKeydown(e) {
      if (this._noInput) {
        // The input element cannot be readonly as it would conflict with
        // the required attribute. Both are not allowed on an input element.
        // Therefore we prevent default on most keydown events.
        var allowedKeys = [
          9 // tab
        ];
        if (allowedKeys.indexOf(e.keyCode) === -1) {
          e.preventDefault();
        }
      }

      switch (this._eventKey(e)) {
        case 'down':
        case 'up':
          // prevent scrolling the page with arrows
          e.preventDefault();

          if (this.opened) {
            this._overlayContent.focus();
            this._overlayContent._onKeydown(e);
          } else {
            this._focusOverlayOnOpen = true;
            this.open();
          }

          break;
        case 'enter': {
          const parsedDate = this._getParsedDate();
          const isValidDate = this._isValidDate(parsedDate);
          if (this.opened) {
            if (this._overlayInitialized && this._overlayContent.focusedDate && isValidDate) {
              this._selectedDate = this._overlayContent.focusedDate;
            }
            this.close();
          } else {
            if (!isValidDate && this._inputElement.value !== '') {
              this.validate();
            } else {
              const oldValue = this.value;
              this._selectParsedOrFocusedDate();
              if (oldValue === this.value) {
                this.validate();
              }
            }
          }
          break;
        }
        case 'esc':
          if (this.opened) {
            this._focusedDate = this._selectedDate;
            this._close();
          } else if (this.autoOpenDisabled) {
            //Do not restore selected date if Esc was pressed after clearing input field
            if (this._inputElement.value === '') {
              this._selectedDate = null;
            }
            this._applyInputValue(this._selectedDate);
          } else {
            this._focusedDate = this._selectedDate;
            this._selectParsedOrFocusedDate();
          }
          break;
        case 'tab':
          if (this.opened) {
            e.preventDefault();
            //Clear the selection range (remains visible on IE)
            this._setSelectionRange(0, 0);
            if (e.shiftKey) {
              this._overlayContent.focusCancel();
            } else {
              this._overlayContent.focus();
              this._overlayContent.revealDate(this._focusedDate);
            }
          }
          break;
      }
    }

    /** @private */
    _getParsedDate(inputValue = this._inputValue) {
      const dateObject = this.i18n.parseDate && this.i18n.parseDate(inputValue);
      const parsedDate =
        dateObject && this._parseDate(dateObject.year + '-' + (dateObject.month + 1) + '-' + dateObject.day);
      return parsedDate;
    }

    /** @private */
    _onUserInput(e) {
      if (!this.opened && this._inputElement.value && !this.autoOpenDisabled) {
        this.open();
      }
      this._userInputValueChanged();

      if (e.__fromClearButton) {
        this.validate();
        this.__dispatchChange = true;
        this.value = '';
        this.__dispatchChange = false;
      }
    }

    /** @private */
    _userInputValueChanged() {
      if (this.opened && this._inputValue) {
        const parsedDate = this._getParsedDate();

        if (this._isValidDate(parsedDate)) {
          this._ignoreFocusedDateChange = true;
          if (!dateEquals(parsedDate, this._focusedDate)) {
            this._focusedDate = parsedDate;
          }
          this._ignoreFocusedDateChange = false;
        }
      }
    }

    /** @private */
    _announceFocusedDate(_focusedDate, opened, _ignoreAnnounce) {
      if (opened && !_ignoreAnnounce) {
        this._overlayContent.announceFocusedDate();
      }
    }

    /** @private */
    get _overlayContent() {
      return this.$.overlay.content.querySelector('#overlay-content');
    }

    /**
     * Fired when the user commits a value change.
     *
     * @event change
     */

    /**
     * Fired when `value` property value changes.
     *
     * @event value-changed
     */

    /**
     * Fired when `opened` property value changes.
     *
     * @event opened-changed
     */
  };
