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
export type TimePickerInvalidChanged = CustomEvent<{ value: boolean; path: 'invalid' }>;

/**
 * Fired when the `value` property changes.
 */
export type TimePickerValueChanged = CustomEvent<{ value: string; path: 'value' }>;

export interface TimePickerElementEventMap {
  'invalid-changed': TimePickerInvalidChanged;

  'value-changed': TimePickerValueChanged;
}

export interface TimePickerEventMap extends HTMLElementEventMap, TimePickerElementEventMap {}
