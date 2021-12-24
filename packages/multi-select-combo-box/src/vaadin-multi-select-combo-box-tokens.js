/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-multi-select-combo-box-token.js';
import { html, LitElement } from 'lit';
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
class MultiSelectComboBoxTokens extends MultiSelectComboBoxMixin(ThemableMixin(LitElement)) {
  static get is() {
    return 'vaadin-multi-select-combo-box-tokens';
  }

  render() {
    return html`
      ${this.compactMode
        ? html`
            <div part="compact-mode-label">
              ${this._getCompactModeLabel(this.items, this.compactModeLabelGenerator)}
            </div>
          `
        : html`
            <div part="tokens">
              ${this.items.map(
                (item) =>
                  html`
                    <vaadin-multi-select-combo-box-token
                      part="token"
                      .item="${item}"
                      .label="${this._getItemLabel(item, this.itemLabelPath)}"
                    ></vaadin-multi-select-combo-box-token>
                  `
              )}
            </div>
          `}
    `;
  }
}

customElements.define(MultiSelectComboBoxTokens.is, MultiSelectComboBoxTokens);
