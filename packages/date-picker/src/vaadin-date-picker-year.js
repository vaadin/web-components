/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { datePickerYearStyles } from './styles/vaadin-date-picker-year-base-styles.js';

/**
 * An element used internally by `<vaadin-date-picker>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @private
 */
export class DatePickerYear extends ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))) {
  static get is() {
    return 'vaadin-date-picker-year';
  }

  static get styles() {
    return datePickerYearStyles;
  }

  static get properties() {
    return {
      year: {
        type: String,
        sync: true,
      },

      selectedDate: {
        type: Object,
        sync: true,
      },
    };
  }

  /** @protected */
  render() {
    return html`
      <div part="year-number">${this.year}</div>
      <div part="year-separator" aria-hidden="true"></div>
    `;
  }

  /** @protected */
  updated(props) {
    super.updated(props);

    if (props.has('year')) {
      this.toggleAttribute('current', this.year === new Date().getFullYear());
    }

    if (props.has('year') || props.has('selectedDate')) {
      this.toggleAttribute('selected', this.selectedDate && this.selectedDate.getFullYear() === this.year);
    }
  }
}

defineCustomElement(DatePickerYear);
