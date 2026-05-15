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
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { toggleSwitchStyles } from './styles/vaadin-toggle-switch-base-styles.js';

/**
 * `<vaadin-toggle-switch>` is a binary on/off switch input field.
 *
 * @customElement vaadin-toggle-switch
 * @extends HTMLElement
 */
export class ToggleSwitch extends CheckboxMixin(
  ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement)))),
) {
  static get is() {
    return 'vaadin-toggle-switch';
  }

  static get experimental() {
    return true;
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

  /**
   * Override method inherited from `InputMixin` to set `role="switch"`
   * on the inner input element.
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

defineCustomElement(ToggleSwitch);
