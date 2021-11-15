/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';
import { ButtonsMixin } from './vaadin-menu-bar-buttons-mixin.js';
import { InteractionsMixin } from './vaadin-menu-bar-interactions-mixin.js';
import './vaadin-menu-bar-submenu.js';
import './vaadin-menu-bar-button.js';

/**
 * `<vaadin-menu-bar>` is a Web Component providing a set of horizontally stacked buttons offering
 * the user quick access to a consistent set of commands. Each button can toggle a submenu with
 * support for additional levels of nested menus.
 *
 * To create the menu bar, first add the component to the page:
 *
 * ```
 * <vaadin-menu-bar></vaadin-menu-bar>
 * ```
 *
 * And then use [`items`](#/elements/vaadin-menu-bar#property-items) property to initialize the structure:
 *
 * ```
 * document.querySelector('vaadin-menu-bar').items = [{text: 'File'}, {text: 'Edit'}];
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are exposed for styling:
 *
 * Part name         | Description
 * ------------------|----------------
 * `container`       | The container wrapping menu bar buttons.
 * `menu-bar-button` | The menu bar button.
 * `overflow-button` | The "overflow" button appearing when menu bar width is not enough to fit all the buttons.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * ### Internal components
 *
 * In addition to `<vaadin-menu-bar>` itself, the following internal
 * components are themable:
 *
 * - `<vaadin-menu-bar-button>` - has the same API as [`<vaadin-button>`](#/elements/vaadin-button).
 * - `<vaadin-context-menu-item>` - has the same API as [`<vaadin-item>`](#/elements/vaadin-item).
 * - `<vaadin-context-menu-list-box>` - has the same API as [`<vaadin-list-box>`](#/elements/vaadin-list-box).
 * - `<vaadin-context-menu-overlay>` - has the same API as [`<vaadin-overlay>`](#/elements/vaadin-overlay).
 *
 * @fires {CustomEvent<boolean>} item-selected - Fired when a submenu item or menu bar button without children is clicked.
 *
 * @extends HTMLElement
 * @mixes ButtonsMixin
 * @mixes InteractionsMixin
 * @mixes ElementMixin
 * @mixes ThemableMixin
 */
class MenuBarElement extends ButtonsMixin(InteractionsMixin(ElementMixin(ThemableMixin(PolymerElement)))) {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none !important;
        }

        [part='container'] {
          position: relative;
          display: flex;
          width: 100%;
          flex-wrap: nowrap;
          overflow: hidden;
        }

        [part$='button'] {
          flex-shrink: 0;
        }

        [part='overflow-button'] {
          margin-right: 0;
        }

        .dots::before {
          display: block;
          content: '\\00B7\\00B7\\00B7';
          font-size: inherit;
          line-height: inherit;
        }
      </style>

      <div part="container">
        <vaadin-menu-bar-button part="overflow-button" hidden$="[[!_hasOverflow]]">
          <div class="dots"></div>
        </vaadin-menu-bar-button>
      </div>
      <vaadin-menu-bar-submenu is-root=""></vaadin-menu-bar-submenu>
    `;
  }

  static get is() {
    return 'vaadin-menu-bar';
  }

  static get version() {
    return '21.0.4';
  }

  static get properties() {
    return {
      /**
       * @typedef MenuBarItem
       * @type {object}
       * @property {string} text - Text to be set as the menu button component's textContent.
       * @property {union: string | object} component - The component to represent the button content.
       * Either a tagName or an element instance. Defaults to "vaadin-context-menu-item".
       * @property {boolean} disabled - If true, the button is disabled and cannot be activated.
       * @property {SubMenuItem[]} children - Array of submenu items.
       */

      /**
       * @typedef SubMenuItem
       * @type {object}
       * @property {string} text - Text to be set as the menu item component's textContent.
       * @property {union: string | object} component - The component to represent the item.
       * Either a tagName or an element instance. Defaults to "vaadin-context-menu-item".
       * @property {boolean} disabled - If true, the item is disabled and cannot be selected.
       * @property {boolean} checked - If true, the item shows a checkmark next to it.
       * @property {SubMenuItem[]} children - Array of child submenu items.
       */

      /**
       * Defines a hierarchical structure, where root level items represent menu bar buttons,
       * and `children` property configures a submenu with items to be opened below
       * the button on click, Enter, Space, Up and Down arrow keys.
       *
       * #### Example
       *
       * ```js
       * menubar.items = [
       *   {
       *     text: 'File',
       *     children: [
       *       {text: 'Open'}
       *       {text: 'Auto Save', checked: true},
       *     ]
       *   },
       *   {component: 'hr'},
       *   {
       *     text: 'Edit',
       *     children: [
       *       {text: 'Undo', disabled: true},
       *       {text: 'Redo'}
       *     ]
       *   },
       *   {text: 'Help'}
       * ];
       * ```
       *
       * @type {!Array<!MenuBarItem>}
       */
      items: {
        type: Array,
        value: () => []
      }
    };
  }

  /**
   * Fired when either a submenu item or menu bar button without nested children is clicked.
   *
   * @event item-selected
   * @param {Object} detail
   * @param {Object} detail.value the selected menu bar item
   */
}

customElements.define(MenuBarElement.is, MenuBarElement);

export { MenuBarElement };
