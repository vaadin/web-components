/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { KeyboardMixin } from '@vaadin/a11y-base/src/keyboard-mixin.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { MonthPickerI18n } from './vaadin-month-picker-mixin.js';

/**
 * An element used internally by `<vaadin-month-picker>`. Not intended to be used separately.
 *
 * @private
 */
declare class MonthPickerOverlayContent extends KeyboardMixin(DirMixin(ThemableMixin(HTMLElement))) {
  /**
   * The selected month in `YYYY-MM` format.
   */
  value: string;

  /**
   * The object used to localize the overlay content.
   */
  i18n: MonthPickerI18n;

  /**
   * The year currently shown in the calendar.
   */
  currentYear: number;

  /**
   * The minimum selectable year.
   */
  minYear: string | null;

  /**
   * The maximum selectable year.
   */
  maxYear: string | null;

  /**
   * Reference to the owning `<vaadin-month-picker>`.
   */
  owner: HTMLElement;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-month-picker-overlay-content': MonthPickerOverlayContent;
  }
}

export { MonthPickerOverlayContent };
