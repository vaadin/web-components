/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { RadioButtonMixin } from './vaadin-radio-button-mixin.js';
import { radioButtonStyles } from './vaadin-radio-button-styles.js';

/**
 * LitElement based version of `<vaadin-radio-button>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment not intended for publishing to npm.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
class RadioButton extends RadioButtonMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-radio-button';
  }

  static get styles() {
    return radioButtonStyles;
  }

  static get properties() {
    return {
      /**
       * True if the element is checked.
       * @type {boolean}
       */
      checked: {
        type: Boolean,
        value: false,
        notify: true,
        reflectToAttribute: true,
        sync: true,
      },
    };
  }

  /** @protected */
  render() {
    return html`
      <div class="vaadin-radio-button-container">
        <div part="radio" aria-hidden="true"></div>
        <slot name="input"></slot>
        <slot name="label"></slot>
      </div>
    `;
  }
}

defineCustomElement(RadioButton);

export { RadioButton };
