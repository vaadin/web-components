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
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name    | Description
 * -------------|------------
 * `icon`       | The icon element
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description
 * -------------|------------
 * `focus-ring` | Set when the element is focused using the keyboard
 * `focused`    | Set when the element is focused
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                |
 * :----------------------------------|
 * | `--vaadin-button-background`     |
 * | `--vaadin-button-border-color`   |
 * | `--vaadin-button-border-radius`  |
 * | `--vaadin-button-border-width`   |
 * | `--vaadin-button-font-size`      |
 * | `--vaadin-button-line-height`    |
 * | `--vaadin-button-margin`         |
 * | `--vaadin-button-padding`        |
 * | `--vaadin-button-text-color`     |
 * | `--vaadin-icon-size`             |
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
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
