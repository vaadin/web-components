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
import './vaadin-dashboard-widget.js';
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';

/**
 * A responsive, grid-based dashboard layout component
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 */
class Dashboard extends ElementMixin(PolylitMixin(LitElement)) {
  static get is() {
    return 'vaadin-dashboard';
  }

  static get cvdlName() {
    return 'vaadin-dashboard';
  }

  /** @protected */
  render() {
    return html``;
  }
}

defineCustomElement(Dashboard);

export { Dashboard };
