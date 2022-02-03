/**
 * @license
 * Copyright (c) 2018 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { Button } from '@vaadin/button/src/vaadin-button.js';

/**
 * The Drawer Toggle component controls the drawer in App Layout component.
 *
 * ```
 * <vaadin-app-layout>
 *   <vaadin-drawer-toggle slot="navbar">Toggle drawer</vaadin-drawer-toggle>
 * </vaadin-app-layout>
 * ```
 *
 * @extends Button
 */
class DrawerToggle extends Button {
  static get template() {
    return html`
      <style>
        :host {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: default;
          position: relative;
          outline: none;
          height: 24px;
          width: 24px;
          padding: 4px;
        }

        [part='icon'],
        [part='icon']::after,
        [part='icon']::before {
          position: absolute;
          top: 8px;
          height: 3px;
          width: 24px;
          background-color: #000;
        }

        [part='icon']::after,
        [part='icon']::before {
          content: '';
        }

        [part='icon']::after {
          top: 6px;
        }

        [part='icon']::before {
          top: 12px;
        }
      </style>
      <slot>
        <div part="icon"></div>
      </slot>
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
        reflectToAttribute: true
      }
    };
  }

  constructor() {
    super();

    this.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('drawer-toggle-click', { bubbles: true, composed: true }));
    });
  }
}

customElements.define(DrawerToggle.is, DrawerToggle);

export { DrawerToggle };
