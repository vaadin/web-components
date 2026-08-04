/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { DelegateFocusMixinClass } from '@vaadin/a11y-base/src/delegate-focus-mixin.js';
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { KeyboardMixinClass } from '@vaadin/a11y-base/src/keyboard-mixin.js';
import type { I18nMixinClass } from '@vaadin/component-base/src/i18n-mixin.js';
import type { InputConstraintsMixinClass } from '@vaadin/field-base/src/input-constraints-mixin.js';
import type { InputMixinClass } from '@vaadin/field-base/src/input-mixin.js';

export interface DatePickerDate {
  day: number;
  month: number;
  year: number;
}

/**
 * A range of dates the provider is asked about. Always covers whole months: `start` is the first
 * day of a month and `end` the last day of a month, so a provider may group its query by month.
 */
export interface DatePickerDateRange {
  /**
   * The first date of the range (inclusive).
   */
  start: DatePickerDate;
  /**
   * The last date of the range (inclusive).
   */
  end: DatePickerDate;
}

/**
 * Metadata resolved on demand for a single date.
 */
export interface DatePickerDateMetadata extends DatePickerDate {
  /**
   * Whether the date cannot be selected.
   */
  disabled?: boolean;
  /**
   * Part names to add to the date, so a theme can style it with `::part()`. A single name, or
   * several separated by spaces. Do not use built-in names like `disabled` and `selected`.
   */
  part?: string;
}

/**
 * A function called with the range of dates the calendar is about to show, returning or resolving
 * with the metadata for the dates in that range.
 */
export type DatePickerDateMetadataProvider = (
  range: DatePickerDateRange,
) => DatePickerDateMetadata[] | Promise<DatePickerDateMetadata[] | null | undefined> | null | undefined;

export interface DatePickerI18n {
  /**
   * An array with the full names of months starting
   * with January.
   */
  monthNames?: string[];
  /**
   * An array of weekday names starting with Sunday. Used
   * in screen reader announcements.
   */
  weekdays?: string[];
  /**
   * An array of short weekday names starting with Sunday.
   * Displayed in the calendar.
   */
  weekdaysShort?: string[];
  /**
   * An integer indicating the first day of the week
   * (0 = Sunday, 1 = Monday, etc.).
   */
  firstDayOfWeek?: number;
  /**
   * Translation of the Today shortcut button text.
   */
  today?: string;
  /**
   * Translation of the Cancel button text.
   */
  cancel?: string;
  /**
   * Accessible name of the overlay content, announced by screen readers when
   * the overlay opens.
   */
  dialogAccessibleName?: string;
  /**
   * Used for adjusting the year value when parsing dates with short years.
   * The year values between 0 and 99 are evaluated and adjusted.
   * Example: for a referenceDate of 1970-10-30;
   *   dateToBeParsed: 40-10-30, result: 1940-10-30
   *   dateToBeParsed: 80-10-30, result: 1980-10-30
   *   dateToBeParsed: 10-10-30, result: 2010-10-30
   * Supported date format: ISO 8601 `"YYYY-MM-DD"` (default)
   * The default value is the current date.
   */
  referenceDate?: string;

  /**
   * A function to parse the given text to an `Object` in the format `{ day: ..., month: ..., year: ... }`.
   * Must properly parse (at least) text formatted by `formatDate`.
   * Setting the property to null will disable keyboard input feature.
   * Note: The argument month is 0-based. This means that January = 0 and December = 11.
   * @param date
   */
  parseDate?(date: string): DatePickerDate | undefined;

  /**
   * A function to format given `Object` as
   * date string. Object is in the format `{ day: ..., month: ..., year: ... }`
   * Note: The argument month is 0-based. This means that January = 0 and December = 11.
   * @param date
   */
  formatDate?(date: DatePickerDate): string;

  /**
   * A function to format given `monthName` and
   * `fullYear` integer as calendar title string.
   * @param monthName
   * @param fullYear
   */
  formatTitle?(monthName: string, fullYear: number): string;
}

export declare function DatePickerMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<DatePickerMixinClass> &
  Constructor<DelegateFocusMixinClass> &
  Constructor<DisabledMixinClass> &
  Constructor<FocusMixinClass> &
  Constructor<I18nMixinClass<DatePickerI18n>> &
  Constructor<InputConstraintsMixinClass> &
  Constructor<InputMixinClass> &
  Constructor<KeyboardMixinClass> &
  T;

export declare class DatePickerMixinClass {
  /**
   * Selected date.
   *
   * Supported date formats:
   * - ISO 8601 `"YYYY-MM-DD"` (default)
   * - 6-digit extended ISO 8601 `"+YYYYYY-MM-DD"`, `"-YYYYYY-MM-DD"`
   */
  value: string;

  /**
   * Date which should be visible when there is no value selected.
   *
   * The same date formats as for the `value` property are supported.
   * @attr {string} initial-position
   */
  initialPosition: string | null | undefined;

  /**
   * Set true to open the date selector overlay.
   */
  opened: boolean | null | undefined;

  /**
   * Set true to prevent the overlay from opening automatically.
   * @attr {boolean} auto-open-disabled
   */
  autoOpenDisabled: boolean | null | undefined;

  /**
   * Set true to display ISO-8601 week numbers in the calendar. Notice that
   * displaying week numbers is only supported when `i18n.firstDayOfWeek`
   * is 1 (Monday).
   * @attr {boolean} show-week-numbers
   */
  showWeekNumbers: boolean | null | undefined;

  /**
   * The object used to localize this component. To change the default
   * localization, replace this with an object that provides all properties, or
   * just the individual properties you want to change.
   *
   * The object has the following JSON structure and default values:
   *
   * ```js
   * {
   *   // An array with the full names of months starting
   *   // with January.
   *   monthNames: [
   *     'January', 'February', 'March', 'April', 'May',
   *     'June', 'July', 'August', 'September',
   *     'October', 'November', 'December'
   *   ],
   *
   *   // An array of weekday names starting with Sunday. Used
   *   // in screen reader announcements.
   *   weekdays: [
   *     'Sunday', 'Monday', 'Tuesday', 'Wednesday',
   *     'Thursday', 'Friday', 'Saturday'
   *   ],
   *
   *   // An array of short weekday names starting with Sunday.
   *   // Displayed in the calendar.
   *   weekdaysShort: [
   *     'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
   *   ],
   *
   *   // An integer indicating the first day of the week
   *   // (0 = Sunday, 1 = Monday, etc.).
   *   firstDayOfWeek: 0,
   *
   *   // Translation of the Today shortcut button text.
   *   today: 'Today',
   *
   *   // Translation of the Cancel button text.
   *   cancel: 'Cancel',
   *
   *   // Accessible name of the overlay content, announced by screen readers
   *   // when the overlay opens.
   *   dialogAccessibleName: 'Calendar',
   *
   *   // Used for adjusting the year value when parsing dates with short years.
   *   // The year values between 0 and 99 are evaluated and adjusted.
   *   // Example: for a referenceDate of 1970-10-30;
   *   //   dateToBeParsed: 40-10-30, result: 1940-10-30
   *   //   dateToBeParsed: 80-10-30, result: 1980-10-30
   *   //   dateToBeParsed: 10-10-30, result: 2010-10-30
   *   // Supported date format: ISO 8601 `"YYYY-MM-DD"` (default)
   *   // The default value is the current date.
   *   referenceDate: '',
   *
   *   // A function to format given `Object` as
   *   // date string. Object is in the format `{ day: ..., month: ..., year: ... }`
   *   // Note: The argument month is 0-based. This means that January = 0 and December = 11.
   *   formatDate: d => {
   *     // returns a string representation of the given
   *     // object in 'MM/DD/YYYY' -format
   *   },
   *
   *   // A function to parse the given text to an `Object` in the format `{ day: ..., month: ..., year: ... }`.
   *   // Must properly parse (at least) text formatted by `formatDate`.
   *   // Setting the property to null will disable keyboard input feature.
   *   // Note: The argument month is 0-based. This means that January = 0 and December = 11.
   *   parseDate: text => {
   *     // Parses a string in 'MM/DD/YY', 'MM/DD' or 'DD' -format to
   *     // an `Object` in the format `{ day: ..., month: ..., year: ... }`.
   *   }
   *
   *   // A function to format given `monthName` and
   *   // `fullYear` integer as calendar title string.
   *   formatTitle: (monthName, fullYear) => {
   *     return monthName + ' ' + fullYear;
   *   }
   * }
   * ```
   */
  i18n: DatePickerI18n;

  /**
   * The earliest date that can be selected. All earlier dates will be disabled.
   *
   * Supported date formats:
   * - ISO 8601 `"YYYY-MM-DD"` (default)
   * - 6-digit extended ISO 8601 `"+YYYYYY-MM-DD"`, `"-YYYYYY-MM-DD"`
   */
  min: string | undefined;

  /**
   * The latest date that can be selected. All later dates will be disabled.
   *
   * Supported date formats:
   * - ISO 8601 `"YYYY-MM-DD"` (default)
   * - 6-digit extended ISO 8601 `"+YYYYYY-MM-DD"`, `"-YYYYYY-MM-DD"`
   */
  max: string | undefined;

  /**
   * A function to be used to determine whether the user can select a given date.
   * Receives a `DatePickerDate` object of the date to be selected and should return a
   * boolean.
   */
  isDateDisabled: (date: DatePickerDate) => boolean;

  /**
   * A batch function that fetches metadata for a range of dates the calendar is about to
   * render. It receives a `DatePickerDateRange` and returns, or resolves with, an array of
   * `DatePickerDateMetadata` objects — a `DatePickerDate` extended with metadata such as
   * `disabled`, e.g. `{ year, month, day, disabled: true }` — for the dates that have metadata
   * within that range. Dates it does not mention have no metadata. `month` is 0-based: 0 is
   * January and 11 is December.
   *
   * Unlike `isDateDisabled`, which is called once per date, this function is called for a range of
   * dates at a time, and again as the calendar renders further dates. The size of the range is
   * decided by the calendar and may span several months, and may include months it already has
   * metadata for, whose entries are then ignored.
   *
   * It may return a `Promise`, so the answer can come from a server. Until it resolves, the
   * affected dates render with the `loading` part but stay selectable, and a loading spinner is
   * shown. Nothing is disabled before the provider has actually reported it, so a slow provider
   * does not make the calendar unusable. If it throws or rejects, the error is logged and the
   * affected months are requested again the next time the user navigates.
   *
   * `disabled` from the metadata is combined with `min`, `max` and `isDateDisabled`: a date is
   * disabled if it is out of the min/max range, or `isDateDisabled` returns `true`, or its metadata
   * marks it disabled. That decides what the calendar renders as disabled, what can be selected, and
   * whether the field is valid.
   *
   * A value is checked against the provider even if the overlay is never opened, which loads the
   * month holding it. Until that month answers the value is valid, and it is re-validated once the
   * answer arrives, so `checkValidity()` can report a value as valid and then invalid.
   *
   * When the overlay opens without a value, the automatically focused date is moved to the closest
   * selectable date if the provider reports it disabled — unless the user has moved the focus
   * already, since disabled dates stay focusable.
   *
   * `part` from the metadata adds part names to the date, so a theme can style specific dates with
   * `::part()` — e.g. `{ year, month, day, part: 'busy' }`. Give a single name or several separated
   * by spaces. Do not use built-in names like `disabled` and `selected`.
   *
   * Keep a stable reference to the function. Assigning a new function clears the cache and
   * re-fetches every visible range. To re-fetch while keeping the same function, because the data
   * behind it changed, call `clearCache()`.
   */
  dateMetadataProvider: DatePickerDateMetadataProvider | null | undefined;

  /**
   * Opens the dropdown.
   */
  open(): void;

  /**
   * Closes the dropdown.
   */
  close(): void;

  /**
   * Clears the `dateMetadataProvider` cache and reloads the date metadata.
   */
  clearCache(): void;
}
