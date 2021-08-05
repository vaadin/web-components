/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';
import { AriaLabelMixin } from '@vaadin/field-base/src/aria-label-mixin.js';
import { ClearButtonMixin } from '@vaadin/field-base/src/clear-button-mixin.js';
import { DelegateFocusMixin } from '@vaadin/field-base/src/delegate-focus-mixin.js';
import { FieldAriaMixin } from '@vaadin/field-base/src/field-aria-mixin.js';
import { InputSlotMixin } from '@vaadin/field-base/src/input-slot-mixin.js';
import { PatternMixin } from '@vaadin/field-base/src/pattern-mixin.js';
import { TimePickerI18n } from '@vaadin/vaadin-time-picker/src/interfaces';

declare class TimePicker extends PatternMixin(
  FieldAriaMixin(
    AriaLabelMixin(InputSlotMixin(DelegateFocusMixin(ClearButtonMixin(ThemableMixin(ElementMixin(HTMLElement))))))
  )
) {
  /**
   * Element used by `DelegatesFocusMixin` to handle focus.
   */
  readonly focusElement: HTMLInputElement;

  /**
   * Set to true to disable this input.
   */
  disabled: boolean;

  /**
   * The name of this element.
   */
  name: string | null | undefined;

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
   * The object used to localize this component.
   * To change the default localization, replace the entire
   * _i18n_ object or just the property you want to modify.
   *
   * The object has the following JSON structure:
   *
   *   {
   *     // A function to format given `Object` as
   *     // time string. Object is in the format `{ hours: ..., minutes: ..., seconds: ..., milliseconds: ... }`
   *     formatTime: (time) => {
   *       // returns a string representation of the given
   *       // object in `hh` / 'hh:mm' / 'hh:mm:ss' / 'hh:mm:ss.fff' - formats
   *     },
   *
   *     // A function to parse the given text to an `Object` in the format
   *     // `{ hours: ..., minutes: ..., seconds: ..., milliseconds: ... }`.
   *     // Must properly parse (at least) text
   *     // formatted by `formatTime`.
   *     parseTime: text => {
   *       // Parses a string in object/string that can be formatted by`formatTime`.
   *     }
   *   }
   */
  i18n: TimePickerI18n;

  /**
   * Returns true if the current input value satisfies all constraints (if any).
   * You can override this method for custom validations.
   *
   * @returns True if the value is valid
   */
  checkValidity(): boolean;
}

export { TimePicker };
