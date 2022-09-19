/**
 * @license
 * Copyright (c) 2019 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { DisabledMixin } from '@vaadin/component-base/src/disabled-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ButtonsMixin } from './vaadin-menu-bar-buttons-mixin.js';
import { InteractionsMixin } from './vaadin-menu-bar-interactions-mixin.js';

export interface MenuBarItem {
  /**
   * Text to be set as the menu button component's textContent.
   */
  text?: string;
  /**
   * Text to be set as the menu button's tooltip.
   * Requires a `<vaadin-tooltip slot="tooltip">` element to be added inside the `<vaadin-menu-bar>`.
   */
  tooltip?: string;
  /**
   * The component to represent the button content.
   * Either a tagName or an element instance. Defaults to "vaadin-context-menu-item".
   */
  component?: HTMLElement | string;
  /**
   * If true, the button is disabled and cannot be activated.
   */
  disabled?: boolean;
  /**
   * Theme(s) to be set as the theme attribute of the button, overriding any theme set on the menu bar.
   */
  theme?: string[] | string;
  /**
   * Array of submenu items.
   */
  children?: SubMenuItem[];
}

export interface SubMenuItem {
  text?: string;
  component?: HTMLElement | string;
  disabled?: boolean;
  theme?: string[] | string;
  checked?: boolean;
  children?: SubMenuItem[];
}

export interface MenuBarI18n {
  moreOptions: string;
}

/**
 * Fired when a submenu item or menu bar button without children is clicked.
 */
export type MenuBarItemSelectedEvent = CustomEvent<{ value: MenuBarItem }>;

export interface MenuBarCustomEventMap {
  'item-selected': MenuBarItemSelectedEvent;
}

export interface MenuBarEventMap extends HTMLElementEventMap, MenuBarCustomEventMap {}

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
 * The following state attributes are available for styling:
 *
 * Attribute           | Description
 * --------------------|----------------------------------
 * `disabled`          | Set when the menu bar is disabled
 * `has-single-button` | Set when there is only one button visible
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/custom-theme/styling-components) documentation.
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
declare class MenuBar extends ButtonsMixin(
  DisabledMixin(InteractionsMixin(ElementMixin(ThemableMixin(ControllerMixin(HTMLElement))))),
) {
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

  /**
   * The object used to localize this component.
   * To change the default localization, replace the entire
   * `i18n` object with a custom one.
   *
   * To update individual properties, extend the existing i18n object like so:
   * ```
   * menuBar.i18n = {
   *   ...menuBar.i18n,
   *   moreOptions: 'More options'
   * }
   * ```
   *
   * The object has the following JSON structure and default values:
   * ```
   * {
   *   moreOptions: 'More options'
   * }
   * ```
   */
  i18n: MenuBarI18n;

  addEventListener<K extends keyof MenuBarEventMap>(
    type: K,
    listener: (this: MenuBar, ev: MenuBarEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof MenuBarEventMap>(
    type: K,
    listener: (this: MenuBar, ev: MenuBarEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;

  /**
   * A callback for the `_theme` property observer.
   * It propagates the host theme to the buttons and the sub menu.
   */
  protected _themeChanged(theme: string | null): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-menu-bar': MenuBar;
  }
}

export { MenuBar };
