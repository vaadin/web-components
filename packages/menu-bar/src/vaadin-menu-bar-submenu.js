/**
 * @license
 * Copyright (c) 2019 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-menu-bar-item.js';
import './vaadin-menu-bar-list-box.js';
import './vaadin-menu-bar-overlay.js';
import { css, html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ContextMenuMixin } from '@vaadin/context-menu/src/vaadin-context-menu-mixin.js';
import { ThemePropertyMixin } from '@vaadin/vaadin-themable-mixin/vaadin-theme-property-mixin.js';

/**
 * An element used internally by `<vaadin-menu-bar>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ContextMenuMixin
 * @mixes ThemePropertyMixin
 * @protected
 */
class MenuBarSubmenu extends ContextMenuMixin(ThemePropertyMixin(PolylitMixin(LitElement))) {
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

  static get properties() {
    return {
      isRoot: {
        type: Boolean,
        reflectToAttribute: true,
        sync: true,
      },
    };
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

  /** @protected */
  render() {
    return html`
      <vaadin-menu-bar-overlay
        id="overlay"
        .owner="${this}"
        .opened="${this.opened}"
        .model="${this._context}"
        .modeless="${this._modeless}"
        .renderer="${this.__itemsRenderer}"
        .withBackdrop="${this._phone}"
        .positionTarget="${this._positionTarget}"
        ?no-horizontal-overlap="${!this.isRoot}"
        ?phone="${this._phone}"
        theme="${ifDefined(this._theme)}"
        exportparts="backdrop, overlay, content"
        @opened-changed="${this._onOverlayOpened}"
        @vaadin-overlay-open="${this._onVaadinOverlayOpen}"
      >
        <slot name="overlay"></slot>
        <slot name="submenu" slot="submenu"></slot>
      </vaadin-menu-bar-overlay>
    `;
  }

  /**
   * Overriding the observer to not add global "contextmenu" listener.
   * @override
   */
  _openedChanged() {
    // Do nothing
  }

  /**
   * Overriding the public method to reset expanded button state.
   */
  close() {
    super.close();

    // Only handle 1st level submenu
    if (this.hasAttribute('is-root')) {
      this.parentElement._close();
    }
  }

  /**
   * Override method from `ContextMenuMixin` to prevent closing
   * sub-menu on the same click event that was used to open it.
   *
   * @param {Event} event
   * @return {boolean}
   * @protected
   * @override
   */
  _shouldCloseOnOutsideClick(event) {
    if (this.hasAttribute('is-root') && event.composedPath().includes(this.listenOn)) {
      return false;
    }

    return super._shouldCloseOnOutsideClick(event);
  }
}

defineCustomElement(MenuBarSubmenu);

export { MenuBarSubmenu };
