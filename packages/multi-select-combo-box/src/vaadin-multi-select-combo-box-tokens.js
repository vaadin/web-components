/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

class MultiSelectComboBoxTokens extends ThemableMixin(LitElement) {
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

  static get properties() {
    return {
      /**
       * When true, the component does not render tokens for every selected value.
       * Instead, only the number of currently selected items is shown.
       */
      compactMode: {
        type: Boolean
      },

      /**
       * Custom function for generating the display label when in compact mode.
       *
       * This function receives the array of selected items and should return
       * a string value that will be used as the display label.
       */
      compactModeLabelGenerator: {
        type: Object
      },

      itemLabelPath: {
        type: String
      }
    };
  }

  /**
   * Returns the item display label.
   * @protected
   */
  _getItemLabel(item, itemLabelPath) {
    return item && Object.prototype.hasOwnProperty.call(item, itemLabelPath) ? item[itemLabelPath] : item;
  }

  /**
   * Retrieves the component display label when in compact mode.
   * @protected
   */
  _getCompactModeLabel(items) {
    if (typeof this.compactModeLabelGenerator === 'function') {
      return this.compactModeLabelGenerator(items);
    }

    const suffix = items.length === 0 || items.length > 1 ? 'values' : 'value';
    return `${items.length} ${suffix}`;
  }

  /** @private */
  _onTokenRemoveClick(event) {
    event.stopPropagation();

    const token = event.target.parentElement;
    const index = token.dataset.index;
    console.log(index);

    // this._removeSelected(event.model.item);
  }
}

customElements.define(MultiSelectComboBoxTokens.is, MultiSelectComboBoxTokens);
