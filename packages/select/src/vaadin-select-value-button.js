/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ButtonMixin } from '@vaadin/button/src/vaadin-button-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { valueButton } from './vaadin-select-value-button-styles.js';

registerStyles('vaadin-select-value-button', valueButton, { moduleId: 'vaadin-select-value-button-styles' });

/**
 * An element used internally by `<vaadin-select>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ButtonMixin
 * @mixes ThemableMixin
 * @protected
 */
class SelectValueButton extends ButtonMixin(ThemableMixin(PolymerElement)) {
  static get is() {
    return 'vaadin-select-value-button';
  }

  static get template() {
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
