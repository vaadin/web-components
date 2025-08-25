/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { DisabledMixin } from '@vaadin/a11y-base/src/disabled-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { matchPaths } from '@vaadin/component-base/src/url-utils.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { breadcrumbItemStyles } from './styles/vaadin-breadcrumb-item-styles.js';

/**
 * `<vaadin-breadcrumb-item>` is a Web Component for displaying a single item in a breadcrumb trail.
 *
 * ```html
 * <vaadin-breadcrumb-item href="/products">Products</vaadin-breadcrumb-item>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name    | Description
 * -------------|----------------
 * `link`       | The link element
 * `separator`  | The separator element
 *
 * The following state attributes are available for styling:
 *
 * Attribute   | Description
 * ------------|-------------
 * `disabled`  | Set when the element is disabled
 * `last`      | Set when this is the last item in the breadcrumb
 * `current`   | Set when the item's href matches the current page
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes DisabledMixin
 * @mixes DirMixin
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class BreadcrumbItem extends DisabledMixin(
  DirMixin(ElementMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))))),
) {
  static get is() {
    return 'vaadin-breadcrumb-item';
  }

  static get styles() {
    return breadcrumbItemStyles;
  }

  static get properties() {
    return {
      /**
       * The URL to navigate to
       */
      href: {
        type: String,
      },

      /**
       * The target of the link
       */
      target: {
        type: String,
      },

      /**
       * Whether to exclude the item from client-side routing
       * @type {boolean}
       * @attr {boolean} router-ignore
       */
      routerIgnore: {
        type: Boolean,
        value: false,
      },

      /**
       * Whether this is the last item in the breadcrumb
       * @type {boolean}
       * @private
       */
      _last: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        attribute: 'last',
      },

      /**
       * Whether the item's href matches the current page
       * @type {boolean}
       */
      current: {
        type: Boolean,
        value: false,
        readOnly: true,
        reflectToAttribute: true,
      },
    };
  }

  constructor() {
    super();
    this.__boundUpdateCurrent = this.__updateCurrent.bind(this);
  }

  /** @protected */
  render() {
    return html`
      ${this.href && !this._last
        ? html`
            <a
              part="link"
              href="${ifDefined(this.disabled ? undefined : this.href)}"
              target="${ifDefined(this.target)}"
              ?router-ignore="${this.routerIgnore}"
              aria-current="${this.current ? 'page' : 'false'}"
              tabindex="${this.disabled ? '-1' : '0'}"
            >
              <slot></slot>
            </a>
          `
        : html`
            <span part="link" aria-current="${this._last ? 'page' : 'false'}">
              <slot></slot>
            </span>
          `}
      ${!this._last ? html`<span part="separator" aria-hidden="true"></span>` : ''}
    `;
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

    if (props.has('href')) {
      this.__updateCurrent();
    }
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();
    this.__updateCurrent();

    window.addEventListener('popstate', this.__boundUpdateCurrent);
    window.addEventListener('vaadin-navigated', this.__boundUpdateCurrent);
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();

    window.removeEventListener('popstate', this.__boundUpdateCurrent);
    window.removeEventListener('vaadin-navigated', this.__boundUpdateCurrent);
  }

  /**
   * @param {boolean} last
   * @private
   */
  _setLast(last) {
    this._last = last;
  }

  /** @private */
  __updateCurrent() {
    if (!this.href) {
      this._setCurrent(false);
      return;
    }

    const browserPath = `${location.pathname}${location.search}`;
    this._setCurrent(matchPaths(browserPath, this.href));
  }
}

defineCustomElement(BreadcrumbItem);

export { BreadcrumbItem };
