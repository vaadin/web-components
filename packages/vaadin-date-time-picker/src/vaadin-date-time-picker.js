/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { dateEquals } from '@vaadin/vaadin-date-picker/src/vaadin-date-picker-helper.js';
import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import './vaadin-date-time-picker-custom-field.js';
import './vaadin-date-time-picker-date-picker.js';
import './vaadin-date-time-picker-time-picker.js';

/**
 * @typedef {object} TimePickerTime
 * @property {string | number} hours
 * @property {string | number} minutes
 * @property {string | number} [seconds]
 * @property {string | number} [milliseconds]
 */

// Find a property definition from the prototype chain of a Polymer element class
const getPropertyFromPrototype = function (clazz, prop) {
  while (clazz) {
    if (clazz.properties && clazz.properties[prop]) {
      return clazz.properties[prop];
    }
    clazz = clazz.__proto__;
  }
};

const datePickerClass = customElements.get('vaadin-date-time-picker-date-picker');
const timePickerClass = customElements.get('vaadin-date-time-picker-time-picker');
const datePickerI18nDefaults = getPropertyFromPrototype(datePickerClass, 'i18n').value();
const timePickerI18nDefaults = getPropertyFromPrototype(timePickerClass, 'i18n').value();
const datePickerI18nProps = Object.keys(datePickerI18nDefaults);
const timePickerI18nProps = Object.keys(timePickerI18nDefaults);

/**
 * `<vaadin-date-time-picker>` is a Web Component providing a date time selection field.
 *
 * ```html
 * <vaadin-date-time-picker value="2019-09-16T15:00"></vaadin-date-time-picker>
 * ```
 *
 * ```js
 * dateTimePicker.value = '2019-09-16T15:00';
 * ```
 *
 * When the selected `value` is changed, a `value-changed` event is triggered.
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description | Theme for Element
 * ----------|-------------|------------------
 * `date` | Date picker element | vaadin-date-time-picker
 * `time` | Time picker element | vaadin-date-time-picker
 *
 * The following state attributes are available for styling:
 *
 * Attribute | Description | Part name
 * ----------|-------------|----------
 * `disabled` | Set when the element is disabled | :host
 * `readonly` | Set when the element is read-only | :host
 *
 * See [ThemableMixin – Stylable Shadow Parts](https://github.com/vaadin/vaadin-themable-mixin#stylable-shadow-parts)
 *
 * ### Internal components
 *
 * In addition to `<vaadin-date-time-picker>` itself, the following internal
 * components are themable:
 *
 * - `<vaadin-date-time-picker-date-picker>` - has the same API as [`<vaadin-date-picker>`](#/elements/vaadin-date-picker).
 * - `<vaadin-date-time-picker-time-picker>` - has the same API as [`<vaadin-time-picker>`](#/elements/vaadin-time-picker).
 * - `<vaadin-date-time-picker-date-text-field>` - has the same API as [`<vaadin-text-field>`](#/elements/vaadin-text-field).
 * - `<vaadin-date-time-picker-time-text-field>` - has the same API as [`<vaadin-text-field>`](#/elements/vaadin-text-field).
 * - `<vaadin-date-time-picker-custom-field>` - has the same API as [`<vaadin-custom-field>`](#/elements/vaadin-custom-field).
 *
 * Note: the `theme` attribute value set on `<vaadin-date-time-picker>` is
 * propagated to the internal components listed above.
 *
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 *
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class DateTimePickerElement extends ElementMixin(ThemableMixin(PolymerElement)) {
  static get template() {
    return html`
      <style>
        :host {
          display: inline-block;
        }

        :host([hidden]) {
          display: none !important;
        }

        .slot-container {
          display: flex;
        }

        [part='date'],
        .slot-container ::slotted([slot='date-picker']) {
          pointer-events: all;
          min-width: 0;
          flex: 1 1 auto;
        }

        [part='time'],
        .slot-container ::slotted([slot='time-picker']) {
          pointer-events: all;
          min-width: 0;
          flex: 1 1.65 auto;
        }
      </style>
      <vaadin-date-time-picker-custom-field
        id="customField"
        on-value-changed="__customFieldValueChanged"
        i18n="[[__customFieldValueFormat]]"
        label="[[label]]"
        theme$="[[theme]]"
        invalid="[[invalid]]"
        required="[[required]]"
        disabled$="[[disabled]]"
        readonly$="[[readonly]]"
        error-message="[[errorMessage]]"
        helper-text="[[helperText]]"
      >
        <div class="slot-container">
          <slot name="date-picker" id="dateSlot">
            <vaadin-date-time-picker-date-picker part="date" theme$="[[theme]]"></vaadin-date-time-picker-date-picker>
          </slot>
          <slot name="time-picker" id="timeSlot">
            <vaadin-date-time-picker-time-picker part="time" theme$="[[theme]]"></vaadin-date-time-picker-time-picker>
          </slot>
        </div>
        <slot name="helper" slot="helper">[[helperText]]</slot>
      </vaadin-date-time-picker-custom-field>
    `;
  }

  static get is() {
    return 'vaadin-date-time-picker';
  }

  static get version() {
    return '21.0.4';
  }

  static get properties() {
    return {
      /**
       * The name of the control, which is submitted with the form data.
       */
      name: {
        type: String
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
       * Set to true to mark the input as required.
       * @type {boolean}
       */
      required: {
        type: Boolean,
        value: false
      },

      /**
       * The error message to display when the input is invalid.
       * @attr {string} error-message
       */
      errorMessage: String,

      /**
       * The value for this element.
       *
       * Supported date time format is based on ISO 8601 (without a time zone designator):
       * - Minute precision `"YYYY-MM-DDThh:mm"` (default)
       * - Second precision `"YYYY-MM-DDThh:mm:ss"`
       * - Millisecond precision `"YYYY-MM-DDThh:mm:ss.fff"`
       * @type {string}
       */
      value: {
        type: String,
        notify: true,
        value: '',
        observer: '__valueChanged'
      },

      /**
       * The earliest allowed value (date and time) that can be selected. All earlier values will be disabled.
       *
       * Supported date time format is based on ISO 8601 (without a time zone designator):
       * - Minute precision `"YYYY-MM-DDThh:mm"`
       * - Second precision `"YYYY-MM-DDThh:mm:ss"`
       * - Millisecond precision `"YYYY-MM-DDThh:mm:ss.fff"`
       *
       * @type {string | undefined}
       */
      min: {
        type: String,
        observer: '__minChanged'
      },

      /**
       * The latest value (date and time) that can be selected. All later values will be disabled.
       *
       * Supported date time format is based on ISO 8601 (without a time zone designator):
       * - Minute precision `"YYYY-MM-DDThh:mm"`
       * - Second precision `"YYYY-MM-DDThh:mm:ss"`
       * - Millisecond precision `"YYYY-MM-DDThh:mm:ss.fff"`
       *
       * @type {string | undefined}
       */
      max: {
        type: String,
        observer: '__maxChanged'
      },

      /**
       * The earliest value that can be selected. All earlier values will be disabled.
       * @private
       */
      __minDateTime: {
        type: Date,
        value: ''
      },

      /**
       * The latest value that can be selected. All later values will be disabled.
       * @private
       */
      __maxDateTime: {
        type: Date,
        value: ''
      },

      /**
       * A placeholder string for the date field.
       * @attr {string} date-placeholder
       */
      datePlaceholder: {
        type: String
      },

      /**
       * A placeholder string for the time field.
       * @attr {string} time-placeholder
       */
      timePlaceholder: {
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
       * Defines the time interval (in seconds) between the items displayed
       * in the time selection box. The default is 1 hour (i.e. `3600`).
       *
       * It also configures the precision of the time part of the value string. By default
       * the component formats time values as `hh:mm` but setting a step value
       * lower than one minute or one second, format resolution changes to
       * `hh:mm:ss` and `hh:mm:ss.fff` respectively.
       *
       * Unit must be set in seconds, and for correctly configuring intervals
       * in the dropdown, it need to evenly divide a day.
       *
       * Note: it is possible to define step that is dividing an hour in inexact
       * fragments (i.e. 5760 seconds which equals 1 hour 36 minutes), but it is
       * not recommended to use it for better UX.
       */
      step: {
        type: Number
      },

      /**
       * Date which should be visible in the date picker overlay when there is no value selected.
       *
       * The same date formats as for the `value` property are supported but without the time part.
       * @attr {string} initial-position
       */
      initialPosition: String,

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
       * String used for the label element.
       * @type {string}
       */
      label: {
        type: String,
        value: ''
      },

      /**
       * Set to true to prevent the overlays from opening automatically.
       * @attr {boolean} auto-open-disabled
       */
      autoOpenDisabled: Boolean,

      /**
       * Set to true to disable this element.
       * @type {boolean}
       */
      disabled: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      /**
       * Set to true to make this element read-only.
       * @type {boolean}
       */
      readonly: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      /**
       * Specify that this control should have input focus when the page loads.
       * @type {boolean}
       */
      autofocus: {
        type: Boolean
      },

      /**
       * The current selected date time.
       * @private
       */
      __selectedDateTime: {
        type: Date
      },

      /** @private */
      __customFieldValueFormat: {
        type: Object,
        value: () => ({
          parseValue: (combinedValue) => combinedValue.split('T'),
          formatValue: (inputValues) => inputValues.join('T')
        })
      },

      /**
       * The object used to localize this component.
       * To change the default localization, replace the entire
       * `i18n` object or just the properties you want to modify.
       *
       * The object is a combination of the i18n properties supported by
       * [`<vaadin-date-picker>`](#/elements/vaadin-date-picker) and
       * [`<vaadin-time-picker>`](#/elements/vaadin-time-picker).
       * @type {!DateTimePickerI18n}
       */
      i18n: {
        type: Object,
        value: () => Object.assign({}, datePickerI18nDefaults, timePickerI18nDefaults)
      }
    };
  }

  static get observers() {
    return [
      '__selectedDateTimeChanged(__selectedDateTime)',
      '__datePlaceholderChanged(datePlaceholder)',
      '__timePlaceholderChanged(timePlaceholder)',
      '__stepChanged(step)',
      '__initialPositionChanged(initialPosition)',
      '__showWeekNumbersChanged(showWeekNumbers)',
      '__requiredChanged(required)',
      '__invalidChanged(invalid)',
      '__disabledChanged(disabled)',
      '__readonlyChanged(readonly)',
      '__i18nChanged(i18n.*)',
      '__autoOpenDisabledChanged(autoOpenDisabled)'
    ];
  }

  constructor() {
    super();
    // Default value for "min" and "max" properties of vaadin-date-picker (for removing constraint)
    this.__defaultDateMinMaxValue = undefined;
    // Default value for "min" property of vaadin-time-picker (for removing constraint)
    this.__defaultTimeMinValue = '00:00:00.000';
    // Default value for "max" property of vaadin-time-picker (for removing constraint)
    this.__defaultTimeMaxValue = '23:59:59.999';
  }

  /** @protected */
  ready() {
    super.ready();

    this.addEventListener('focusout', (e) => {
      if (e.relatedTarget !== this.__datePicker.$.overlay) {
        this.validate();
      }
    });

    this.__changeEventHandler = this.__changeEventHandler.bind(this);
    this.__filterElements = (node) => node.nodeType === Node.ELEMENT_NODE;

    this.__datePickerChanged();
    this.__timePickerChanged();

    this.$.dateSlot.addEventListener('slotchange', this.__datePickerChanged.bind(this));
    this.$.timeSlot.addEventListener('slotchange', this.__timePickerChanged.bind(this));

    if (this.autofocus && !this.disabled) {
      window.requestAnimationFrame(() => this.focus());
    }
  }

  /** @protected */
  focus() {
    this.$.customField.focus();
  }

  /** @private */
  __syncI18n(target, source, props) {
    props = props || Object.keys(source.i18n);
    props.forEach((prop) => {
      // eslint-disable-next-line no-prototype-builtins
      if (source.i18n && source.i18n.hasOwnProperty(prop)) {
        target.set(`i18n.${prop}`, source.i18n[prop]);
      }
    });
  }

  // This is needed only for the case when date or time picker is slotted/changed after ready
  // since custom field doesn't automatically pick that change because we use a wrapper element
  // in the custom field slot.
  /** @private */
  __updateCustomFieldInputs() {
    const cfInputs = this.$.customField.inputs;
    if (
      this.__datePicker &&
      this.__timePicker &&
      (cfInputs[0] !== this.__datePicker || cfInputs[1] !== this.__timePicker)
    ) {
      this.$.customField._setInputs([this.__datePicker, this.__timePicker]);
    }
  }

  /** @private */
  __changeEventHandler() {
    this.__doDispatchChange = true;
  }

  /** @private */
  __removeChangeListener(node) {
    if (node) {
      node.removeEventListener('change', this.__changeEventHandler, false);
    }
  }

  /** @private */
  __addChangeListener(node) {
    node.addEventListener('change', this.__changeEventHandler, false);
  }

  /** @private */
  __datePickerChanged() {
    const defaultDatePicker = this.shadowRoot.querySelector('[part="date"]');
    const assignedElements = this.$.dateSlot.assignedNodes({ flatten: true }).filter(this.__filterElements);
    const datePicker = assignedElements[0];
    if (this.__datePicker === datePicker) {
      return;
    }
    this.__removeChangeListener(this.__datePicker);
    this.__addChangeListener(datePicker);
    this.__datePicker = datePicker;
    this.__updateCustomFieldInputs();

    if (datePicker === defaultDatePicker) {
      // Synchronize properties to default date picker
      datePicker.placeholder = this.datePlaceholder;
      datePicker.invalid = this.invalid;
      datePicker.initialPosition = this.initialPosition;
      datePicker.showWeekNumbers = this.showWeekNumbers;
      this.__syncI18n(datePicker, this, datePickerI18nProps);
    } else {
      // Synchronize properties from slotted date picker
      this.datePlaceholder = datePicker.placeholder;
      this.initialPosition = datePicker.initialPosition;
      this.showWeekNumbers = datePicker.showWeekNumbers;
      this.__syncI18n(this, datePicker, datePickerI18nProps);
    }

    // min and max are always synchronized from date time picker (host) to inner fields because time picker
    // min and max need to be dynamically set depending on currently selected date instead of simple propagation
    datePicker.min = this.__formatDateISO(this.__minDateTime, this.__defaultDateMinMaxValue);
    datePicker.max = this.__formatDateISO(this.__maxDateTime, this.__defaultDateMinMaxValue);
    datePicker.required = this.required;
    datePicker.disabled = this.disabled;
    datePicker.readonly = this.readonly;
    datePicker.autoOpenDisabled = this.autoOpenDisabled;

    // Disable default internal validation for the component
    datePicker.validate = () => {};
    datePicker._validateInput = () => {};
  }

  /** @private */
  __timePickerChanged() {
    const defaultTimePicker = this.shadowRoot.querySelector('[part="time"]');
    const assignedElements = this.$.timeSlot.assignedNodes({ flatten: true }).filter(this.__filterElements);
    const timePicker = assignedElements[0];
    if (this.__timePicker === timePicker) {
      return;
    }
    this.__removeChangeListener(this.__timePicker);
    this.__addChangeListener(timePicker);
    this.__timePicker = timePicker;
    this.__updateCustomFieldInputs();

    if (timePicker === defaultTimePicker) {
      // Synchronize properties to default time picker
      timePicker.placeholder = this.timePlaceholder;
      timePicker.step = this.step;
      timePicker.invalid = this.invalid;
      this.__syncI18n(timePicker, this, timePickerI18nProps);
    } else {
      // Synchronize properties from slotted time picker
      this.timePlaceholder = timePicker.placeholder;
      this.step = timePicker.step;
      this.__syncI18n(this, timePicker, timePickerI18nProps);
    }

    // min and max are always synchronized from parent to slotted because time picker min and max
    // need to be dynamically set depending on currently selected date instead of simple propagation
    this.__updateTimePickerMinMax();
    timePicker.required = this.required;
    timePicker.disabled = this.disabled;
    timePicker.readonly = this.readonly;
    timePicker.autoOpenDisabled = this.autoOpenDisabled;

    // Disable default internal validation for the component
    timePicker.validate = () => {};
  }

  /** @private */
  __updateTimePickerMinMax() {
    if (this.__timePicker && this.__datePicker) {
      const selectedDate = this.__parseDate(this.__datePicker.value);
      const isMinMaxSameDay = dateEquals(this.__minDateTime, this.__maxDateTime);
      const oldTimeValue = this.__timePicker.value;

      if ((this.__minDateTime && dateEquals(selectedDate, this.__minDateTime)) || isMinMaxSameDay) {
        this.__timePicker.min = this.__dateToIsoTimeString(this.__minDateTime);
      } else {
        this.__timePicker.min = this.__defaultTimeMinValue;
      }

      if ((this.__maxDateTime && dateEquals(selectedDate, this.__maxDateTime)) || isMinMaxSameDay) {
        this.__timePicker.max = this.__dateToIsoTimeString(this.__maxDateTime);
      } else {
        this.__timePicker.max = this.__defaultTimeMaxValue;
      }

      // If time picker automatically adjusts the time value due to the new min or max
      // revert the time value
      if (this.__timePicker.value !== oldTimeValue) {
        this.__timePicker.value = oldTimeValue;
      }
    }
  }

  /** @private */
  __i18nChanged(changeRecord) {
    if (this.__datePicker) {
      this.__datePicker.set(changeRecord.path, changeRecord.value);
    }
    if (this.__timePicker) {
      this.__timePicker.set(changeRecord.path, changeRecord.value);
    }
  }

  /** @private */
  __datePlaceholderChanged(datePlaceholder) {
    if (this.__datePicker) {
      this.__datePicker.placeholder = datePlaceholder;
    }
  }

  /** @private */
  __timePlaceholderChanged(timePlaceholder) {
    if (this.__timePicker) {
      this.__timePicker.placeholder = timePlaceholder;
    }
  }

  /** @private */
  __stepChanged(step) {
    if (this.__timePicker && this.__timePicker.step !== step) {
      const oldTimeValue = this.__timePicker.value;

      this.__timePicker.step = step;

      // If time picker value changes due to the new step (precision change)
      // propagate the updated value change to custom-field (which doesn't
      // automatically process programmatically triggered value updates)
      if (this.__timePicker.value !== oldTimeValue) {
        this.__triggerCustomFieldValueUpdate();
      }
    }
  }

  /** @private */
  __triggerCustomFieldValueUpdate() {
    if (this.__timePicker) {
      this.__timePicker.dispatchEvent(new CustomEvent('change', { bubbles: true }));
    }
  }

  /** @private */
  __initialPositionChanged(initialPosition) {
    if (this.__datePicker) {
      this.__datePicker.initialPosition = initialPosition;
    }
  }

  /** @private */
  __showWeekNumbersChanged(showWeekNumbers) {
    if (this.__datePicker) {
      this.__datePicker.showWeekNumbers = showWeekNumbers;
    }
  }

  /** @private */
  __invalidChanged(invalid) {
    if (this.__datePicker) {
      this.__datePicker.invalid = invalid;
    }
    if (this.__timePicker) {
      this.__timePicker.invalid = invalid;
    }
  }

  /** @private */
  __requiredChanged(required) {
    if (this.__datePicker) {
      this.__datePicker.required = required;
    }
    if (this.__timePicker) {
      this.__timePicker.required = required;
    }
  }

  /** @private */
  __disabledChanged(disabled) {
    if (this.__datePicker) {
      this.__datePicker.disabled = disabled;
    }
    if (this.__timePicker) {
      this.__timePicker.disabled = disabled;
    }
  }

  /** @private */
  __readonlyChanged(readonly) {
    if (this.__datePicker) {
      this.__datePicker.readonly = readonly;
    }
    if (this.__timePicker) {
      this.__timePicker.readonly = readonly;
    }
  }

  /**
   * String (ISO date) to Date object
   * @param {string} str e.g. 'yyyy-mm-dd'
   * @return {Date | undefined}
   * @private
   */
  __parseDate(str) {
    return datePickerClass.prototype._parseDate(str);
  }

  /**
   * Date object to string (ISO date)
   * @param {Date} date
   * @param {string} defaultValue
   * @return {string} e.g. 'yyyy-mm-dd' (or defaultValue when date is falsy)
   * @private
   */
  __formatDateISO(date, defaultValue) {
    if (!date) {
      return defaultValue;
    }
    return datePickerClass.prototype._formatISO(date);
  }

  /**
   * Custom time object to string (ISO time)
   * @param {!TimePickerTime} time Time components as properties { hours, minutes, seconds, milliseconds }
   * @return {string} e.g. 'hh:mm', 'hh:mm:ss', 'hh:mm:ss.fff'
   * @private
   */
  __formatTimeISO(time) {
    return timePickerI18nDefaults.formatTime(time);
  }

  /**
   * String (ISO time) to custom time object
   * @param {string} str e.g. 'hh:mm', 'hh:mm:ss', 'hh:mm:ss.fff'
   * @return {!TimePickerTime | undefined} Time components as properties { hours, minutes, seconds, milliseconds }
   * @private
   */
  __parseTimeISO(str) {
    return timePickerI18nDefaults.parseTime(str);
  }

  /**
   * String (ISO date time) to Date object
   * @param {string} str e.g. 'yyyy-mm-ddThh:mm', 'yyyy-mm-ddThh:mm:ss', 'yyyy-mm-ddThh:mm:ss.fff'
   * @return {Date | undefined}
   * @private
   */
  __parseDateTime(str) {
    const [dateValue, timeValue] = str.split('T');
    /* istanbul ignore if */
    if (!(dateValue && timeValue)) {
      return;
    }

    /** @type {Date} */
    const date = this.__parseDate(dateValue);
    if (!date) {
      return;
    }

    const time = this.__parseTimeISO(timeValue);
    if (!time) {
      return;
    }

    date.setHours(parseInt(time.hours));
    date.setMinutes(parseInt(time.minutes || 0));
    date.setSeconds(parseInt(time.seconds || 0));
    date.setMilliseconds(parseInt(time.milliseconds || 0));

    return date;
  }

  /**
   * Date object to string (ISO date time)
   * @param {Date} date
   * @return {string} e.g. 'yyyy-mm-ddThh:mm', 'yyyy-mm-ddThh:mm:ss', 'yyyy-mm-ddThh:mm:ss.fff'
   *                  (depending on precision defined by "step" property)
   * @private
   */
  __formatDateTime(date) {
    if (!date) {
      return '';
    }
    const dateValue = this.__formatDateISO(date, '');
    const timeValue = this.__dateToIsoTimeString(date);
    return `${dateValue}T${timeValue}`;
  }

  /**
   * Date object to string (ISO time)
   * @param {Date} date
   * @return {string} e.g. 'hh:mm', 'hh:mm:ss', 'hh:mm:ss.fff' (depending on precision defined by "step" property)
   * @private
   */
  __dateToIsoTimeString(date) {
    return this.__formatTimeISO(
      this.__validateTime({
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds(),
        milliseconds: date.getMilliseconds()
      })
    );
  }

  /**
   * @param {!TimePickerTime} timeObject
   * @return {!TimePickerTime}
   * @private
   */
  __validateTime(timeObject) {
    if (timeObject) {
      timeObject.seconds = this.__stepSegment < 3 ? undefined : timeObject.seconds;
      timeObject.milliseconds = this.__stepSegment < 4 ? undefined : timeObject.milliseconds;
    }
    return timeObject;
  }

  /**
   * Returns true if `value` is valid, and sets the `invalid` flag appropriately.
   *
   * @return {boolean} True if the value is valid.
   */
  validate() {
    return !(this.invalid = !this.checkValidity());
  }

  /**
   * Returns true if the current input value satisfies all constraints (if any)
   *
   * You can override the `checkValidity` method for custom validations.
   * @return {boolean}
   */
  checkValidity() {
    const hasInvalidFields = this.$.customField.inputs.filter((input) => !input.checkValidity.call(input)).length > 0;
    const hasEmptyFields = this.required && this.$.customField.inputs.filter((el) => !el.value).length > 0;

    if (hasInvalidFields || hasEmptyFields) {
      return false;
    }
    return true;
  }

  // Copied from vaadin-time-picker
  /** @private */
  // eslint-disable-next-line getter-return
  get __stepSegment() {
    const step = this.step == undefined ? 60 : parseFloat(this.step);
    if (step % 3600 === 0) {
      // Accept hours
      return 1;
    } else if (step % 60 === 0 || !step) {
      // Accept minutes
      return 2;
    } else if (step % 1 === 0) {
      // Accept seconds
      return 3;
    } else if (step < 1) {
      // Accept milliseconds
      return 4;
    }
  }

  /**
   * @param {Date} date1
   * @param {Date} date2
   * @return {boolean}
   * @private
   */
  __dateTimeEquals(date1, date2) {
    if (!dateEquals(date1, date2)) {
      return false;
    }
    return (
      date1.getHours() === date2.getHours() &&
      date1.getMinutes() === date2.getMinutes() &&
      date1.getSeconds() === date2.getSeconds() &&
      date1.getMilliseconds() === date2.getMilliseconds()
    );
  }

  /** @private */
  __handleDateTimeChange(property, parsedProperty, value, oldValue) {
    if (!value) {
      this[property] = '';
      this[parsedProperty] = '';
      return;
    }

    const dateTime = this.__parseDateTime(value);
    if (!dateTime) {
      // Invalid date, revert to old value
      this[property] = oldValue;
      return;
    }
    if (!this.__dateTimeEquals(this[parsedProperty], dateTime)) {
      this[parsedProperty] = dateTime;
    }
  }

  /** @private */
  __valueChanged(value, oldValue) {
    this.__handleDateTimeChange('value', '__selectedDateTime', value, oldValue);

    if (this.__doDispatchChange) {
      this.__dispatchChange();
      this.validate();
    }
  }

  /** @private */
  __dispatchChange() {
    this.dispatchEvent(new CustomEvent('change', { bubbles: true }));
  }

  /** @private */
  __minChanged(value, oldValue) {
    this.__handleDateTimeChange('min', '__minDateTime', value, oldValue);
    if (this.__datePicker) {
      this.__datePicker.min = this.__formatDateISO(this.__minDateTime, this.__defaultDateMinMaxValue);
    }
    this.__updateTimePickerMinMax();
  }

  /** @private */
  __maxChanged(value, oldValue) {
    this.__handleDateTimeChange('max', '__maxDateTime', value, oldValue);
    if (this.__datePicker) {
      this.__datePicker.max = this.__formatDateISO(this.__maxDateTime, this.__defaultDateMinMaxValue);
    }
    this.__updateTimePickerMinMax();
  }

  /** @private */
  __selectedDateTimeChanged(selectedDateTime) {
    const formattedValue = this.__formatDateTime(selectedDateTime);
    if (this.value !== formattedValue) {
      this.value = formattedValue;
    }

    // Setting the customField.value below triggers validation of the date picker and time picker.
    // If the inputs are slotted (e.g. when using the Java API) and have an initial value this can
    // happen before date picker ready() which would throw an error when date picker is trying to read
    // `this.$.input` (as a result of value change triggered by setting custom field value).
    // Workaround the problem by setting custom field value only if date picker is ready.
    const inputs = this.$.customField.inputs;
    const isDatePickerReady = Boolean(inputs && inputs[0] && inputs[0].$);
    if (isDatePickerReady) {
      const doDispatchChange = this.__doDispatchChange;

      this.$.customField.value = this.value !== '' ? this.value : 'T';

      this.__doDispatchChange = doDispatchChange;
    }
  }

  /** @private */
  __customFieldValueChanged(e) {
    /** @type {string} */
    const value = e.detail.value;

    // Initial empty value from custom field
    if (value === 'T' && !this.__customFieldInitialValueChangeReceived) {
      this.__customFieldInitialValueChangeReceived = true;
      // Ignore initial value from custom field so we don't override initial value of date time picker
      return;
    }

    const [date, time] = value.split('T');

    // Handle updating time picker min/max if the date changed.
    // This may cause the time picker value to be adjusted.
    // __oldDateValue is used only here and the if condition is only a minor performance optimization
    // not to run the update checks unnecessarily if only the time was changed.
    if (this.__oldDateValue !== date) {
      this.__oldDateValue = date;
      this.__updateTimePickerMinMax();
    }

    if (date && time) {
      if (value !== this.value) {
        this.value = value;
      }
    } else {
      this.value = '';
    }
    this.__doDispatchChange = false;
  }

  /** @private */
  __autoOpenDisabledChanged(autoOpenDisabled) {
    if (this.__datePicker) {
      this.__datePicker.autoOpenDisabled = autoOpenDisabled;
    }
    if (this.__timePicker) {
      this.__timePicker.autoOpenDisabled = autoOpenDisabled;
    }
  }

  /**
   * Fired when the user commits a value change.
   *
   * @event change
   */
}

customElements.define(DateTimePickerElement.is, DateTimePickerElement);

export { DateTimePickerElement };
