/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { toggleSwitchStyles } from './styles/vaadin-toggle-switch-base-styles.js';
import { ToggleSwitchMixin } from './vaadin-toggle-switch-mixin.js';

/**
 * `<vaadin-toggle-switch>` is a binary on/off switch control.
 *
 * ```html
 * <vaadin-toggle-switch label="Notifications"></vaadin-toggle-switch>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name            | Description
 * ---------------------|-------------
 * `switch`             | The element representing a stylable switch track
 * `thumb`              | The element representing a stylable switch thumb
 * `label`              | The slotted label element wrapper
 * `helper-text`        | The slotted helper text element wrapper
 * `error-message`      | The slotted error message element wrapper
 * `required-indicator` | The `required` state indicator element
 *
 * The following state attributes are available for styling:
 *
 * Attribute            | Description
 * ---------------------|-------------
 * `active`             | Set when the toggle switch is activated with mouse, touch or the keyboard.
 * `checked`            | Set when the toggle switch is on.
 * `disabled`           | Set when the toggle switch is disabled.
 * `readonly`           | Set when the toggle switch is readonly.
 * `focus-ring`         | Set when the toggle switch is focused using the keyboard.
 * `focused`            | Set when the toggle switch is focused.
 * `invalid`            | Set when the toggle switch is invalid.
 * `has-label`          | Set when the toggle switch has a label.
 * `has-helper`         | Set when the toggle switch has helper text.
 * `has-error-message`  | Set when the toggle switch has an error message.
 * `has-tooltip`        | Set when the toggle switch has a slotted tooltip.
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                               |
 * :--------------------------------------------------|
 * | `--vaadin-toggle-switch-size`                    |
 * | `--vaadin-toggle-switch-background`              |
 * | `--vaadin-toggle-switch-border-color`            |
 * | `--vaadin-toggle-switch-border-width`            |
 * | `--vaadin-toggle-switch-gap`                     |
 * | `--vaadin-toggle-switch-label-color`             |
 * | `--vaadin-toggle-switch-label-font-size`         |
 * | `--vaadin-toggle-switch-label-font-weight`       |
 * | `--vaadin-toggle-switch-label-line-height`       |
 * | `--vaadin-toggle-switch-track-width`             |
 * | `--vaadin-toggle-switch-thumb-size`              |
 * | `--vaadin-toggle-switch-thumb-color`             |
 * | `--vaadin-toggle-switch-thumb-checked-color`     |
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @fires {Event} change - Fired when the toggle switch is checked or unchecked by the user.
 * @fires {CustomEvent} checked-changed - Fired when the `checked` property changes.
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} validated - Fired whenever the field is validated.
 *
 * @customElement vaadin-toggle-switch
 * @extends HTMLElement
 * @mixes ToggleSwitchMixin
 * @mixes ThemableMixin
 * @mixes ElementMixin
 */
export class ToggleSwitch extends ToggleSwitchMixin(
  ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement)))),
) {
  static get is() {
    return 'vaadin-toggle-switch';
  }

  static get styles() {
    return toggleSwitchStyles;
  }

  /** @protected */
  render() {
    return html`
      <div class="vaadin-toggle-switch-container">
        <div part="switch" aria-hidden="true">
          <div part="thumb"></div>
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
}

defineCustomElement(ToggleSwitch);
