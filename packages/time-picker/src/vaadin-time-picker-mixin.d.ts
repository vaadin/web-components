/**
 * @license
 * Copyright (c) 2018 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { DelegateFocusMixinClass } from '@vaadin/a11y-base/src/delegate-focus-mixin.js';
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { KeyboardMixinClass } from '@vaadin/a11y-base/src/keyboard-mixin.js';
import type { ControllerMixinClass } from '@vaadin/component-base/src/controller-mixin.js';
import type { DelegateStateMixinClass } from '@vaadin/component-base/src/delegate-state-mixin.js';
import type { SlotStylesMixinClass } from '@vaadin/component-base/src/slot-styles-mixin.js';
import type { ClearButtonMixinClass } from '@vaadin/field-base/src/clear-button-mixin.js';
import type { FieldMixinClass } from '@vaadin/field-base/src/field-mixin.js';
import type { InputConstraintsMixinClass } from '@vaadin/field-base/src/input-constraints-mixin.js';
import type { InputControlMixinClass } from '@vaadin/field-base/src/input-control-mixin.js';
import type { InputMixinClass } from '@vaadin/field-base/src/input-mixin.js';
import type { LabelMixinClass } from '@vaadin/field-base/src/label-mixin.js';
import type { PatternMixinClass } from '@vaadin/field-base/src/pattern-mixin.js';
import type { ValidateMixinClass } from '@vaadin/field-base/src/validate-mixin.js';
import type { TimePickerTime } from './vaadin-time-picker-helper.js';

export interface TimePickerI18n {
  parseTime(time: string): TimePickerTime | undefined;
  formatTime(time: TimePickerTime | undefined): string;
}

/**
 * A mixin providing common time-picker functionality.
 */
export declare function TimePickerMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ClearButtonMixinClass> &
  Constructor<ControllerMixinClass> &
  Constructor<DelegateFocusMixinClass> &
  Constructor<DelegateStateMixinClass> &
  Constructor<DisabledMixinClass> &
  Constructor<FieldMixinClass> &
  Constructor<FocusMixinClass> &
  Constructor<InputConstraintsMixinClass> &
  Constructor<InputControlMixinClass> &
  Constructor<InputMixinClass> &
  Constructor<KeyboardMixinClass> &
  Constructor<LabelMixinClass> &
  Constructor<PatternMixinClass> &
  Constructor<SlotStylesMixinClass> &
  Constructor<TimePickerMixinClass> &
  Constructor<ValidateMixinClass> &
  T;

export declare class TimePickerMixinClass {
  /**
   * The time value for this element.
   *
   * Supported time formats are in ISO 8601:
   * - `hh:mm` (default)
   * - `hh:mm:ss`
   * - `hh:mm:ss.fff`
   */
  value: string;

  /**
   * True if the dropdown is open, false otherwise.
   */
  opened: boolean;

  /**
   * Minimum time allowed.
   *
   * Supported time formats are in ISO 8601:
   * - `hh:mm`
   * - `hh:mm:ss`
   * - `hh:mm:ss.fff`
   */
  min: string;

  /**
   * Maximum time allowed.
   *
   * Supported time formats are in ISO 8601:
   * - `hh:mm`
   * - `hh:mm:ss`
   * - `hh:mm:ss.fff`
   */
  max: string;

  /**
   * Specifies the number of valid intervals in a day used for
   * configuring the items displayed in the selection box.
   *
   * It also configures the precision of the value string. By default
   * the component formats values as `hh:mm` but setting a step value
   * lower than one minute or one second, format resolution changes to
   * `hh:mm:ss` and `hh:mm:ss.fff` respectively.
   *
   * Unit must be set in seconds, and for correctly configuring intervals
   * in the dropdown, it need to evenly divide a day.
   *
   * Note: it is possible to define step that is dividing an hour in inexact
   * fragments (i.e. 5760 seconds which equals 1 hour 36 minutes), but it is
   * not recommended to use it for better UX experience.
   */
  step: number | null | undefined;

  /**
   * Set true to prevent the overlay from opening automatically.
   * @attr {boolean} auto-open-disabled
   */
  autoOpenDisabled: boolean | null | undefined;

  /**
   * A space-delimited list of CSS class names to set on the overlay element.
   *
   * @attr {string} overlay-class
   */
  overlayClass: string;

  /**
   * The object used to localize this component.
   * To change the default localization, replace the entire
   * _i18n_ object or just the property you want to modify.
   *
   * The object has the following JSON structure:
   *
   * ```
   * {
   *   // A function to format given `Object` as
   *   // time string. Object is in the format `{ hours: ..., minutes: ..., seconds: ..., milliseconds: ... }`
   *   formatTime: (time) => {
   *     // returns a string representation of the given
   *     // object in `hh` / 'hh:mm' / 'hh:mm:ss' / 'hh:mm:ss.fff' - formats
   *   },
   *
   *   // A function to parse the given text to an `Object` in the format
   *   // `{ hours: ..., minutes: ..., seconds: ..., milliseconds: ... }`.
   *   // Must properly parse (at least) text
   *   // formatted by `formatTime`.
   *   parseTime: text => {
   *     // Parses a string in object/string that can be formatted by`formatTime`.
   *   }
   * }
   * ```
   *
   * Both `formatTime` and `parseTime` need to be implemented
   * to ensure the component works properly.
   */
  i18n: TimePickerI18n;

  /**
   * Opens the dropdown list.
   */
  open(): void;

  /**
   * Closes the dropdown list.
   */
  close(): void;
}
