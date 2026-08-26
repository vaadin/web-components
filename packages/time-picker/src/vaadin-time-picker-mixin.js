/**
 * @license
 * Copyright (c) 2018 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ComboBoxBaseMixin } from '@vaadin/combo-box/src/vaadin-combo-box-base-mixin.js';
import { I18nMixin } from '@vaadin/component-base/src/i18n-mixin.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
import { InputControlMixin } from '@vaadin/field-base/src/input-control-mixin.js';
import { InputController } from '@vaadin/field-base/src/input-controller.js';
import { LabelledInputController } from '@vaadin/field-base/src/labelled-input-controller.js';
import { PatternMixin } from '@vaadin/field-base/src/pattern-mixin.js';
import { formatISOTime, parseISOTime, validateTime } from './vaadin-time-picker-helper.js';

export const timePickerI18nDefaults = Object.freeze({
  formatTime: formatISOTime,
  parseTime: parseISOTime,
});

const MIN_ALLOWED_TIME = '00:00:00.000';
const MAX_ALLOWED_TIME = '23:59:59.999';

/**
 * A mixin providing common time-picker functionality.
 */
export const TimePickerMixin = (superClass) =>
  class TimePickerMixinClass extends I18nMixin(PatternMixin(ComboBoxBaseMixin(InputControlMixin(superClass)))) {
    static get properties() {
      return {
        /**
         * The time value for this element.
         *
         * Supported time formats are in ISO 8601:
         * - `hh:mm` (default)
         * - `hh:mm:ss`
         * - `hh:mm:ss.fff`
         */
        value: {
          type: String,
          notify: true,
          value: '',
          sync: true,
        },

        /**
         * Minimum time allowed.
         *
         * Supported time formats are in ISO 8601:
         * - `hh:mm`
         * - `hh:mm:ss`
         * - `hh:mm:ss.fff`
         */
        min: {
          type: String,
          value: '',
          sync: true,
        },

        /**
         * Maximum time allowed.
         *
         * Supported time formats are in ISO 8601:
         * - `hh:mm`
         * - `hh:mm:ss`
         * - `hh:mm:ss.fff`
         */
        max: {
          type: String,
          value: '',
          sync: true,
        },

        /**
         * Defines the time interval (in seconds) between the items displayed
         * in the time selection box. The default is 1 hour (i.e. `3600`).
         *
         * It also configures the precision of the value string. By default
         * the component formats values as `hh:mm` but setting a step value
         * lower than one minute or one second, format resolution changes to
         * `hh:mm:ss` and `hh:mm:ss.fff` respectively.
         *
         * Unit must be set in seconds, and for correctly configuring intervals
         * in the dropdown, it need to evenly divide a day.
         *
         * Note: it is possible to define step that is dividing an hour in inexact
         * fragments (i.e. 5760 seconds which equals 1 hour 36 minutes), but it is
         * not recommended to use it for better UX experience.
         */
        step: {
          type: Number,
          sync: true,
        },

        /** @private */
        _comboBoxValue: {
          type: String,
          sync: true,
        },

        /** @private */
        _inputContainer: {
          type: Object,
        },
      };
    }

    static get observers() {
      return [
        '_openedOrItemsChanged(opened, _dropdownItems)',
        '_updateScroller(opened, _dropdownItems, _focusedIndex, _theme, value)',
        '__updateAriaAttributes(_dropdownItems, opened, inputElement)',
      ];
    }

    static get defaultI18n() {
      return timePickerI18nDefaults;
    }

    static get constraints() {
      return [...super.constraints, 'min', 'max'];
    }

    /**
     * Tag name prefix used by `ComboBoxBaseMixin` for scroller and items.
     * @protected
     * @return {string}
     */
    get _tagNamePrefix() {
      return 'vaadin-time-picker';
    }

    /**
     * Used by `ClearButtonMixin` as a reference to the clear button element.
     * @protected
     * @return {!HTMLElement}
     */
    get clearElement() {
      return this.$.clearButton;
    }

    /**
     * The object used to localize this component. To change the default
     * localization, replace this with an object that provides both the
     * time parsing and formatting functions.
     *
     * The object has the following JSON structure:
     *
     * ```js
     * {
     *   // A function to format given `Object` as
     *   // time string. Object is in the format `{ hours: ..., minutes: ..., seconds: ..., milliseconds: ... }`
     *   formatTime: (time) => {
     *     // returns a string representation of the given
     *     // object in `hh` / 'hh:mm' / 'hh:mm:ss' / 'hh:mm:ss.fff' - formats
     *   },
     *
     *   // A function to parse the given text to an `Object` in the format
     *   // `{ hours: ..., minutes: ..., seconds: ..., milliseconds: ... }`.
     *   // Must properly parse (at least) text
     *   // formatted by `formatTime`.
     *   parseTime: text => {
     *     // Parses a string in object/string that can be formatted by`formatTime`.
     *   }
     * }
     * ```
     *
     * NOTE: `formatTime` and `parseTime` must be implemented in a
     * compatible manner to ensure the component works properly.
     *
     * NOTE: these functions only apply to the text shown in the input field and
     * in the dropdown. The `value`, `min` and `max` properties always use the
     * ISO 8601 format, and are never passed to `parseTime`, so implementations
     * do not need to accept ISO 8601 input.
     *
     * @type {!TimePickerI18n}
     */
    get i18n() {
      return super.i18n;
    }

    set i18n(value) {
      super.i18n = value;
    }

    /**
     * The input element's value when it cannot be parsed as a time, and an empty string otherwise.
     *
     * @private
     * @return {string}
     */
    get __unparsableValue() {
      if (this._inputElementValue && !this.__effectiveI18n.parseTime(this._inputElementValue)) {
        return this._inputElementValue;
      }

      return '';
    }

    /** @protected */
    ready() {
      super.ready();

      this.addController(
        new InputController(
          this,
          (input) => {
            this._setInputElement(input);
            this._setFocusElement(input);
            this.stateTarget = input;
            this.ariaTarget = input;
          },
          {
            // The "search" word is a trick to prevent Safari from enabling AutoFill,
            // which is causing click issues:
            // https://github.com/vaadin/web-components/issues/6817#issuecomment-2268229567
            uniqueIdPrefix: 'search-input',
          },
        ),
      );
      this.addController(new LabelledInputController(this.inputElement, this._labelController));
      this._inputContainer = this.shadowRoot.querySelector('[part~="input-field"]');
      this._toggleElement = this.$.toggleButton;

      this._tooltipController = new TooltipController(this);
      this._tooltipController.setShouldShow((timePicker) => !timePicker.opened);
      this._tooltipController.setPosition('top');
      this._tooltipController.setAriaTarget(this.inputElement);
      this.addController(this._tooltipController);
    }

    /** @protected */
    updated(props) {
      super.updated(props);

      if (['__effectiveI18n', 'min', 'max', 'step'].some((prop) => props.has(prop))) {
        this.__updateDropdownItems();
      }

      if (props.has('step')) {
        const time = this.__getTimeObject(this.value);
        this.value = formatISOTime(time);
        // Always update the input value, even if the component value hasn't
        // changed, so that the text matches the step interval. For example,
        // if the step is 3600 "10:00:50" should become "10:00".
        this.__updateInputValue(time);
      }

      if (props.has('__effectiveI18n') && this.value) {
        this.__updateInputValue(this.__getTimeObject(this.value));
      }
    }

    /**
     * Returns true if the current input value satisfies all constraints (if any).
     * You can override this method for custom validations.
     *
     * @return {boolean} True if the value is valid
     */
    checkValidity() {
      return !!(
        this.inputElement.checkValidity() &&
        (!this.value || this._timeAllowed(parseISOTime(this.value))) &&
        (!this._comboBoxValue || this.__effectiveI18n.parseTime(this._comboBoxValue))
      );
    }

    /**
     * Override method from `ComboBoxBaseMixin` to handle item label path.
     * @protected
     * @override
     */
    _getItemLabel(item) {
      return item ? item.label : '';
    }

    /** @private */
    _updateScroller(opened, items, focusedIndex, theme, value) {
      if (opened) {
        this._scroller.style.maxHeight =
          getComputedStyle(this).getPropertyValue(`--${this._tagNamePrefix}-overlay-max-height`) || '65vh';
      }

      const isClosing = this.hasAttribute('closing');

      this._scroller.setProperties({
        items: opened || isClosing ? items : [],
        opened,
        focusedIndex,
        theme,
        selectedItem: items?.find((item) => item.value === value),
      });
    }

    /** @private */
    _openedOrItemsChanged(opened, items) {
      // Close the overlay if there are no items to display.
      this._overlayOpened = opened && !!items?.length;
    }

    /**
     * Override method from `ComboBoxBaseMixin` to commit value on overlay closing.
     * @protected
     * @override
     */
    _onClosed() {
      this._commitValue();
    }

    /**
     * Override method from `ComboBoxBaseMixin` to handle Escape pres..
     * @protected
     * @override
     */
    _onEscapeCancel() {
      this._inputElementValue = this._comboBoxValue;
      this._closeOrCommit();
    }

    /**
     * Override method from `ComboBoxBaseMixin` to implement clearing logic.
     * @protected
     * @override
     */
    _onClearAction() {
      this.__setValueFromText('');

      this.__commitValueChange();
    }

    /**
     * Override method from `ComboBoxBaseMixin` to implement value commit logic.
     * @protected
     * @override
     */
    _commitValue() {
      if (this._focusedIndex > -1) {
        // Commit value based on focused index
        const focusedItem = this._dropdownItems[this._focusedIndex];
        this.__setValueFromTime(parseISOTime(focusedItem.value));
        this._focusedIndex = -1;
      } else if (this._inputElementValue !== this._comboBoxValue) {
        // Committing text that did not change would parse and format it again,
        // and set the value from the result, so skip it.
        this.__setValueFromText(this._inputElementValue || '');
      }

      this.__commitValueChange();

      this._clearSelectionRange();
    }

    /**
     * Override method from `ComboBoxBaseMixin` to handle loading.
     * @protected
     * @override
     */
    _closeOrCommit() {
      if (!this.opened) {
        this._commitValue();
      } else {
        this.close();
      }
    }

    /**
     * Override method from `ComboBoxBaseMixin` to handle reverting value.
     * @protected
     * @override
     */
    _revertInputValue() {
      this._inputElementValue = this._comboBoxValue;
      this._clearSelectionRange();
    }

    /**
     * @param {boolean} focused
     * @override
     * @protected
     */
    _setFocused(focused) {
      super._setFocused(focused);

      if (!focused && !this._closeOnBlurIsPrevented) {
        // Do not validate when focusout is caused by document
        // losing focus, which happens on browser tab switch.
        if (document.hasFocus()) {
          this._requestValidation();
        }
      }
    }

    /** @private */
    __validDayDivisor(step) {
      // Valid if undefined, or exact divides a day, or has millisecond resolution
      return !step || (24 * 3600) % step === 0 || (step < 1 && ((step % 1) * 1000) % 1 === 0);
    }

    /**
     * Override an event listener from `KeyboardMixin`.
     * @param {!KeyboardEvent} e
     * @protected
     */
    _onKeyDown(e) {
      super._onKeyDown(e);

      if (this.readonly || this.disabled || this._dropdownItems.length) {
        return;
      }

      const stepResolution = (this.__validDayDivisor(this.step) && this.step) || 60;

      if (e.keyCode === 40) {
        this.__onArrowPressWithStep(-stepResolution);
      } else if (e.keyCode === 38) {
        this.__onArrowPressWithStep(stepResolution);
      }
    }

    /** @private */
    __onArrowPressWithStep(step) {
      const objWithStep = this.__addStep(this.__getMsec(this.__memoValue), step, true);
      this.__memoValue = objWithStep;

      // Only commit when the formatted text changes, so that a step finer than
      // the formatter can show does not move the value on its own, see #6397.
      const text = this.__effectiveI18n.formatTime(objWithStep) || '';
      if (text !== this._comboBoxValue) {
        this.__setValueFromTime(objWithStep);
      }

      this.__commitValueChange();
    }

    /**
     * Depending on the nature of the value change that has occurred since
     * the last commit attempt, triggers validation and fires an event:
     *
     * Value change             | Event
     * -------------------------|-------------------
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
     * Returning milliseconds from Object in the format `{ hours: ..., minutes: ..., seconds: ..., milliseconds: ... }`
     * @private
     */
    __getMsec(obj) {
      let result = (obj?.hours || 0) * 60 * 60 * 1000;
      result += (obj?.minutes || 0) * 60 * 1000;
      result += (obj?.seconds || 0) * 1000;
      result += parseInt(obj?.milliseconds) || 0;

      return result;
    }

    /**
     * Returning Object in the format `{ hours: ..., minutes: ..., seconds: ..., milliseconds: ... }`
     * from an ISO 8601 time, stripped to the resolution defined by the step.
     * @private
     */
    __getTimeObject(timeString) {
      return validateTime(parseISOTime(timeString), this.step);
    }

    /**
     * Returning seconds from Object in the format `{ hours: ..., minutes: ..., seconds: ..., milliseconds: ... }`
     * @private
     */
    __getSec(obj) {
      let result = (obj?.hours || 0) * 60 * 60;
      result += (obj?.minutes || 0) * 60;
      result += obj?.seconds || 0;
      result += (obj?.milliseconds || 0) / 1000;

      return result;
    }

    /**
     * Returning Object in the format `{ hours: ..., minutes: ..., seconds: ..., milliseconds: ... }`
     * from the result of adding step value in milliseconds to the milliseconds amount.
     * With `precision` parameter rounding the value to the closest step valid interval.
     * @private
     */
    __addStep(msec, step, precision) {
      // If the time is `00:00` and step changes value downwards, it should be considered as `24:00`
      if (msec === 0 && step < 0) {
        msec = 24 * 60 * 60 * 1000;
      }

      const stepMsec = step * 1000;
      const diffToNext = msec % stepMsec;
      if (stepMsec < 0 && diffToNext && precision) {
        msec -= diffToNext;
      } else if (stepMsec > 0 && diffToNext && precision) {
        msec -= diffToNext - stepMsec;
      } else {
        msec += stepMsec;
      }

      const hh = Math.floor(msec / 1000 / 60 / 60);
      msec -= hh * 1000 * 60 * 60;
      const mm = Math.floor(msec / 1000 / 60);
      msec -= mm * 1000 * 60;
      const ss = Math.floor(msec / 1000);
      msec -= ss * 1000;

      return { hours: hh < 24 ? hh : 0, minutes: mm, seconds: ss, milliseconds: msec };
    }

    /** @private */
    __updateDropdownItems() {
      const minSec = this.__getSec(this.__getTimeObject(this.min || MIN_ALLOWED_TIME));
      const maxSec = this.__getSec(this.__getTimeObject(this.max || MAX_ALLOWED_TIME));

      this._dropdownItems = this.__generateDropdownList(minSec, maxSec, this.step);
    }

    /** @private */
    __updateAriaAttributes(items, opened, input) {
      if (items === undefined || input === undefined) {
        return;
      }

      if (items.length === 0) {
        input.removeAttribute('role');
        input.removeAttribute('aria-expanded');
      } else {
        input.setAttribute('role', 'combobox');
        input.setAttribute('aria-expanded', !!opened);
      }
    }

    /** @private */
    __generateDropdownList(minSec, maxSec, step) {
      if (step < 15 * 60 || !this.__validDayDivisor(step)) {
        return [];
      }

      const generatedList = [];

      // Default step in overlay items is 1 hour
      if (!step) {
        step = 3600;
      }

      let time = -step + minSec;
      while (time + step >= minSec && time + step <= maxSec) {
        const timeObj = validateTime(this.__addStep(time * 1000, step), step);
        time += step;
        const formatted = this.__effectiveI18n.formatTime(timeObj);
        generatedList.push({ label: formatted, value: formatISOTime(timeObj) });
      }

      return generatedList;
    }

    /**
     * Override an observer from `InputMixin`.
     * @protected
     * @override
     */
    _valueChanged(value, oldValue) {
      // Strip value to the step resolution before marking as committed.
      const parsedObj = (this.__memoValue = this.__getTimeObject(value));
      const newValue = formatISOTime(parsedObj);

      // Mark value set programmatically by the user
      // as committed for the change event detection.
      if (!this.__keepCommittedValue) {
        this.__committedValue = value;
        this.__committedUnparsableValue = '';
      }

      if (value !== '' && value !== null && !parsedObj) {
        // Value can not be parsed, reset to the old one.
        this.value = oldValue ?? '';
      } else if (value !== newValue) {
        // Value can be parsed (e.g. 12 -> 12:00), adjust.
        this.value = newValue;
      } else if (!this.__keepCommittedValue) {
        this.__updateInputValue(parsedObj);
      }

      this._toggleHasValue(this._hasValue);
    }

    /**
     * Sets the value without marking it as committed, so that
     * `__commitValueChange()` can still detect the change and
     * fire an event for it.
     *
     * @param {string} value
     * @private
     */
    __setUncommittedValue(value) {
      this.__keepCommittedValue = true;
      this.value = value;
      this.__keepCommittedValue = false;
    }

    /**
     * Sets the value and the input text from the given time,
     * stripped to the resolution defined by the step.
     *
     * @param {!TimePickerTime} time
     * @private
     */
    __setValueFromTime(time) {
      const stripped = validateTime(time, this.step);
      this.__setUncommittedValue(formatISOTime(stripped));
      this.__updateInputValue(stripped);
    }

    /**
     * Sets the value from the given text. When the text can not be parsed as a
     * time, the value is set to an empty string and the text is left in the
     * input for the user to correct.
     *
     * @param {string} text
     * @private
     */
    __setValueFromText(text) {
      // Skip parsing an empty field to not call custom `i18n.parseTime` for it.
      const parsed = text ? this.__effectiveI18n.parseTime(text) : undefined;

      if (parsed) {
        this.__setValueFromTime(parsed);
        return;
      }

      this.__setUncommittedValue('');
      this._inputElementValue = text;
      this._comboBoxValue = text;
    }

    /** @private */
    __updateInputValue(obj) {
      const text = this.__effectiveI18n.formatTime(obj) || '';
      this._inputElementValue = text;
      this._comboBoxValue = text;
    }

    /**
     * Returns true if `time` satisfies the `min` and `max` constraints (if any).
     *
     * @param {!TimePickerTime} time Value to check against constraints
     * @return {boolean} True if `time` satisfies the constraints
     * @protected
     */
    _timeAllowed(time) {
      const parsedMin = parseISOTime(this.min || MIN_ALLOWED_TIME);
      const parsedMax = parseISOTime(this.max || MAX_ALLOWED_TIME);

      return (
        (!parsedMin || this.__getMsec(time) >= this.__getMsec(parsedMin)) &&
        (!parsedMax || this.__getMsec(time) <= this.__getMsec(parsedMax))
      );
    }

    /**
     * Override method from `ComboBoxBaseMixin` to deselect
     * dropdown item by requesting content update on clear.
     * @param {Event} event
     * @protected
     */
    _onClearButtonClick(event) {
      event.stopPropagation();
      super._onClearButtonClick(event);

      if (this.opened) {
        this._scroller.requestContentUpdate();
      }
    }

    /**
     * @param {Event} event
     * @protected
     */
    _onHostClick(event) {
      const path = event.composedPath();

      // Open dropdown only when clicking on the label or input field
      if (path.includes(this._labelNode) || path.includes(this._inputContainer)) {
        super._onHostClick(event);
      }
    }

    /**
     * Override an event listener from `InputMixin`.
     * @param {!Event} event
     * @protected
     * @override
     */
    _onChange(event) {
      // Suppress the native change event fired on the native input.
      // We use `__commitValueChange` to fire a custom event.
      event.stopPropagation();
    }
  };
