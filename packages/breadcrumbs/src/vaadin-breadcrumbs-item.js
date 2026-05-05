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
import { breadcrumbsItemStyles } from './styles/vaadin-breadcrumbs-item-base-styles.js';

/**
 * `<vaadin-breadcrumbs-item>` is a single item inside a `<vaadin-breadcrumbs>`.
 *
 * @customElement vaadin-breadcrumbs-item
 * @extends HTMLElement
 * @mixes ElementMixin
 */
class BreadcrumbsItem extends ElementMixin(PolylitMixin(LumoInjectionMixin(LitElement))) {
  static get is() {
    return 'vaadin-breadcrumbs-item';
  }

  static get styles() {
    return breadcrumbsItemStyles;
  }

  static get experimental() {
    return 'breadcrumbsComponent';
  }

  /** @protected */
  render() {
    return html``;
  }
}

defineCustomElement(BreadcrumbsItem);

export { BreadcrumbsItem };
