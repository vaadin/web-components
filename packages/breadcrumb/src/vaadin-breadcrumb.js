/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-breadcrumb-item.js';
import { LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { breadcrumbStyles } from './styles/vaadin-breadcrumb-base-styles.js';
import { BreadcrumbMixin } from './vaadin-breadcrumb-mixin.js';

/**
 * `<vaadin-breadcrumb>` is a Web Component for displaying breadcrumb navigation.
 *
 * ```html
 * <vaadin-breadcrumb>
 *   <vaadin-breadcrumb-item>Home</vaadin-breadcrumb-item>
 *   <vaadin-breadcrumb-item>Products</vaadin-breadcrumb-item>
 *   <vaadin-breadcrumb-item current>Shoes</vaadin-breadcrumb-item>
 * </vaadin-breadcrumb>
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

  static experimental = true;

  static get styles() {
    return breadcrumbStyles;
  }

  // render() is provided by BreadcrumbMixin
}

defineCustomElement(Breadcrumb);

export { Breadcrumb };
