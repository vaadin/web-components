/**
 * @license
 * Copyright (c) 2019 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { DisabledMixinClass } from '@vaadin/a11y-base/src/disabled-mixin.js';
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { ThemableMixinClass } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import type { MenuBarItem, MenuBarMixinClass } from './vaadin-menu-bar-mixin.js';

export { MenuBarItem, MenuBarI18n, SubMenuItem } from './vaadin-menu-bar-mixin.js';

/**
 * Fired when a submenu item or menu bar button without children is clicked.
 */
export type MenuBarItemSelectedEvent<TItem extends MenuBarItem = MenuBarItem> = CustomEvent<{ value: TItem }>;

export interface MenuBarCustomEventMap<TItem extends MenuBarItem = MenuBarItem> {
  'item-selected': MenuBarItemSelectedEvent<TItem>;
}

export interface MenuBarEventMap<TItem extends MenuBarItem = MenuBarItem>
  extends HTMLElementEventMap,
    MenuBarCustomEventMap<TItem> {}

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
 *
 * The following state attributes are available for styling:
 *
 * Attribute           | Description
 * --------------------|----------------------------------
 * `disabled`          | Set when the menu bar is disabled
 * `has-single-button` | Set when there is only one button visible
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * ### Internal components
 *
 * In addition to `<vaadin-menu-bar>` itself, the following internal
 * components are themable:
 *
 * - `<vaadin-menu-bar-button>` - has the same API as [`<vaadin-button>`](#/elements/vaadin-button).
 * - `<vaadin-menu-bar-item>` - has the same API as [`<vaadin-item>`](#/elements/vaadin-item).
 * - `<vaadin-menu-bar-list-box>` - has the same API as [`<vaadin-list-box>`](#/elements/vaadin-list-box).
 * - `<vaadin-menu-bar-overlay>` - has the same API as [`<vaadin-overlay>`](#/elements/vaadin-overlay).
 *
 * The `<vaadin-menu-bar-item>` sub-menu elements have the following additional state attributes
 * on top of the built-in `<vaadin-item>` state attributes:
 *
 * Attribute  | Description
 * ---------- |-------------
 * `expanded` | Expanded parent item.
 *
 * Note: the `theme` attribute value set on `<vaadin-menu-bar>` is
 * propagated to the internal components listed above.
 *
 * @fires {CustomEvent} item-selected - Fired when a submenu item or menu bar button without children is clicked.
 */
declare class MenuBar<TItem extends MenuBarItem = MenuBarItem> extends HTMLElement {
  addEventListener<K extends keyof MenuBarEventMap<TItem>>(
    type: K,
    listener: (this: MenuBar<TItem>, ev: MenuBarEventMap<TItem>[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof MenuBarEventMap<TItem>>(
    type: K,
    listener: (this: MenuBar<TItem>, ev: MenuBarEventMap<TItem>[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

interface MenuBar<TItem extends MenuBarItem = MenuBarItem>
  extends MenuBarMixinClass<TItem>,
    DisabledMixinClass,
    ElementMixinClass,
    ThemableMixinClass {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-menu-bar': MenuBar;
  }
}

export { MenuBar };
