/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { ButtonMixin } from '@vaadin/button/src/vaadin-button-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { valueButton } from './vaadin-select-value-button-styles.js';

/**
 * An element used internally by `<vaadin-select>`. Not intended to be used separately.
 *
 * @extends HTMLElement
 * @mixes ButtonMixin
 * @mixes ThemableMixin
 * @protected
 */
class SelectValueButton extends ButtonMixin(ThemableMixin(PolylitMixin(LitElement))) {
  static get is() {
    return 'vaadin-select-value-button';
  }

  static get styles() {
    return valueButton;
  }

  /** @protected */
  render() {
    return html`
      <div class="vaadin-button-container">
        <span part="label">
          <slot></slot>
        </span>
      </div>
    `;
  }
}

defineCustomElement(SelectValueButton);
