/**
 * @license
 * Copyright (c) 2021 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { multiSelectComboBoxSelectAllButtonStyles } from './styles/vaadin-multi-select-combo-box-select-all-button-base-styles.js';

/**
 * An element used by `<vaadin-multi-select-combo-box>` to select or deselect
 * all items shown in the dropdown.
 *
 * ### Styling
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement vaadin-multi-select-combo-box-select-all-button
 * @extends HTMLElement
 * @private
 */
class MultiSelectComboBoxSelectAllButton extends PolylitMixin(LumoInjectionMixin(LitElement)) {
  static get is() {
    return 'vaadin-multi-select-combo-box-select-all-button';
  }

  static get styles() {
    return multiSelectComboBoxSelectAllButtonStyles;
  }

  static get properties() {
    return {
      /**
       * The text shown in the button.
       */
      label: {
        type: String,
        sync: true,
      },
    };
  }

  /** @protected */
  render() {
    return html`${this.label}`;
  }

  /** @protected */
  firstUpdated() {
    super.firstUpdated();

    this.setAttribute('role', 'button');
    this.setAttribute('tabindex', '-1');
  }
}

defineCustomElement(MultiSelectComboBoxSelectAllButton);
