/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { sideNavItemStyles } from '../theme/lumo/vaadin-side-nav-styles.js';

function isEnabled() {
  return window.Vaadin && window.Vaadin.featureFlags && !!window.Vaadin.featureFlags.sideNavComponent;
}

/**
 * An element used internally by `<vaadin-side-nav>`. Represents a navigation target.
 * Not intended to be used separately.
 *
 * ```
 *   <vaadin-side-nav-item>
 *     Item 1
 *     <vaadin-side-nav-item path="/path1" slot="children">
 *       Child item 1
 *     </vaadin-side-nav-item>
 *     <vaadin-side-nav-item path="/path2" slot="children">
 *       Child item 2
 *     </vaadin-side-nav-item>
 *   </vaadin-side-nav-item>
 * ```
 *
 * ### Customization
 *
 * You can configure the item by using `slot` names.
 *
 * Slot name | Description
 * ----------|-------------
 * `prefix`  | A slot for content before the label (e.g. an icon).
 * `suffix`  | A slot for content after the label (e.g. an icon).
 *
 * #### Example:
 *
 * ```
 *  <vaadin-side-nav-item>
 *     <vaadin-icon icon="vaadin:chart" slot="prefix"></vaadin-icon>
 *     Item
 *     <span theme="badge primary" slot="suffix">Suffix</span>
 *   </vaadin-side-nav-item>
 * ```
 *
 * @extends LitElement
 * @mixes PolylitMixin
 * @mixes ThemableMixin
 * @mixes ElementMixin
 */
class SideNavItem extends ElementMixin(ThemableMixin(PolylitMixin(LitElement))) {
  static get is() {
    return 'vaadin-side-nav-item';
  }

  static get styles() {
    return sideNavItemStyles;
  }

  static get properties() {
    return {
      /**
       * The path to navigate to.
       */
      path: String,

      /**
       * When present, the item is expanded to show the children items.
       *
       * @type {boolean}
       */
      expanded: {
        type: Boolean,
        value: false,
        notify: true,
        reflectToAttribute: true,
      },

      /**
       * Toggles the `active` attribute.
       *
       * @type {boolean}
       */
      active: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },
    };
  }

  /** @protected */
  get _button() {
    return this.shadowRoot.querySelector('button');
  }

  /** @protected */
  get _childrenSlot() {
    return this.shadowRoot.querySelector('#children');
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'listitem');
    this.__updateActive();
    this.__boundUpdateActive = this.__updateActive.bind(this);
    window.addEventListener('popstate', this.__boundUpdateActive);
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('popstate', this.__boundUpdateActive);
  }

  /** @protected */
  render() {
    return html`
      <a href="${ifDefined(this.path)}" part="item" aria-current="${this.active ? 'page' : false}">
        <slot name="prefix"></slot>
        <slot></slot>
        <slot name="suffix"></slot>
        <button
          part="toggle-button"
          @click="${this.__toggleExpanded}"
          ?hidden="${!this.querySelector('[slot=children]')}"
          aria-controls="children"
          aria-expanded="${this.expanded}"
          aria-label="Toggle child items"
        ></button>
      </a>
      <slot name="children" role="list" part="children" id="children" ?hidden="${!this.expanded}"></slot>
    `;
  }

  /** @private */
  __toggleExpanded(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.expanded = !this.expanded;
  }

  /** @private */
  __updateActive() {
    if (!this.path && this.path !== '') {
      this.active = false;
      return;
    }
    this.active = this.__calculateActive();
    this.toggleAttribute('child-active', document.location.pathname.startsWith(this.path));
    if (this.active) {
      this.expanded = true;
    }
  }

  /** @private */
  __calculateActive() {
    const pathAbsolute = this.path.startsWith('/');
    // Absolute path or no base uri in use. No special comparison needed
    if (pathAbsolute) {
      // Compare an absolute view path
      return document.location.pathname === this.path;
    }
    const hasBaseUri = document.baseURI !== document.location.href;
    if (!hasBaseUri) {
      // Compare a relative view path (strip the starting slash)
      return document.location.pathname.substring(1) === this.path;
    }
    const pathRelativeToRoot = document.location.pathname;
    const basePath = new URL(document.baseURI).pathname;
    const pathWithoutBase = pathRelativeToRoot.substring(basePath.length);
    const pathRelativeToBase =
      basePath !== pathRelativeToRoot && pathRelativeToRoot.startsWith(basePath) ? pathWithoutBase : pathRelativeToRoot;
    return pathRelativeToBase === this.path;
  }
}

if (isEnabled()) {
  customElements.define(SideNavItem.is, SideNavItem);
}

export { SideNavItem };
