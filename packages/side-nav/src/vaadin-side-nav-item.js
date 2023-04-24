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

/**
 * An element used internally by `<vaadin-side-nav>`. Not intended to be used separately.
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
      path: String,

      expanded: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },

      active: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },
    };
  }

  get button() {
    return this.shadowRoot.querySelector('button');
  }

  get childrenSlot() {
    return this.shadowRoot.querySelector('#children');
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'listitem');
    this._updateActive();
    this.__boundUpdateActive = this._updateActive.bind(this);
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
          @click="${this.toggleExpanded}"
          ?hidden="${!this.querySelector('[slot=children]')}"
          aria-controls="children"
          aria-expanded="${this.expanded}"
          aria-label="Toggle child items"
        ></button>
      </a>
      <slot name="children" role="list" part="children" id="children" ?hidden="${!this.expanded}"></slot>
    `;
  }

  toggleExpanded(e) {
    e.preventDefault();
    e.stopPropagation();
    this.expanded = !this.expanded;
  }

  _updateActive() {
    if (!this.path) {
      this.active = false;
      return;
    }
    this.active = this._calculateActive();
    this.toggleAttribute('child-active', document.location.pathname.startsWith(this.path));
    if (this.active) {
      this.expanded = true;
    }
  }

  _calculateActive() {
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

customElements.define(SideNavItem.is, SideNavItem);

export { SideNavItem };
