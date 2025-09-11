/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { KeyboardMixinClass } from '@vaadin/a11y-base/src/keyboard-mixin.js';
import type { I18nMixinClass } from '@vaadin/component-base/src/i18n-mixin.js';
import type { InputMixinClass } from '@vaadin/field-base/src/input-mixin.js';

export interface MonthPickerI18n {
  /**
   * Accessible label for the previous-year button in the calendar header.
   */
  prevYear?: string;
  /**
   * Accessible label for the next-year button in the calendar header.
   */
  nextYear?: string;
  /**
   * Full month names starting with January. Used for the accessible names
   * of month cells.
   */
  monthNames?: string[];
  /**
   * Short month names starting with January. Displayed in the calendar.
   */
  monthNamesShort?: string[];
  /**
   * Allowed input formats. The first entry is used as the primary format.
   */
  formats?: string[];
}

export declare function MonthPickerMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<DisabledMixinClass> &
  Constructor<FocusMixinClass> &
  Constructor<I18nMixinClass<MonthPickerI18n>> &
  Constructor<InputMixinClass> &
  Constructor<KeyboardMixinClass> &
  Constructor<MonthPickerMixinClass> &
  T;

export declare class MonthPickerMixinClass {
  /**
   * Set true to prevent the overlay from opening automatically when the
   * input is focused.
   */
  autoOpenDisabled: boolean | null | undefined;

  /**
   * The earliest selectable year and month, in `YYYY-MM` format. All
   * earlier values are disabled.
   */
  min: string | null | undefined;

  /**
   * The latest selectable year and month, in `YYYY-MM` format. All later
   * values are disabled.
   */
  max: string | null | undefined;

  /**
   * Set true to open the month-selector overlay.
   */
  opened: boolean;

  /**
   * Set true to make the field read-only.
   */
  readonly: boolean;

  /**
   * The selected month in `YYYY-MM` format.
   */
  value: string;

  /**
   * The object used to localize this component. Replace with an object
   * that provides all properties, or just the individual properties you
   * want to change.
   */
  i18n: MonthPickerI18n;

  /**
   * Opens the overlay.
   */
  open(): void;

  /**
   * Closes the overlay.
   */
  close(): void;

  /**
   * Returns true if the current input value satisfies all constraints.
   */
  checkValidity(): boolean;
}
