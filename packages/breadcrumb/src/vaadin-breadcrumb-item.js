/**
 * @license
 * Copyright (c) 2025 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { DisabledMixin } from '@vaadin/a11y-base/src/disabled-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { breadcrumbItemStyles } from './styles/vaadin-breadcrumb-item-base-styles.js';

/**
 * `<vaadin-breadcrumb-item>` is a navigation item used within `<vaadin-breadcrumb>`.
 *
 * ```html
 * <vaadin-breadcrumb-item path="/products">Products</vaadin-breadcrumb-item>
 * ```
 *
 * ### Customization
 *
 * Slot name | Description
 * ----------|-------------
 * (default) | Item label text
 * `prefix`  | Content before the label (e.g. an icon)
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ----------|-------------
 * `link`    | The anchor or span element wrapping the label
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description
 * -------------|-------------
 * `disabled`   | Set when the element is disabled
 * `has-path`   | Set when the element has a path
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement vaadin-breadcrumb-item
 * @extends HTMLElement
 * @mixes DisabledMixin
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class BreadcrumbItem extends DisabledMixin(ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))))) {
  static get is() {
    return 'vaadin-breadcrumb-item';
  }

  static get properties() {
    return {
      /**
       * Navigation target. If absent, the item represents the current page.
       * Consistent with `vaadin-side-nav-item`.
       * @attr {string} path
       */
      path: {
        type: String,
        reflect: true,
      },
    };
  }

  static get styles() {
    return breadcrumbItemStyles;
  }

  /** @protected */
  firstUpdated() {
    super.firstUpdated();

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'listitem');
    }
  }

  /** @protected */
  updated(props) {
    super.updated(props);

    if (props.has('path')) {
      if (this.path != null) {
        this.setAttribute('has-path', '');
      } else {
        this.removeAttribute('has-path');
      }
    }
  }

  /** @protected */
  render() {
    if (this.path != null) {
      return html`
        <slot name="prefix"></slot>
        <a
          part="link"
          href="${ifDefined(this.disabled ? undefined : this.path)}"
          aria-disabled="${this.disabled ? 'true' : 'false'}"
          @click="${this.__onClick}"
        >
          <slot></slot>
        </a>
      `;
    }

    return html`
      <slot name="prefix"></slot>
      <span part="link">
        <slot></slot>
      </span>
    `;
  }

  /** @private */
  __onClick(e) {
    if (this.disabled) {
      e.preventDefault();
    }
  }
}

defineCustomElement(BreadcrumbItem);

export { BreadcrumbItem };
