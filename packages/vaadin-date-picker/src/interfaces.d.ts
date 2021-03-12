export interface DatePickerDate {
  day: number;
  month: number;
  year: number;
}

export interface DatePickerI18n {
  monthNames: string[];
  weekdays: string[];
  weekdaysShort: string[];
  firstDayOfWeek: number;
  week: string;
  calendar: string;
  clear: string;
  today: string;
  cancel: string;
  parseDate: (date: string) => DatePickerDate | undefined;
  formatDate: (date: DatePickerDate) => string;
  formatTitle: (monthName: string, fullYear: number) => string;
}

/**
 * Fired when the `opened` property changes.
 */
export type DatePickerOpenedChanged = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `invalid` property changes.
 */
export type DatePickerInvalidChanged = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `value` property changes.
 */
export type DatePickerValueChanged = CustomEvent<{ value: string }>;

export interface DatePickerElementEventMap {
  'opened-changed': DatePickerOpenedChanged;


  'invalid-changed': DatePickerInvalidChanged;

  'value-changed': DatePickerValueChanged;
}

export interface DatePickerEventMap extends HTMLElementEventMap, DatePickerElementEventMap {}
