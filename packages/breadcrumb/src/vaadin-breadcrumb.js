/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { breadcrumbStyles } from './styles/vaadin-breadcrumb-base-styles.js';
import { BreadcrumbMixin } from './vaadin-breadcrumb-mixin.js';

/**
 * `<vaadin-breadcrumb>` is a web component for displaying breadcrumb navigation.
 *
 * ```html
 * <vaadin-breadcrumb>
 *   <vaadin-breadcrumb-item href="/">Home</vaadin-breadcrumb-item>
 *   <vaadin-breadcrumb-item href="/products">Products</vaadin-breadcrumb-item>
 *   <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
 * </vaadin-breadcrumb>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------|-------------
 * `list`    | The ordered list element wrapping the items
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description
 * -------------|-------------
 *
 * The following custom CSS properties are available:
 *
 * Custom property                          | Description                | Default
 * ----------------------------------------|----------------------------|---------
 * `--vaadin-breadcrumb-separator-symbol`   | Separator character/icon   | `/`
 * `--vaadin-breadcrumb-separator-color`    | Separator color            | secondary text
 * `--vaadin-breadcrumb-separator-size`     | Separator font size        | inherit
 * `--vaadin-breadcrumb-separator-gap`      | Space around separator     | xs
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
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

  /** @protected */
  render() {
    return html`
      <nav aria-label="${this.label}">
        <ol part="list">
          <slot></slot>
        </ol>
      </nav>
    `;
  }
}

defineCustomElement(Breadcrumb);

export { Breadcrumb };
