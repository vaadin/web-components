/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-dashboard-section.js';
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { DashboardLayoutMixin } from './vaadin-dashboard-layout-mixin.js';

/**
 * Dashboard layout element
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

  /** @protected */
  render() {
    return html`<slot></slot>`;
  }
}

defineCustomElement(DashboardLayout);

export { DashboardLayout };
