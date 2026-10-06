/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { announce } from '@vaadin/a11y-base/src/announce.js';
import { hideOthers } from '@vaadin/a11y-base/src/aria-hidden.js';
import { DelegateFocusMixin } from '@vaadin/a11y-base/src/delegate-focus-mixin.js';
import { isElementFocused, isKeyboardActive } from '@vaadin/a11y-base/src/focus-utils.js';
import { KeyboardMixin } from '@vaadin/a11y-base/src/keyboard-mixin.js';
import { setOrRemoveAttribute } from '@vaadin/component-base/src/dom-utils.js';
import { I18nMixin } from '@vaadin/component-base/src/i18n-mixin.js';
import { MediaQueryController } from '@vaadin/component-base/src/media-query-controller.js';
import { FieldMixin } from '@vaadin/field-base/src/field-mixin.js';
import {
  dateAllowed,
  dateEquals,
  dateSelectable,
  extractDateParts,
  formatISODate,
  getClosestDate,
  parseDate,
} from './vaadin-date-picker-helper.js';
import { datePickerI18nDefaults } from './vaadin-date-picker-mixin.js';

export const dateRangePickerI18nDefaults = Object.freeze({
  ...datePickerI18nDefaults,
  startAccessibleName: 'Start date',
  endAccessibleName: 'End date',
  rangeStart: 'range start',
  rangeEnd: 'range end',
  inRange: 'in range',
});

/**
 * A mixin providing the selection logic of a date range picker: a start and an
 * end input that share a single date picker overlay. The focused input decides
 * which end of the range a pick in the overlay sets.
 *
 * @polymerMixin
 * @mixes DelegateFocusMixin
 * @mixes FieldMixin
 * @mixes I18nMixin
 * @mixes KeyboardMixin
 */
export const DateRangePickerMixin = (superClass) =>
  class DateRangePickerMixinClass extends I18nMixin(FieldMixin(DelegateFocusMixin(KeyboardMixin(superClass)))) {
    static get properties() {
      return {
        /**
         * The start date of the range, in ISO 8601 `"YYYY-MM-DD"` format.
         * @attr {string} start-value
         */
        startValue: {
          type: String,
          value: '',
          notify: true,
          sync: true,
        },

        /**
         * The end date of the range, in ISO 8601 `"YYYY-MM-DD"` format.
         * @attr {string} end-value
         */
        endValue: {
          type: String,
          value: '',
          notify: true,
          sync: true,
        },

        /**
         * The earliest date that can be selected, in ISO 8601 `"YYYY-MM-DD"` format.
         */
        min: {
          type: String,
        },

        /**
         * The latest date that can be selected, in ISO 8601 `"YYYY-MM-DD"` format.
         */
        max: {
          type: String,
        },

        /**
         * A function to be used to determine whether the user can select a given date.
         * Receives a `DatePickerDate` object of the date to be selected and should return a
         * boolean.
         * @type {function(DatePickerDate): boolean | undefined}
         */
        isDateDisabled: {
          type: Function,
        },

        /**
         * Placeholder of the start input.
         * @attr {string} start-placeholder
         */
        startPlaceholder: {
          type: String,
        },

        /**
         * Placeholder of the end input.
         * @attr {string} end-placeholder
         */
        endPlaceholder: {
          type: String,
        },

        /**
         * Set to true to display a clear button in each of the inputs.
         * @attr {boolean} clear-button-visible
         */
        clearButtonVisible: {
          type: Boolean,
          reflectToAttribute: true,
          value: false,
        },

        /**
         * Set to true to make the field read-only.
         */
        readonly: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
        },

        /**
         * Set true to display ISO-8601 week numbers in the calendar.
         * @attr {boolean} show-week-numbers
         */
        showWeekNumbers: {
          type: Boolean,
          value: false,
        },

        /**
         * Set true to open the date selector overlay.
         */
        opened: {
          type: Boolean,
          reflectToAttribute: true,
          notify: true,
          sync: true,
        },

        /**
         * The input whose date a pick in the overlay sets: `start` or `end`.
         * @protected
         */
        _activePart: {
          type: String,
          value: 'start',
          reflectToAttribute: true,
          attribute: 'active-part',
          sync: true,
        },

        /** @protected */
        _startDate: {
          type: Object,
          value: null,
          sync: true,
        },

        /** @protected */
        _endDate: {
          type: Object,
          value: null,
          sync: true,
        },

        /** @protected */
        _overlayContent: {
          type: Object,
          sync: true,
        },

        /** @protected */
        _fullscreen: {
          type: Boolean,
          value: false,
          sync: true,
        },

        /** @protected */
        _fullscreenMediaQuery: {
          value: '(max-width: 450px), (max-height: 450px)',
        },
      };
    }

    static get defaultI18n() {
      return dateRangePickerI18nDefaults;
    }

    /**
     * The object used to localize this component. To change the default
     * localization, replace this with an object that provides all properties, or
     * just the individual properties you want to change.
     *
     * Supports all the properties of the date picker `i18n` object, plus:
     *
     * ```js
     * {
     *   // Accessible names of the start and end inputs
     *   startAccessibleName: 'Start date',
     *   endAccessibleName: 'End date',
     *   // Range roles announced for the dates in the calendar
     *   rangeStart: 'range start',
     *   rangeEnd: 'range end',
     *   inRange: 'in range',
     * }
     * ```
     */
    get i18n() {
      return super.i18n;
    }

    set i18n(value) {
      super.i18n = value;
    }

    /** @protected */
    get _startInput() {
      return this.querySelector(':scope > input[slot="input"]');
    }

    /** @protected */
    get _endInput() {
      return this.querySelector(':scope > input[slot="end-input"]');
    }

    /** @private */
    get __activeInput() {
      return this._activePart === 'end' ? this._endInput : this._startInput;
    }

    /** @private */
    get __activeDate() {
      return this._activePart === 'end' ? this._endDate : this._startDate;
    }

    /** @private */
    get __minDate() {
      return parseDate(this.min);
    }

    /** @private */
    get __maxDate() {
      return parseDate(this.max);
    }

    constructor() {
      super();

      this._boundOnScroll = this.__onScroll.bind(this);
    }

    /** @protected */
    ready() {
      super.ready();

      // Like the date time picker, the field is a group labelled by its label and
      // described by its helper and error message, see `FieldMixin`.
      if (!this.hasAttribute('role')) {
        this.setAttribute('role', 'group');
      }
      this.ariaTarget = this;

      this.addEventListener('click', (event) => this.__onHostClick(event));
      this.addEventListener('focusin', (event) => this.__onFocusIn(event));

      this.addController(
        new MediaQueryController(this._fullscreenMediaQuery, (matches) => {
          this._fullscreen = matches;
        }),
      );
    }

    /** @protected */
    willUpdate(props) {
      super.willUpdate(props);

      if (props.has('opened') && this.opened) {
        this.__ensureContent();
      }

      if (props.has('startValue')) {
        this._startDate = this.__parseValue(this.startValue, this._startDate);
      }

      if (props.has('endValue')) {
        this._endDate = this.__parseValue(this.endValue, this._endDate);
      }
    }

    /** @protected */
    updated(props) {
      super.updated(props);

      if (props.has('_startDate') || props.has('__effectiveI18n')) {
        this.startValue = formatISODate(this._startDate);
        this.__applyInputValue(this._startInput, this._startDate);
      }

      if (props.has('_endDate') || props.has('__effectiveI18n')) {
        this.endValue = formatISODate(this._endDate);
        this.__applyInputValue(this._endInput, this._endDate);
      }

      if (props.has('_startDate') || props.has('_endDate')) {
        this.toggleAttribute('has-value', !!(this._startDate || this._endDate));
        this.toggleAttribute('has-start-value', !!this._startDate);
        this.toggleAttribute('has-end-value', !!this._endDate);
      }

      if (props.has('showWeekNumbers') || props.has('__effectiveI18n')) {
        // Currently only supported for locales that start the week on Monday.
        this.toggleAttribute('week-numbers', this.showWeekNumbers && this.__effectiveI18n.firstDayOfWeek === 1);
      }

      this.__updateInputs();
      this.__updateOverlayContent();
    }

    /** @protected */
    firstUpdated(props) {
      super.firstUpdated(props);

      this.__committedValue = this.__getRangeString();
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

    /**
     * Returns true if both inputs hold a valid date or are empty, the dates can be
     * selected, and the start date is not after the end date.
     * @override
     */
    checkValidity() {
      const inputsValid = [
        [this._startInput, this._startDate],
        [this._endInput, this._endDate],
      ].every(([input, date]) => !input || !input.value || (!!date && input.value === this.__formatDate(date)));

      const datesSelectable = [this._startDate, this._endDate].every(
        (date) => !date || dateSelectable(date, this.__minDate, this.__maxDate, this.isDateDisabled),
      );

      const orderValid = !this._startDate || !this._endDate || this._startDate <= this._endDate;

      const requiredValid = !this.required || (!!this._startDate && !!this._endDate);

      return inputsValid && datesSelectable && orderValid && requiredValid;
    }

    /**
     * Override method from `FocusMixin` to keep the focused state while focus moves
     * between the inputs and the overlay, which are all part of the field.
     * @protected
     * @override
     */
    _shouldRemoveFocus(event) {
      const { relatedTarget } = event;
      if (relatedTarget && this.contains(relatedTarget)) {
        return false;
      }

      return !this.opened || (relatedTarget !== null && relatedTarget !== document.body);
    }

    /**
     * Override method from `FocusMixin` to commit typed text when focus leaves the field.
     * @protected
     * @override
     */
    _setFocused(focused) {
      super._setFocused(focused);

      if (!focused && !this.opened) {
        this.__commitInputValues();

        // Do not validate when focusout is caused by document
        // losing focus, which happens on browser tab switch.
        if (document.hasFocus()) {
          this._requestValidation();
        }
      }
    }

    /**
     * Override method from `KeyboardMixin` to open the overlay with arrow keys and to
     * move focus from the end input into the calendar with Tab.
     * @protected
     * @override
     */
    _onKeyDown(event) {
      super._onKeyDown(event);

      if (this.__isFromOverlay(event)) {
        return;
      }

      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowUp':
          event.preventDefault();
          if (this.opened) {
            this._overlayContent.focusDateElement();
          } else {
            this.__focusOverlayOnOpen = true;
            this.open();
          }
          break;
        case 'Tab':
          // Tab moves from the start input to the end input natively,
          // and from the end input into the calendar.
          if (this.opened && !event.shiftKey && event.target === this._endInput) {
            event.preventDefault();
            event.stopPropagation();
            this._overlayContent.focusDateElement();
          }
          // Shift+Tab from the start input moves focus to the overlay's last button,
          // like in the date picker, instead of leaving the field with the overlay open.
          if (this.opened && event.shiftKey && event.target === this._startInput) {
            event.preventDefault();
            event.stopPropagation();
            this._overlayContent.focusCancel();
          }
          break;
        default:
          break;
      }
    }

    /**
     * Override method from `KeyboardMixin` to commit the typed text on Enter.
     * @protected
     * @override
     */
    _onEnter(event) {
      if (this.__isFromOverlay(event)) {
        return;
      }

      if (this.opened) {
        // Closing commits the typed text.
        this.close();
      } else {
        this.__commitInputValues();
        this._requestValidation();
      }
    }

    /**
     * Override method from `KeyboardMixin` to cancel the selection on Escape.
     * @protected
     * @override
     */
    _onEscape(event) {
      if (this.opened) {
        event.stopPropagation();
        this.__cancelled = true;
        this.close();
        return;
      }

      const hasText = !!(this._startInput?.value || this._endInput?.value);
      if (this.clearButtonVisible && hasText && !this.readonly) {
        // Stop propagation to not close a dialog when clearing on Escape.
        event.stopPropagation();
        this._startDate = null;
        this._endDate = null;
        this.__applyInputValue(this._startInput, null);
        this.__applyInputValue(this._endInput, null);
        this.__commitValueChange();
        return;
      }

      // Revert unparsed text of the focused input.
      this.__applyInputValue(this._startInput, this._startDate);
      this.__applyInputValue(this._endInput, this._endDate);
    }

    /** @protected */
    _onOpenedChanged(event) {
      this.opened = event.detail.value;
    }

    /** @protected */
    _onOverlayOpened() {
      const content = this._overlayContent;
      content.reset();

      // Snapshot the range so that Escape and Cancel can restore it.
      this.__datesOnOpen = [this._startDate, this._endDate];
      this.__committedValue = this.__getRangeString();

      const initialPosition = this.__getInitialPosition();
      content.initialPosition = initialPosition;
      content.scrollToDate(initialPosition);
      content.focusedDate = initialPosition;

      window.addEventListener('scroll', this._boundOnScroll, true);

      if (this.__focusOverlayOnOpen) {
        content.focusDateElement();
        this.__focusOverlayOnOpen = false;
      } else if (!this.__activeInput.matches(':focus')) {
        this.__focusActiveInput();
      }

      this.__showOthers = hideOthers(this);
    }

    /** @protected */
    _onOverlayClosing() {
      this._overlayContent?.cancelLoadVisibleDateMetadata();
      this.__pickingWholeRange = false;

      if (this.__showOthers) {
        this.__showOthers();
        this.__showOthers = null;
      }
      window.removeEventListener('scroll', this._boundOnScroll, true);

      if (this.__cancelled) {
        this.__cancelled = false;
        [this._startDate, this._endDate] = this.__datesOnOpen;
        this.__applyInputValue(this._startInput, this._startDate);
        this.__applyInputValue(this._endInput, this._endDate);
      } else {
        this.__commitInputValues();
        // Also validates unparsable text, which does not change the value.
        this._requestValidation();
      }

      this.__commitValueChange();

      if (!isElementFocused(this._startInput) && !isElementFocused(this._endInput)) {
        this._setFocused(false);
      }
    }

    /** @protected */
    _onVaadinOverlayClose(event) {
      // Prevent closing the overlay on clicks inside the field, such as on the label
      // or on the other input.
      const sourceEvent = event.detail.sourceEvent;
      if (sourceEvent?.composedPath().includes(this) && !sourceEvent.composedPath().includes(this.$.overlay)) {
        event.preventDefault();
      }
    }

    /** @protected */
    _onToggleClick(event) {
      event.stopPropagation();
      if (this.opened) {
        this.close();
      } else {
        // The calendar button always picks the whole range: the start, then the end.
        this._activePart = 'start';
        this.__pickingWholeRange = true;
        this.__focusActiveInput();
        this.open();
      }
    }

    /** @protected */
    _onClearButtonClick(event, part) {
      event.preventDefault();
      event.stopPropagation();
      if (part === 'start') {
        this._startDate = null;
        this.__applyInputValue(this._startInput, null);
      } else {
        this._endDate = null;
        this.__applyInputValue(this._endInput, null);
      }
      this.__commitValueChange();
    }

    /** @private */
    __onHostClick(event) {
      const path = event.composedPath();
      if (path.includes(this.$.overlay) || path.some((node) => node.part?.contains?.('clear-button'))) {
        return;
      }
      this.open();
    }

    /** @private */
    __onFocusIn(event) {
      if (event.target === this._startInput) {
        this._activePart = 'start';
      } else if (event.target === this._endInput) {
        this._activePart = 'end';
      } else {
        return;
      }

      if (this.opened) {
        this.__revealActiveDate();
      }
    }

    /** @protected */
    _onInputTextChange(event) {
      if (!this.opened && event.target.value) {
        this.open();
      }

      const parsedDate = this.__parseDateText(event.target.value);
      if (parsedDate && this._overlayContent) {
        this._overlayContent.focusedDate = parsedDate;
      }
    }

    /** @private */
    __onScroll(event) {
      if (event.target === window || !this._overlayContent.contains(event.target)) {
        this._overlayContent._repositionYearScroller();
      }
    }

    /** @private */
    __isFromOverlay(event) {
      return !!this._overlayContent && event.composedPath().includes(this._overlayContent);
    }

    /** @private */
    __ensureContent() {
      if (this._overlayContent) {
        return;
      }

      const content = document.createElement('vaadin-date-picker-overlay-content');
      content.setAttribute('slot', 'overlay');
      this.appendChild(content);
      this._overlayContent = content;

      // Picked by clicking a date in the calendar.
      content.addEventListener('date-tap', (event) => {
        if (this.__pickDate(event.detail.date)) {
          this.__focusActiveInput();
          this.close();
        }
      });

      // Picked by dragging across dates, or by dragging an end of the range.
      content.addEventListener('range-drag-end', (event) => {
        const { start, end } = event.detail;
        this._startDate = start;
        this._endDate = end;
        this.__applyInputValue(this._startInput, start);
        this.__applyInputValue(this._endInput, end);
        this.__focusActiveInput();
        this.close();
      });

      // Picked with Enter, Space or the Today button. The overlay content closes
      // itself after Enter and Today, unless the pick only set the start.
      content.addEventListener('date-selected', (event) => {
        this.__keepOpen = !this.__pickDate(event.detail.date);
      });

      content.addEventListener('close', () => {
        if (this.__keepOpen) {
          this.__keepOpen = false;
          return;
        }
        this.close();
        this.__focusActiveInput();
      });

      // Capture phase, so that the flag is set before the Cancel button closes the overlay.
      content.addEventListener(
        'click',
        (event) => {
          if (event.composedPath().includes(content._cancelButton)) {
            this.__cancelled = true;
          }
        },
        true,
      );

      content.addEventListener('click', (event) => event.stopPropagation());

      content.addEventListener('focus-input', () => this.__focusActiveInput());

      this.__updateOverlayContent();
    }

    /**
     * Applies a date picked in the overlay to the active end of the range.
     * Returns true if the pick completed the range and the overlay should close.
     * @private
     */
    __pickDate(date) {
      if (!date) {
        // Space on the selected date clears the active end.
        if (this._activePart === 'end') {
          this._endDate = null;
        } else {
          this._startDate = null;
        }
        return false;
      }

      if (this._activePart === 'end' && !this._startDate) {
        // Picking the end first continues with the start, like picking the start
        // first continues with the end, instead of leaving half a range.
        this._endDate = date;
        this._activePart = 'start';
        this.__focusActiveInput();
        announce(`${this.__effectiveI18n.endAccessibleName}: ${this.__formatDate(date)}`);
        return false;
      }

      if (this._activePart === 'end' && date >= this._startDate) {
        this._endDate = date;
        return true;
      }

      // When picking the whole range, the start is followed by the end. The current
      // end stays as long as the range stays valid, until a new end is picked.
      if (this._activePart === 'start' && this.__pickingWholeRange && this._endDate && date <= this._endDate) {
        this._startDate = date;
        this._activePart = 'end';
        this.__focusActiveInput();
        announce(`${this.__effectiveI18n.startAccessibleName}: ${this.__formatDate(date)}`);
        return false;
      }

      // Opened from the start input, changing only the start keeps the end, as long as
      // the range stays valid.
      if (this._activePart === 'start' && this._endDate && date <= this._endDate) {
        this._startDate = date;
        return true;
      }

      // Otherwise the pick starts a new range: a start after the end, or a date
      // before the start while picking the end, sets a new start and clears the end.
      this._startDate = date;
      this._endDate = null;
      this.__applyInputValue(this._endInput, null);
      this._activePart = 'end';
      this.__focusActiveInput();
      announce(`${this.__effectiveI18n.startAccessibleName}: ${this.__formatDate(date)}`);
      return false;
    }

    /** @private */
    __focusActiveInput() {
      const input = this.__activeInput;
      if (input && !isElementFocused(input)) {
        input.focus({ focusVisible: isKeyboardActive() });
      }
    }

    /** @private */
    __revealActiveDate() {
      const content = this._overlayContent;
      if (!content) {
        return;
      }
      const date = this.__activeDate || this._startDate || this._endDate;
      if (date) {
        content.focusedDate = date;
      }
    }

    /** @private */
    __getInitialPosition() {
      const date = this.__activeDate || this._startDate || this._endDate || new Date();
      const min = this.__minDate;
      const max = this.__maxDate;
      if (dateAllowed(date, min, max)) {
        return date;
      }
      return getClosestDate(date, [min, max]);
    }

    /** @private */
    __updateInputs() {
      const i18n = this.__effectiveI18n;
      [
        [this._startInput, this.startPlaceholder, i18n.startAccessibleName],
        [this._endInput, this.endPlaceholder, i18n.endAccessibleName],
      ].forEach(([input, placeholder, partName]) => {
        if (!input) {
          return;
        }
        input.disabled = !!this.disabled;
        input.readOnly = !!this.readonly;
        input.placeholder = placeholder || '';
        // Do not show the virtual keyboard when the overlay covers the screen.
        setOrRemoveAttribute(input, 'inputmode', this._fullscreen ? 'none' : null);
        input.setAttribute('aria-expanded', String(!!this.opened));
        // The host is a group labelled by the field label, see `ready()`, so the
        // inputs only need the name of their part.
        input.setAttribute('aria-label', partName);
        // NVDA does not announce aria-required on a group, so set it on the inputs too.
        setOrRemoveAttribute(input, 'aria-required', this.required ? 'true' : null);
      });
    }

    /** @private */
    __updateOverlayContent() {
      const content = this._overlayContent;
      if (!content) {
        return;
      }
      content.i18n = this.__effectiveI18n;
      content.label = this.label;
      content.minDate = this.__minDate;
      content.maxDate = this.__maxDate;
      content.isDateDisabled = this.isDateDisabled;
      content.showWeekNumbers = this.showWeekNumbers;
      // The range marks both of its ends as selected. A lone end date is marked
      // through `selectedDate`, which the range does not cover.
      content.selectedDate = this._startDate ? null : this._endDate;
      content.rangeStart = this._startDate;
      content.rangeEnd = this._endDate;
      content.rangePreview = this._activePart;
      content.toggleAttribute('fullscreen', this._fullscreen);
      setOrRemoveAttribute(content, 'theme', this._theme);
    }

    /**
     * Parses the text of both inputs and applies the result as the range.
     * Unparsable text is kept in the input, which makes the field invalid.
     * @private
     */
    __commitInputValues() {
      [
        [this._startInput, '_startDate'],
        [this._endInput, '_endDate'],
      ].forEach(([input, prop]) => {
        if (!input || input.value === this.__formatDate(this[prop])) {
          return;
        }
        this[prop] = this.__parseDateText(input.value) || null;
        if (this[prop]) {
          // Normalize the text of a parsed date.
          this.__applyInputValue(input, this[prop]);
        }
      });
      this.__commitValueChange();
    }

    /** @private */
    __commitValueChange() {
      const committed = this.__getRangeString();
      if (this.__committedValue !== committed) {
        this._requestValidation();
        this.dispatchEvent(new CustomEvent('change', { bubbles: true }));
      }
      this.__committedValue = committed;
    }

    /** @private */
    __getRangeString() {
      return `${formatISODate(this._startDate)}/${formatISODate(this._endDate)}`;
    }

    /** @private */
    __parseValue(value, currentDate) {
      const date = parseDate(value);
      if (!value || !date) {
        return null;
      }
      // Keep the same instance to not trigger updates for an equal date.
      return dateEquals(date, currentDate) ? currentDate : date;
    }

    /** @private */
    __parseDateText(text) {
      const i18n = this.__effectiveI18n;
      if (!text || !i18n.parseDate) {
        return undefined;
      }
      const parts = i18n.parseDate(text);
      const date = parts && parseDate(`${parts.year}-${parts.month + 1}-${parts.day}`);
      if (date && !isNaN(date.getTime())) {
        return date;
      }
      return undefined;
    }

    /** @private */
    __formatDate(date) {
      return date ? this.__effectiveI18n.formatDate(extractDateParts(date)) : '';
    }

    /** @private */
    __applyInputValue(input, date) {
      if (input) {
        input.value = this.__formatDate(date);
      }
    }
  };
