/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * An element used by `<vaadin-multi-select-combo-box>` to display selected items.
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name        | Description
 * -----------------|-------------
 * `label`          | Element containing the label
 * `remove-button`  | Remove token button
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @extends HTMLElement
 * @private
 */
class MultiSelectComboBoxToken extends ThemableMixin(LitElement) {
  static get is() {
    return 'vaadin-multi-select-combo-box-token';
  }

  static get properties() {
    return {
      label: {
        type: String
      },

      item: {
        type: Object
      }
    };
  }

  render() {
    return html`
      <div part="label">${this.label}</div>
      <div part="remove-button" role="button" @click="${this._onRemoveClick}"></div>
    `;
  }

  /** @private */
  _onRemoveClick(event) {
    event.stopPropagation();

    this.dispatchEvent(
      new CustomEvent('item-removed', {
        detail: {
          item: this.item
        },
        bubbles: true,
        composed: true
      })
    );
  }
}

customElements.define(MultiSelectComboBoxToken.is, MultiSelectComboBoxToken);
