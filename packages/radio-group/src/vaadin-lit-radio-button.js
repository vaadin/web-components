/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { styles, template } from './lib/radio-button-base.js';
import { RadioButtonMixin } from './vaadin-radio-button-mixin.js';

/**
 * LitElement based version of `<vaadin-radio-button>` web component.
 * Note: this is a prototype not supposed to be used publicly.
 *
 * @private
 */
class RadioButton extends RadioButtonMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-radio-button';
  }

  static get styles() {
    return styles;
  }

  /** @protected */
  render() {
    return template(html);
  }
}

customElements.define(RadioButton.is, RadioButton);

export { RadioButton };
