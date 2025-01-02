/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { buttonStyles } from '@vaadin/button/src/vaadin-button-base.js';
import { ButtonMixin } from '@vaadin/button/src/vaadin-button-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { isEmptyTextNode } from '@vaadin/component-base/src/dom-utils.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { drawerToggle } from './vaadin-drawer-toggle-styles.js';

/**
 * LitElement based version of `<vaadin-drawer-toggle>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
class DrawerToggle extends ButtonMixin(DirMixin(ThemableMixin(PolylitMixin(LitElement)))) {
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
