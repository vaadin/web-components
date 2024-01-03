/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
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
export class DatePickerYear extends ThemableMixin(DatePickerYearMixin(PolymerElement)) {
  static get is() {
    return 'vaadin-date-picker-year';
  }

  static get template() {
    return html`
      <style>
        :host {
          display: block;
          height: 100%;
        }
      </style>
      <div part="year-number">[[year]]</div>
      <div part="year-separator" aria-hidden="true"></div>
    `;
  }
}

defineCustomElement(DatePickerYear);
