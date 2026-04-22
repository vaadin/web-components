/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-breadcrumb-item.js';
import './vaadin-breadcrumb-overlay.js';
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { breadcrumbStyles } from './styles/vaadin-breadcrumb-base-styles.js';
import { BreadcrumbMixin } from './vaadin-breadcrumb-mixin.js';

/**
 * `<vaadin-breadcrumb>` is a Web Component for displaying a breadcrumb trail of
 * navigational steps leading to the current page.
 *
 * ```html
 * <vaadin-breadcrumb>
 *   <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
 *   <vaadin-breadcrumb-item path="/reports">Reports</vaadin-breadcrumb-item>
 *   <vaadin-breadcrumb-item>Quarterly</vaadin-breadcrumb-item>
 * </vaadin-breadcrumb>
 * ```
 *
 * This component is experimental. To use it, enable the feature flag before
 * importing the component:
 *
 * ```js
 * window.Vaadin.featureFlags.breadcrumbComponent = true;
 * ```
 *
 * @customElement vaadin-breadcrumb
 * @extends HTMLElement
 * @mixes BreadcrumbMixin
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class Breadcrumb extends BreadcrumbMixin(ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))))) {
  static get is() {
    return 'vaadin-breadcrumb';
  }

  static get styles() {
    return breadcrumbStyles;
  }

  static get experimental() {
    return 'breadcrumbComponent';
  }

  /** @protected */
  render() {
    return html`
      <div role="list" part="list">
        <slot name="root"></slot>
        <div role="listitem" part="overflow" hidden>
          <button part="overflow-button" aria-label="" aria-haspopup="true" aria-expanded="false"></button>
        </div>
        <slot></slot>
      </div>
    `;
  }
}

defineCustomElement(Breadcrumb);

export { Breadcrumb };
