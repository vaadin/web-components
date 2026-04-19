/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-breadcrumb-item.js';
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { I18nMixin } from '@vaadin/component-base/src/i18n-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { breadcrumbStyles } from './styles/vaadin-breadcrumb-base-styles.js';
import { BreadcrumbMixin } from './vaadin-breadcrumb-mixin.js';

/**
 * `<vaadin-breadcrumb>` is a Web Component for displaying a breadcrumb navigation trail.
 *
 * ```html
 * <vaadin-breadcrumb>
 *   <vaadin-breadcrumb-item path="/">Home</vaadin-breadcrumb-item>
 *   <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
 *   <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
 * </vaadin-breadcrumb>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name    | Description
 * -------------|-------------
 * `container`  | The flex container holding the item slot. Has `role="list"`.
 * `dropdown`   | The fixed-position dropdown panel listing collapsed items.
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description
 * -------------|-------------
 * `hidden`     | Set when the element is hidden.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement vaadin-breadcrumb
 * @extends HTMLElement
 * @mixes BreadcrumbMixin
 * @mixes I18nMixin
 * @mixes ResizeMixin
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class Breadcrumb extends BreadcrumbMixin(
  I18nMixin(
    { moreItems: 'Show collapsed items' },
    ResizeMixin(ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))))),
  ),
) {
  static get is() {
    return 'vaadin-breadcrumb';
  }

  static get styles() {
    return breadcrumbStyles;
  }

  static get experimental() {
    return true;
  }

  /** @protected */
  render() {
    return html`
      <div part="container" role="list">
        <slot></slot>
      </div>
      <div part="dropdown" role="list" hidden></div>
    `;
  }
}

defineCustomElement(Breadcrumb);

export { Breadcrumb };
