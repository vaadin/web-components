import { DatePickerI18n } from '@vaadin/vaadin-date-picker';
import { TimePickerI18n } from '@vaadin/vaadin-time-picker';

export interface DateTimePickerI18n extends DatePickerI18n, TimePickerI18n {}

/**
 * Fired when the `invalid` property changes.
 */
export type DateTimePickerInvalidChanged = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `value` property changes.
 */
export type DateTimePickerValueChanged = CustomEvent<{ value: string }>;

export interface DateTimePickerElementEventMap {
  'invalid-changed': DateTimePickerInvalidChanged;

  'value-changed': DateTimePickerValueChanged;
}

export interface DateTimePickerEventMap extends DateTimePickerElementEventMap, HTMLElementEventMap {}
