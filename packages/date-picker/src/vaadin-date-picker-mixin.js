/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { hideOthers } from '@vaadin/a11y-base/src/aria-hidden.js';
import { DelegateFocusMixin } from '@vaadin/a11y-base/src/delegate-focus-mixin.js';
import { isKeyboardActive } from '@vaadin/a11y-base/src/focus-utils.js';
import { KeyboardMixin } from '@vaadin/a11y-base/src/keyboard-mixin.js';
import { isIOS } from '@vaadin/component-base/src/browser-utils.js';
import { setOrRemoveAttribute } from '@vaadin/component-base/src/dom-utils.js';
import { I18nMixin } from '@vaadin/component-base/src/i18n-mixin.js';
import { MediaQueryController } from '@vaadin/component-base/src/media-query-controller.js';
import { InputConstraintsMixin } from '@vaadin/field-base/src/input-constraints-mixin.js';
import { VirtualKeyboardController } from '@vaadin/field-base/src/virtual-keyboard-controller.js';
import { DateMetadataController } from './vaadin-date-metadata-controller.js';
import {
  dateAllowed,
  dateEquals,
  dateSelectable,
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
  dialogAccessibleName: 'Calendar',
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

export const DatePickerMixin = (subclass) =>
  class DatePickerMixinClass extends I18nMixin(DelegateFocusMixin(InputConstraintsMixin(KeyboardMixin(subclass)))) {
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
        initialPosition: {
          type: String,
        },

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
         * @protected
         */
        _fullscreen: {
          type: Boolean,
          value: false,
          sync: true,
        },

        /**
         * @protected
         */
        _fullscreenMediaQuery: {
          value: '(max-width: 450px), (max-height: 450px)',
        },

        /**
         * The earliest date that can be selected. All earlier dates will be disabled.
         *
         * Supported date formats:
         * - ISO 8601 `"YYYY-MM-DD"` (default)
         * - 6-digit extended ISO 8601 `"+YYYYYY-MM-DD"`, `"-YYYYYY-MM-DD"`
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
         * A batch function that fetches metadata for a range of dates the calendar is about to
         * render. It receives a `DatePickerDateRange` and returns, or resolves with, an array of
         * `DatePickerDateMetadata` objects — a `DatePickerDate` extended with metadata such as
         * `disabled`, e.g. `{ year, month, day, disabled: true }` — for the dates that have metadata
         * within that range. Dates it does not mention have no metadata. `month` is 0-based: 0 is
         * January and 11 is December.
         *
         * Unlike `isDateDisabled`, which is called once per date, this function is called for a
         * range of dates at a time, and again as the calendar renders further dates. The size of the
         * range is decided by the calendar and may span several months, and may include months it
         * already has metadata for, whose entries are then ignored.
         *
         * It may return a `Promise`, so the answer can come from a server. Until it resolves, the
         * affected dates render with the `loading` part but stay selectable, and a loading spinner
         * is shown. Nothing is disabled before the provider has actually reported it, so a slow
         * provider does not make the calendar unusable. If it throws or rejects, the error is logged
         * and the affected months are requested again the next time the user navigates.
         *
         * `disabled` from the metadata is combined with `min`, `max` and `isDateDisabled`: a date is
         * disabled if it is out of the min/max range, or `isDateDisabled` returns `true`, or its
         * metadata marks it disabled. That decides what the calendar renders as disabled, what can be
         * selected, and whether the field is valid.
         *
         * A value is checked against the provider even if the overlay is never opened, which loads the
         * month holding it. Until that month answers the value is valid, and it is re-validated once
         * the answer arrives, so `checkValidity()` can report a value as valid and then invalid.
         *
         * `part` from the metadata adds part names to the date, so a theme can style specific dates
         * with `::part()` — e.g. `{ year, month, day, part: 'busy' }`. Give a single name or several
         * separated by spaces. Do not use built-in names like `disabled` and `selected`.
         *
         * Keep a stable reference to the function. Assigning a new function clears the cache and
         * re-fetches every visible range. To re-fetch while keeping the same function, because the
         * data behind it changed, call `clearCache()`.
         *
         * @type {DatePickerDateMetadataProvider | null | undefined}
         */
        dateMetadataProvider: {
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
          computed: '_isNoInput(inputElement, _fullscreen, _ios, __effectiveI18n, opened, autoOpenDisabled)',
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
        '_selectedDateChanged(_selectedDate, __effectiveI18n)',
        '_focusedDateChanged(_focusedDate, __effectiveI18n)',
        '__updateOverlayContent(_overlayContent, __effectiveI18n, label, _minDate, _maxDate, _focusedDate, _selectedDate, showWeekNumbers, isDateDisabled, __enteredDate)',
        '__updateOverlayContentTheme(_overlayContent, _theme)',
        '__updateOverlayContentFullScreen(_overlayContent, _fullscreen)',
      ];
    }

    static get defaultI18n() {
      return datePickerI18nDefaults;
    }

    static get constraints() {
      return [...super.constraints, 'min', 'max', 'dateMetadataProvider'];
    }

    constructor() {
      super();

      this._boundOnClick = this._onClick.bind(this);
      this._boundOnScroll = this._onScroll.bind(this);

      this._dateMetadataController = new DateMetadataController(this, () => this.__onDateMetadataChanged());
      this.addController(this._dateMetadataController);
    }

    /**
     * The object used to localize this component. To change the default
     * localization, replace this with an object that provides all properties, or
     * just the individual properties you want to change.
     *
     * The object has the following JSON structure and default values:
     *
     * ```js
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
     *   // Accessible name of the overlay content, announced by screen readers
     *   // when the overlay opens.
     *   dialogAccessibleName: 'Calendar',
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
     * @type {!DatePickerI18n}
     */
    get i18n() {
      return super.i18n;
    }

    set i18n(value) {
      super.i18n = value;
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

      this._overlayElement = this.$.overlay;
    }

    /** @protected */
    updated(props) {
      super.updated(props);

      if (props.has('dateMetadataProvider')) {
        this._dateMetadataController.setProvider(this.dateMetadataProvider);
        this.__reloadDateMetadata();
      }

      if (props.has('showWeekNumbers') || props.has('__effectiveI18n')) {
        // Currently only supported for locales that start the week on Monday.
        this.toggleAttribute('week-numbers', this.showWeekNumbers && this.__effectiveI18n.firstDayOfWeek === 1);
      }
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      this.opened = false;
    }

    /**
     * @param {FocusOptions=} options
     * @protected
     * @override
     */
    focus(options) {
      if (this._noInput && !isKeyboardActive()) {
        this.open();
      } else {
        super.focus(options);
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
      this.$.overlay.close();
    }

    /**
     * Clears the `dateMetadataProvider` cache and reloads the date metadata.
     */
    clearCache() {
      this._dateMetadataController.clearCache();
      this.__reloadDateMetadata();
    }

    /**
     * Asks for what the dropped cache was holding: the months the overlay is showing, and the month
     * of the value being validated. Requested from here rather than from the controller's
     * notification, which would turn a provider that keeps failing into an endless retry, since a
     * failed month is dropped and so becomes missing again.
     * @private
     */
    __reloadDateMetadata() {
      if (this.opened) {
        this._overlayContent?.loadVisibleDateMetadata();
      }
      this.__ensureSelectedDateLoaded();
    }

    /** @private */
    __ensureContent() {
      if (this._overlayContent) {
        return;
      }

      // Create and store document content element
      const content = document.createElement('vaadin-date-picker-overlay-content');
      content.setAttribute('slot', 'overlay');
      this.appendChild(content);

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
      if (!this.__effectiveI18n.parseDate) {
        return;
      }

      let dateObject = this.__effectiveI18n.parseDate(dateString);
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
      if (this.__effectiveI18n.formatDate) {
        return this.__effectiveI18n.formatDate(extractDateParts(dateObject));
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
        !this._selectedDate ||
        dateSelectable(
          this._selectedDate,
          this._minDate,
          this._maxDate,
          this.isDateDisabled,
          this._dateMetadataController,
        );

      let inputValidity = true;
      if (this.inputElement && this.inputElement.checkValidity) {
        inputValidity = this.inputElement.checkValidity();
      }

      return inputValid && isDateValid && inputValidity;
    }

    /**
     * Asks the controller for the month holding the selected date, so a value that was set or typed
     * without ever opening the overlay is still checked against the provider. Validation is re-run
     * from the host callback once the month resolves.
     * @private
     */
    __ensureSelectedDateLoaded() {
      const controller = this._dateMetadataController;
      const awaiting = !!(controller?.provider && this._selectedDate && !controller.isMonthLoaded(this._selectedDate));
      // Always assigned, so clearing the value or removing the provider while a request is in
      // flight disarms the pending re-validation, and a later answer for some other month does not
      // re-validate a value that never waited for it.
      this.__awaitingProviderValidation = awaiting;
      if (awaiting) {
        controller.ensureRangeLoaded(this._selectedDate, this._selectedDate);
      }
    }

    /**
     * Called by the date metadata controller, one microtask after its state changed
     * and coalesced, so this never writes reactive state from inside an update. The
     * rendered months refresh on their own because they subscribe to the controller.
     * @private
     */
    __onDateMetadataChanged() {
      const controller = this._dateMetadataController;

      // Only the open overlay has a spinner to update and a today button to re-evaluate.
      if (this._overlayContent) {
        this._overlayContent.loading = controller.isLoading();
        this._overlayContent.updateTodayButton();
      }

      // Runs whether or not the overlay was ever opened, which is the case this exists for: a value
      // set or typed with the overlay closed is reported invalid as soon as its month answers.
      if (this.__awaitingProviderValidation && this._selectedDate && controller.isMonthLoaded(this._selectedDate)) {
        this.__awaitingProviderValidation = false;
        this._requestValidation();
      }
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
     * Override method inherited from `ClearButtonMixin`
     * to not blur on clear button mousedown when opened
     * so that focus remains in the input field.
     *
     * @return {boolean}
     * @protected
     * @override
     */
    _shouldKeepFocusOnClearMousedown() {
      if (this.opened) {
        return true;
      }

      return super._shouldKeepFocusOnClearMousedown();
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
    // eslint-disable-next-line @typescript-eslint/max-params
    _isNoInput(inputElement, fullscreen, ios, effectiveI18n, opened, autoOpenDisabled) {
      // On fullscreen mode, text input is disabled if auto-open isn't disabled or
      // whenever the dropdown is opened
      const noInputOnFullscreenMode = fullscreen && (!autoOpenDisabled || opened);
      // On iOS, text input is disabled whenever the dropdown is opened, because
      // the virtual keyboard doesn't affect the viewport metrics and thus the
      // dropdown could get covered by the keyboard.
      const noInputOnIos = ios && opened;

      return !inputElement || noInputOnFullscreenMode || noInputOnIos || !effectiveI18n.parseDate;
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
      if (opened) {
        this.__ensureContent();
      }

      if (this.inputElement) {
        this.inputElement.setAttribute('aria-expanded', opened);
      }
    }

    /** @private */
    _selectedDateChanged(selectedDate, effectiveI18n) {
      if (selectedDate === undefined || effectiveI18n === undefined) {
        return;
      }

      if (!this.__keepInputValue) {
        this._applyInputValue(selectedDate);
      }

      this.value = this._formatISO(selectedDate);
      this._ignoreFocusedDateChange = true;
      this._focusedDate = selectedDate;
      this._ignoreFocusedDateChange = false;

      this.__ensureSelectedDateLoaded();
    }

    /** @private */
    _focusedDateChanged(focusedDate, effectiveI18n) {
      if (focusedDate === undefined || effectiveI18n === undefined) {
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
      effectiveI18n,
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
        // Reuse the date-picker's controller so the overlay shares the same cache.
        overlayContent._dateMetadataController = this._dateMetadataController;
        overlayContent.i18n = effectiveI18n;
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
        setOrRemoveAttribute(overlayContent, 'theme', theme);
      }
    }

    /** @private */
    __updateOverlayContentFullScreen(overlayContent, fullscreen) {
      if (overlayContent) {
        overlayContent.toggleAttribute('fullscreen', fullscreen);
      }
    }

    /** @protected */
    _onOverlayEscapePress(event) {
      event.stopPropagation();
      this._focusedDate = this._selectedDate;
      this._applyInputValue(this._selectedDate);
      this._close();
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

      const input = this.inputElement;
      if (this._noInput && input) {
        input.blur();
        this._overlayContent.focusDateElement();
      }

      const focusables = this._noInput ? content : this;
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
      if (this.__effectiveI18n.parseDate) {
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
      this._overlayContent?.cancelLoadVisibleDateMetadata();

      // Reset `aria-hidden` state.
      if (this.__showOthers) {
        this.__showOthers();
        this.__showOthers = null;
      }
      window.removeEventListener('scroll', this._boundOnScroll, true);

      this.__commitParsedOrFocusedDate();

      if (this.inputElement && this.inputElement.selectionStart) {
        this.inputElement.selectionStart = this.inputElement.selectionEnd;
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
      if (this.inputElement) {
        this.inputElement.setSelectionRange(a, b);
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
      // Ignore click events bubbling from the overlay
      if (event.composedPath().includes(this._overlayElement)) {
        return;
      }

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
        const allowedKeys = ['Tab', 'Escape'];
        if (allowedKeys.indexOf(e.key) === -1) {
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
     * @param {!KeyboardEvent} event
     * @protected
     * @override
     */
    _onEnter(event) {
      // Ignore Enter keydown event bubbling from the overlay
      if (event.composedPath().includes(this._overlayContent)) {
        return;
      }

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
      if (this.opened) {
        this._onOverlayEscapePress(event);
        return;
      }

      if (this.clearButtonVisible && !!this.value && !this.readonly) {
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
      } else {
        this.__enteredDate = null;
      }
    }

    /** @private */
    __computeMinOrMaxDate(dateString) {
      return parseDate(dateString);
    }
  };
