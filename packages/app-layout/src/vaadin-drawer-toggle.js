/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { buttonStyles } from '@vaadin/button/src/styles/vaadin-button-base-styles.js';
import { ButtonMixin } from '@vaadin/button/src/vaadin-button-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { isEmptyTextNode } from '@vaadin/component-base/src/dom-utils.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { drawerToggle } from './styles/vaadin-drawer-toggle-base-styles.js';

/**
 * The Drawer Toggle component controls the drawer in App Layout component.
 *
 * ```html
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
class DrawerToggle extends ButtonMixin(DirMixin(ThemableMixin(PolylitMixin(LumoInjectionMixin(LitElement))))) {
  static get is() {
    return 'vaadin-drawer-toggle';
  }

  static get styles() {
    return [buttonStyles, drawerToggle];
  }

  static get properties() {
    return {
      ariaLabel: {
        type: String,
        value: 'Toggle navigation panel',
        reflectToAttribute: true,
        sync: true,
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
  render() {
    return html`
      <slot id="slot" @slotchange="${this._toggleFallbackIcon}">
        <div part="icon"></div>
      </slot>
      <div part="icon" ?hidden="${!this._showFallbackIcon}"></div>
    `;
  }

  /** @protected */
  ready() {
    super.ready();

    this._toggleFallbackIcon();
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
