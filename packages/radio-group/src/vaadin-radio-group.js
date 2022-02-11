/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { RadioButton } from './vaadin-radio-button.js';
import { RadioGroupMixin } from './vaadin-radio-group-mixin.js';

/**
 * `<vaadin-radio-group>` is a web component that allows the user to choose one item from a group of choices.
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
 * Part name            | Description
 * ---------------------|----------------
 * `label`              | The slotted label element wrapper
 * `group-field`        | The radio button elements wrapper
 * `helper-text`        | The slotted helper text element wrapper
 * `error-message`      | The slotted error message element wrapper
 * `required-indicator` | The `required` state indicator element
 *
 * The following state attributes are available for styling:
 *
 * Attribute           | Description                               | Part name
 * --------------------|-------------------------------------------|------------
 * `disabled`          | Set when the element is disabled          | :host
 * `readonly`          | Set when the element is readonly          | :host
 * `invalid`           | Set when the element is invalid           | :host
 * `focused`           | Set when the element is focused           | :host
 * `has-label`         | Set when the element has a label          | :host
 * `has-value`         | Set when the element has a value          | :host
 * `has-helper`        | Set when the element has helper text      | :host
 * `has-error-message` | Set when the element has an error message | :host
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 *
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes RadioGroupMixin
 * @mixes ThemableMixin
 */
class RadioGroup extends RadioGroupMixin(ElementMixin(ThemableMixin(PolymerElement))) {
  static get is() {
    return 'vaadin-radio-group';
  }

  static get template() {
    return html`
      <style>
        :host {
          display: inline-flex;
        }

        :host::before {
          content: '\\2003';
          width: 0;
          display: inline-block;
        }

        :host([hidden]) {
          display: none !important;
        }

        .vaadin-group-field-container {
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        :host(:not([has-label])) [part='label'] {
          display: none;
        }
      </style>
      <div class="vaadin-group-field-container">
        <div part="label">
          <slot name="label"></slot>
          <span part="required-indicator" aria-hidden="true"></span>
        </div>

        <div part="group-field">
          <slot></slot>
        </div>

        <div part="helper-text">
          <slot name="helper"></slot>
        </div>

        <div part="error-message">
          <slot name="error-message"></slot>
        </div>
      </div>
    `;
  }

  /**
   * @param {Node} node
   * @return {boolean}
   * @protected
   * @override
   */
  _isRadioButton(node) {
    return node instanceof RadioButton;
  }
}

customElements.define(RadioGroup.is, RadioGroup);

export { RadioGroup };
