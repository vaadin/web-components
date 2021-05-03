import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';

import { ControlStateMixin } from '@vaadin/vaadin-control-state-mixin/vaadin-control-state-mixin.js';

import { TimePickerEventMap, TimePickerI18n, TimePickerTime } from './interfaces';

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
 */
declare class TimePickerElement extends ElementMixin(ControlStateMixin(ThemableMixin(HTMLElement))) {
  /**
   * Focusable element used by vaadin-control-state-mixin
   */
  readonly focusElement: HTMLElement;

  /**
   * Set to true to disable this input.
   */
  disabled: boolean;

  /**
   * The name of this element.
   */
  name: string | null | undefined;

  /**
   * The time value for this element.
   *
   * Supported time formats are in ISO 8601:
   * - `hh:mm` (default)
   * - `hh:mm:ss`
   * - `hh:mm:ss.fff`
   */
  value: string;

  /**
   * The label for this element.
   */
  label: string | null | undefined;

  /**
   * Set to true to mark the input as required.
   */
  required: boolean;

  /**
   * Set to true to prevent the user from entering invalid input.
   * @attr {boolean} prevent-invalid-input
   */
  preventInvalidInput: boolean | null | undefined;

  /**
   * A pattern to validate the `input` with.
   */
  pattern: string | null | undefined;

  /**
   * The error message to display when the input is invalid.
   * @attr {string} error-message
   */
  errorMessage: string | null | undefined;

  /**
   * String used for the helper text.
   * @attr {string} helper-text
   */
  helperText: string | null | undefined;

  /**
   * A placeholder string in addition to the label.
   */
  placeholder: string;

  /**
   * Set to true to prevent user picking a date or typing in the input.
   */
  readonly: boolean;

  /**
   * Set to true if the value is invalid.
   */
  invalid: boolean;

  /**
   * Minimum time allowed.
   *
   * Supported time formats are in ISO 8601:
   * - `hh:mm`
   * - `hh:mm:ss`
   * - `hh:mm:ss.fff`
   */
  min: string;

  /**
   * Maximum time allowed.
   *
   * Supported time formats are in ISO 8601:
   * - `hh:mm`
   * - `hh:mm:ss`
   * - `hh:mm:ss.fff`
   */
  max: string;

  /**
   * Specifies the number of valid intervals in a day used for
   * configuring the items displayed in the selection box.
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
  step: number | null | undefined;

  /**
   * Set to true to display the clear icon which clears the input.
   * @attr {boolean} clear-button-visible
   */
  clearButtonVisible: boolean;

  /**
   * Set true to prevent the overlay from opening automatically.
   * @attr {boolean} auto-open-disabled
   */
  autoOpenDisabled: boolean | null | undefined;

  /**
   * The object used to localize this component.
   * To change the default localization, replace the entire
   * _i18n_ object or just the property you want to modify.
   *
   * The object has the following JSON structure:
   *
   *           {
   *             // A function to format given `Object` as
   *             // time string. Object is in the format `{ hours: ..., minutes: ..., seconds: ..., milliseconds: ... }`
   *             formatTime: (time) => {
   *               // returns a string representation of the given
   *               // object in `hh` / 'hh:mm' / 'hh:mm:ss' / 'hh:mm:ss.fff' - formats
   *             },
   *
   *             // A function to parse the given text to an `Object` in the format
   *             // `{ hours: ..., minutes: ..., seconds: ..., milliseconds: ... }`.
   *             // Must properly parse (at least) text
   *             // formatted by `formatTime`.
   *             parseTime: text => {
   *               // Parses a string in object/string that can be formatted by`formatTime`.
   *             }
   *
   *             // Translation of the time selector icon button title.
   *             selector: 'Time selector',
   *
   *             // Translation of the time selector clear button title.
   *             clear: 'Clear'
   *           }
   */
  i18n: TimePickerI18n;

  _getInputElement(): HTMLElement;

  /**
   * Returns true if `value` is valid, and sets the `invalid` flag appropriately.
   *
   * @returns True if the value is valid and sets the `invalid` flag appropriately
   */
  validate(): boolean;

  /**
   * Returns true if `time` satisfies the `min` and `max` constraints (if any).
   *
   * @param time Value to check against constraints
   * @returns True if `time` satisfies the constraints
   */
  _timeAllowed(time: TimePickerTime): boolean;

  /**
   * Returns true if the current input value satisfies all constraints (if any)
   *
   * You can override the `checkValidity` method for custom validations.
   *
   * @returns True if the value is valid
   */
  checkValidity(): boolean;

  addEventListener<K extends keyof TimePickerEventMap>(
    type: K,
    listener: (this: TimePickerElement, ev: TimePickerEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof TimePickerEventMap>(
    type: K,
    listener: (this: TimePickerElement, ev: TimePickerEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-time-picker': TimePickerElement;
  }
}

export { TimePickerElement };
