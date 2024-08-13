/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';

/**
 * A Widget component for use with the Dashboard component
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 */
class DashboardWidget extends ElementMixin(PolylitMixin(LitElement)) {
  static get is() {
    return 'vaadin-dashboard-widget';
  }

  /** @protected */
  render() {
    return html``;
  }
}

defineCustomElement(DashboardWidget);

export { DashboardWidget };
