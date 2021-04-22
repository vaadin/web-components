export interface TimePickerTime {
  hours: string | number;
  minutes: string | number;
  seconds?: string | number;
  milliseconds?: string | number;
}

export interface TimePickerI18n {
  parseTime: (time: string) => TimePickerTime | undefined;
  formatTime: (time: TimePickerTime) => string;
  clear: string;
  selector: string;
}

/**
 * Fired when the `invalid` property changes.
 */
export type TimePickerInvalidChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `value` property changes.
 */
export type TimePickerValueChangedEvent = CustomEvent<{ value: string }>;

export interface TimePickerElementEventMap {
  'invalid-changed': TimePickerInvalidChangedEvent;

  'value-changed': TimePickerValueChangedEvent;
}

export interface TimePickerEventMap extends HTMLElementEventMap, TimePickerElementEventMap {}
