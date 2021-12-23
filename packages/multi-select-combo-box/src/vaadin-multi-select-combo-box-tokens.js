/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { MultiSelectComboBoxMixin } from './vaadin-multi-select-combo-box-mixin.js';

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
                (item, index) =>
                  html`
                    <div part="token" data-index="${index}">
                      <div part="token-label">${this._getItemLabel(item, this.itemLabelPath)}</div>
                      <div part="token-remove-button" role="button" @click="${this._onTokenRemoveClick}"></div>
                    </div>
                  `
              )}
            </div>
          `}
    `;
  }

  /** @private */
  _onTokenRemoveClick(event) {
    event.stopPropagation();

    const token = event.target.parentElement;

    this.dispatchEvent(
      new CustomEvent('item-removed', {
        detail: {
          item: this.items.indexOf(token.dataset.index)
        }
      })
    );
  }
}

customElements.define(MultiSelectComboBoxTokens.is, MultiSelectComboBoxTokens);
