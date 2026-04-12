/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { DisabledMixin } from '@vaadin/a11y-base/src/disabled-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { breadcrumbItemStyles } from './styles/vaadin-breadcrumb-item-base-styles.js';

/**
 * `<vaadin-breadcrumb-item>` is a breadcrumb item element to be used within
 * `<vaadin-breadcrumb>`.
 *
 * ```html
 * <vaadin-breadcrumb>
 *   <vaadin-breadcrumb-item path="/home">Home</vaadin-breadcrumb-item>
 *   <vaadin-breadcrumb-item>Current</vaadin-breadcrumb-item>
 * </vaadin-breadcrumb>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name   | Description
 * ------------|-------------
 * `link`      | The `<a>` element. Non-interactive when `current`, `disabled`, or `path` is unset.
 *
 * The following state attributes are available for styling:
 *
 * Attribute   | Description
 * ------------|-------------
 * `disabled`  | Set when the element is disabled.
 * `current`   | Set when the element represents the current page.
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

  static get styles() {
    return breadcrumbItemStyles;
  }

  static get properties() {
    return {
      /**
       * The navigation target path. Maps to `href` on the internal `<a>` element.
       * When `undefined`, the item is treated as non-interactive text.
       */
      path: {
        type: String,
      },

      /**
       * Whether this item represents the current page. Set by the container
       * via `_setCurrent()`. When `true`, the link is non-interactive and
       * receives `aria-current="page"`.
       *
       * @attr {boolean} current
       */
      current: {
        type: Boolean,
        value: false,
        readOnly: true,
        reflectToAttribute: true,
      },
    };
  }

  static get experimental() {
    return 'breadcrumbComponent';
  }

  /**
   * @return {string | undefined} The effective href for the internal link.
   * @protected
   */
  get _effectiveHref() {
    if (this.current || this.disabled || this.path == null) {
      return undefined;
    }
    return this.path;
  }

  /**
   * @return {string | undefined} The effective tabindex for the internal link.
   * @protected
   */
  get _effectiveTabindex() {
    if (this.current || this.path == null) {
      return undefined;
    }
    if (this.disabled) {
      return '-1';
    }
    return '0';
  }

  /** @protected */
  render() {
    return html`
      <a
        part="link"
        id="link"
        href="${ifDefined(this._effectiveHref)}"
        tabindex="${ifDefined(this._effectiveTabindex)}"
        aria-current="${this.current ? 'page' : nothing}"
      >
        <slot></slot>
      </a>
      <slot name="tooltip"></slot>
    `;
  }

  /**
   * @protected
   * @override
   */
  firstUpdated() {
    super.firstUpdated();

    // Set default role if not provided
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'listitem');
    }
  }
}

defineCustomElement(BreadcrumbItem);

export { BreadcrumbItem };
