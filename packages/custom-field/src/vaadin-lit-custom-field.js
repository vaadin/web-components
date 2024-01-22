/**
 * @license
 * Copyright (c) 2019 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { CustomFieldMixin } from './vaadin-custom-field-mixin.js';
import { customFieldStyles } from './vaadin-custom-field-styles.js';

/**
 * LitElement based version of `<vaadin-custom-field>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
class CustomField extends CustomFieldMixin(ThemableMixin(ElementMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-custom-field';
  }

  static get styles() {
    return customFieldStyles;
  }

  /** @protected */
  render() {
    return html`
      <div class="vaadin-custom-field-container">
        <div part="label" @click="${this.focus}">
          <slot name="label"></slot>
          <span part="required-indicator" aria-hidden="true"></span>
        </div>

        <div class="inputs-wrapper" @change="${this._onInputChange}">
          <slot id="slot"></slot>
        </div>

        <div part="helper-text">
          <slot name="helper"></slot>
        </div>

        <div part="error-message">
          <slot name="error-message"></slot>
        </div>
      </div>

      <slot name="tooltip"></slot>
    `;
  }

  /**
   * Fired when the user commits a value change for any of the internal inputs.
   *
   * @event change
   */
}

defineCustomElement(CustomField);

export { CustomField };
