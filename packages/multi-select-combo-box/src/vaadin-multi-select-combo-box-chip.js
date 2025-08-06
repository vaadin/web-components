/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { multiSelectComboBoxChipStyles } from './styles/vaadin-multi-select-combo-box-chip-base-styles.js';

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
 * `remove-button`  | Remove button
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement
 * @extends HTMLElement
 * @private
 */
class MultiSelectComboBoxChip extends ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))) {
  static get is() {
    return 'vaadin-multi-select-combo-box-chip';
  }

  static get styles() {
    return multiSelectComboBoxChipStyles;
  }

  static get properties() {
    return {
      disabled: {
        type: Boolean,
        reflectToAttribute: true,
        sync: true,
      },

      readonly: {
        type: Boolean,
        reflectToAttribute: true,
        sync: true,
      },

      label: {
        type: String,
        sync: true,
      },

      item: {
        type: Object,
      },
    };
  }

  /** @protected */
  render() {
    return html`
      <div part="label">${this.label}</div>
      <div part="remove-button" @click="${this._onRemoveClick}"></div>
    `;
  }

  /** @private */
  _onRemoveClick(event) {
    event.stopPropagation();

    this.dispatchEvent(
      new CustomEvent('item-removed', {
        detail: {
          item: this.item,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

defineCustomElement(MultiSelectComboBoxChip);
