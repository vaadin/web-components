/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { isIOS } from '@vaadin/component-base/src/browser-utils.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { KeyboardMixin } from '@vaadin/component-base/src/keyboard-mixin.js';
import { MediaQueryController } from '@vaadin/component-base/src/media-query-controller.js';
import { DelegateFocusMixin } from '@vaadin/field-base/src/delegate-focus-mixin.js';
import { InputMixin } from '@vaadin/field-base/src/input-mixin.js';
import { VirtualKeyboardController } from '@vaadin/field-base/src/virtual-keyboard-controller.js';
import { dateAllowed, dateEquals, extractDateParts, getClosestDate } from './vaadin-date-picker-helper.js';

/**
 * @polymerMixin
 * @param {function(new:HTMLElement)} subclass
 */
export const DatePickerMixin = (subclass) =>
  class VaadinDatePickerMixin extends ControllerMixin(DelegateFocusMixin(InputMixin(KeyboardMixin(subclass)))) {
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
         * Selected date.
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
         * Date which should be visible when there is no value selected.
         *
         * The same date formats as for the `value` property are supported.
         * @attr {string} initial-position
         */
        initialPosition: String,

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
          type: Boolean,
          value: false
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
          computed: '_isNoInput(inputElement, _fullscreen, _ios, i18n, opened, autoOpenDisabled)'
        },

        /** @private */
        _ios: {
          type: Boolean,
          value: isIOS
        },

        /** @private */
        _webkitOverflowScroll: {
          type: Boolean,
          value: document.createElement('div').style.webkitOverflowScrolling === ''
        },

        /** @private */
        _focusOverlayOnOpen: Boolean,

        /** @protected */
        _overlayInitialized: Boolean
      };
    }

    static get observers() {
      return [
        '_selectedDateChanged(_selectedDate, i18n.formatDate)',
        '_focusedDateChanged(_focusedDate, i18n.formatDate)'
      ];
    }

    /**
     * Override a getter from `ClearButtonMixin` to make it optional
     * and to prevent warning when a clear button is missing,
     * for example when using <vaadin-date-picker-light>.
     * @protected
     * @return {Element | null | undefined}
     */
    get clearElement() {
      return null;
    }

    /** @protected */
    get _inputValue() {
      return this.inputElement ? this.inputElement.value : undefined;
    }

    /** @protected */
    set _inputValue(value) {
      if (this.inputElement) {
        this.inputElement.value = value;
      }
    }

    /** @private */
    get _nativeInput() {
      if (this.inputElement) {
        // TODO: support focusElement for backwards compatibility
        return this.inputElement.focusElement || this.inputElement;
      }
      return null;
    }

    constructor() {
      super();

      this._boundOnScroll = this._onScroll.bind(this);
    }

    /**
     * Override an event listener from `DelegateFocusMixin`
     * @protected
     */
    _onFocus(event) {
      super._onFocus(event);

      this._noInput && event.target.blur();
    }

    /**
     * Override an event listener from `DelegateFocusMixin`
     * @protected
     */
    _onBlur(event) {
      super._onBlur(event);

      if (!this.opened) {
        if (this.autoOpenDisabled) {
          const parsedDate = this._getParsedDate();
          if (this._isValidDate(parsedDate)) {
            this._selectDate(parsedDate);
          }
        }

        if (this.inputElement.value === '' && this.__dispatchChange) {
          this.validate();
          this.value = '';
          this.__dispatchChange = false;
        } else {
          this.validate();
        }
      }
    }

    /** @protected */
    ready() {
      super.ready();

      this.addEventListener('click', (e) => {
        if (!this._isClearButton(e) && (!this.autoOpenDisabled || this._noInput)) {
          this.open();
        }
      });

      this.addController(
        new MediaQueryController(this._fullscreenMediaQuery, (matches) => {
          this._fullscreen = matches;
        })
      );

      this.addController(new VirtualKeyboardController(this));
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      this.opened = false;
    }

    /**
     * Override Polymer lifecycle callback to dispatch `change` event if needed.
     * This is necessary to ensure `change` is fired after `value-changed`.
     *
     * @param {!Object} currentProps Current accessor values
     * @param {?Object} changedProps Properties changed since the last call
     * @param {?Object} oldProps Previous values for each changed property
     * @protected
     * @override
     */
    _propertiesChanged(currentProps, changedProps, oldProps) {
      super._propertiesChanged(currentProps, changedProps, oldProps);

      if ('value' in changedProps && this.__dispatchChange) {
        this.dispatchEvent(new CustomEvent('change', { bubbles: true }));
        this.__dispatchChange = false;
      }
    }

    /**
     * Opens the dropdown.
     */
    open() {
      if (!this.disabled && !this.readonly) {
        this.opened = true;
      }
    }

    /**
     * Closes the dropdown.
     */
    close() {
      if (this._overlayInitialized || this.autoOpenDisabled) {
        this.$.overlay.close();
      }
    }

    /** @private */
    _initOverlay() {
      this.$.overlay.removeAttribute('disable-upgrade');
      this._overlayInitialized = true;

      this.$.overlay.addEventListener('opened-changed', (e) => (this.opened = e.detail.value));

      this._overlayContent.addEventListener('close', this._close.bind(this));
      this._overlayContent.addEventListener('focus-input', this._focusAndSelect.bind(this));

      // User confirmed selected date by clicking the calendar.
      this._overlayContent.addEventListener('date-tap', (e) => {
        this.__userConfirmedDate = true;

        this._selectDate(e.detail.date);
      });

      // User confirmed selected date by pressing Enter or Today.
      this._overlayContent.addEventListener('date-selected', (e) => {
        this.__userConfirmedDate = true;

        this._selectDate(e.detail.date);
      });

      // Keep focus attribute in focusElement for styling
      this._overlayContent.addEventListener('focus', () => {
        this._setFocused(true);
      });

      this.$.overlay.addEventListener('vaadin-overlay-close', this._onVaadinOverlayClose.bind(this));

      this.addEventListener('mousedown', () => this.__bringToFront());
      this.addEventListener('touchstart', () => this.__bringToFront());
    }

    /**
     * Returns true if `value` is valid, and sets the `invalid` flag appropriately.
     *
     * @return {boolean} True if the value is valid and sets the `invalid` flag appropriately
     */
    validate() {
      return !(this.invalid = !this.checkValidity());
    }

    /**
     * Returns true if the current input value satisfies all constraints (if any)
     *
     * Override the `checkValidity` method for custom validations.
     *
     * @return {boolean} True if the value is valid
     */
    checkValidity() {
      const inputValid =
        !this._inputValue ||
        (this._selectedDate && this._inputValue === this._getFormattedDate(this.i18n.formatDate, this._selectedDate));
      const minMaxValid = !this._selectedDate || dateAllowed(this._selectedDate, this._minDate, this._maxDate);

      let inputValidity = true;
      if (this.inputElement) {
        if (this.inputElement.checkValidity) {
          inputValidity = this.inputElement.checkValidity();
        } else if (this.inputElement.validate) {
          // iron-form-elements have the validate API
          inputValidity = this.inputElement.validate();
        }
      }

      return inputValid && minMaxValid && inputValidity;
    }

    /**
     * Select date on user interaction and set the flag
     * to fire change event if necessary.
     *
     * @param {Date} dateToSelect
     * @protected
     */
    _selectDate(dateToSelect) {
      const value = this._formatISO(dateToSelect);

      // Only set flag if the value will change.
      if (this.value !== value) {
        this.__dispatchChange = true;
      }

      this._selectedDate = dateToSelect;
    }

    /** @private */
    _close(e) {
      if (e) {
        e.stopPropagation();
      }
      this._focus();
      this.close();
    }

    /** @private */
    __bringToFront() {
      requestAnimationFrame(() => {
        this.$.overlay.bringToFront();
      });
    }

    /** @private */
    _parseDate(str) {
      // Parsing with RegExp to ensure correct format
      const parts = /^([-+]\d{1}|\d{2,4}|[-+]\d{6})-(\d{1,2})-(\d{1,2})$/.exec(str);
      if (!parts) {
        return;
      }

      const date = new Date(0, 0); // Wrong date (1900-01-01), but with midnight in local time
      date.setFullYear(parseInt(parts[1], 10));
      date.setMonth(parseInt(parts[2], 10) - 1);
      date.setDate(parseInt(parts[3], 10));
      return date;
    }

    /** @private */
    // eslint-disable-next-line max-params
    _isNoInput(inputElement, fullscreen, ios, i18n, opened, autoOpenDisabled) {
      // On fullscreen mode, text input is disabled if auto-open isn't disabled or
      // whenever the dropdown is opened
      const noInputOnFullscreenMode = fullscreen && (!autoOpenDisabled || opened);
      // On iOS, text input is disabled whenever the dropdown is opened, because
      // the virtual keyboard doesn't affect the viewport metrics and thus the
      // dropdown could get covered by the keyboard.
      const noInputOnIos = ios && opened;

      return !inputElement || noInputOnFullscreenMode || noInputOnIos || !i18n.parseDate;
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

    /** @protected */
    _inputElementChanged(input) {
      super._inputElementChanged(input);
      if (input) {
        input.autocomplete = 'off';
        input.setAttribute('role', 'combobox');
        input.setAttribute('aria-haspopup', 'dialog');
        input.setAttribute('aria-expanded', !!this.opened);
        this._applyInputValue(this._selectedDate);
      }
    }

    /** @protected */
    _openedChanged(opened) {
      if (opened && !this._overlayInitialized) {
        this._initOverlay();
      }
      if (this._overlayInitialized) {
        this.$.overlay.opened = opened;
      }
      if (this.inputElement) {
        this.inputElement.setAttribute('aria-expanded', opened);
      }
    }

    /** @private */
    _selectedDateChanged(selectedDate, formatDate) {
      if (selectedDate === undefined || formatDate === undefined) {
        return;
      }
      const value = this._formatISO(selectedDate);

      this.__keepInputValue || this._applyInputValue(selectedDate);

      if (value !== this.value) {
        this.validate();
        this.value = value;
      }
      this._ignoreFocusedDateChange = true;
      this._focusedDate = selectedDate;
      this._ignoreFocusedDateChange = false;
    }

    /** @private */
    _focusedDateChanged(focusedDate, formatDate) {
      if (focusedDate === undefined || formatDate === undefined) {
        return;
      }
      if (!this._ignoreFocusedDateChange && !this._noInput) {
        this._applyInputValue(focusedDate);
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

      const date = this._parseDate(value);
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
      this._handleDateChange('_selectedDate', value, oldValue);

      this._toggleHasValue(!!value);
    }

    /** @private */
    _minChanged(value, oldValue) {
      this._handleDateChange('_minDate', value, oldValue);
    }

    /** @private */
    _maxChanged(value, oldValue) {
      this._handleDateChange('_maxDate', value, oldValue);
    }

    /** @protected */
    _onOverlayOpened() {
      this._openedWithFocusRing = this.hasAttribute('focus-ring');

      const parsedInitialPosition = this._parseDate(this.initialPosition);

      const initialPosition =
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

      if (this._webkitOverflowScroll) {
        this._touchPrevented = this._preventWebkitOverflowScrollingTouch(this.parentElement);
      }

      if (this._focusOverlayOnOpen) {
        this._overlayContent.focusDateElement();
        this._focusOverlayOnOpen = false;
      } else {
        this._focus();
      }

      if (this._noInput && this.focusElement) {
        this.focusElement.blur();
      }
    }

    // A hack needed for iOS to prevent dropdown from being clipped in an
    // ancestor container with -webkit-overflow-scrolling: touch;
    /** @private */
    _preventWebkitOverflowScrollingTouch(element) {
      const result = [];
      while (element) {
        if (window.getComputedStyle(element).webkitOverflowScrolling === 'touch') {
          const oldInlineValue = element.style.webkitOverflowScrolling;
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
          this._selectDate(parsedDate);
        } else {
          this.__keepInputValue = true;
          this._selectDate(null);
          this._selectedDate = null;
          this.__keepInputValue = false;
        }
      } else if (this._focusedDate) {
        this._selectDate(this._focusedDate);
      }
      this._ignoreFocusedDateChange = false;
    }

    /** @protected */
    _onOverlayClosed() {
      window.removeEventListener('scroll', this._boundOnScroll, true);

      if (this._touchPrevented) {
        this._touchPrevented.forEach(
          (prevented) => (prevented.element.style.webkitOverflowScrolling = prevented.oldInlineValue)
        );
        this._touchPrevented = [];
      }

      // No need to select date on close if it was confirmed by the user.
      if (this.__userConfirmedDate) {
        this.__userConfirmedDate = false;
      } else {
        this._selectParsedOrFocusedDate();
      }

      if (this._nativeInput && this._nativeInput.selectionStart) {
        this._nativeInput.selectionStart = this._nativeInput.selectionEnd;
      }
      // No need to revalidate the value after `_selectedDateChanged`
      // Needed in case the value was not changed: open and close dropdown.
      if (!this.value) {
        this.validate();
      }

      // If the input isn't focused when overlay closes (fullscreen mode), clear focused state
      if (this.getRootNode().activeElement !== this.inputElement) {
        this._setFocused(false);
      }
    }

    /** @private */
    _onScroll(e) {
      if (e.target === window || !this._overlayContent.contains(e.target)) {
        this._overlayContent._repositionYearScroller();
      }
    }

    /** @protected */
    _focus() {
      if (this._noInput) {
        this._overlayInitialized && this._overlayContent.focus();
      } else {
        this.inputElement.focus();
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

    /** @private */
    _isValidDate(d) {
      return d && !isNaN(d.getTime());
    }

    /**
     * Override an event listener from `InputConstraintsMixin`
     * to have date-picker fully control when to fire a change event.
     * @protected
     */
    _onChange(event) {
      // For change event on the native <input> blur, after the input is cleared,
      // we schedule change event to be dispatched on date-picker blur.
      if (
        this.inputElement.value === '' &&
        !(event.detail && event.detail.sourceEvent && event.detail.sourceEvent.__fromClearButton)
      ) {
        this.__dispatchChange = true;
      }

      event.stopPropagation();
    }

    /**
     * Override an event listener from `ClearButtonMixin`
     * to validate and dispatch change on clear.
     * @protected
     */
    _onClearButtonClick() {
      this.value = '';
      this._inputValue = '';
      this.validate();
      this.dispatchEvent(new CustomEvent('change', { bubbles: true }));
    }

    /**
     * Override an event listener from `KeyboardMixin`.
     * Do not call `super` to also override `ClearButtonMixin`.
     * @protected
     * @override
     */
    _onKeyDown(e) {
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

      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowUp':
          // prevent scrolling the page with arrows
          e.preventDefault();
          if (this.opened) {
            // The overlay can be opened with ctrl + option + shift in VoiceOver
            // and without this logic, it won't be possible to focus the dialog opened this way.
            this._overlayContent.focusDateElement();
          } else {
            this._focusOverlayOnOpen = true;
            this.open();
          }
          break;
        case 'Enter': {
          const parsedDate = this._getParsedDate();
          const isValidDate = this._isValidDate(parsedDate);
          if (this.opened) {
            if (this._overlayInitialized && this._overlayContent.focusedDate && isValidDate) {
              this._selectDate(this._overlayContent.focusedDate);
            }
            this.close();
          } else if (!isValidDate && this.inputElement.value !== '') {
            this.validate();
          } else {
            const oldValue = this.value;
            this._selectParsedOrFocusedDate();
            if (oldValue === this.value) {
              this.validate();
            }
          }
          break;
        }
        case 'Escape':
          if (this.opened) {
            this._focusedDate = this._selectedDate;
            this._close();
          } else if (this.clearButtonVisible) {
            this._onClearButtonClick();
          } else if (this.autoOpenDisabled) {
            // Do not restore selected date if Esc was pressed after clearing input field
            if (this.inputElement.value === '') {
              this._selectDate(null);
            }
            this._applyInputValue(this._selectedDate);
          } else {
            this._focusedDate = this._selectedDate;
            this._selectParsedOrFocusedDate();
          }
          break;
        case 'Tab':
          if (this.opened) {
            e.preventDefault();
            // Clear the selection range (remains visible on IE)
            this._setSelectionRange(0, 0);
            if (e.shiftKey) {
              this._overlayContent.focusCancel();
            } else {
              this._overlayContent.focusDate(this._focusedDate);
            }
          }
          break;
        default:
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

    /** @protected */
    _isClearButton(event) {
      return event.composedPath()[0] === this.clearElement;
    }

    /**
     * Override an event listener from `InputMixin`
     * @protected
     */
    _onInput() {
      if (!this.opened && this.inputElement.value && !this.autoOpenDisabled) {
        this.open();
      }
      this._userInputValueChanged();
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
