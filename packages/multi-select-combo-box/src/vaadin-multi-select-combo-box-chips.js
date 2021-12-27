/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-multi-select-combo-box-chip.js';
import { css, html, LitElement } from 'lit';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { MultiSelectComboBoxMixin } from './vaadin-multi-select-combo-box-mixin.js';

/**
 * An element used internally by `<vaadin-multi-select-combo-box>`. Not intended to be used separately.
 *
 * @extends HTMLElement
 * @mixes MultiSelectComboBoxMixin
 * @mixes ThemableMixin
 * @private
 */
class MultiSelectComboBoxChips extends MultiSelectComboBoxMixin(ThemableMixin(LitElement)) {
  static get is() {
    return 'vaadin-multi-select-combo-box-chips';
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        flex-wrap: wrap;
        flex-grow: 1;
        min-width: 0;
      }

      :host([hidden]) {
        display: none !important;
      }
    `;
  }

  render() {
    return html`
      ${this.items.map(
        (item) =>
          html`
            <vaadin-multi-select-combo-box-chip
              part="chip"
              .item="${item}"
              .label="${this._getItemLabel(item, this.itemLabelPath)}"
            ></vaadin-multi-select-combo-box-chip>
          `
      )}
    `;
  }
}

customElements.define(MultiSelectComboBoxChips.is, MultiSelectComboBoxChips);
