/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { breadcrumbItemStyles } from './styles/vaadin-breadcrumb-item-base-styles.js';

/**
 * `<vaadin-breadcrumb-item>` is a Web Component for individual breadcrumb items
 * within a `<vaadin-breadcrumb>` container.
 *
 * ```html
 * <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name    | Description
 * -------------|-------------
 * `link`       | The `<a>` element rendering the item as a link.
 * `separator`  | The visual separator after the item.
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description
 * -------------|-------------
 * `current`    | Set on the last item (current page).
 * `hidden`     | Set when the element is hidden.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement vaadin-breadcrumb-item
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class BreadcrumbItem extends ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement)))) {
  static get is() {
    return 'vaadin-breadcrumb-item';
  }

  static get styles() {
    return breadcrumbItemStyles;
  }

  static get experimental() {
    return 'breadcrumbComponent';
  }

  static get properties() {
    return {
      /**
       * Navigation target URL. Rendered as the `href` attribute on the internal `<a>` element.
       * When `null` or absent, the link has no `href` and is non-interactive.
       * @type {string | null}
       */
      path: {
        type: String,
        value: null,
        reflect: true,
      },

      /**
       * Whether this item represents the current page.
       * When true, `aria-current="page"` is set on the link, `tabindex` is `-1`,
       * and `href` is not rendered even if `path` is set. The separator is also hidden.
       * @type {boolean}
       */
      current: {
        type: Boolean,
        value: false,
        reflect: true,
      },
    };
  }

  /** @protected */
  render() {
    return html`
      <a
        id="link"
        part="link"
        href="${ifDefined(this.current ? undefined : this.path)}"
        tabindex="${this.current || this.path == null ? '-1' : '0'}"
        aria-current="${this.current ? 'page' : 'false'}"
      >
        <slot name="prefix"></slot>
        <slot></slot>
      </a>
      <span part="separator" aria-hidden="true"></span>
    `;
  }
}

defineCustomElement(BreadcrumbItem);

export { BreadcrumbItem };
