/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { CheckboxMixin } from './vaadin-checkbox-mixin.js';
import { checkboxStyles } from './vaadin-checkbox-styles.js';

registerStyles('vaadin-checkbox', checkboxStyles, { moduleId: 'vaadin-checkbox-styles' });

/**
 * `<vaadin-checkbox>` is an input field representing a binary choice.
 *
 * ```html
 * <vaadin-checkbox label="I accept the terms and conditions"></vaadin-checkbox>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name            | Description
 * ---------------------|-------------
 * `checkbox`           | The element representing a stylable custom checkbox
 * `label`              | The slotted label element wrapper
 * `helper-text`        | The slotted helper text element wrapper
 * `error-message`      | The slotted error message element wrapper
 * `required-indicator` | The `required` state indicator element
 *
 * The following state attributes are available for styling:
 *
 * Attribute            | Description
 * ---------------------|-------------
 * `active`             | Set when the checkbox is activated with mouse, touch or the keyboard.
 * `checked`            | Set when the checkbox is checked.
 * `disabled`           | Set when the checkbox is disabled.
 * `readonly`           | Set when the checkbox is readonly.
 * `focus-ring`         | Set when the checkbox is focused using the keyboard.
 * `focused`            | Set when the checkbox is focused.
 * `indeterminate`      | Set when the checkbox is in the indeterminate state.
 * `invalid`            | Set when the checkbox is invalid.
 * `has-label`          | Set when the checkbox has a label.
 * `has-helper`         | Set when the checkbox has helper text.
 * `has-error-message`  | Set when the checkbox has an error message.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {Event} change - Fired when the checkbox is checked or unchecked by the user.
 * @fires {CustomEvent} checked-changed - Fired when the `checked` property changes.
 * @fires {CustomEvent} indeterminate-changed - Fired when the `indeterminate` property changes.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes CheckboxMixin
 * @mixes ThemableMixin
 * @mixes ElementMixin
 */
export class Checkbox extends CheckboxMixin(ElementMixin(ThemableMixin(PolymerElement))) {
  static get is() {
    return 'vaadin-checkbox';
  }

  static get template() {
    return html`
      <div class="vaadin-checkbox-container">
        <div part="checkbox" aria-hidden="true"></div>
        <slot name="input"></slot>
        <div part="label">
          <slot name="label"></slot>
          <div part="required-indicator" on-click="_onRequiredIndicatorClick"></div>
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

  /** @protected */
  ready() {
    super.ready();

    this._tooltipController = new TooltipController(this);
    this._tooltipController.setAriaTarget(this.inputElement);
    this.addController(this._tooltipController);
  }
}

defineCustomElement(Checkbox);
