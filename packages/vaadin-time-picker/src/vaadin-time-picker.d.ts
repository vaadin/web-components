/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { InputControlMixin } from '@vaadin/field-base/src/input-control-mixin.js';
import { PatternMixin } from '@vaadin/field-base/src/pattern-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { TimePickerEventMap, TimePickerI18n } from './interfaces';

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
 */
declare class TimePicker extends PatternMixin(InputControlMixin(ThemableMixin(ElementMixin(HTMLElement)))) {
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
   */
  i18n: TimePickerI18n;

  /**
   * Returns true if `value` is valid, and sets the `invalid` flag appropriately.
   */
  validate(): boolean;

  /**
   * Returns true if the current input value satisfies all constraints (if any).
   * You can override this method for custom validations.
   */
  checkValidity(): boolean;

  addEventListener<K extends keyof TimePickerEventMap>(
    type: K,
    listener: (this: TimePicker, ev: TimePickerEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof TimePickerEventMap>(
    type: K,
    listener: (this: TimePicker, ev: TimePickerEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-time-picker': TimePicker;
  }
}

export { TimePicker };
