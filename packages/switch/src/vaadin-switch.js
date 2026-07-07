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
import { switchStyles } from './styles/vaadin-switch-base-styles.js';

/**
 * `<vaadin-switch>` is a binary on/off switch control for a single setting.
 *
 * ```html
 * <vaadin-switch label="Notifications"></vaadin-switch>
 * ```
 *
 * @customElement
 * @extends HTMLElement
 */
class Switch extends ElementMixin(PolylitMixin(LumoInjectionMixin(LitElement))) {
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
    return html``;
  }
}

defineCustomElement(Switch);

export { Switch };
