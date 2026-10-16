/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';

/**
 * `<vaadin-date-range-picker>` is a Web Component for selecting a start date and an end date.
 *
 * ```html
 * <vaadin-date-range-picker></vaadin-date-range-picker>
 * ```
 *
 * The component is experimental. Enable it with the `dateRangePickerComponent` feature flag.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 */
declare class DateRangePicker extends ElementMixin(HTMLElement) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-date-range-picker': DateRangePicker;
  }
}

export { DateRangePicker };
