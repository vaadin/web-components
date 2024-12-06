/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { hideOthers } from '@vaadin/a11y-base/src/aria-hidden.js';
import { DelegateFocusMixin } from '@vaadin/a11y-base/src/delegate-focus-mixin.js';
import { isKeyboardActive } from '@vaadin/a11y-base/src/focus-utils.js';
import { KeyboardMixin } from '@vaadin/a11y-base/src/keyboard-mixin.js';
import { isIOS } from '@vaadin/component-base/src/browser-utils.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { MediaQueryController } from '@vaadin/component-base/src/media-query-controller.js';
import { OverlayClassMixin } from '@vaadin/component-base/src/overlay-class-mixin.js';
import { InputConstraintsMixin } from '@vaadin/field-base/src/input-constraints-mixin.js';
import { VirtualKeyboardController } from '@vaadin/field-base/src/virtual-keyboard-controller.js';
import {
  dateAllowed,
  dateEquals,
  extractDateParts,
  formatISODate,
  getAdjustedYear,
  getClosestDate,
  parseDate,
} from './vaadin-date-picker-helper.js';

export const datePickerI18nDefaults = Object.freeze({
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
  referenceDate: '',
  formatDate(d) {
    const yearStr = String(d.year).replace(/\d+/u, (y) => '0000'.substr(y.length) + y);
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
});

/**
 * @polymerMixin
 * @mixes ControllerMixin
 * @mixes DelegateFocusMixin
 * @mixes InputConstraintsMixin
 * @mixes KeyboardMixin
 * @mixes OverlayClassMixin
 * @param {function(new:HTMLElement)} subclass
 */
export const DatePickerMixin = (subclass) =>
  class DatePickerMixinClass extends OverlayClassMixin(
    ControllerMixin(DelegateFocusMixin(InputConstraintsMixin(KeyboardMixin(subclass)))),
  ) {
    static get properties() {
      return {
        /**
         * The current selected date.
         * @type {Date | undefined}
         * @protected
         */
        _selectedDate: {
          type: Object,
          sync: true,
        },

        /**
         * @type {Date | undefined}
         * @protected
         */
        _focusedDate: {
          type: Object,
          sync: true,
        },

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
          sync: true,
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
          sync: true,
        },

        /**
         * Set true to prevent the overlay from opening automatically.
         * @attr {boolean} auto-open-disabled
         */
        autoOpenDisabled: {
          type: Boolean,
          sync: true,
        },

        /**
         * Set true to display ISO-8601 week numbers in the calendar. Notice that
         * displaying week numbers is only supported when `i18n.firstDayOfWeek`
         * is 1 (Monday).
         * @attr {boolean} show-week-numbers
         */
        showWeekNumbers: {
          type: Boolean,
          value: false,
          sync: true,
        },

        /**
         * @type {boolean}
         * @protected
         */
        _fullscreen: {
          type: Boolean,
          value: false,
          sync: true,
        },

        /**
         * @type {string}
         * @protected
         */
        _fullscreenMediaQuery: {
          value: '(max-width: 450px), (max-height: 450px)',
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
          sync: true,
          value: () => ({ ...datePickerI18nDefaults }),
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
          sync: true,
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
          sync: true,
        },

        /**
         * A function to be used to determine whether the user can select a given date.
         * Receives a `DatePickerDate` object of the date to be selected and should return a
         * boolean.
         *
         * @type {function(DatePickerDate): boolean | undefined}
         */
        isDateDisabled: {
          type: Function,
        },

        /**
         * The earliest date that can be selected. All earlier dates will be disabled.
         * @type {Date | undefined}
         * @protected
         */
        _minDate: {
          type: Date,
          computed: '__computeMinOrMaxDate(min)',
          sync: true,
        },

        /**
         * The latest date that can be selected. All later dates will be disabled.
         * @type {Date | undefined}
         * @protected
         */
        _maxDate: {
          type: Date,
          computed: '__computeMinOrMaxDate(max)',
          sync: true,
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

        /** @private */
        _overlayContent: {
          type: Object,
          sync: true,
        },

        /** @private */
        __enteredDate: {
          type: Date,
          sync: true,
        },
      };
    }

    static get observers() {
      return [
        '_selectedDateChanged(_selectedDate, i18n)',
        '_focusedDateChanged(_focusedDate, i18n)',
        '__updateOverlayContent(_overlayContent, i18n, label, _minDate, _maxDate, _focusedDate, _selectedDate, showWeekNumbers, isDateDisabled, __enteredDate)',
        '__updateOverlayContentTheme(_overlayContent, _theme)',
        '__updateOverlayContentFullScreen(_overlayContent, _fullscreen)',
      ];
    }

    static get constraints() {
      return [...super.constraints, 'min', 'max'];
    }

    constructor() {
      super();

      this._boundOnClick = this._onClick.bind(this);
      this._boundOnScroll = this._onScroll.bind(this);
      this._boundOverlayRenderer = this._overlayRenderer.bind(this);
    }

    /** @override */
    get _inputElementValue() {
      return super._inputElementValue;
    }

    /** @override */
    set _inputElementValue(value) {
      super._inputElementValue = value;

      const parsedDate = this.__parseDate(value);
      this.__setEnteredDate(parsedDate);
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

    /** @private */
    get _nativeInput() {
      if (this.inputElement) {
        // TODO: support focusElement for backwards compatibility
        return this.inputElement.focusElement || this.inputElement;
      }
      return null;
    }

    /**
     * The input element's value when it cannot be parsed as a date, and an empty string otherwise.
     *
     * @return {string}
     * @private
     */
    get __unparsableValue() {
      if (!this._inputElementValue || this.__parseDate(this._inputElementValue)) {
        return '';
      }

      return this._inputElementValue;
    }

    /**
     * Override an event listener from `DelegateFocusMixin`
     * @protected
     */
    _onFocus(event) {
      super._onFocus(event);

      if (this._noInput && !isKeyboardActive()) {
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
        this.__commitParsedOrFocusedDate();

        // Do not validate when focusout is caused by document
        // losing focus, which happens on browser tab switch.
        if (document.hasFocus()) {
          this._requestValidation();
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

      const overlay = this.$.overlay;
      this._overlayElement = overlay;

      overlay.renderer = this._boundOverlayRenderer;

      this.addEventListener('mousedown', () => this.__bringToFront());
      this.addEventListener('touchstart', () => this.__bringToFront());
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

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

    /**
     * Closes the dropdown.
     */
    close() {
      this.$.overlay.close();
    }

    /** @private */
    _overlayRenderer(root) {
      if (root.firstChild) {
        return;
      }

      // Create and store document content element
      const content = document.createElement('vaadin-date-picker-overlay-content');
      root.appendChild(content);

      this._overlayContent = content;

      content.addEventListener('close', () => {
        this._close();
      });

      content.addEventListener('focus-input', this._focusAndSelect.bind(this));

      // User confirmed selected date by clicking the calendar.
      content.addEventListener('date-tap', (e) => {
        this.__commitDate(e.detail.date);

        this._close();
      });

      // User confirmed selected date by pressing Enter, Space, or Today.
      content.addEventListener('date-selected', (e) => {
        this.__commitDate(e.detail.date);
      });

      // Set focus-ring attribute when moving focus to the overlay
      // by pressing Tab or arrow key, after opening it on click.
      content.addEventListener('focusin', () => {
        if (this._keyboardActive) {
          this._setFocused(true);
        }
      });

      content.addEventListener('focusout', (event) => {
        if (this._shouldRemoveFocus(event)) {
          this._setFocused(false);
        }
      });

      // Two-way data binding for `focusedDate` property
      content.addEventListener('focused-date-changed', (e) => {
        this._focusedDate = e.detail.value;
      });

      content.addEventListener('click', (e) => e.stopPropagation());
    }

    /**
     * @param {string} dateString
     * @private
     */
    __parseDate(dateString) {
      if (!this.i18n.parseDate) {
        return;
      }

      let dateObject = this.i18n.parseDate(dateString);
      if (dateObject) {
        dateObject = parseDate(`${dateObject.year}-${dateObject.month + 1}-${dateObject.day}`);
      }
      if (dateObject && !isNaN(dateObject.getTime())) {
        return dateObject;
      }
    }

    /**
     * @param {Date} dateObject
     * @private
     */
    __formatDate(dateObject) {
      if (this.i18n.formatDate) {
        return this.i18n.formatDate(extractDateParts(dateObject));
      }
    }

    /**
     * Returns true if the current input value satisfies all constraints (if any)
     *
     * Override the `checkValidity` method for custom validations.
     *
     * @return {boolean} True if the value is valid
     */
    checkValidity() {
      const inputValue = this._inputElementValue;
      const inputValid = !inputValue || (!!this._selectedDate && inputValue === this.__formatDate(this._selectedDate));
      const isDateValid =
        !this._selectedDate || dateAllowed(this._selectedDate, this._minDate, this._maxDate, this.isDateDisabled);

      let inputValidity = true;
      if (this.inputElement && this.inputElement.checkValidity) {
        inputValidity = this.inputElement.checkValidity();
      }

      return inputValid && isDateValid && inputValidity;
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
     * @param {FocusEvent} event
     * @return {boolean}
     * @protected
     * @override
     */
    _shouldRemoveFocus(event) {
      // Remove the focused state when clicking outside on a focusable element that is deliberately
      // made targetable with pointer-events: auto, such as the time-picker in the date-time-picker.
      // In this scenario, focus will move straight to that element and the closing overlay won't
      // attempt to restore focus to the input.
      const { relatedTarget } = event;
      if (
        this.opened &&
        relatedTarget !== null &&
        relatedTarget !== document.body &&
        !this.contains(relatedTarget) &&
        !this._overlayContent.contains(relatedTarget)
      ) {
        return true;
      }

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
     * Depending on the nature of the value change that has occurred since
     * the last commit attempt, triggers validation and fires an event:
     *
     * Value change             | Event
     * :------------------------|:------------------
     * empty => parsable        | change
     * empty => unparsable      | unparsable-change
     * parsable => empty        | change
     * parsable => parsable     | change
     * parsable => unparsable   | change
     * unparsable => empty      | unparsable-change
     * unparsable => parsable   | change
     * unparsable => unparsable | unparsable-change
     *
     * @private
     */
    __commitValueChange() {
      const unparsableValue = this.__unparsableValue;

      if (this.__committedValue !== this.value) {
        this._requestValidation();
        this.dispatchEvent(new CustomEvent('change', { bubbles: true }));
      } else if (this.__committedUnparsableValue !== unparsableValue) {
        this._requestValidation();
        this.dispatchEvent(new CustomEvent('unparsable-change'));
      }

      this.__committedValue = this.value;
      this.__committedUnparsableValue = unparsableValue;
    }

    /**
     * Sets the given date as the value and commits it.
     *
     * @param {Date} date
     * @private
     */
    __commitDate(date) {
      // Prevent the value observer from treating the following value change
      // as initiated programmatically by the developer, and therefore
      // from automatically committing it without a change event.
      this.__keepCommittedValue = true;
      this._selectedDate = date;
      this.__keepCommittedValue = false;
      this.__commitValueChange();
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
    // eslint-disable-next-line @typescript-eslint/max-params
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
      return formatISODate(date);
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
      if (this.inputElement) {
        this.inputElement.setAttribute('aria-expanded', opened);
      }
    }

    /** @private */
    _selectedDateChanged(selectedDate, i18n) {
      if (selectedDate === undefined || i18n === undefined) {
        return;
      }

      if (!this.__keepInputValue) {
        this._applyInputValue(selectedDate);
      }

      this.value = this._formatISO(selectedDate);
      this._ignoreFocusedDateChange = true;
      this._focusedDate = selectedDate;
      this._ignoreFocusedDateChange = false;
    }

    /** @private */
    _focusedDateChanged(focusedDate, i18n) {
      if (focusedDate === undefined || i18n === undefined) {
        return;
      }
      if (!this._ignoreFocusedDateChange && !this._noInput) {
        this._applyInputValue(focusedDate);
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
            this._requestValidation();
          }
        }
      } else {
        this._selectedDate = null;
      }

      if (!this.__keepCommittedValue) {
        this.__committedValue = this.value;
        this.__committedUnparsableValue = '';
      }

      this._toggleHasValue(this._hasValue);
    }

    /** @private */
    // eslint-disable-next-line @typescript-eslint/max-params
    __updateOverlayContent(
      overlayContent,
      i18n,
      label,
      minDate,
      maxDate,
      focusedDate,
      selectedDate,
      showWeekNumbers,
      isDateDisabled,
      enteredDate,
    ) {
      if (overlayContent) {
        overlayContent.i18n = i18n;
        overlayContent.label = label;
        overlayContent.minDate = minDate;
        overlayContent.maxDate = maxDate;
        overlayContent.focusedDate = focusedDate;
        overlayContent.selectedDate = selectedDate;
        overlayContent.showWeekNumbers = showWeekNumbers;
        overlayContent.isDateDisabled = isDateDisabled;
        overlayContent.enteredDate = enteredDate;
      }
    }

    /** @private */
    __updateOverlayContentTheme(overlayContent, theme) {
      if (overlayContent) {
        if (theme) {
          overlayContent.setAttribute('theme', theme);
        } else {
          overlayContent.removeAttribute('theme');
        }
      }
    }

    /** @private */
    __updateOverlayContentFullScreen(overlayContent, fullscreen) {
      if (overlayContent) {
        overlayContent.toggleAttribute('fullscreen', fullscreen);
      }
    }

    /** @protected */
    _onOverlayEscapePress() {
      this._focusedDate = this._selectedDate;
      this._closedByEscape = true;
      this._close();
      this._closedByEscape = false;
    }

    /** @protected */
    _onOverlayOpened() {
      const content = this._overlayContent;
      content.reset();

      // Detect which date to show
      const initialPosition = this._getInitialPosition();
      content.initialPosition = initialPosition;

      // Scroll the date into view
      const scrollFocusDate = content.focusedDate || initialPosition;
      content.scrollToDate(scrollFocusDate);

      // Ensure the date is focused
      this._ignoreFocusedDateChange = true;
      content.focusedDate = scrollFocusDate;
      this._ignoreFocusedDateChange = false;

      window.addEventListener('scroll', this._boundOnScroll, true);

      if (this._focusOverlayOnOpen) {
        content.focusDateElement();
        this._focusOverlayOnOpen = false;
      } else {
        this._focus();
      }

      const input = this._nativeInput;
      if (this._noInput && input) {
        input.blur();
        this._overlayContent.focusDateElement();
      }

      const focusables = this._noInput ? content : [input, content];
      this.__showOthers = hideOthers(focusables);
    }

    /** @private */
    _getInitialPosition() {
      const parsedInitialPosition = parseDate(this.initialPosition);

      const initialPosition =
        this._selectedDate || this._overlayContent.initialPosition || parsedInitialPosition || new Date();

      return parsedInitialPosition || dateAllowed(initialPosition, this._minDate, this._maxDate, this.isDateDisabled)
        ? initialPosition
        : this._minDate || this._maxDate
          ? getClosestDate(initialPosition, [this._minDate, this._maxDate])
          : new Date();
    }

    /**
     * Tries to parse the input element's value as a date. If the input value
     * is parsable, commits the resulting date as the value. Otherwise, commits
     * an empty string as the value. If no i18n parser is provided, commits
     * the focused date as the value.
     *
     * @private
     */
    __commitParsedOrFocusedDate() {
      // Select the parsed input or focused date
      this._ignoreFocusedDateChange = true;
      if (this.i18n.parseDate) {
        const inputValue = this._inputElementValue || '';
        const parsedDate = this.__parseDate(inputValue);

        if (parsedDate) {
          this.__commitDate(parsedDate);
        } else {
          this.__keepInputValue = true;
          this.__commitDate(null);
          this.__keepInputValue = false;
        }
      } else if (this._focusedDate) {
        this.__commitDate(this._focusedDate);
      }
      this._ignoreFocusedDateChange = false;
    }

    /** @protected */
    _onOverlayClosed() {
      // Reset `aria-hidden` state.
      if (this.__showOthers) {
        this.__showOthers();
        this.__showOthers = null;
      }
      window.removeEventListener('scroll', this._boundOnScroll, true);

      if (this._closedByEscape) {
        this._applyInputValue(this._selectedDate);
      }
      this.__commitParsedOrFocusedDate();

      if (this._nativeInput && this._nativeInput.selectionStart) {
        this._nativeInput.selectionStart = this._nativeInput.selectionEnd;
      }
      // No need to revalidate the value after `_selectedDateChanged`
      // Needed in case the value was not changed: open and close dropdown,
      // especially on outside click. On Esc key press, do not validate.
      if (!this.value && !this._keyboardActive) {
        this._requestValidation();
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
      this._setSelectionRange(0, this._inputElementValue.length);
    }

    /** @private */
    _applyInputValue(date) {
      this._inputElementValue = date ? this.__formatDate(date) : '';
    }

    /** @private */
    _setSelectionRange(a, b) {
      if (this._nativeInput && this._nativeInput.setSelectionRange) {
        this._nativeInput.setSelectionRange(a, b);
      }
    }

    /**
     * Override an event listener from `InputConstraintsMixin`
     * to have date-picker fully control when to fire a change event
     * and trigger validation.
     *
     * @protected
     */
    _onChange(event) {
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
      this.__commitDate(null);
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
      if (this.opened) {
        // Closing will implicitly select parsed or focused date
        this.close();
      } else {
        this.__commitParsedOrFocusedDate();
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

      if (this.inputElement.value === '') {
        // Do not restore selected date if Esc was pressed after clearing input field
        this.__commitDate(null);
      } else {
        this._applyInputValue(this._selectedDate);
      }
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
      if (!this.opened && this._inputElementValue && !this.autoOpenDisabled) {
        this.open();
      }

      const parsedDate = this.__parseDate(this._inputElementValue || '');
      if (parsedDate) {
        this._ignoreFocusedDateChange = true;
        if (!dateEquals(parsedDate, this._focusedDate)) {
          this._focusedDate = parsedDate;
        }
        this._ignoreFocusedDateChange = false;
      }

      this.__setEnteredDate(parsedDate);
    }

    /**
     * @param {Date} date
     * @private
     */
    __setEnteredDate(date) {
      if (date) {
        if (!dateEquals(this.__enteredDate, date)) {
          this.__enteredDate = date;
        }
      } else if (this.__enteredDate != null) {
        // Do not override initial undefined value with null
        // to avoid triggering a Lit update that can cause
        // other scheduled properties to flush too early.
        this.__enteredDate = null;
      }
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
