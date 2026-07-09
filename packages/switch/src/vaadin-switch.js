/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { CheckboxMixin } from '@vaadin/checkbox/src/vaadin-checkbox-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { switchStyles } from './styles/vaadin-switch-base-styles.js';

/**
 * `<vaadin-switch>` is a binary on/off switch control for a single setting.
 *
 * ```html
 * <vaadin-switch label="Notifications"></vaadin-switch>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name            | Description
 * ---------------------|-------------
 * `switch`             | The track element that holds the marker.
 * `marker`             | The marker element inside the track.
 * `label`              | The slotted label element wrapper.
 * `helper-text`        | The slotted helper text element wrapper.
 * `error-message`      | The slotted error message element wrapper.
 * `required-indicator` | The `required` state indicator element.
 *
 * The following state attributes are available for styling:
 *
 * Attribute            | Description
 * ---------------------|-------------
 * `active`             | Set when the switch is activated with mouse, touch or the keyboard.
 * `checked`            | Set when the switch is checked.
 * `disabled`           | Set when the switch is disabled.
 * `readonly`           | Set when the switch is readonly.
 * `focus-ring`         | Set when the switch is focused using the keyboard.
 * `focused`            | Set when the switch is focused.
 * `required`           | Set when the switch is required.
 * `invalid`            | Set when the switch is invalid.
 * `has-label`          | Set when the switch has a label.
 * `has-helper`         | Set when the switch has helper text.
 * `has-error-message`  | Set when the switch has an error message.
 * `has-tooltip`        | Set when the switch has a slotted tooltip.
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                                |
 * :--------------------------------------------------|
 * | `--vaadin-input-field-error-color`               |
 * | `--vaadin-input-field-error-font-size`           |
 * | `--vaadin-input-field-error-font-weight`         |
 * | `--vaadin-input-field-error-line-height`         |
 * | `--vaadin-input-field-helper-color`              |
 * | `--vaadin-input-field-helper-font-size`          |
 * | `--vaadin-input-field-helper-font-weight`        |
 * | `--vaadin-input-field-helper-line-height`        |
 * | `--vaadin-input-field-required-indicator`        |
 * | `--vaadin-input-field-required-indicator-color`  |
 * | `--vaadin-switch-background`                     |
 * | `--vaadin-switch-border-color`                   |
 * | `--vaadin-switch-border-radius`                  |
 * | `--vaadin-switch-border-width`                   |
 * | `--vaadin-switch-gap`                            |
 * | `--vaadin-switch-height`                         |
 * | `--vaadin-switch-width`                          |
 * | `--vaadin-switch-icon-color`                     |
 * | `--vaadin-switch-icon-size`                      |
 * | `--vaadin-switch-label-color`                    |
 * | `--vaadin-switch-label-font-size`                |
 * | `--vaadin-switch-label-font-weight`              |
 * | `--vaadin-switch-label-line-height`              |
 * | `--vaadin-switch-marker-border-color`            |
 * | `--vaadin-switch-marker-border-radius`           |
 * | `--vaadin-switch-marker-border-width`            |
 * | `--vaadin-switch-marker-color`                   |
 * | `--vaadin-switch-marker-height`                  |
 * | `--vaadin-switch-marker-scale`                   |
 * | `--vaadin-switch-marker-width`                   |
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {Event} change - Fired when the switch is toggled by the user.
 * @fires {CustomEvent} checked-changed - Fired when the `checked` property changes.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} validated - Fired whenever the field is validated.
 *
 * @customElement vaadin-switch
 * @extends HTMLElement
 */
class Switch extends CheckboxMixin(ElementMixin(PolylitMixin(LumoInjectionMixin(LitElement)))) {
  static get is() {
    return 'vaadin-switch';
  }

  static get experimental() {
    return true;
  }

  static get styles() {
    return switchStyles;
  }

  /** @protected */
  render() {
    return html`
      <div class="vaadin-switch-container">
        <div part="switch" aria-hidden="true">
          <div part="marker"></div>
        </div>
        <slot name="input"></slot>
        <div part="label">
          <slot name="label"></slot>
          <div part="required-indicator" @click="${this._onRequiredIndicatorClick}"></div>
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

  /**
   * Override method inherited from `InputMixin` to set `role="switch"`
   * on the inner input element, so screen readers announce the control
   * as a switch with an on/off state rather than a checkbox.
   *
   * @param {HTMLElement | undefined} input
   * @param {HTMLElement | undefined} oldInput
   * @protected
   * @override
   */
  _inputElementChanged(input, oldInput) {
    super._inputElementChanged(input, oldInput);

    if (input) {
      input.setAttribute('role', 'switch');
    }
  }
}

defineCustomElement(Switch);

export { Switch };
