/**
 * @license
 * Copyright (c) 2018 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/checkbox/src/vaadin-checkbox.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { CheckboxGroupMixin } from './vaadin-checkbox-group-mixin.js';
import { checkboxGroupStyles } from './vaadin-checkbox-group-styles.js';

registerStyles('vaadin-checkbox-group', checkboxGroupStyles, { moduleId: 'vaadin-checkbox-group-styles' });

/**
 * `<vaadin-checkbox-group>` is a web component that allows the user to choose several items from a group of binary choices.
 *
 * ```html
 * <vaadin-checkbox-group label="Export data">
 *   <vaadin-checkbox value="0" label="Order ID"></vaadin-checkbox>
 *   <vaadin-checkbox value="1" label="Product name"></vaadin-checkbox>
 *   <vaadin-checkbox value="2" label="Customer"></vaadin-checkbox>
 *   <vaadin-checkbox value="3" label="Status"></vaadin-checkbox>
 * </vaadin-checkbox-group>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name            | Description
 * ---------------------|----------------
 * `label`              | The slotted label element wrapper
 * `group-field`        | The checkbox elements wrapper
 * `helper-text`        | The slotted helper text element wrapper
 * `error-message`      | The slotted error message element wrapper
 * `required-indicator` | The `required` state indicator element
 *
 * The following state attributes are available for styling:
 *
 * Attribute           | Description                               | Part name
 * --------------------|-------------------------------------------|------------
 * `disabled`          | Set when the element is disabled          | :host
 * `invalid`           | Set when the element is invalid           | :host
 * `focused`           | Set when the element is focused           | :host
 * `has-label`         | Set when the element has a label          | :host
 * `has-value`         | Set when the element has a value          | :host
 * `has-helper`        | Set when the element has helper text      | :host
 * `has-error-message` | Set when the element has an error message | :host
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 * @fires {CustomEvent} validated - Fired whenever the field is validated.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes ElementMixin
 * @mixes CheckboxGroupMixin
 */
class CheckboxGroup extends CheckboxGroupMixin(ElementMixin(ThemableMixin(PolymerElement))) {
  static get is() {
    return 'vaadin-checkbox-group';
  }

  static get template() {
    return html`
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

      <slot name="tooltip"></slot>
    `;
  }
}

defineCustomElement(CheckboxGroup);

export { CheckboxGroup };
