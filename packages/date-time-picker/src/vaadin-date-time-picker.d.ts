/**
 * @license
 * Copyright (c) 2019 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DisabledMixin } from '@vaadin/component-base/src/disabled-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { FocusMixin } from '@vaadin/component-base/src/focus-mixin.js';
import { SlotMixin } from '@vaadin/component-base/src/slot-mixin.js';
import { DatePickerI18n } from '@vaadin/date-picker/src/vaadin-date-picker.js';
import { FieldMixin } from '@vaadin/field-base/src/field-mixin.js';
import { TimePickerI18n } from '@vaadin/time-picker/src/vaadin-time-picker.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

export interface DateTimePickerI18n extends DatePickerI18n, TimePickerI18n {}

/**
 * Fired when the user commits a value change.
 */
export type DateTimePickerChangeEvent = Event & {
  target: DateTimePicker;
};

/**
 * Fired when the `invalid` property changes.
 */
export type DateTimePickerInvalidChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `value` property changes.
 */
export type DateTimePickerValueChangedEvent = CustomEvent<{ value: string }>;

export interface DateTimePickerCustomEventMap {
  'invalid-changed': DateTimePickerInvalidChangedEvent;

  'value-changed': DateTimePickerValueChangedEvent;
}

export interface DateTimePickerEventMap extends DateTimePickerCustomEventMap, HTMLElementEventMap {
  change: DateTimePickerChangeEvent;
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
 * In addition to `<vaadin-date-time-picker>` itself, the following internal
 * components are themable:
 *
 * - `<vaadin-date-time-picker-date-picker>` - has the same API as [`<vaadin-date-picker>`](#/elements/vaadin-date-picker).
 * - `<vaadin-date-time-picker-time-picker>` - has the same API as [`<vaadin-time-picker>`](#/elements/vaadin-time-picker).
 *
 * Note: the `theme` attribute value set on `<vaadin-date-time-picker>` is
 * propagated to the internal components listed above.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @fires {Event} change - Fired when the user commits a value change.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 */
declare class DateTimePicker extends FieldMixin(
  SlotMixin(DisabledMixin(FocusMixin(ThemableMixin(ElementMixin(HTMLElement))))),
) {
  /**
   * The name of the control, which is submitted with the form data.
   */
  name: string | null | undefined;

  /**
   * The value for this element.
   *
   * Supported date time format is based on ISO 8601 (without a time zone designator):
   * - Minute precision `"YYYY-MM-DDThh:mm"` (default)
   * - Second precision `"YYYY-MM-DDThh:mm:ss"`
   * - Millisecond precision `"YYYY-MM-DDThh:mm:ss.fff"`
   */
  value: string;

  /**
   * The earliest allowed value (date and time) that can be selected. All earlier values will be disabled.
   *
   * Supported date time format is based on ISO 8601 (without a time zone designator):
   * - Minute precision `"YYYY-MM-DDThh:mm"`
   * - Second precision `"YYYY-MM-DDThh:mm:ss"`
   * - Millisecond precision `"YYYY-MM-DDThh:mm:ss.fff"`
   */
  min: string | undefined;

  /**
   * The latest value (date and time) that can be selected. All later values will be disabled.
   *
   * Supported date time format is based on ISO 8601 (without a time zone designator):
   * - Minute precision `"YYYY-MM-DDThh:mm"`
   * - Second precision `"YYYY-MM-DDThh:mm:ss"`
   * - Millisecond precision `"YYYY-MM-DDThh:mm:ss.fff"`
   */
  max: string | undefined;

  /**
   * A placeholder string for the date field.
   * @attr {string} date-placeholder
   */
  datePlaceholder: string | null | undefined;

  /**
   * A placeholder string for the time field.
   * @attr {string} time-placeholder
   */
  timePlaceholder: string | null | undefined;

  /**
   * Specifies the number of valid intervals in a day used for
   * configuring the items displayed in the time selection box.
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
  step: number | null | undefined;

  /**
   * Date which should be visible in the date picker overlay when there is no value selected.
   *
   * The same date formats as for the `value` property are supported but without the time part.
   * @attr {string} initial-position
   */
  initialPosition: string | null | undefined;

  /**
   * Set true to display ISO-8601 week numbers in the calendar. Notice that
   * displaying week numbers is only supported when `i18n.firstDayOfWeek`
   * is 1 (Monday).
   * @attr {boolean} show-week-numbers
   */
  showWeekNumbers: boolean | null | undefined;

  /**
   * Set to true to prevent the overlays from opening automatically.
   * @attr {boolean} auto-open-disabled
   */
  autoOpenDisabled: boolean | null | undefined;

  /**
   * Set to true to make this element read-only.
   */
  readonly: boolean;

  /**
   * Specify that this control should have input focus when the page loads.
   */
  autofocus: boolean;

  /**
   * The object used to localize this component.
   * To change the default localization, replace the entire
   * `i18n` object or just the properties you want to modify.
   *
   * The object is a combination of the i18n properties supported by
   * [`<vaadin-date-picker>`](#/elements/vaadin-date-picker) and
   * [`<vaadin-time-picker>`](#/elements/vaadin-time-picker).
   */
  i18n: DateTimePickerI18n;

  addEventListener<K extends keyof DateTimePickerEventMap>(
    type: K,
    listener: (this: DateTimePicker, ev: DateTimePickerEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof DateTimePickerEventMap>(
    type: K,
    listener: (this: DateTimePicker, ev: DateTimePickerEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-date-time-picker': DateTimePicker;
  }
}

export { DateTimePicker };
