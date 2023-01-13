/**
 * @license
 * Copyright (c) 2016 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * An element used internally by `<vaadin-date-picker>`. Not intended to be used separately.
 *
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @private
 */
export class DatePickerYear extends ThemableMixin(PolymerElement) {
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

  static get properties() {
    return {
      year: {
        type: String,
      },

      selectedDate: {
        type: Object,
      },
    };
  }

  static get observers() {
    return ['__updateSelected(year, selectedDate)'];
  }

  /** @private */
  __updateSelected(year, selectedDate) {
    this.toggleAttribute('selected', selectedDate && selectedDate.getFullYear() === year);
    this.toggleAttribute('current', year === new Date().getFullYear());
  }
}

customElements.define(DatePickerYear.is, DatePickerYear);
