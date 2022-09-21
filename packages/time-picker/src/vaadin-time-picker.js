/**
 * @license
 * Copyright (c) 2018 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/input-container/src/vaadin-input-container.js';
import './vaadin-time-picker-combo-box.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
import { InputControlMixin } from '@vaadin/field-base/src/input-control-mixin.js';
import { InputController } from '@vaadin/field-base/src/input-controller.js';
import { LabelledInputController } from '@vaadin/field-base/src/labelled-input-controller.js';
import { PatternMixin } from '@vaadin/field-base/src/pattern-mixin.js';
import { inputFieldShared } from '@vaadin/field-base/src/styles/input-field-shared-styles.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const MIN_ALLOWED_TIME = '00:00:00.000';
const MAX_ALLOWED_TIME = '23:59:59.999';

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
 * The following custom properties are available for styling:
 *
 * Custom property                         | Description                | Default
 * ----------------------------------------|----------------------------|---------
 * `--vaadin-field-default-width`          | Default width of the field | `12em`
 * `--vaadin-combo-box-overlay-max-height` | Max height of the overlay  | `65vh`
 *
 * `<vaadin-time-picker>` provides the same set of shadow DOM parts and state attributes as `<vaadin-text-field>`.
 * See [`<vaadin-text-field>`](#/elements/vaadin-text-field) for the styling documentation.
 *
 * In addition to `<vaadin-text-field>` parts, the following parts are available for theming:
 *
 * Part name       | Description
 * ----------------|----------------
 * `toggle-button` | The toggle button
 *
 * In addition to `<vaadin-text-field>` state attributes, the following state attributes are available for theming:
 *
 * Attribute | Description
 * ----------|------------------------------------------
 * `opened`  | Set when the time-picker dropdown is open
 *
 * ### Internal components
 *
 * In addition to `<vaadin-time-picker>` itself, the following internal
 * components are themable:
 *
 * - `<vaadin-time-picker-combo-box>` - has the same API as [`<vaadin-combo-box-light>`](#/elements/vaadin-combo-box-light).
 * - `<vaadin-time-picker-overlay>` - has the same API as [`<vaadin-overlay>`](#/elements/vaadin-overlay).
 * - `<vaadin-time-picker-item>` - has the same API as [`<vaadin-item>`](#/elements/vaadin-item).
 * - [`<vaadin-input-container>`](#/elements/vaadin-input-container) - an internal element wrapping the input.
 *
 * Note: the `theme` attribute value set on `<vaadin-time-picker>` is
 * propagated to the internal components listed above.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/custom-theme/styling-components) documentation.
 *
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 * @fires {CustomEvent} validated - Fired whenever the field is validated.
 *
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 * @mixes InputControlMixin
 * @mixes PatternMixin
 */
class TimePicker extends PatternMixin(InputControlMixin(ThemableMixin(ElementMixin(PolymerElement)))) {
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

      <div class="vaadin-time-picker-container">
        <div part="label">
          <slot name="label"></slot>
          <span part="required-indicator" aria-hidden="true" on-click="focus"></span>
        </div>

        <vaadin-time-picker-combo-box
          id="comboBox"
          filtered-items="[[__dropdownItems]]"
          value="{{_comboBoxValue}}"
          opened="{{opened}}"
          disabled="[[disabled]]"
          readonly="[[readonly]]"
          clear-button-visible="[[clearButtonVisible]]"
          auto-open-disabled="[[autoOpenDisabled]]"
          position-target="[[_inputContainer]]"
          theme$="[[_theme]]"
          on-change="__onComboBoxChange"
        >
          <vaadin-input-container
            part="input-field"
            readonly="[[readonly]]"
            disabled="[[disabled]]"
            invalid="[[invalid]]"
            theme$="[[_theme]]"
          >
            <slot name="prefix" slot="prefix"></slot>
            <slot name="input"></slot>
            <div id="clearButton" part="clear-button" slot="suffix" aria-hidden="true"></div>
            <div id="toggleButton" class="toggle-button" part="toggle-button" slot="suffix" aria-hidden="true"></div>
          </vaadin-input-container>
        </vaadin-time-picker-combo-box>

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
        value: '',
      },

      /**
       * True if the dropdown is open, false otherwise.
       */
      opened: {
        type: Boolean,
        notify: true,
        value: false,
        reflectToAttribute: true,
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
        value: '',
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
        value: '',
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
      },

      /**
       * Set true to prevent the overlay from opening automatically.
       * @attr {boolean} auto-open-disabled
       */
      autoOpenDisabled: Boolean,

      /** @private */
      __dropdownItems: {
        type: Array,
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
              if (time.seconds !== undefined) {
                timeString += `:${pad(time.seconds)}`;
              }
              if (time.milliseconds !== undefined) {
                timeString += `.${pad(time.milliseconds, '000')}`;
              }
              return timeString;
            },
            parseTime: (text) => {
              // Parsing with RegExp to ensure correct format
              const MATCH_HOURS = '(\\d|[0-1]\\d|2[0-3])';
              const MATCH_MINUTES = '(\\d|[0-5]\\d)';
              const MATCH_SECONDS = MATCH_MINUTES;
              const MATCH_MILLISECONDS = '(\\d{1,3})';
              const re = new RegExp(
                `^${MATCH_HOURS}(?::${MATCH_MINUTES}(?::${MATCH_SECONDS}(?:\\.${MATCH_MILLISECONDS})?)?)?$`,
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
          };
        },
      },

      /** @private */
      _comboBoxValue: {
        type: String,
        observer: '__comboBoxValueChanged',
      },

      /** @private */
      _inputContainer: Object,
    };
  }

  static get observers() {
    return ['__updateDropdownItems(i18n.*, min, max, step)'];
  }

  static get constraints() {
    return [...super.constraints, 'min', 'max'];
  }

  /**
   * Used by `InputControlMixin` as a reference to the clear button element.
   * @protected
   * @return {!HTMLElement}
   */
  get clearElement() {
    return this.$.clearButton;
  }

  /** @protected */
  ready() {
    super.ready();

    this.addController(
      new InputController(this, (input) => {
        this._setInputElement(input);
        this._setFocusElement(input);
        this.stateTarget = input;
        this.ariaTarget = input;
      }),
    );
    this.addController(new LabelledInputController(this.inputElement, this._labelController));
    this._inputContainer = this.shadowRoot.querySelector('[part~="input-field"]');

    this._tooltipController = new TooltipController(this);
    this._tooltipController.setShouldShow((timePicker) => !timePicker.opened);
    this._tooltipController.setPosition('top');
    this.addController(this._tooltipController);
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
   * Opens the dropdown list.
   */
  open() {
    if (!this.disabled && !this.readonly) {
      this.opened = true;
    }
  }

  /**
   * Closes the dropdown list.
   */
  close() {
    this.opened = false;
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

  /**
   * Override an event listener from `KeyboardMixin`.
   * Do not call `super` in order to override clear
   * button logic defined in `InputControlMixin`.
   * @param {Event} event
   * @protected
   */
  _onEscape() {
    // Do nothing, the internal combo-box handles Escape.
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

    const hh = Math.floor(msec / 1000 / 60 / 60);
    msec -= hh * 1000 * 60 * 60;
    const mm = Math.floor(msec / 1000 / 60);
    msec -= mm * 1000 * 60;
    const ss = Math.floor(msec / 1000);
    msec -= ss * 1000;

    return { hours: hh < 24 ? hh : 0, minutes: mm, seconds: ss, milliseconds: msec };
  }

  /** @private */
  __updateDropdownItems(i8n, min, max, step) {
    const minTimeObj = this.__validateTime(this.__parseISO(min || MIN_ALLOWED_TIME));
    const minSec = this.__getSec(minTimeObj);

    const maxTimeObj = this.__validateTime(this.__parseISO(max || MAX_ALLOWED_TIME));
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

    if (value !== '' && value !== null && !parsedObj) {
      // Value can not be parsed, reset to the old one.
      this.value = oldValue === undefined ? '' : oldValue;
    } else if (value !== newValue) {
      // Value can be parsed (e.g. 12 -> 12:00), adjust.
      this.value = newValue;
    } else if (this.__keepInvalidInput) {
      // User input could not be parsed and was reset
      // to empty string, do not update input value.
      delete this.__keepInvalidInput;
    } else {
      this.__updateInputValue(parsedObj);
    }

    this._toggleHasValue(this._hasValue);
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
      // If user input can not be parsed, keep it.
      if (value !== '') {
        this.__keepInvalidInput = true;
      }

      this.value = '';
    }
  }

  /** @private */
  __onComboBoxChange(event) {
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
    const parsedMin = this.i18n.parseTime(this.min || MIN_ALLOWED_TIME);
    const parsedMax = this.i18n.parseTime(this.max || MAX_ALLOWED_TIME);

    return (
      (!this.__getMsec(parsedMin) || this.__getMsec(time) >= this.__getMsec(parsedMin)) &&
      (!this.__getMsec(parsedMax) || this.__getMsec(time) <= this.__getMsec(parsedMax))
    );
  }

  /**
   * Override method inherited from `InputControlMixin`.
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
