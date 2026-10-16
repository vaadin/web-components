/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { dateRangePickerStyles } from './styles/vaadin-date-range-picker-base-styles.js';

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
 *
 * @customElement vaadin-date-range-picker
 * @extends HTMLElement
 */
class DateRangePicker extends ElementMixin(PolylitMixin(LumoInjectionMixin(LitElement))) {
  static get is() {
    return 'vaadin-date-range-picker';
  }

  static get experimental() {
    return true;
  }

  static get styles() {
    return dateRangePickerStyles;
  }
}

defineCustomElement(DateRangePicker);

export { DateRangePicker };
