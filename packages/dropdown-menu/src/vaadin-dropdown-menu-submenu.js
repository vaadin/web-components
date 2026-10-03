/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import '@vaadin/context-menu/src/vaadin-context-menu-item.js';
import '@vaadin/context-menu/src/vaadin-context-menu-list-box.js';
import '@vaadin/context-menu/src/vaadin-context-menu-overlay.js';
import { css, html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ContextMenuMixin } from '@vaadin/context-menu/src/vaadin-context-menu-mixin.js';

/**
 * An element used internally by `<vaadin-dropdown-menu>`. Not intended to be used separately.
 *
 * @customElement vaadin-dropdown-menu-submenu
 * @extends HTMLElement
 * @protected
 */
class DropdownMenuSubmenu extends ContextMenuMixin(DirMixin(PolylitMixin(LitElement))) {
  static get is() {
    return 'vaadin-dropdown-menu-submenu';
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

  constructor() {
    super();

    this.openOn = 'opensubmenu';
  }

  /** @protected */
  render() {
    return html`
      <vaadin-context-menu-overlay
        id="overlay"
        .owner="${this}"
        .opened="${this.opened}"
        .model="${this._context}"
        .modeless="${this._modeless}"
        .renderer="${this.__itemsRenderer}"
        .withBackdrop="${this._phone}"
        .positionTarget="${this._positionTarget}"
        no-horizontal-overlap
        ?phone="${this._phone}"
        exportparts="backdrop, overlay, content"
        @opened-changed="${this._onOverlayOpened}"
        @vaadin-overlay-open="${this._onVaadinOverlayOpen}"
      >
        <slot name="overlay"></slot>
        <slot name="submenu" slot="submenu"></slot>
      </vaadin-context-menu-overlay>
    `;
  }

  /**
   * Override method from `ContextMenuMixin` to not toggle user-select on the target.
   * @protected
   * @override
   */
  _openedChanged() {
    // Do nothing
  }

  /**
   * Override method from `ContextMenuMixin` to not react to global "contextmenu" events.
   * @private
   * @override
   */
  __onGlobalContextMenu() {
    // Do nothing
  }
}

defineCustomElement(DropdownMenuSubmenu);

export { DropdownMenuSubmenu };
