/**
 * @license
 * Copyright (c) 2025 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { I18nMixin } from '@vaadin/component-base/src/i18n-mixin.js';
import { InputMixin } from '@vaadin/field-base/src/input-mixin.js';
import {
  applyRefCentury,
  formatValue,
  monthAllowed,
  parseValue,
  toRefCentury,
  valueToYearMonth,
  yearMonthToValue,
} from './vaadin-month-picker-helpers.js';

const DEFAULT_REF_CENTURY = toRefCentury(new Date().getFullYear());

const DEFAULT_I18N = {
  prevYear: 'Previous year',
  nextYear: 'Next year',
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
  monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  formats: ['MM.YYYY'],
};

/**
 * A mixin providing common month picker functionality.
 *
 * @polymerMixin
 */
export const MonthPickerMixin = (superClass) =>
  class MonthPickerMixinClass extends I18nMixin(DEFAULT_I18N, InputMixin(superClass)) {
    static get properties() {
      return {
        /**
         * Set true to prevent the overlay from opening automatically.
         * @attr {boolean} auto-open-disabled
         */
        autoOpenDisabled: {
          type: Boolean,
          sync: true,
        },

        /**
         * The earliest year and month that can be selected.
         * All earlier years and months will be disabled.
         */
        min: {
          type: String,
          sync: true,
        },

        /**
         * The latest year and month that can be selected.
         * All later years and months will be disabled.
         */
        max: {
          type: String,
          sync: true,
        },

        /**
         * Set true to open the month selector overlay.
         */
        opened: {
          type: Boolean,
          reflectToAttribute: true,
          notify: true,
          sync: true,
        },

        /**
         * When present, it specifies that the field is read-only.
         */
        readonly: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
        },

        /**
         * The selected month in `YYYY-MM` format.
         */
        value: {
          type: String,
          notify: true,
          value: '',
          sync: true,
        },

        /** @private */
        _overlayContent: {
          type: Object,
          sync: true,
        },

        /** @private */
        _selectedValue: {
          type: String,
        },

        /** @private */
        _selectedYearMonth: {
          type: Object,
        },
      };
    }

    constructor() {
      super();

      this._boundOnClick = this._onClick.bind(this);
    }

    /**
     * The object used to localize this component. To change the default
     * localization, replace this with an object that provides all properties, or
     * just the individual properties you want to change.
     *
     * The object has the following JSON structure and default values:
     * ```js
     * {
     *   // An array with the full names of months starting
     *   // with January.
     *   monthNames: [
     *     'January', 'February', 'March', 'April', 'May',
     *     'June', 'July', 'August', 'September',
     *     'October', 'November', 'December'
     *   ],
     *   // An array with the short names of months starting
     *   // with January.
     *   monthNames: [
     *     'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
     *     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
     *   ],
     *   // Allowed formats. The first one is used as a primary format
     *   formats: ['MM.YYYY'],
     * }
     * ```
     * @return {!MonthPickerI18n}
     */
    get i18n() {
      return super.i18n;
    }

    set i18n(value) {
      super.i18n = value;
    }

    /** @protected */
    ready() {
      super.ready();

      this.addEventListener('click', this._boundOnClick);
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      this.opened = false;
    }

    /** @protected */
    willUpdate(props) {
      super.willUpdate(props);

      if (props.has('opened') && this.opened) {
        this.__ensureContent();
      }
    }

    /** @protected */
    updated(props) {
      super.updated(props);

      if (
        props.has('_overlayContent') ||
        props.has('min') ||
        props.has('max') ||
        props.has('i18n') ||
        props.has('value')
      ) {
        if (this._overlayContent) {
          this._overlayContent.min = this.min;
          this._overlayContent.max = this.max;
          this._overlayContent.i18n = this.i18n;
          this._overlayContent.value = this.value;
        }
      }

      if (props.has('opened') && this.inputElement) {
        this.__updateOpenedYear();

        this.inputElement.setAttribute('aria-expanded', !!this.opened);
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
      this.opened = false;
    }

    /**
     * Returns true if the current input value satisfies all constraints (if any)
     *
     * Override the `checkValidity` method for custom validations.
     *
     * @return {boolean} True if the value is valid
     */
    checkValidity() {
      const inputValue = this.inputElement.value;
      const selectedValue = this._selectedValue;

      const hasCorrectInput =
        !!selectedValue &&
        this._selectedYearMonth &&
        inputValue === formatValue(this._selectedYearMonth, this.__effectiveI18n);

      const inputValid = !inputValue || hasCorrectInput;

      const isMonthValid = !selectedValue || monthAllowed(selectedValue, this.min, this.max);
      return inputValid && isMonthValid;
    }

    /**
     * Override an observer from `InputMixin`.
     * @protected
     * @override
     */
    _valueChanged(value, oldVal) {
      if (value === '' && oldVal === undefined) {
        // Initializing, no need to do anything
        // See https://github.com/vaadin/vaadin-combo-box/issues/554
        return;
      }

      this._selectedValue = value;

      if (value) {
        // Forward value set programmatically to the input
        const yearMonth = valueToYearMonth(value);
        if (yearMonth) {
          this._referenceCentury = toRefCentury(yearMonth.year);
          this.inputElement.value = formatValue(yearMonth, this.i18n);
        }
      } else {
        this.inputElement.value = '';
      }

      this.toggleAttribute('has-value', !!value);
    }

    /**
     * @protected
     * @override
     */
    _inputElementChanged(input) {
      super._inputElementChanged(input);
      if (input) {
        input.autocomplete = 'off';
        input.setAttribute('role', 'combobox');
        input.setAttribute('aria-haspopup', 'dialog');
        input.setAttribute('aria-expanded', !!this.opened);
      }
    }

    /**
     * Override an event listener from `KeyboardMixin`.
     *
     * @param {KeyboardEvent} event
     * @protected
     * @override
     */
    _onKeyDown(event) {
      super._onKeyDown(event);

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          this.open();
          break;
        case 'Tab':
          this._onTab(event);
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
        event.preventDefault();
        this.opened = false;
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
        this.opened = false;
        return;
      }

      if (this.clearButtonVisible && !!this.value && !this.readonly) {
        // Stop event from propagating to the host element
        // to avoid closing dialog when clearing on Esc
        event.stopPropagation();
        this._onClearButtonClick(event);
      }
    }

    /** @private */
    _onTab(event) {
      if (this.opened) {
        event.preventDefault();
        event.stopPropagation();
        // TODO original implementation focused month instead
        this._overlayContent._prevButton.focus();
      }
    }

    /** @private */
    _onClick(event) {
      if (!this._isClearButton(event) && !this.autoOpenDisabled) {
        this.open();
      }
    }

    /** @protected */
    _onOverlayOpened() {
      // Store committed value on open
      this._lastCommittedValue = this.value;
    }

    /**
     * Override an event listener from `InputMixin` to open overlay
     * when typing and to not set `value` property immediately.
     * @protected
     */
    _onInput() {
      if (!this.opened && this.inputElement.value && !this.autoOpenDisabled) {
        this.open();
      }
    }

    /**
     * @protected
     * @override
     */
    _onChange(event) {
      // Suppress the native change event fired on the native input.
      // We use `_detectAndDispatchChange` to fire a custom event.
      event.stopPropagation();

      const inputValue = this.inputElement.value;

      const parsedYearMonth = parseValue(inputValue, this.i18n);

      if (parsedYearMonth && parsedYearMonth.year) {
        if (parsedYearMonth.year < 100) {
          parsedYearMonth.year = applyRefCentury(parsedYearMonth.year, this._referenceCentury);
        } else {
          this._referenceCentury = toRefCentury(parsedYearMonth.year);
        }
      } else {
        // reset the reference century, when the text field is cleared
        this._referenceCentury = DEFAULT_REF_CENTURY;
      }

      const selectedValue = parsedYearMonth !== null ? yearMonthToValue(parsedYearMonth) : '';
      this.__commitChanges(selectedValue, parsedYearMonth);

      this.__updateOpenedYear();
    }

    /** @protected */
    _isClearButton(event) {
      return event.composedPath()[0] === this.clearElement;
    }

    /** @private */
    __detectAndDispatchChange() {
      if (this.value !== this._lastCommittedValue) {
        this.dispatchEvent(new CustomEvent('change', { bubbles: true }));
        this._lastCommittedValue = this.value;
      }
    }

    /** @private */
    __commitChanges(selectedValue, yearMonth) {
      if (selectedValue) {
        this._selectedYearMonth = yearMonth;
        this._selectedValue = selectedValue;
      }

      this._requestValidation();

      if (!this.invalid) {
        this.__keepInputValue = false;
        this.value = selectedValue || '';
      } else {
        // TODO do not discard invalid value, add `unparsable-change` event
        this.value = '';
      }

      this.__detectAndDispatchChange();
    }

    /** @private */
    __ensureContent() {
      if (this._overlayContent) {
        return;
      }

      // Create and store document content element
      const content = document.createElement('vaadin-month-picker-overlay-content');
      content.owner = this;
      content.setAttribute('slot', 'overlay');
      content.i18n = this.i18n;
      this.appendChild(content);

      content.addEventListener('month-click', (e) => {
        this._onMonthClick(e);
      });

      content.addEventListener('click', (e) => e.stopPropagation());

      this._overlayContent = content;
    }

    /** @private */
    _onMonthClick(e) {
      this.opened = false;

      const { value } = e.detail;

      if (this.value !== value) {
        const yearMonth = valueToYearMonth(value);
        this._referenceCentury = toRefCentury(yearMonth.year);

        this.inputElement.value = formatValue(yearMonth, this.i18n);
        this.__commitChanges(value, yearMonth);
      }
    }

    /** @private */
    __updateOpenedYear() {
      if (!this.opened) {
        return;
      }

      if (this._overlayContent) {
        if (this.yearMonth) {
          // The current value, if any, should be visible
          this._overlayContent.currentYear = this.yearMonth.year;
        } else {
          // Otherwise, show current year, or the closest year with enabled values
          const yearNow = new Date().getFullYear();

          const adjustByMin = (year) => (this.min ? Math.max(year, valueToYearMonth(this.min).year) : year);
          const adjustByMax = (year) => (this.max ? Math.min(year, valueToYearMonth(this.max).year) : year);

          this._overlayContent.currentYear = adjustByMax(adjustByMin(yearNow));
        }
      }
    }
  };
