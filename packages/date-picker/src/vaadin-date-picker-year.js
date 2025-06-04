/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { CSSInjectionMixin } from '@vaadin/vaadin-themable-mixin/css-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { datePickerYearStyles } from './styles/vaadin-date-picker-year-core-styles.js';
import { DatePickerYearMixin } from './vaadin-date-picker-year-mixin.js';

/**
 * An element used internally by `<vaadin-date-picker>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes DatePickerYearMixin
 * @private
 */
export class DatePickerYear extends CSSInjectionMixin(ThemableMixin(DatePickerYearMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-date-picker-year';
  }

  static get styles() {
    return datePickerYearStyles;
  }

  /** @protected */
  render() {
    return html`
      <div part="year-number">${this.year}</div>
      <div part="year-separator" aria-hidden="true"></div>
    `;
  }
}

defineCustomElement(DatePickerYear);
