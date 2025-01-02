/**
 * @license
 * Copyright (c) 2021 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { multiSelectComboBoxChip } from './vaadin-multi-select-combo-box-styles.js';

/**
 * LitElement based version of `<vaadin-multi-select-combo-box-chip>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
class MultiSelectComboBoxChip extends ThemableMixin(PolylitMixin(LitElement)) {
  static get is() {
    return 'vaadin-multi-select-combo-box-chip';
  }

  static get styles() {
    return multiSelectComboBoxChip;
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
