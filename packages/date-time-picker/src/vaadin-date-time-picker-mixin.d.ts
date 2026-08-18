/**
 * @license
 * Copyright (c) 2019 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { I18nMixinClass } from '@vaadin/component-base/src/i18n-mixin.js';
import type { DatePickerDateMetadataProvider, DatePickerI18n } from '@vaadin/date-picker/src/vaadin-date-picker.js';
import type { FieldMixinClass } from '@vaadin/field-base/src/field-mixin.js';
import type { LabelMixinClass } from '@vaadin/field-base/src/label-mixin.js';
import type { ValidateMixinClass } from '@vaadin/field-base/src/validate-mixin.js';
import type { TimePickerI18n } from '@vaadin/time-picker/src/vaadin-time-picker.js';

export interface DateTimePickerI18n extends DatePickerI18n, TimePickerI18n {
  /**
   * Accessible label to the date picker.
   * The property works in conjunction with label and accessibleName defined on the field.
   * If both properties are defined, then accessibleName takes precedence.
   * Then, the dateLabel value is concatenated with it.
   */
  dateLabel?: string;

  /**
   * Accessible label to the time picker.
   * The property works in conjunction with label and accessibleName defined on the field.
   * If both properties are defined, then accessibleName takes precedence.
   * Then, the dateLabel value is concatenated with it.
   */
  timeLabel?: string;
}

/**
 * A mixin providing common date-time-picker functionality.
 */
export declare function DateTimePickerMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<DateTimePickerMixinClass> &
  Constructor<DisabledMixinClass> &
  Constructor<FieldMixinClass> &
  Constructor<FocusMixinClass> &
  Constructor<I18nMixinClass<DateTimePickerI18n>> &
  Constructor<LabelMixinClass> &
  Constructor<ValidateMixinClass> &
  T;

export declare class DateTimePickerMixinClass {
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
   * The time part to set automatically when the user commits a date while
   * the time picker is empty. Supported time formats are in ISO 8601:
   *
   * - `hh:mm` (default)
   * - `hh:mm:ss`
   * - `hh:mm:ss.fff`
   *
   * The time part is set when a date is committed while the time picker
   * is empty — never for programmatic or initial values. A value outside
   * `min` / `max` is applied as-is and makes the field invalid.
   *
   * When not set, selecting a date leaves the time part empty. A string
   * that is not a valid ISO 8601 time is ignored and logs a warning.
   *
   * @attr {string} default-time
   */
  defaultTime: string | null | undefined;

  /**
   * Set true to display ISO-8601 week numbers in the calendar. Notice that
   * displaying week numbers is only supported when `i18n.firstDayOfWeek`
   * is 1 (Monday).
   * @attr {boolean} show-week-numbers
   */
  showWeekNumbers: boolean | null | undefined;

  /**
   * A function that provides metadata for the dates the calendar is about to render: whether they
   * are disabled, and CSS `part` names for styling from outside using the `::part()` selector.
   * The provider is called for a range of dates at a time, and again as the calendar renders
   * further dates.
   *
   * It receives a `DatePickerDateRange` and returns an array of `DatePickerDateMetadata` objects
   * for the dates in that range that have metadata. It can return a `Promise` to load the metadata
   * asynchronously, and `null` or `undefined` when no date in the range has metadata.
   *
   * The returned array has the following structure:
   *
   * ```js
   * [
   *   // The date is an ISO 8601 string.
   *   { date: '2026-01-01', disabled: true },
   *
   *   // Adds a custom part name to the date.
   *   { date: '2026-01-02', part: 'busy' },
   * ]
   * ```
   *
   * A date is disabled if its metadata marks it disabled, or it is outside `min` and `max`.
   * Disabled dates are not selectable, and a value on a disabled date makes the field invalid.
   * The provider does not affect which date is focused when opening the overlay. Use
   * `initialPosition` property to provide a selectable date.
   *
   * While a returned `Promise` is pending, the dates it covers are not disabled yet and render with
   * the `loading` part. If the function throws or rejects, corresponding dates are requested again
   * the next time the user navigates.
   *
   * The provider is used for validation also when the overlay is closed. Date is considered valid
   * while the provider is pending. Unlike `<vaadin-date-picker>`, the value is not re-validated
   * when the metadata is loaded, but checked against it at the next validation instead.
   *
   * Keep a stable reference to the function: assigning a new one clears the cache and re-fetches
   * visible range. Call `clearCache()` to re-fetch when the data behind the same function changed.
   */
  dateMetadataProvider: DatePickerDateMetadataProvider | null | undefined;

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
   * The object used to localize this component. To change the default
   * localization, replace this with an object that provides all properties, or
   * just the individual properties you want to change.
   *
   * The object has the following structure and default values:
   *
   * ```js
   * {
   *   // Accessible label to the date picker.
   *   // The property works in conjunction with label and accessibleName defined on the field.
   *   // If both properties are defined, then accessibleName takes precedence.
   *   // Then, the dateLabel value is concatenated with it.
   *   dateLabel: undefined;
   *
   *   // Accessible label to the time picker.
   *   // The property works in conjunction with label and accessibleName defined on the field.
   *   // If both properties are defined, then accessibleName takes precedence.
   *   // Then, the dateLabel value is concatenated with it.
   *   timeLabel: undefined;
   * }
   * ```
   *
   * Additionally, all i18n properties from
   * [`<vaadin-date-picker>`](#/elements/vaadin-date-picker) and
   * [`<vaadin-time-picker>`](#/elements/vaadin-time-picker) are supported.
   */
  i18n: DateTimePickerI18n;

  /**
   * Clears the `dateMetadataProvider` cache and reloads the date metadata.
   */
  clearCache(): void;
}
