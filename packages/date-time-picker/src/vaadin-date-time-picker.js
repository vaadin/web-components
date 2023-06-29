/**
 * @license
 * Copyright (c) 2019 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { DisabledMixin } from '@vaadin/a11y-base/src/disabled-mixin.js';
import { FocusMixin } from '@vaadin/a11y-base/src/focus-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { SlotController } from '@vaadin/component-base/src/slot-controller.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
import { DatePicker } from '@vaadin/date-picker/src/vaadin-date-picker.js';
import { dateEquals, parseDate } from '@vaadin/date-picker/src/vaadin-date-picker-helper.js';
import { FieldMixin } from '@vaadin/field-base/src/field-mixin.js';
import { inputFieldShared } from '@vaadin/field-base/src/styles/input-field-shared-styles.js';
import { TimePicker } from '@vaadin/time-picker/src/vaadin-time-picker.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles('vaadin-date-time-picker', inputFieldShared, { moduleId: 'vaadin-date-time-picker' });

/**
 * @typedef {object} TimePickerTime
 * @property {string | number} hours
 * @property {string | number} minutes
 * @property {string | number} [seconds]
 * @property {string | number} [milliseconds]
 */

// Find a property definition from the prototype chain of a Polymer element class
function getPropertyFromPrototype(clazz, prop) {
  while (clazz) {
    if (clazz.properties && clazz.properties[prop]) {
      return clazz.properties[prop];
    }
    clazz = Object.getPrototypeOf(clazz);
  }
}

const datePickerI18nDefaults = getPropertyFromPrototype(DatePicker, 'i18n').value();
const timePickerI18nDefaults = getPropertyFromPrototype(TimePicker, 'i18n').value();
const datePickerI18nProps = Object.keys(datePickerI18nDefaults);
const timePickerI18nProps = Object.keys(timePickerI18nDefaults);

/**
 * A controller to initialize slotted picker.
 *
 * @private
 */
class PickerSlotController extends SlotController {
  constructor(host, type) {
    super(host, `${type}-picker`, `vaadin-${type}-picker`, {
      initializer: (picker, host) => {
        const prop = `__${type}Picker`;
        host[prop] = picker;
      },
    });
  }
}

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
 * Part name            | Description
 * ---------------------|----------------
 * `label`              | The slotted label element wrapper
 * `helper-text`        | The slotted helper text element wrapper
 * `error-message`      | The slotted error message element wrapper
 * `required-indicator` | The `required` state indicator element
 *
 * The following state attributes are available for styling:
 *
 * Attribute           | Description                               | Part name
 * --------------------|-------------------------------------------|------------
 * `disabled`          | Set when the element is disabled          | :host
 * `focused`           | Set when the element is focused           | :host
 * `focus-ring`        | Set when the element is keyboard focused  | :host
 * `readonly`          | Set when the element is readonly          | :host
 * `invalid`           | Set when the element is invalid           | :host
 * `has-label`         | Set when the element has a label          | :host
 * `has-value`         | Set when the element has a value          | :host
 * `has-helper`        | Set when the element has helper text      | :host
 * `has-error-message` | Set when the element has an error message | :host
 *
 * ### Internal components
 *
 * The following components are created by `<vaadin-date-time-picker>` and placed in light DOM:
 *
 * - [`<vaadin-date-picker>`](#/elements/vaadin-date-picker).
 * - [`<vaadin-time-picker>`](#/elements/vaadin-time-picker).
 *
 * Note: the `theme` attribute value set on `<vaadin-date-time-picker>` is
 * propagated to these components.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 * @fires {CustomEvent} validated - Fired whenever the field is validated.
 *
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 * @mixes FocusMixin
 * @mixes DisabledMixin
 * @mixes FieldMixin
 */
class DateTimePicker extends FieldMixin(DisabledMixin(FocusMixin(ThemableMixin(ElementMixin(PolymerElement))))) {
  static get template() {
    return html`
      <style>
        .vaadin-date-time-picker-container {
          --vaadin-field-default-width: auto;
        }

        .slots {
          display: flex;
          --vaadin-field-default-width: 12em;
        }

        .slots ::slotted([slot='date-picker']) {
          min-width: 0;
          flex: 1 1 auto;
        }

        .slots ::slotted([slot='time-picker']) {
          min-width: 0;
          flex: 1 1.65 auto;
        }
      </style>

      <div class="vaadin-date-time-picker-container">
        <div part="label" on-click="focus">
          <slot name="label"></slot>
          <span part="required-indicator" aria-hidden="true"></span>
        </div>

        <div class="slots">
          <slot name="date-picker" id="dateSlot"></slot>
          <slot name="time-picker" id="timeSlot"></slot>
        </div>

        <div part="helper-text">
          <slot name="helper"></slot>
        </div>

        <div part="error-message">
          <slot name="error-message"></slot>
        </div>
      </div>

      <slot name="tooltip"></slot>
    `;
  }

  static get is() {
    return 'vaadin-date-time-picker';
  }

  static get properties() {
    return {
      /**
       * The name of the control, which is submitted with the form data.
       */
      name: {
        type: String,
      },

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
        observer: '__valueChanged',
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
        observer: '__minChanged',
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
        observer: '__maxChanged',
      },

      /**
       * The earliest value that can be selected. All earlier values will be disabled.
       * @private
       */
      __minDateTime: {
        type: Date,
        value: '',
      },

      /**
       * The latest value that can be selected. All later values will be disabled.
       * @private
       */
      __maxDateTime: {
        type: Date,
        value: '',
      },

      /**
       * A placeholder string for the date field.
       * @attr {string} date-placeholder
       */
      datePlaceholder: {
        type: String,
      },

      /**
       * A placeholder string for the time field.
       * @attr {string} time-placeholder
       */
      timePlaceholder: {
        type: String,
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
        type: Number,
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
        type: Boolean,
      },

      /**
       * Set to true to prevent the overlays from opening automatically.
       * @attr {boolean} auto-open-disabled
       */
      autoOpenDisabled: Boolean,

      /**
       * Set to true to make this element read-only.
       * @type {boolean}
       */
      readonly: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },

      /**
       * Specify that this control should have input focus when the page loads.
       * @type {boolean}
       */
      autofocus: {
        type: Boolean,
      },

      /**
       * The current selected date time.
       * @private
       */
      __selectedDateTime: {
        type: Date,
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
        value: () => ({ ...datePickerI18nDefaults, ...timePickerI18nDefaults }),
      },

      /**
       * A space-delimited list of CSS class names to set on the overlay elements
       * of the internal components controlled by the `<vaadin-date-time-picker>`:
       *
       * - [`<vaadin-date-picker>`](#/elements/vaadin-date-picker#property-overlayClass)
       * - [`<vaadin-time-picker>`](#/elements/vaadin-time-picker#property-overlayClass)
       *
       * @attr {string} overlay-class
       */
      overlayClass: {
        type: String,
      },

      /**
       * The current slotted date picker.
       * @private
       */
      __datePicker: {
        type: HTMLElement,
        observer: '__datePickerChanged',
      },

      /**
       * The current slotted time picker.
       * @private
       */
      __timePicker: {
        type: HTMLElement,
        observer: '__timePickerChanged',
      },
    };
  }

  static get observers() {
    return [
      '__selectedDateTimeChanged(__selectedDateTime)',
      '__datePlaceholderChanged(datePlaceholder, __datePicker)',
      '__timePlaceholderChanged(timePlaceholder, __timePicker)',
      '__stepChanged(step, __timePicker)',
      '__initialPositionChanged(initialPosition, __datePicker)',
      '__showWeekNumbersChanged(showWeekNumbers, __datePicker)',
      '__requiredChanged(required, __datePicker, __timePicker)',
      '__invalidChanged(invalid, __datePicker, __timePicker)',
      '__disabledChanged(disabled, __datePicker, __timePicker)',
      '__readonlyChanged(readonly, __datePicker, __timePicker)',
      '__i18nChanged(i18n, __datePicker, __timePicker)',
      '__autoOpenDisabledChanged(autoOpenDisabled, __datePicker, __timePicker)',
      '__themeChanged(_theme, __datePicker, __timePicker)',
      '__overlayClassChanged(overlayClass, __datePicker, __timePicker)',
      '__pickersChanged(__datePicker, __timePicker)',
      '__labelOrAccessibleNameChanged(label, accessibleName, i18n, __datePicker, __timePicker)',
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

    this.__changeEventHandler = this.__changeEventHandler.bind(this);
    this.__valueChangedEventHandler = this.__valueChangedEventHandler.bind(this);
  }

  /** @private */
  get __inputs() {
    return [this.__datePicker, this.__timePicker];
  }

  /** @private */
  get __formattedValue() {
    const [dateValue, timeValue] = this.__inputs.map((picker) => picker.value);
    if (dateValue && timeValue) {
      return [dateValue, timeValue].join('T');
    }
    return '';
  }

  /** @protected */
  ready() {
    super.ready();

    this._datePickerController = new PickerSlotController(this, 'date');
    this.addController(this._datePickerController);

    this._timePickerController = new PickerSlotController(this, 'time');
    this.addController(this._timePickerController);

    if (this.autofocus && !this.disabled) {
      window.requestAnimationFrame(() => this.focus());
    }

    this.setAttribute('role', 'group');

    this._tooltipController = new TooltipController(this);
    this.addController(this._tooltipController);
    this._tooltipController.setPosition('top');
    this._tooltipController.setShouldShow((target) => {
      return target.__datePicker && !target.__datePicker.opened && target.__timePicker && !target.__timePicker.opened;
    });

    this.ariaTarget = this;
  }

  focus() {
    this.__datePicker.focus();
  }

  /**
   * Override method inherited from `FocusMixin` to validate on blur.
   * @param {boolean} focused
   * @protected
   * @override
   */
  _setFocused(focused) {
    super._setFocused(focused);

    // Do not validate when focusout is caused by document
    // losing focus, which happens on browser tab switch.
    if (!focused && document.hasFocus()) {
      this.validate();
    }
  }

  /**
   * Override method inherited from `FocusMixin` to not remove focused
   * state when focus moves between pickers or to the overlay.
   * @param {FocusEvent} event
   * @return {boolean}
   * @protected
   * @override
   */
  _shouldRemoveFocus(event) {
    const target = event.relatedTarget;
    const overlayContent = this.__datePicker._overlayContent;

    if (
      this.__datePicker.contains(target) ||
      this.__timePicker.contains(target) ||
      (overlayContent && overlayContent.contains(target))
    ) {
      return false;
    }

    return true;
  }

  /** @private */
  __syncI18n(target, source, props = Object.keys(source.i18n)) {
    props.forEach((prop) => {
      // eslint-disable-next-line no-prototype-builtins
      if (source.i18n && source.i18n.hasOwnProperty(prop)) {
        target.set(`i18n.${prop}`, source.i18n[prop]);
      }
    });
  }

  /** @private */
  __changeEventHandler(event) {
    event.stopPropagation();

    if (this.__dispatchChangeForValue === this.value) {
      this.__dispatchChange();
      this.validate();
    }
    this.__dispatchChangeForValue = undefined;
  }

  /** @private */
  __addInputListeners(node) {
    node.addEventListener('change', this.__changeEventHandler);
    node.addEventListener('value-changed', this.__valueChangedEventHandler);
  }

  /** @private */
  __removeInputListeners(node) {
    node.removeEventListener('change', this.__changeEventHandler);
    node.removeEventListener('value-changed', this.__valueChangedEventHandler);
  }

  /** @private */
  __isDefaultPicker(picker, type) {
    const controller = this[`_${type}PickerController`];
    return controller && picker === controller.defaultNode;
  }

  /** @private */
  __datePickerChanged(newDatePicker, existingDatePicker) {
    if (!newDatePicker) {
      return;
    }
    if (existingDatePicker) {
      // Remove an existing date picker
      this.__removeInputListeners(existingDatePicker);
      existingDatePicker.remove();
    }

    this.__addInputListeners(newDatePicker);

    if (this.__isDefaultPicker(newDatePicker, 'date')) {
      // Synchronize properties to default date picker
      newDatePicker.placeholder = this.datePlaceholder;
      newDatePicker.invalid = this.invalid;
      newDatePicker.initialPosition = this.initialPosition;
      newDatePicker.showWeekNumbers = this.showWeekNumbers;
      this.__syncI18n(newDatePicker, this, datePickerI18nProps);
    } else {
      // Synchronize properties from slotted date picker
      this.datePlaceholder = newDatePicker.placeholder;
      this.initialPosition = newDatePicker.initialPosition;
      this.showWeekNumbers = newDatePicker.showWeekNumbers;
      this.__syncI18n(this, newDatePicker, datePickerI18nProps);
    }

    // Min and max are always synchronized from date time picker (host) to inner fields because time picker
    // min and max need to be dynamically set depending on currently selected date instead of simple propagation
    newDatePicker.min = this.__formatDateISO(this.__minDateTime, this.__defaultDateMinMaxValue);
    newDatePicker.max = this.__formatDateISO(this.__maxDateTime, this.__defaultDateMinMaxValue);

    // Disable default internal validation for the component
    newDatePicker.validate = () => {};
    newDatePicker._validateInput = () => {};
  }

  /** @private */
  __timePickerChanged(newTimePicker, existingTimePicker) {
    if (!newTimePicker) {
      return;
    }
    if (existingTimePicker) {
      // Remove an existing time picker
      this.__removeInputListeners(existingTimePicker);
      existingTimePicker.remove();
    }

    this.__addInputListeners(newTimePicker);

    if (this.__isDefaultPicker(newTimePicker, 'time')) {
      // Synchronize properties to default time picker
      newTimePicker.placeholder = this.timePlaceholder;
      newTimePicker.step = this.step;
      newTimePicker.invalid = this.invalid;
      this.__syncI18n(newTimePicker, this, timePickerI18nProps);
    } else {
      // Synchronize properties from slotted time picker
      this.timePlaceholder = newTimePicker.placeholder;
      this.step = newTimePicker.step;
      this.__syncI18n(this, newTimePicker, timePickerI18nProps);
    }

    // Min and max are always synchronized from parent to slotted because time picker min and max
    // need to be dynamically set depending on currently selected date instead of simple propagation
    this.__updateTimePickerMinMax();

    // Disable default internal validation for the component
    newTimePicker.validate = () => {};
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
  __i18nChanged(i18n, datePicker, timePicker) {
    if (datePicker) {
      datePicker.i18n = { ...datePicker.i18n, ...i18n };
    }

    if (timePicker) {
      timePicker.i18n = { ...timePicker.i18n, ...i18n };
    }
  }

  /** @private */
  __labelOrAccessibleNameChanged(label, accessibleName, i18n, datePicker, timePicker) {
    const name = accessibleName || label || '';

    if (datePicker) {
      datePicker.accessibleName = `${name} ${i18n.dateLabel || ''}`.trim();
    }

    if (timePicker) {
      timePicker.accessibleName = `${name} ${i18n.timeLabel || ''}`.trim();
    }
  }

  /** @private */
  __datePlaceholderChanged(datePlaceholder, datePicker) {
    if (datePicker) {
      datePicker.placeholder = datePlaceholder;
    }
  }

  /** @private */
  __timePlaceholderChanged(timePlaceholder, timePicker) {
    if (timePicker) {
      timePicker.placeholder = timePlaceholder;
    }
  }

  /** @private */
  __stepChanged(step, timePicker) {
    if (timePicker && timePicker.step !== step) {
      timePicker.step = step;
    }
  }

  /** @private */
  __initialPositionChanged(initialPosition, datePicker) {
    if (datePicker) {
      datePicker.initialPosition = initialPosition;
    }
  }

  /** @private */
  __showWeekNumbersChanged(showWeekNumbers, datePicker) {
    if (datePicker) {
      datePicker.showWeekNumbers = showWeekNumbers;
    }
  }

  /** @private */
  __invalidChanged(invalid, datePicker, timePicker) {
    if (datePicker) {
      datePicker.invalid = invalid;
    }
    if (timePicker) {
      timePicker.invalid = invalid;
    }
  }

  /** @private */
  __requiredChanged(required, datePicker, timePicker) {
    if (datePicker) {
      datePicker.required = required;
    }
    if (timePicker) {
      timePicker.required = required;
    }
  }

  /** @private */
  __disabledChanged(disabled, datePicker, timePicker) {
    if (datePicker) {
      datePicker.disabled = disabled;
    }
    if (timePicker) {
      timePicker.disabled = disabled;
    }
  }

  /** @private */
  __readonlyChanged(readonly, datePicker, timePicker) {
    if (datePicker) {
      datePicker.readonly = readonly;
    }
    if (timePicker) {
      timePicker.readonly = readonly;
    }
  }

  /**
   * String (ISO date) to Date object
   * @param {string} str e.g. 'yyyy-mm-dd'
   * @return {Date | undefined}
   * @private
   */
  __parseDate(str) {
    return parseDate(str);
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
    return DatePicker.prototype._formatISO(date);
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
    /* c8 ignore next 3 */
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
        milliseconds: date.getMilliseconds(),
      }),
    );
  }

  /**
   * @param {!TimePickerTime} timeObject
   * @return {!TimePickerTime}
   * @private
   */
  __validateTime(timeObject) {
    if (timeObject) {
      const stepSegment = this.__getStepSegment();
      timeObject.seconds = stepSegment < 3 ? undefined : timeObject.seconds;
      timeObject.milliseconds = stepSegment < 4 ? undefined : timeObject.milliseconds;
    }
    return timeObject;
  }

  /**
   * Returns true if the current input value satisfies all constraints (if any)
   *
   * You can override the `checkValidity` method for custom validations.
   * @return {boolean}
   */
  checkValidity() {
    const hasInvalidFields = this.__inputs.some((input) => !input.checkValidity());
    const hasEmptyFields = this.required && this.__inputs.some((el) => !el.value);

    if (hasInvalidFields || hasEmptyFields) {
      return false;
    }
    return true;
  }

  // Copied from vaadin-time-picker
  /** @private */
  __getStepSegment() {
    const step = this.step == null ? 60 : parseFloat(this.step);
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

    if (oldValue !== undefined) {
      this.__dispatchChangeForValue = value;
    }

    this.toggleAttribute('has-value', !!value);
    this.__updateTimePickerMinMax();
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

    if (this.__datePicker && this.__timePicker && this.value) {
      this.validate();
    }
  }

  /** @private */
  __maxChanged(value, oldValue) {
    this.__handleDateTimeChange('max', '__maxDateTime', value, oldValue);
    if (this.__datePicker) {
      this.__datePicker.max = this.__formatDateISO(this.__maxDateTime, this.__defaultDateMinMaxValue);
    }
    this.__updateTimePickerMinMax();

    if (this.__datePicker && this.__timePicker && this.value) {
      this.validate();
    }
  }

  /** @private */
  __selectedDateTimeChanged(selectedDateTime) {
    const formattedValue = this.__formatDateTime(selectedDateTime);
    if (this.value !== formattedValue) {
      this.value = formattedValue;
    }

    // Setting the date/time picker value below triggers validation of the components.
    // If the inputs are slotted (e.g. when using the Java API) and have an initial value this can
    // happen before date picker ready() which would throw an error when date picker is trying to read
    // `this.$.input` (as a result of value change triggered by setting the value).
    // Workaround the problem by setting custom field value only if date picker is ready.
    const isDatePickerReady = Boolean(this.__datePicker && this.__datePicker.$);
    if (isDatePickerReady && !this.__ignoreInputValueChange) {
      // Ignore value changes until both inputs have a value updated
      // TODO: This logic clears both fields if one of them is cleared :(
      this.__ignoreInputValueChange = true;
      const [dateValue, timeValue] = this.value.split('T');
      this.__datePicker.value = dateValue || '';
      this.__timePicker.value = timeValue || '';
      this.__ignoreInputValueChange = false;
    }
  }

  /** @private */
  __valueChangedEventHandler() {
    if (this.__ignoreInputValueChange) {
      return;
    }

    const value = this.__formattedValue;

    const [date, time] = value.split('T');

    this.__ignoreInputValueChange = true;
    this.__updateTimePickerMinMax();

    if (date && time) {
      if (value !== this.value) {
        this.value = value;
      }
    } else {
      this.value = '';
    }

    this.__ignoreInputValueChange = false;
  }

  /** @private */
  __autoOpenDisabledChanged(autoOpenDisabled, datePicker, timePicker) {
    if (datePicker) {
      datePicker.autoOpenDisabled = autoOpenDisabled;
    }
    if (timePicker) {
      timePicker.autoOpenDisabled = autoOpenDisabled;
    }
  }

  /** @private */
  __themeChanged(theme, datePicker, timePicker) {
    if (!datePicker || !timePicker) {
      // Both pickers are not ready yet
      return;
    }

    [datePicker, timePicker].forEach((picker) => {
      if (theme) {
        picker.setAttribute('theme', theme);
      } else {
        picker.removeAttribute('theme');
      }
    });
  }

  /** @private */
  __overlayClassChanged(overlayClass, datePicker, timePicker) {
    if (!datePicker || !timePicker) {
      // Both pickers are not ready yet
      return;
    }

    datePicker.overlayClass = overlayClass;
    timePicker.overlayClass = overlayClass;
  }

  /** @private */
  __pickersChanged(datePicker, timePicker) {
    if (!datePicker || !timePicker) {
      // Both pickers are not ready yet
      return;
    }

    if (this.__isDefaultPicker(datePicker, 'date') !== this.__isDefaultPicker(timePicker, 'time')) {
      // Both pickers are not replaced yet
      return;
    }

    if (datePicker.value) {
      // The new pickers have a value, update the component value
      this.__valueChangedEventHandler();
    } else if (this.value) {
      // The component has a value, update the new pickers values
      this.__selectedDateTimeChanged(this.__selectedDateTime);

      if (this.min || this.max) {
        this.validate();
      }
    }
  }

  /**
   * Fired when the user commits a value change.
   *
   * @event change
   */
}

customElements.define(DateTimePicker.is, DateTimePicker);

export { DateTimePicker };
