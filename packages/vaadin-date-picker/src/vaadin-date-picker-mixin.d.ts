import { DatePickerI18n } from './interfaces';

export { DatePickerMixin };

declare function DatePickerMixin<T extends new (...args: any[]) => {}>(base: T): T & DatePickerMixinConstructor;

interface DatePickerMixinConstructor {
  new (...args: any[]): DatePickerMixin;
}

export { DatePickerMixinConstructor };

interface DatePickerMixin {
  readonly _inputElement: HTMLElement | null;

  /**
   * The current selected date.
   */
  _selectedDate: Date | null | undefined;

  _focusedDate: Date | null | undefined;

  /**
   * The value for this element.
   *
   * Supported date formats:
   * - ISO 8601 `"YYYY-MM-DD"` (default)
   * - 6-digit extended ISO 8601 `"+YYYYYY-MM-DD"`, `"-YYYYYY-MM-DD"`
   */
  value: string;

  /**
   * Set to true to mark the input as required.
   */
  required: boolean;

  /**
   * The name of this element.
   */
  name: string | null | undefined;

  /**
   * Date which should be visible when there is no value selected.
   *
   * The same date formats as for the `value` property are supported.
   */
  initialPosition: string | null | undefined;

  /**
   * The label for this element.
   */
  label: string | null | undefined;

  /**
   * Set true to open the date selector overlay.
   */
  opened: boolean | null | undefined;

  /**
   * Set true to prevent the overlay from opening automatically.
   */
  autoOpenDisabled: boolean | null | undefined;

  /**
   * Set true to display ISO-8601 week numbers in the calendar. Notice that
   * displaying week numbers is only supported when `i18n.firstDayOfWeek`
   * is 1 (Monday).
   */
  showWeekNumbers: boolean | null | undefined;

  _fullscreen: boolean;

  _fullscreenMediaQuery: string;

  /**
   * The object used to localize this component.
   * To change the default localization, replace the entire
   * `i18n` object with a custom one.
   *
   * To update individual properties, extend the existing i18n object like so:
   * ```
   * datePicker.i18n = { ...datePicker.i18n, {
   *   formatDate: date => { ... },
   *   parseDate: value => { ... },
   * }};
   * ```
   *
   * The object has the following JSON structure and default values:
   *
   * ```
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
   *   // Used in screen reader announcements along with week
   *   // numbers, if they are displayed.
   *   week: 'Week',
   *
   *   // Translation of the Calendar icon button title.
   *   calendar: 'Calendar',
   *
   *   // Translation of the Clear icon button title.
   *   lear: 'Clear',
   *
   *   // Translation of the Today shortcut button text.
   *   today: 'Today',
   *
   *   // Translation of the Cancel button text.
   *   cancel: 'Cancel',
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
   * The earliest date that can be selected. All earlier dates will be disabled.
   */
  _minDate: Date | string | null;

  /**
   * The latest date that can be selected. All later dates will be disabled.
   */
  _maxDate: Date | string | null;

  _overlayInitialized: boolean | null | undefined;

  /**
   * Opens the dropdown.
   */
  open(): void;

  /**
   * Closes the dropdown.
   */
  close(): void;

  _onOverlayOpened(): void;

  _onOverlayClosed(): void;

  /**
   * Returns true if `value` is valid, and sets the `invalid` flag appropriately.
   *
   * @returns True if the value is valid and sets the `invalid` flag appropriately
   */
  validate(): boolean;

  /**
   * Returns true if the current input value satisfies all constraints (if any)
   *
   * Override the `checkValidity` method for custom validations.
   *
   * @returns True if the value is valid
   */
  checkValidity(): boolean;

  _focus(): void;
}
