import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';

import { ButtonsMixin } from './vaadin-menu-bar-buttons-mixin.js';

import { InteractionsMixin } from './vaadin-menu-bar-interactions-mixin.js';

import { MenuBarEventMap, MenuBarItem } from './interfaces';

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
 * @fires {CustomEvent} item-selected - Fired when a submenu item or menu bar button without children is clicked.
 */
declare class MenuBarElement extends ButtonsMixin(InteractionsMixin(ElementMixin(ThemableMixin(HTMLElement)))) {
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
   */
  items: MenuBarItem[];

  addEventListener<K extends keyof MenuBarEventMap>(
    type: K,
    listener: (this: MenuBarElement, ev: MenuBarEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof MenuBarEventMap>(
    type: K,
    listener: (this: MenuBarElement, ev: MenuBarEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-menu-bar': MenuBarElement;
  }
}

export { MenuBarElement };
