/**
 * @license
 * Copyright (c) 2018 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { Button } from '@vaadin/button/src/vaadin-button.js';
import { isEmptyTextNode } from '@vaadin/component-base/src/dom-utils.js';

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
      <slot id="slot">
        <div part="icon"></div>
      </slot>
      <div part="icon" hidden$="[[!_showFallbackIcon]]"></div>
      <slot name="tooltip"></slot>
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

    this._observer = new FlattenedNodesObserver(this, () => {
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

customElements.define(DrawerToggle.is, DrawerToggle);

export { DrawerToggle };
