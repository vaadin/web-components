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
 * `<vaadin-breadcrumb-item>` is a navigation item to be used within `<vaadin-breadcrumb>`.
 *
 * When `href` is set, it renders as a clickable link. When `href` is absent,
 * it represents the current page and is rendered as non-interactive text
 * with `aria-current="page"`.
 *
 * ```html
 * <vaadin-breadcrumb-item href="/">Home</vaadin-breadcrumb-item>
 * <vaadin-breadcrumb-item>Current Page</vaadin-breadcrumb-item>
 * ```
 *
 * ### Customization
 *
 * You can configure the item by using `slot` names.
 *
 * Slot name | Description
 * ----------|-------------
 * `prefix`  | Content before the label (e.g. an icon).
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name    | Description
 * -------------|-------------
 * `item`       | The list item wrapper
 * `link`       | The anchor or span element
 * `separator`  | The separator element
 *
 * The following state attributes are available for styling:
 *
 * Attribute         | Description
 * ------------------|-------------
 * `disabled`        | Set when the item is disabled.
 * `overflow-hidden` | Set when the item is hidden due to overflow.
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

  static get properties() {
    return {
      /**
       * The URL to navigate to when the breadcrumb item is clicked.
       * When absent, the item is treated as the current page.
       *
       * @attr {string} href
       */
      href: {
        type: String,
        reflect: true,
      },

      /**
       * When true, the item is disabled and cannot be interacted with.
       *
       * @attr {boolean} disabled
       */
      disabled: {
        type: Boolean,
        reflect: true,
        value: false,
      },

      /**
       * Whether the item is hidden due to overflow.
       * Set by the parent `<vaadin-breadcrumb>` component.
       *
       * @attr {boolean} overflow-hidden
       */
      overflowHidden: {
        type: Boolean,
        reflect: true,
        attribute: 'overflow-hidden',
        value: false,
      },
    };
  }

  /** @protected */
  render() {
    return html`
      <div part="item">
        ${this.href != null
          ? html`
              <a
                part="link"
                href="${ifDefined(this.disabled ? undefined : this.href)}"
                aria-disabled="${this.disabled ? 'true' : 'false'}"
                @click="${this.__onLinkClick}"
              >
                <slot name="prefix"></slot>
                <slot></slot>
              </a>
            `
          : html`
              <span part="link" aria-current="page">
                <slot name="prefix"></slot>
                <slot></slot>
              </span>
            `}
        <span part="separator" aria-hidden="true"></span>
      </div>
    `;
  }

  /** @private */
  __onLinkClick(event) {
    if (this.disabled) {
      event.preventDefault();
    }
  }
}

defineCustomElement(BreadcrumbItem);

export { BreadcrumbItem };
