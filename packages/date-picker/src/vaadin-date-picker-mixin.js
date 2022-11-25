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
import { InputConstraintsMixin } from '@vaadin/field-base/src/input-constraints-mixin.js';
import { VirtualKeyboardController } from '@vaadin/field-base/src/virtual-keyboard-controller.js';
import {
  dateAllowed,
  dateEquals,
  extractDateParts,
  getAdjustedYear,
  getClosestDate,
  parseDate,
} from './vaadin-date-picker-helper.js';

/**
 * @polymerMixin
 * @param {function(new:HTMLElement)} subclass
 */
export const DatePickerMixin = (subclass) =>
  class VaadinDatePickerMixin extends ControllerMixin(
    DelegateFocusMixin(InputConstraintsMixin(KeyboardMixin(subclass))),
  ) {
    static get properties() {
      return {
        /**
         * The current selected date.
         * @type {Date | undefined}
         * @protected
         */
        _selectedDate: {
          type: Date,
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
          notify: true,
          value: '',
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
          observer: '_openedChanged',
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
          type: Boolean,
        },

        /**
         * @type {boolean}
         * @protected
         */
        _fullscreen: {
          type: Boolean,
          value: false,
        },

        /**
         * @type {string}
         * @protected
         */
        _fullscreenMediaQuery: {
          value: '(max-width: 420px), (max-height: 420px)',
        },

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
         *   // Used for adjusting the year value when parsing dates with short years.
         *   // The year values between 0 and 99 are evaluated and adjusted.
         *   // Example: for a referenceDate of 1970-10-30;
         *   //   dateToBeParsed: 40-10-30, result: 1940-10-30
         *   //   dateToBeParsed: 80-10-30, result: 1980-10-30
         *   //   dateToBeParsed: 10-10-30, result: 2010-10-30
         *   // Supported date format: ISO 8601 `"YYYY-MM-DD"` (default)
         *   // The default value is the current date.
         *   referenceDate: '',
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
                'December',
              ],
              weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
              weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
              firstDayOfWeek: 0,
              week: 'Week',
              calendar: 'Calendar',
              today: 'Today',
              cancel: 'Cancel',
              referenceDate: '',
              formatDate(d) {
                const yearStr = String(d.year).replace(/\d+/, (y) => '0000'.substr(y.length) + y);
                return [d.month + 1, d.day, yearStr].join('/');
              },
              parseDate(text) {
                const parts = text.split('/');
                const today = new Date();
                let date,
                  month = today.getMonth(),
                  year = today.getFullYear();

                if (parts.length === 3) {
                  month = parseInt(parts[0]) - 1;
                  date = parseInt(parts[1]);
                  year = parseInt(parts[2]);
                  if (parts[2].length < 3 && year >= 0) {
                    const usedReferenceDate = this.referenceDate ? parseDate(this.referenceDate) : new Date();
                    year = getAdjustedYear(usedReferenceDate, year, month, date);
                  }
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
                return `${monthName} ${fullYear}`;
              },
            };
          },
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
        },

        /**
         * The earliest date that can be selected. All earlier dates will be disabled.
         * @type {Date | undefined}
         * @protected
         */
        _minDate: {
          type: Date,
          computed: '__computeMinOrMaxDate(min)',
        },

        /**
         * The latest date that can be selected. All later dates will be disabled.
         * @type {Date | undefined}
         * @protected
         */
        _maxDate: {
          type: Date,
          computed: '__computeMinOrMaxDate(max)',
        },

        /** @private */
        _noInput: {
          type: Boolean,
          computed: '_isNoInput(inputElement, _fullscreen, _ios, i18n, opened, autoOpenDisabled)',
        },

        /** @private */
        _ios: {
          type: Boolean,
          value: isIOS,
        },

        /** @private */
        _focusOverlayOnOpen: Boolean,

        /** @protected */
        _overlayInitialized: Boolean,
      };
    }

    static get observers() {
      return [
        '_selectedDateChanged(_selectedDate, i18n.formatDate)',
        '_focusedDateChanged(_focusedDate, i18n.formatDate)',
      ];
    }

    static get constraints() {
      return [...super.constraints, 'min', 'max'];
    }

    /**
     * Override a getter from `InputControlMixin` to make it optional
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

      this._boundOnClick = this._onClick.bind(this);
      this._boundOnScroll = this._onScroll.bind(this);
    }

    /**
     * Override an event listener from `DelegateFocusMixin`
     * @protected
     */
    _onFocus(event) {
      super._onFocus(event);

      if (this._noInput) {
        event.target.blur();
      }
    }

    /**
     * Override an event listener from `DelegateFocusMixin`
     * @protected
     */
    _onBlur(event) {
      super._onBlur(event);

      if (!this.opened) {
        if (this.autoOpenDisabled) {
          this._selectParsedOrFocusedDate();
        }

        this.validate();

        if (this._inputValue === '' && this.value !== '') {
          this.value = '';
        }
      }
    }

    /** @protected */
    ready() {
      super.ready();

      this.addEventListener('click', this._boundOnClick);

      this.addController(
        new MediaQueryController(this._fullscreenMediaQuery, (matches) => {
          this._fullscreen = matches;
        }),
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

    /** @protected */
    _initOverlay() {
      this.$.overlay.removeAttribute('disable-upgrade');
      this._overlayInitialized = true;

      this.$.overlay.addEventListener('opened-changed', (e) => {
        this.opened = e.detail.value;
      });

      this.$.overlay.addEventListener('vaadin-overlay-escape-press', () => {
        this._focusedDate = this._selectedDate;
        this._close();
      });

      this._overlayContent.addEventListener('close', () => {
        this._close();
      });

      this._overlayContent.addEventListener('focus-input', this._focusAndSelect.bind(this));

      // User confirmed selected date by clicking the calendar.
      this._overlayContent.addEventListener('date-tap', (e) => {
        this.__userConfirmedDate = true;

        this._selectDate(e.detail.date);

        this._close();
      });

      // User confirmed selected date by pressing Enter or Today.
      this._overlayContent.addEventListener('date-selected', (e) => {
        this.__userConfirmedDate = true;

        this._selectDate(e.detail.date);
      });

      // Set focus-ring attribute when moving focus to the overlay
      // by pressing Tab or arrow key, after opening it on click.
      this._overlayContent.addEventListener('focusin', () => {
        if (this._keyboardActive) {
          this._setFocused(true);
        }
      });

      this.addEventListener('mousedown', () => this.__bringToFront());
      this.addEventListener('touchstart', () => this.__bringToFront());
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
        (!!this._selectedDate && this._inputValue === this._getFormattedDate(this.i18n.formatDate, this._selectedDate));
      const minMaxValid = !this._selectedDate || dateAllowed(this._selectedDate, this._minDate, this._maxDate);

      let inputValidity = true;
      if (this.inputElement) {
        if (this.inputElement.checkValidity) {
          inputValidity = this.inputElement.checkValidity();
        } else if (this.inputElement.validate) {
          // Iron-form-elements have the validate API
          inputValidity = this.inputElement.validate();
        }
      }

      return inputValid && minMaxValid && inputValidity;
    }

    /**
     * Override method inherited from `FocusMixin`
     * to not call `_setFocused(true)` when focus
     * is restored after closing overlay on click,
     * and to avoid removing `focus-ring` attribute.
     *
     * @param {!FocusEvent} _event
     * @return {boolean}
     * @protected
     * @override
     */
    _shouldSetFocus(_event) {
      return !this._shouldKeepFocusRing;
    }

    /**
     * Override method inherited from `FocusMixin`
     * to prevent removing the `focused` attribute:
     * - when moving focus to the overlay content,
     * - when closing on date click / outside click.
     *
     * @param {!FocusEvent} _event
     * @return {boolean}
     * @protected
     * @override
     */
    _shouldRemoveFocus(_event) {
      return !this.opened;
    }

    /**
     * Override method inherited from `FocusMixin`
     * to store the `focus-ring` state to restore
     * it later when closing on outside click.
     *
     * @param {boolean} focused
     * @protected
     * @override
     */
    _setFocused(focused) {
      super._setFocused(focused);

      this._shouldKeepFocusRing = focused && this._keyboardActive;
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
    _close() {
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

      if (!this.__keepInputValue) {
        this._applyInputValue(selectedDate);
      }

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

    /**
     * Override the value observer from `InputMixin` to implement custom
     * handling of the `value` property. The date-picker doesn't forward
     * the value directly to the input like the default implementation of `InputMixin`.
     * Instead, it parses the value into a date, puts it in `_selectedDate` which
     * is then displayed in the input with respect to the specified date format.
     *
     * @param {string | undefined} value
     * @param {string | undefined} oldValue
     * @protected
     * @override
     */
    _valueChanged(value, oldValue) {
      const newDate = parseDate(value);

      if (value && !newDate) {
        // The new value cannot be parsed, revert the old value.
        this.value = oldValue;
        return;
      }

      if (value) {
        if (!dateEquals(this._selectedDate, newDate)) {
          // Update the date instance only if the date has actually changed.
          this._selectedDate = newDate;

          if (oldValue !== undefined) {
            // Validate only if `value` changes after initialization.
            this.validate();
          }
        }
      } else {
        this._selectedDate = null;
      }

      this._toggleHasValue(this._hasValue);
    }

    /** @protected */
    _onOverlayOpened() {
      const parsedInitialPosition = parseDate(this.initialPosition);

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

      if (this._focusOverlayOnOpen) {
        this._overlayContent.focusDateElement();
        this._focusOverlayOnOpen = false;
      } else {
        this._focus();
      }

      if (this._noInput && this.focusElement) {
        this.focusElement.blur();
        this._overlayContent.focusDateElement();
      }
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
    }

    /** @private */
    _onScroll(e) {
      if (e.target === window || !this._overlayContent.contains(e.target)) {
        this._overlayContent._repositionYearScroller();
      }
    }

    /** @protected */
    _focus() {
      if (!this._noInput) {
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
      if (this._inputValue === '') {
        this.__dispatchChange = true;
      }

      event.stopPropagation();
    }

    /**
     * @param {Event} event
     * @private
     */
    _onClick(event) {
      // Clear button click is handled in separate listener
      // but bubbles to the host, so we need to ignore it.
      if (!this._isClearButton(event)) {
        this._onHostClick(event);
      }
    }

    /**
     * @param {Event} event
     * @private
     */
    _onHostClick(event) {
      if (!this.autoOpenDisabled || this._noInput) {
        event.preventDefault();
        this.open();
      }
    }

    /**
     * Override an event listener from `InputControlMixin`
     * to validate and dispatch change on clear.
     * @protected
     */
    _onClearButtonClick(event) {
      event.preventDefault();
      this.value = '';
      this._inputValue = '';
      this.validate();
      this.dispatchEvent(new CustomEvent('change', { bubbles: true }));
    }

    /**
     * Override an event listener from `KeyboardMixin`.
     * @param {KeyboardEvent} e
     * @protected
     * @override
     */
    _onKeyDown(e) {
      super._onKeyDown(e);

      if (this._noInput) {
        // The input element cannot be readonly as it would conflict with
        // the required attribute. Both are not allowed on an input element.
        // Therefore we prevent default on most keydown events.
        const allowedKeys = [
          9, // Tab
        ];
        if (allowedKeys.indexOf(e.keyCode) === -1) {
          e.preventDefault();
        }
      }

      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowUp':
          // Prevent scrolling the page with arrows
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
        case 'Tab':
          if (this.opened) {
            e.preventDefault();
            e.stopPropagation();
            // Clear the selection range (remains visible on IE)
            this._setSelectionRange(0, 0);
            if (e.shiftKey) {
              this._overlayContent.focusCancel();
            } else {
              this._overlayContent.focusDateElement();
            }
          }
          break;
        default:
          break;
      }
    }

    /**
     * Override an event listener from `KeyboardMixin`.
     *
     * @param {!KeyboardEvent} _event
     * @protected
     * @override
     */
    _onEnter(_event) {
      const oldValue = this.value;
      if (this.opened) {
        // Closing will implicitly select parsed or focused date
        this.close();
      } else {
        this._selectParsedOrFocusedDate();
      }
      if (oldValue === this.value) {
        this.validate();
      }
    }

    /**
     * Override an event listener from `KeyboardMixin`.
     * Do not call `super` in order to override clear
     * button logic defined in `InputControlMixin`.
     *
     * @param {!KeyboardEvent} event
     * @protected
     * @override
     */
    _onEscape(event) {
      // Closing overlay is handled in vaadin-overlay-escape-press event listener.
      if (this.opened) {
        return;
      }

      if (this.clearButtonVisible && !!this.value) {
        // Stop event from propagating to the host element
        // to avoid closing dialog when clearing on Esc
        event.stopPropagation();
        this._onClearButtonClick(event);
        return;
      }

      if (this.autoOpenDisabled) {
        // Do not restore selected date if Esc was pressed after clearing input field
        if (this.inputElement.value === '') {
          this._selectDate(null);
        }
        this._applyInputValue(this._selectedDate);
      } else {
        this._focusedDate = this._selectedDate;
        this._selectParsedOrFocusedDate();
      }
    }

    /** @private */
    _getParsedDate(inputValue = this._inputValue) {
      const dateObject = this.i18n.parseDate && this.i18n.parseDate(inputValue);
      const parsedDate = dateObject && parseDate(`${dateObject.year}-${dateObject.month + 1}-${dateObject.day}`);
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
      if (this._inputValue) {
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

    /** @private */
    __computeMinOrMaxDate(dateString) {
      return parseDate(dateString);
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
