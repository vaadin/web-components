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
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
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
 * `separator` | The separator region rendered before the item's link. Hidden on the first item.
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

      /**
       * Custom separator DOM node set by the container. When set, replaces
       * the default chevron character in the separator region.
       *
       * @type {Node | undefined}
       * @protected
       */
      _customSeparator: {
        type: Object,
        attribute: false,
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
      <span part="separator" aria-hidden="true" id="separator">${this._customSeparator ? nothing : '\u203A'}</span>
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

  constructor() {
    super();

    this.__onResize = this.__onResize.bind(this);
  }

  /**
   * @protected
   * @override
   */
  updated(changedProperties) {
    super.updated(changedProperties);

    if (changedProperties.has('_customSeparator')) {
      this.__updateCustomSeparator();
    }
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

    // Set up truncation detection via ResizeObserver
    const link = this.shadowRoot.querySelector('#link');
    this.__resizeObserver = new ResizeObserver(() => this.__onResize());
    this.__resizeObserver.observe(link);

    // Set up tooltip controller
    this._tooltipController = new TooltipController(this);
    this.addController(this._tooltipController);
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();

    if (this.__resizeObserver) {
      this.__resizeObserver.disconnect();
    }
  }

  /** @private */
  __updateCustomSeparator() {
    const separator = this.shadowRoot.querySelector('#separator');
    if (this._customSeparator) {
      separator.appendChild(this._customSeparator);
    }
  }

  /** @private */
  __onResize() {
    const link = this.shadowRoot.querySelector('#link');
    if (link.scrollWidth > link.clientWidth) {
      link.setAttribute('title', this.textContent.trim());
    } else {
      link.removeAttribute('title');
    }
  }
}

defineCustomElement(BreadcrumbItem);

export { BreadcrumbItem };
