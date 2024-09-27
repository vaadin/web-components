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
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { DashboardLayoutMixin } from './vaadin-dashboard-layout-mixin.js';

/**
 * A responsive, grid-based dashboard layout component
 *
 * @customElement
 * @extends HTMLElement
 * @mixes DashboardLayoutMixin
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class DashboardLayout extends DashboardLayoutMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-dashboard-layout';
  }

  static get properties() {
    return {
      /**
       * Whether the dashboard layout is dense.
       * @type {boolean}
       */
      dense: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },
    };
  }

  /** @protected */
  render() {
    return html`<div id="grid"><slot></slot></div>`;
  }
}

defineCustomElement(DashboardLayout);

export { DashboardLayout };
