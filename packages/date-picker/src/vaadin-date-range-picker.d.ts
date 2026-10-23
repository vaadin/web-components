/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { DatePickerDate, DatePickerI18n } from './vaadin-date-picker.js';

export interface DateRangePickerI18n extends DatePickerI18n {
  startAccessibleName: string;
  endAccessibleName: string;
  rangeAccessibleName: string;
  rangeStart: string;
  rangeEnd: string;
  inRange: string;
}

/**
 * Fired when the user commits a range change.
 */
export type DateRangePickerChangeEvent = Event & {
  target: DateRangePicker;
};

/**
 * Fired when the `startValue` property changes.
 */
export type DateRangePickerStartValueChangedEvent = CustomEvent<{ value: string }>;

/**
 * Fired when the `endValue` property changes.
 */
export type DateRangePickerEndValueChangedEvent = CustomEvent<{ value: string }>;

/**
 * Fired when the `opened` property changes.
 */
export type DateRangePickerOpenedChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the `invalid` property changes.
 */
export type DateRangePickerInvalidChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired whenever the field is validated.
 */
export type DateRangePickerValidatedEvent = CustomEvent<{ valid: boolean }>;

export interface DateRangePickerCustomEventMap {
  'start-value-changed': DateRangePickerStartValueChangedEvent;

  'end-value-changed': DateRangePickerEndValueChangedEvent;

  'opened-changed': DateRangePickerOpenedChangedEvent;

  'invalid-changed': DateRangePickerInvalidChangedEvent;

  validated: DateRangePickerValidatedEvent;
}

export interface DateRangePickerEventMap extends HTMLElementEventMap, DateRangePickerCustomEventMap {
  change: DateRangePickerChangeEvent;
}

/**
 * `<vaadin-date-range-picker>` is an input field that allows to enter a date range
 * by typing into a start and an end input, or by picking both dates from a single
 * calendar overlay.
 *
 * **Prototype.** This component is an experimental prototype for gathering design
 * feedback. Its API and behavior are not final.
 *
 * @fires {Event} change - Fired when the user commits a range change.
 * @fires {CustomEvent} start-value-changed - Fired when the `startValue` property changes.
 * @fires {CustomEvent} end-value-changed - Fired when the `endValue` property changes.
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} validated - Fired whenever the field is validated.
 */
declare class DateRangePicker extends ThemableMixin(ElementMixin(HTMLElement)) {
  startValue: string;
  endValue: string;
  min: string | undefined;
  max: string | undefined;
  isDateDisabled: ((date: DatePickerDate) => boolean) | undefined;
  startPlaceholder: string | undefined;
  endPlaceholder: string | undefined;
  clearButtonVisible: boolean;
  readonly: boolean;
  disabled: boolean;
  required: boolean;
  invalid: boolean;
  label: string | null | undefined;
  helperText: string | null | undefined;
  errorMessage: string | null | undefined;
  showWeekNumbers: boolean;
  separateDatePicking: boolean;
  singleInput: boolean;
  opened: boolean;
  i18n: Partial<DateRangePickerI18n>;
  open(): void;
  close(): void;
  validate(): boolean;
  checkValidity(): boolean;

  addEventListener<K extends keyof DateRangePickerEventMap>(
    type: K,
    listener: (this: DateRangePicker, ev: DateRangePickerEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof DateRangePickerEventMap>(
    type: K,
    listener: (this: DateRangePicker, ev: DateRangePickerEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-date-range-picker': DateRangePicker;
  }
}

export { DateRangePicker };
