/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { buttonStyles } from '@vaadin/button/src/vaadin-button-base.js';
import { ButtonMixin } from '@vaadin/button/src/vaadin-button-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { isEmptyTextNode } from '@vaadin/component-base/src/dom-utils.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { drawerToggle } from './vaadin-drawer-toggle-styles.js';

registerStyles('vaadin-drawer-toggle', [buttonStyles, drawerToggle], { moduleId: 'vaadin-drawer-toggle-styles' });

/**
 * The Drawer Toggle component controls the drawer in App Layout component.
 *
 * ```
 * <vaadin-app-layout>
 *   <vaadin-drawer-toggle slot="navbar">Toggle drawer</vaadin-drawer-toggle>
 * </vaadin-app-layout>
 * ```
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ButtonMixin
 * @mixes DirMixin
 * @mixes ThemableMixin
 */
class DrawerToggle extends ButtonMixin(DirMixin(ThemableMixin(PolymerElement))) {
  static get template() {
    return html`
      <slot id="slot">
        <div part="icon"></div>
      </slot>
      <div part="icon" hidden$="[[!_showFallbackIcon]]"></div>
    `;
  }

  static get is() {
    return 'vaadin-drawer-toggle';
  }

  static get properties() {
    return {
      ariaLabel: {
        type: String,
        value: 'Toggle navigation panel',
        reflectToAttribute: true,
      },

      /** @private */
      _showFallbackIcon: {
        type: Boolean,
        value: false,
      },
    };
  }

  constructor() {
    super();

    this.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('drawer-toggle-click', { bubbles: true, composed: true }));
    });
  }

  /** @protected */
  ready() {
    super.ready();

    this._toggleFallbackIcon();

    this.$.slot.addEventListener('slotchange', () => {
      this._toggleFallbackIcon();
    });
  }

  /** @private */
  _toggleFallbackIcon() {
    const nodes = this.$.slot.assignedNodes();

    // Show fallback icon if there are 1-2 empty text nodes assigned to the default slot.
    this._showFallbackIcon = nodes.length > 0 && nodes.every((node) => isEmptyTextNode(node));
  }
}

defineCustomElement(DrawerToggle);

export { DrawerToggle };
