/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { toggleSwitchStyles } from './styles/vaadin-toggle-switch-base-styles.js';

/**
 * `<vaadin-toggle-switch>` is a binary on/off switch input field.
 *
 * @customElement vaadin-toggle-switch
 * @extends HTMLElement
 */
export class ToggleSwitch extends ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement)))) {
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
    return html``;
  }
}

defineCustomElement(ToggleSwitch);
