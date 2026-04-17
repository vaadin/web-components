/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { breadcrumbItemStyles } from './styles/vaadin-breadcrumb-item-base-styles.js';
import { BreadcrumbItemMixin } from './vaadin-breadcrumb-item-mixin.js';

/**
 * `<vaadin-breadcrumb-item>` is a Web Component for individual breadcrumb items
 * used within `<vaadin-breadcrumb>`.
 *
 * ```html
 * <vaadin-breadcrumb-item>Home</vaadin-breadcrumb-item>
 * ```
 *
 * @customElement vaadin-breadcrumb-item
 * @extends HTMLElement
 * @mixes BreadcrumbItemMixin
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class BreadcrumbItem extends BreadcrumbItemMixin(
  ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement)))),
) {
  static get is() {
    return 'vaadin-breadcrumb-item';
  }

  static experimental = 'breadcrumbComponent';

  static get styles() {
    return breadcrumbItemStyles;
  }

  // render() is provided by BreadcrumbItemMixin
}

defineCustomElement(BreadcrumbItem);

export { BreadcrumbItem };
