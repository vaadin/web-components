/**
 * @license
 * Copyright (c) 2019 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-menu-bar-item.js';
import './vaadin-menu-bar-list-box.js';
import './vaadin-menu-bar-overlay.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';
import { SubMenuMixin } from './vaadin-menu-bar-submenu-mixin.js';

/**
 * An element used internally by `<vaadin-menu-bar>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ControllerMixin
 * @mixes SubMenuMixin
 * @mixes ThemePropertyMixin
 * @protected
 */
class MenuBarSubmenu extends SubMenuMixin(ControllerMixin(ThemePropertyMixin(PolymerElement))) {
  static get is() {
    return 'vaadin-menu-bar-submenu';
  }

  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none !important;
        }
      </style>

      <slot id="slot"></slot>
    `;
  }

  /**
   * @param {DocumentFragment} dom
   * @return {ShadowRoot}
   * @protected
   * @override
   */
  _attachDom(dom) {
    const root = this.attachShadow({ mode: 'open' });
    root.appendChild(dom);
    root.appendChild(this._overlayElement);
    return root;
  }
}

defineCustomElement(MenuBarSubmenu);
