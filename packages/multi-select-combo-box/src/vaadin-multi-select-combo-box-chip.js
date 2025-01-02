/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { multiSelectComboBoxChip } from './vaadin-multi-select-combo-box-styles.js';

registerStyles('vaadin-multi-select-combo-box-chip', multiSelectComboBoxChip, {
  moduleId: 'vaadin-multi-select-combo-box-chip',
});

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
class MultiSelectComboBoxChip extends ThemableMixin(PolymerElement) {
  static get is() {
    return 'vaadin-multi-select-combo-box-chip';
  }

  static get properties() {
    return {
      disabled: {
        type: Boolean,
        reflectToAttribute: true,
      },

      readonly: {
        type: Boolean,
        reflectToAttribute: true,
      },

      label: {
        type: String,
      },

      item: {
        type: Object,
      },
    };
  }

  static get template() {
    return html`
      <div part="label">[[label]]</div>
      <div part="remove-button" on-click="_onRemoveClick"></div>
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
