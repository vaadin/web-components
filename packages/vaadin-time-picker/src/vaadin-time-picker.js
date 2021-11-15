/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';
import { ControlStateMixin } from '@vaadin/vaadin-control-state-mixin/vaadin-control-state-mixin.js';
import '@vaadin/vaadin-combo-box/src/vaadin-combo-box-light.js';
import './vaadin-time-picker-text-field.js';

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
 * The following custom properties are available for styling:
 *
 * Part name | Description
 * ----------------|----------------
 * `toggle-button` | The toggle button
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description | Part name
 * -------------|-------------|------------
 * `disabled` | Set to a disabled time picker | :host
 * `readonly` | Set to a read only time picker | :host
 * `invalid` | Set when the element is invalid | :host
 * `focused` | Set when the element is focused | :host
 * `focus-ring` | Set when the element is keyboard focused | :host
 *
 * ### Internal components
 *
 * In addition to `<vaadin-select>` itself, the following internal
 * components are themable:
 *
 * - `<vaadin-time-picker-text-field>` - has the same API as [`<vaadin-text-field>`](#/elements/vaadin-text-field).
 * - [`<vaadin-combo-box-light>`](#/elements/vaadin-combo-box-light).
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
 * @mixes ControlStateMixin
 * @mixes ThemableMixin
 */
class TimePickerElement extends ElementMixin(ControlStateMixin(ThemableMixin(PolymerElement))) {
  static get template() {
    return html`
      <style>
        :host {
          display: inline-block;
        }

        :host([hidden]) {
          display: none !important;
        }

        [part~='toggle-button'] {
          cursor: pointer;
        }

        .input {
          width: 100%;
          min-width: 0;
        }
      </style>
      <vaadin-combo-box-light
        allow-custom-value=""
        filtered-items="[[__dropdownItems]]"
        disabled="[[disabled]]"
        readonly="[[readonly]]"
        auto-open-disabled="[[autoOpenDisabled]]"
        dir="ltr"
        theme$="[[theme]]"
      >
        <vaadin-time-picker-text-field
          class="input"
          name="[[name]]"
          invalid="[[invalid]]"
          autocomplete="off"
          label="[[label]]"
          required="[[required]]"
          disabled="[[disabled]]"
          prevent-invalid-input="[[preventInvalidInput]]"
          pattern="[[pattern]]"
          error-message="[[errorMessage]]"
          autofocus="[[autofocus]]"
          placeholder="[[placeholder]]"
          readonly="[[readonly]]"
          role="application"
          aria-live="assertive"
          min$="[[min]]"
          max$="[[max]]"
          aria-label$="[[label]]"
          clear-button-visible="[[clearButtonVisible]]"
          i18n="[[i18n]]"
          helper-text="[[helperText]]"
          theme$="[[theme]]"
        >
          <slot name="helper" slot="helper">[[helperText]]</slot>
          <span
            slot="suffix"
            part="toggle-button"
            class="toggle-button"
            role="button"
            aria-label$="[[i18n.selector]]"
          ></span>
        </vaadin-time-picker-text-field>
      </vaadin-combo-box-light>
    `;
  }

  static get is() {
    return 'vaadin-time-picker';
  }
  static get version() {
    return '21.0.4';
  }

  static get properties() {
    return {
      /**
       * The name of this element.
       */
      name: {
        type: String
      },

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
        observer: '__valueChanged',
        notify: true,
        value: ''
      },

      /**
       * The label for this element.
       */
      label: {
        type: String,
        reflectToAttribute: true
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
       * Set to true to disable this input.
       * @type {boolean}
       */
      disabled: {
        type: Boolean,
        value: false
      },

      /**
       * Set to true to prevent the user from entering invalid input.
       * @attr {boolean} prevent-invalid-input
       */
      preventInvalidInput: {
        type: Boolean
      },

      /**
       * A pattern to validate the `input` with.
       */
      pattern: {
        type: String
      },

      /**
       * The error message to display when the input is invalid.
       * @attr {string} error-message
       */
      errorMessage: {
        type: String
      },

      /**
       * String used for the helper text.
       * @attr {string} helper-text
       */
      helperText: {
        type: String,
        value: ''
      },

      /**
       * A placeholder string in addition to the label.
       * @type {string}
       */
      placeholder: {
        type: String,
        value: ''
      },

      /**
       * Set to true to prevent user picking a date or typing in the input.
       * @type {boolean}
       */
      readonly: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      /**
       * Set to true if the value is invalid.
       * @type {boolean}
       */
      invalid: {
        type: Boolean,
        reflectToAttribute: true,
        notify: true,
        value: false
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
       * Set to true to display the clear icon which clears the input.
       * @attr {boolean} clear-button-visible
       * @type {boolean}
       */
      clearButtonVisible: {
        type: Boolean,
        value: false
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

          {
            // A function to format given `Object` as
            // time string. Object is in the format `{ hours: ..., minutes: ..., seconds: ..., milliseconds: ... }`
            formatTime: (time) => {
              // returns a string representation of the given
              // object in `hh` / 'hh:mm' / 'hh:mm:ss' / 'hh:mm:ss.fff' - formats
            },

            // A function to parse the given text to an `Object` in the format
            // `{ hours: ..., minutes: ..., seconds: ..., milliseconds: ... }`.
            // Must properly parse (at least) text
            // formatted by `formatTime`.
            parseTime: text => {
              // Parses a string in object/string that can be formatted by`formatTime`.
            }

            // Translation of the time selector icon button title.
            selector: 'Time selector',

            // Translation of the time selector clear button title.
            clear: 'Clear'
          }
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
            },
            selector: 'Time selector',
            clear: 'Clear'
          };
        }
      }
    };
  }

  static get observers() {
    return ['__updateDropdownItems(i18n.*, min, max, step)'];
  }

  /** @protected */
  ready() {
    super.ready();

    // In order to have synchronized invalid property, we need to use the same validate logic.
    this.__inputElement.validate = () => {};

    // Not using declarative because we receive an event before text-element shadow is ready,
    // thus querySelector in textField.focusElement raises an undefined exception on validate
    this.__dropdownElement.addEventListener('value-changed', (e) => this.__onInputChange(e));
    this.__inputElement.addEventListener('keydown', this.__onKeyDown.bind(this));

    // Validation listeners
    this.__dropdownElement.addEventListener('change', () => this.validate());
    this.__inputElement.addEventListener('blur', () => this.validate());

    this.__dropdownElement.addEventListener('change', (e) => {
      // `vaadin-combo-box-light` forwards 'change' event from text-field.
      // So we need to filter out in order to avoid duplicates.
      if (e.composedPath()[0] !== this.__inputElement) {
        this.__dispatchChange();
      }
    });
  }

  /** @private */
  __validDayDivisor(step) {
    // valid if undefined, or exact divides a day, or has millisecond resolution
    return !step || (24 * 3600) % step === 0 || (step < 1 && ((step % 1) * 1000) % 1 === 0);
  }

  /** @private */
  __onKeyDown(e) {
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
    this.__inputElement.value = this.i18n.formatTime(this.__validateTime(objWithStep));
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
      this.__dropdownElement.value = this.i18n.formatTime(this.i18n.parseTime(this.value));
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

  /** @private */
  __valueChanged(value, oldValue) {
    const parsedObj = (this.__memoValue = this.__parseISO(value));
    const newValue = this.__formatISO(parsedObj) || '';

    if (this.value !== '' && this.value !== null && !parsedObj) {
      this.value = oldValue;
    } else if (this.value !== newValue) {
      this.value = newValue;
    } else {
      this.__updateInputValue(parsedObj);
    }
  }

  /** @private */
  __onInputChange() {
    const parsedObj = this.i18n.parseTime(this.__dropdownElement.value);
    const newValue = this.i18n.formatTime(parsedObj) || '';

    if (parsedObj) {
      if (this.__dropdownElement.value !== newValue) {
        this.__dropdownElement.value = newValue;
      } else {
        this.__updateValue(parsedObj);
      }
    } else {
      this.value = '';
    }
  }

  /** @private */
  __updateValue(obj) {
    const timeString = this.__formatISO(this.__validateTime(obj)) || '';
    this.value = timeString;
  }

  /** @private */
  __updateInputValue(obj) {
    const timeString = this.i18n.formatTime(this.__validateTime(obj)) || '';
    this.__dropdownElement.value = timeString;
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
    return TimePickerElement.properties.i18n.value().formatTime(time);
  }

  /** @private */
  __parseISO(text) {
    // The default i18n parser implementation is ISO 8601 compliant
    return TimePickerElement.properties.i18n.value().parseTime(text);
  }

  /** @protected */
  _getInputElement() {
    return this.shadowRoot.querySelector('vaadin-time-picker-text-field');
  }

  /** @private */
  get __inputElement() {
    return this.__memoInput || (this.__memoInput = this._getInputElement());
  }

  /** @private */
  get __dropdownElement() {
    return this.__memoDropdown || (this.__memoDropdown = this.shadowRoot.querySelector('vaadin-combo-box-light'));
  }

  /**
   * Focusable element used by vaadin-control-state-mixin
   * @return {!HTMLElement}
   * @protected
   */
  get focusElement() {
    return this.__inputElement;
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
   * Returns true if the current input value satisfies all constraints (if any)
   *
   * You can override the `checkValidity` method for custom validations.
   *
   * @return {boolean} True if the value is valid
   */
  checkValidity() {
    return !!(
      this.__inputElement.focusElement.checkValidity() &&
      (!this.value || this._timeAllowed(this.i18n.parseTime(this.value))) &&
      (!this.__dropdownElement.value || this.i18n.parseTime(this.__dropdownElement.value))
    );
  }

  /**
   * Fired when the user commits a value change.
   *
   * @event change
   */
}

customElements.define(TimePickerElement.is, TimePickerElement);

export { TimePickerElement };
