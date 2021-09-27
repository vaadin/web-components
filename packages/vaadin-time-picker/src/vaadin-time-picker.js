/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { AriaLabelController } from '@vaadin/field-base/src/aria-label-controller.js';
import { ClearButtonMixin } from '@vaadin/field-base/src/clear-button-mixin.js';
import { FieldAriaMixin } from '@vaadin/field-base/src/field-aria-mixin.js';
import { InputSlotMixin } from '@vaadin/field-base/src/input-slot-mixin.js';
import { PatternMixin } from '@vaadin/field-base/src/pattern-mixin.js';
import { inputFieldShared } from '@vaadin/field-base/src/styles/input-field-shared-styles.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { registerStyles } from '@vaadin/vaadin-themable-mixin/register-styles.js';
import '@vaadin/input-container/src/vaadin-input-container.js';
import './vaadin-time-picker-combo-box.js';

registerStyles('vaadin-time-picker', inputFieldShared, { moduleId: 'vaadin-time-picker-styles' });

/**
 * `<vaadin-time-picker>` is a Web Component providing a time-selection field.
 *
 * ```html
 * <vaadin-time-picker></vaadin-time-picker>
 * ```
 * ```js
 * timePicker.value = '14:30';
 * ```
 *
 * When the selected `value` is changed, a `value-changed` event is triggered.
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name       | Description
 * ----------------|----------------
 * `clear-button`  | The clear button
 * `input-field`   | Input element wrapper
 * `toggle-button` | The toggle button
 * `label`         | The label element
 * `error-message` | The error message element
 * `helper-text`   | The helper text element wrapper
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description                              | Part name
 * -------------|------------------------------------------|------------
 * `disabled`   | Set to a disabled time picker            | :host
 * `readonly`   | Set to a read only time picker           | :host
 * `invalid`    | Set when the element is invalid          | :host
 * `focused`    | Set when the element is focused          | :host
 * `focus-ring` | Set when the element is keyboard focused | :host
 *
 * ### Internal components
 *
 * In addition to `<vaadin-time-picker>` itself, the following internal
 * components are themable:
 *
 * - `<vaadin-time-picker-combo-box>` - has the same API as [`<vaadin-combo-box-light>`](#/elements/vaadin-combo-box-light).
 *
 * Note: the `theme` attribute value set on `<vaadin-time-picker>` is
 * propagated to the internal components listed above.
 *
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 *
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 * @mixes InputSlotMixin
 * @mixes ClearButtonMixin
 * @mixes FieldAriaMixin
 * @mixes PatternMixin
 */
class TimePicker extends PatternMixin(
  FieldAriaMixin(ClearButtonMixin(InputSlotMixin(ThemableMixin(ElementMixin(PolymerElement)))))
) {
  static get is() {
    return 'vaadin-time-picker';
  }

  static get template() {
    return html`
      <style>
        /* See https://github.com/vaadin/vaadin-time-picker/issues/145 */
        :host([dir='rtl']) [part='input-field'] {
          direction: ltr;
        }

        :host([dir='rtl']) [part='input-field'] ::slotted(input)::placeholder {
          direction: rtl;
          text-align: left;
        }

        [part~='toggle-button'] {
          cursor: pointer;
        }
      </style>

      <div part="container">
        <div part="label" on-click="focus">
          <slot name="label"></slot>
          <span part="required-indicator" aria-hidden="true"></span>
        </div>

        <vaadin-time-picker-combo-box
          id="comboBox"
          filtered-items="[[__dropdownItems]]"
          value="{{_comboBoxValue}}"
          disabled="[[disabled]]"
          readonly="[[readonly]]"
          auto-open-disabled="[[autoOpenDisabled]]"
          position-target="[[_inputContainer]]"
          theme$="[[theme]]"
          on-change="__onChange"
        >
          <vaadin-input-container
            part="input-field"
            readonly="[[readonly]]"
            disabled="[[disabled]]"
            invalid="[[invalid]]"
            theme$="[[theme]]"
          >
            <slot name="prefix" slot="prefix"></slot>
            <slot name="input"></slot>
            <div id="clearButton" part="clear-button" slot="suffix"></div>
            <div id="toggleButton" class="toggle-button" part="toggle-button" slot="suffix"></div>
          </vaadin-input-container>
        </vaadin-time-picker-combo-box>

        <div part="helper-text">
          <slot name="helper"></slot>
        </div>

        <div part="error-message">
          <slot name="error-message"></slot>
        </div>
      </div>
    `;
  }

  static get properties() {
    return {
      /**
       * The time value for this element.
       *
       * Supported time formats are in ISO 8601:
       * - `hh:mm` (default)
       * - `hh:mm:ss`
       * - `hh:mm:ss.fff`
       * @type {string}
       */
      value: {
        type: String,
        notify: true,
        value: ''
      },

      /**
       * Minimum time allowed.
       *
       * Supported time formats are in ISO 8601:
       * - `hh:mm`
       * - `hh:mm:ss`
       * - `hh:mm:ss.fff`
       * @type {string}
       */
      min: {
        type: String,
        value: '00:00:00.000'
      },

      /**
       * Maximum time allowed.
       *
       * Supported time formats are in ISO 8601:
       * - `hh:mm`
       * - `hh:mm:ss`
       * - `hh:mm:ss.fff`
       * @type {string}
       */
      max: {
        type: String,
        value: '23:59:59.999'
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
        type: Number
      },

      /**
       * Set true to prevent the overlay from opening automatically.
       * @attr {boolean} auto-open-disabled
       */
      autoOpenDisabled: Boolean,

      /** @private */
      __dropdownItems: {
        type: Array
      },

      /**
       * The object used to localize this component.
       * To change the default localization, replace the entire
       * _i18n_ object or just the property you want to modify.
       *
       * The object has the following JSON structure:
       *
       * ```
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
       * Both `formatTime` and `parseTime` need to be implemented
       * to ensure the component works properly.
       *
       * @type {!TimePickerI18n}
       */
      i18n: {
        type: Object,
        value: () => {
          return {
            formatTime: (time) => {
              if (!time) {
                return;
              }

              const pad = (num = 0, fmt = '00') => (fmt + num).substr((fmt + num).length - fmt.length);
              // Always display hour and minute
              let timeString = `${pad(time.hours)}:${pad(time.minutes)}`;
              // Adding second and millisecond depends on resolution
              time.seconds !== undefined && (timeString += `:${pad(time.seconds)}`);
              time.milliseconds !== undefined && (timeString += `.${pad(time.milliseconds, '000')}`);
              return timeString;
            },
            parseTime: (text) => {
              // Parsing with RegExp to ensure correct format
              const MATCH_HOURS = '(\\d|[0-1]\\d|2[0-3])';
              const MATCH_MINUTES = '(\\d|[0-5]\\d)';
              const MATCH_SECONDS = MATCH_MINUTES;
              const MATCH_MILLISECONDS = '(\\d{1,3})';
              const re = new RegExp(
                `^${MATCH_HOURS}(?::${MATCH_MINUTES}(?::${MATCH_SECONDS}(?:\\.${MATCH_MILLISECONDS})?)?)?$`
              );
              const parts = re.exec(text);
              if (parts) {
                // Allows setting the milliseconds with hundreds and tens precision
                if (parts[4]) {
                  while (parts[4].length < 3) {
                    parts[4] += '0';
                  }
                }
                return { hours: parts[1], minutes: parts[2], seconds: parts[3], milliseconds: parts[4] };
              }
            }
          };
        }
      },

      /** @private */
      _comboBoxValue: {
        type: String,
        observer: '__comboBoxValueChanged'
      },

      /** @private */
      _inputContainer: Object
    };
  }

  static get observers() {
    return ['__updateDropdownItems(i18n.*, min, max, step)'];
  }

  /**
   * Element used by `FieldAriaMixin` to set ARIA attributes.
   * @protected
   */
  get _ariaTarget() {
    return this.inputElement;
  }

  /**
   * Used by `ClearButtonMixin` as a reference to the clear button element.
   * @protected
   * @return {!HTMLElement}
   */
  get clearElement() {
    return this.$.clearButton;
  }

  /** @protected */
  ready() {
    super.ready();

    this.addController(new AriaLabelController(this));
    this._inputContainer = this.shadowRoot.querySelector('[part~="input-field"]');
  }

  /**
   * Override method inherited from `InputMixin` to forward the input to combo-box.
   * @protected
   * @override
   */
  _inputElementChanged(input) {
    super._inputElementChanged(input);

    if (input) {
      this.$.comboBox._setInputElement(input);
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
      (!this.value || this._timeAllowed(this.i18n.parseTime(this.value))) &&
      (!this._comboBoxValue || this.i18n.parseTime(this._comboBoxValue))
    );
  }

  /**
   * Override method inherited from `FocusMixin` to validate on blur.
   * @param {boolean} focused
   * @protected
   */
  _setFocused(focused) {
    super._setFocused(focused);

    if (!focused) {
      this.validate();
    }
  }

  /** @private */
  __validDayDivisor(step) {
    // valid if undefined, or exact divides a day, or has millisecond resolution
    return !step || (24 * 3600) % step === 0 || (step < 1 && ((step % 1) * 1000) % 1 === 0);
  }

  /**
   * Override an event listener from `ClearButtonMixin`
   * to prevent clearing the input value on Esc key.
   * @param {Event} event
   * @protected
   */
  _onKeyDown(e) {
    if (this.readonly || this.disabled || this.__dropdownItems.length) {
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
    this.inputElement.value = this.i18n.formatTime(this.__validateTime(objWithStep));
    this.__dispatchChange();
  }

  /** @private */
  __dispatchChange() {
    this.dispatchEvent(new CustomEvent('change', { bubbles: true }));
  }

  /**
   * Returning milliseconds from Object in the format `{ hours: ..., minutes: ..., seconds: ..., milliseconds: ... }`
   * @private
   */
  __getMsec(obj) {
    let result = ((obj && obj.hours) || 0) * 60 * 60 * 1000;
    result += ((obj && obj.minutes) || 0) * 60 * 1000;
    result += ((obj && obj.seconds) || 0) * 1000;
    result += (obj && parseInt(obj.milliseconds)) || 0;

    return result;
  }

  /**
   * Returning seconds from Object in the format `{ hours: ..., minutes: ..., seconds: ..., milliseconds: ... }`
   * @private
   */
  __getSec(obj) {
    let result = ((obj && obj.hours) || 0) * 60 * 60;
    result += ((obj && obj.minutes) || 0) * 60;
    result += (obj && obj.seconds) || 0;
    result += (obj && obj.milliseconds / 1000) || 0;

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

    var hh = Math.floor(msec / 1000 / 60 / 60);
    msec -= hh * 1000 * 60 * 60;
    var mm = Math.floor(msec / 1000 / 60);
    msec -= mm * 1000 * 60;
    var ss = Math.floor(msec / 1000);
    msec -= ss * 1000;

    return { hours: hh < 24 ? hh : 0, minutes: mm, seconds: ss, milliseconds: msec };
  }

  /** @private */
  __updateDropdownItems(i8n, min, max, step) {
    const minTimeObj = this.__validateTime(this.__parseISO(min));
    const minSec = this.__getSec(minTimeObj);

    const maxTimeObj = this.__validateTime(this.__parseISO(max));
    const maxSec = this.__getSec(maxTimeObj);

    this.__adjustValue(minSec, maxSec, minTimeObj, maxTimeObj);

    this.__dropdownItems = this.__generateDropdownList(minSec, maxSec, step);

    if (step !== this.__oldStep) {
      this.__oldStep = step;
      const parsedObj = this.__validateTime(this.__parseISO(this.value));
      this.__updateValue(parsedObj);
    }

    if (this.value) {
      this._comboBoxValue = this.i18n.formatTime(this.i18n.parseTime(this.value));
    }
  }

  /** @private */
  __generateDropdownList(minSec, maxSec, step) {
    if (step < 15 * 60 || !this.__validDayDivisor(step)) {
      return [];
    }

    const generatedList = [];

    // Default step in overlay items is 1 hour
    step = step || 3600;

    let time = -step + minSec;
    while (time + step >= minSec && time + step <= maxSec) {
      const timeObj = this.__validateTime(this.__addStep(time * 1000, step));
      time += step;
      const formatted = this.i18n.formatTime(timeObj);
      generatedList.push({ label: formatted, value: formatted });
    }

    return generatedList;
  }

  /** @private */
  __adjustValue(minSec, maxSec, minTimeObj, maxTimeObj) {
    // Do not change the value if it is empty
    if (!this.__memoValue) {
      return;
    }

    const valSec = this.__getSec(this.__memoValue);

    if (valSec < minSec) {
      this.__updateValue(minTimeObj);
    } else if (valSec > maxSec) {
      this.__updateValue(maxTimeObj);
    }
  }

  /**
   * Override an observer from `InputMixin`.
   * @protected
   * @override
   */
  _valueChanged(value, oldValue) {
    const parsedObj = (this.__memoValue = this.__parseISO(value));
    const newValue = this.__formatISO(parsedObj) || '';

    if (this.value !== '' && this.value !== null && !parsedObj) {
      this.value = oldValue;
    } else if (this.value !== newValue) {
      this.value = newValue;
    } else {
      this.__updateInputValue(parsedObj);
    }

    this._toggleHasValue(!!this.value);
  }

  /** @private */
  __comboBoxValueChanged(value, oldValue) {
    if (value === '' && oldValue === undefined) {
      return;
    }

    const parsedObj = this.i18n.parseTime(value);
    const newValue = this.i18n.formatTime(parsedObj) || '';

    if (parsedObj) {
      if (value !== newValue) {
        this._comboBoxValue = newValue;
      } else {
        this.__updateValue(parsedObj);
      }
    } else {
      this.value = '';
    }
  }

  /** @private */
  __onChange(event) {
    event.stopPropagation();

    this.validate();

    this.__dispatchChange();
  }

  /** @private */
  __updateValue(obj) {
    const timeString = this.__formatISO(this.__validateTime(obj)) || '';
    this.value = timeString;
  }

  /** @private */
  __updateInputValue(obj) {
    const timeString = this.i18n.formatTime(this.__validateTime(obj)) || '';
    this._comboBoxValue = timeString;
  }

  /** @private */
  __validateTime(timeObject) {
    if (timeObject) {
      timeObject.hours = parseInt(timeObject.hours);
      timeObject.minutes = parseInt(timeObject.minutes || 0);
      timeObject.seconds = this.__stepSegment < 3 ? undefined : parseInt(timeObject.seconds || 0);
      timeObject.milliseconds = this.__stepSegment < 4 ? undefined : parseInt(timeObject.milliseconds || 0);
    }
    return timeObject;
  }

  /** @private */
  get __stepSegment() {
    if (this.step % 3600 === 0) {
      // Accept hours
      return 1;
    } else if (this.step % 60 === 0 || !this.step) {
      // Accept minutes
      return 2;
    } else if (this.step % 1 === 0) {
      // Accept seconds
      return 3;
    } else if (this.step < 1) {
      // Accept milliseconds
      return 4;
    }
    return undefined;
  }

  /** @private */
  __formatISO(time) {
    // The default i18n formatter implementation is ISO 8601 compliant
    return TimePicker.properties.i18n.value().formatTime(time);
  }

  /** @private */
  __parseISO(text) {
    // The default i18n parser implementation is ISO 8601 compliant
    return TimePicker.properties.i18n.value().parseTime(text);
  }

  /**
   * Returns true if `time` satisfies the `min` and `max` constraints (if any).
   *
   * @param {!TimePickerTime} time Value to check against constraints
   * @return {boolean} True if `time` satisfies the constraints
   * @protected
   */
  _timeAllowed(time) {
    const parsedMin = this.i18n.parseTime(this.min);
    const parsedMax = this.i18n.parseTime(this.max);

    return (
      (!this.__getMsec(parsedMin) || this.__getMsec(time) >= this.__getMsec(parsedMin)) &&
      (!this.__getMsec(parsedMax) || this.__getMsec(time) <= this.__getMsec(parsedMax))
    );
  }

  /**
   * Override method inherited from `ClearButtonMixin`.
   * @protected
   */
  _onClearButtonClick() {}

  /**
   * Override method inherited from `InputConstraintsMixin`.
   * @protected
   */
  _onChange() {}

  /**
   * Override method inherited from `InputMixin`.
   * @protected
   */
  _onInput() {
    // Need to invoke _checkInputValue from PatternMixin to prevent invalid input
    this._checkInputValue();
  }

  /**
   * Fired when the user commits a value change.
   *
   * @event change
   */
}

customElements.define(TimePicker.is, TimePicker);

export { TimePicker };
