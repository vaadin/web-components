/**
 * @license
 * Copyright (c) 2019 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-menu-bar-item.js';
import './vaadin-menu-bar-list-box.js';
import './vaadin-menu-bar-overlay.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { OverlayClassMixin } from '@vaadin/component-base/src/overlay-class-mixin.js';
import { ContextMenuMixin } from '@vaadin/context-menu/src/vaadin-context-menu-mixin.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';

/**
 * An element used internally by `<vaadin-menu-bar>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ContextMenuMixin
 * @mixes ControllerMixin
 * @mixes OverlayClassMixin
 * @mixes ThemePropertyMixin
 * @protected
 */
class MenuBarSubmenu extends ContextMenuMixin(OverlayClassMixin(ControllerMixin(ThemePropertyMixin(PolymerElement)))) {
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

  constructor() {
    super();

    this.openOn = 'opensubmenu';
  }

  /**
   * Tag name prefix used by overlay, list-box and items.
   * @protected
   * @return {string}
   */
  get _tagNamePrefix() {
    return 'vaadin-menu-bar';
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

  /**
   * Overriding the observer to not add global "contextmenu" listener.
   */
  _openedChanged(opened) {
    this._overlayElement.opened = opened;
  }

  /**
   * Overriding the public method to reset expanded button state.
   */
  close() {
    super.close();

    // Only handle 1st level submenu
    if (this.hasAttribute('is-root')) {
      this.getRootNode().host._close();
    }
  }
}

defineCustomElement(MenuBarSubmenu);
