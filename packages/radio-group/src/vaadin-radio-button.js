/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { radioButtonStyles } from './styles/vaadin-radio-button-core-styles.js';
import { RadioButtonMixin } from './vaadin-radio-button-mixin.js';

/**
 * `<vaadin-radio-button>` is a web component representing a choice in a radio group.
 * Only one radio button in the group can be selected at the same time.
 *
 * ```html
 * <vaadin-radio-group label="Travel class">
 *   <vaadin-radio-button value="economy" label="Economy"></vaadin-radio-button>
 *   <vaadin-radio-button value="business" label="Business"></vaadin-radio-button>
 *   <vaadin-radio-button value="firstClass" label="First Class"></vaadin-radio-button>
 * </vaadin-radio-group>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name   | Description
 * ------------|----------------
 * `radio`     | The wrapper element that contains slotted `<input type="radio">`.
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description | Part name
 * -------------|-------------|------------
 * `active`     | Set when the radio button is pressed down, either with a pointer or the keyboard. | `:host`
 * `disabled`   | Set when the radio button is disabled. | `:host`
 * `focus-ring` | Set when the radio button is focused using the keyboard. | `:host`
 * `focused`    | Set when the radio button is focused. | `:host`
 * `checked`    | Set when the radio button is checked. | `:host`
 * `has-label`  | Set when the radio button has a label. | `:host`
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} checked-changed - Fired when the `checked` property changes.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes ElementMixin
 * @mixes RadioButtonMixin
 */
class RadioButton extends RadioButtonMixin(ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))))) {
  static get is() {
    return 'vaadin-radio-button';
  }

  static get styles() {
    return radioButtonStyles;
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
