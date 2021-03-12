/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { ButtonElement } from '@vaadin/vaadin-button/src/vaadin-button.js';

/**
 * The Drawer Toggle component controls the drawer in App Layout component.
 *
 * ```
 * <vaadin-app-layout>
 *   <vaadin-drawer-toggle slot="navbar">Toggle drawer</vaadin-drawer-toggle>
 * </vaadin-app-layout>
 * ```
 */
class DrawerToggleElement extends ButtonElement {
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

        #button {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: inherit;
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
      <button id="button" type="button" aria-label$="[[ariaLabel]]"></button>
    `;
  }

  static get is() {
    return 'vaadin-drawer-toggle';
  }

  static get properties() {
    return {
      ariaLabel: {
        type: String,
        value: 'Toggle'
      }
    };
  }

  constructor() {
    super();

    this.addEventListener('click', () => {
      if (!this.disabled) {
        this._fireClick();
      }
    });

    this.addEventListener('keyup', (event) => {
      if (/^( |SpaceBar|Enter)$/.test(event.key) && !this.disabled) {
        this._fireClick();
      }
    });
  }

  _fireClick() {
    this.dispatchEvent(new CustomEvent('drawer-toggle-click', { bubbles: true, composed: true }));
  }
}

customElements.define(DrawerToggleElement.is, DrawerToggleElement);

export { DrawerToggleElement };
