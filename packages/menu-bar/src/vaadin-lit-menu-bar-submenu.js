/**
 * @license
 * Copyright (c) 2019 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-lit-menu-bar-item.js';
import './vaadin-lit-menu-bar-list-box.js';
import './vaadin-lit-menu-bar-overlay.js';
import { css, html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import { SubMenuMixin } from './vaadin-menu-bar-submenu-mixin.js';

/**
 * An element used internally by `<vaadin-menu-bar>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes SubMenuMixin
 * @mixes ThemePropertyMixin
 * @protected
 */
class MenuBarSubmenu extends SubMenuMixin(ThemePropertyMixin(PolylitMixin(LitElement))) {
  static get is() {
    return 'vaadin-menu-bar-submenu';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      :host([hidden]) {
        display: none !important;
      }
    `;
  }

  /** @protected */
  render() {
    return html`<slot id="slot"></slot>`;
  }

  /**
   * @protected
   * @override
   */
  createRenderRoot() {
    const root = super.createRenderRoot();
    root.appendChild(this._overlayElement);
    return root;
  }
}

defineCustomElement(MenuBarSubmenu);
