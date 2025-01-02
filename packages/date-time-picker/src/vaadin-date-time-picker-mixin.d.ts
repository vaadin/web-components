/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';
import type { DatePickerI18n } from '@vaadin/date-picker/src/vaadin-date-picker.js';
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
  dateLabel: string | null | undefined;

  /**
   * Accessible label to the time picker.
   * The property works in conjunction with label and accessibleName defined on the field.
   * If both properties are defined, then accessibleName takes precedence.
   * Then, the dateLabel value is concatenated with it.
   */
  timeLabel: string | null | undefined;
}

/**
 * A mixin providing common date-time-picker functionality.
 */
export declare function DateTimePickerMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ControllerMixinClass> &
  Constructor<DateTimePickerMixinClass> &
  Constructor<DisabledMixinClass> &
  Constructor<FieldMixinClass> &
  Constructor<FocusMixinClass> &
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

  /**
   * A space-delimited list of CSS class names to set on the overlay elements
   * of the internal components controlled by the `<vaadin-date-time-picker>`:
   *
   * - [`<vaadin-date-picker>`](#/elements/vaadin-date-picker#property-overlayClass)
   * - [`<vaadin-time-picker>`](#/elements/vaadin-time-picker#property-overlayClass)
   *
   * @attr {string} overlay-class
   */
  overlayClass: string;
}
