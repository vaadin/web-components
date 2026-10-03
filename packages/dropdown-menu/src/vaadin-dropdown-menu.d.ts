/**
 * @license
 * Copyright (c) 2026 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { ElementMixinClass } from '@vaadin/component-base/src/element-mixin.js';
import type { ContextMenuItem as ContextMenuItemElement } from '@vaadin/context-menu/src/vaadin-context-menu-item.js';
import type { ContextMenuItemData } from '@vaadin/context-menu/src/vaadin-contextmenu-items-mixin.js';
import type { DropdownMenuMixinClass, DropdownMenuPosition } from './vaadin-dropdown-menu-mixin.js';

export { DropdownMenuPosition };

export type DropdownMenuItem<TItemData extends object = object> = ContextMenuItemData<TItemData>;

/**
 * Fired when an item is selected. The `detail.value` is the item object
 * with `items`, and the item element with a slotted list-box.
 */
export type DropdownMenuItemSelectedEvent<TItem extends DropdownMenuItem = DropdownMenuItem> = CustomEvent<{
  value: TItem | ContextMenuItemElement;
}>;

/**
 * Fired when the `opened` property changes.
 */
export type DropdownMenuOpenedChangedEvent = CustomEvent<{ value: boolean }>;

/**
 * Fired when the menu is closed.
 */
export type DropdownMenuClosedEvent = CustomEvent;

export interface DropdownMenuCustomEventMap<TItem extends DropdownMenuItem = DropdownMenuItem> {
  'item-selected': DropdownMenuItemSelectedEvent<TItem>;

  'opened-changed': DropdownMenuOpenedChangedEvent;

  closed: DropdownMenuClosedEvent;
}

export interface DropdownMenuEventMap<TItem extends DropdownMenuItem = DropdownMenuItem>
  extends HTMLElementEventMap, DropdownMenuCustomEventMap<TItem> {}

/**
 * `<vaadin-dropdown-menu>` is a Web Component that shows a button
 * which opens a dropdown menu of actions.
 *
 * Define the menu with the `items` property:
 *
 * ```html
 * <vaadin-dropdown-menu label="Actions"></vaadin-dropdown-menu>
 * ```
 * ```js
 * const menu = document.querySelector('vaadin-dropdown-menu');
 * menu.items = [
 *   { text: 'Edit' },
 *   { text: 'Share', children: [{ text: 'By email' }, { text: 'By link' }] },
 *   { component: 'hr' },
 *   { text: 'Delete', disabled: true },
 * ];
 * menu.addEventListener('item-selected', (e) => console.log(e.detail.value.text));
 * ```
 *
 * Or with a slotted list-box:
 *
 * ```html
 * <vaadin-dropdown-menu label="Actions">
 *   <vaadin-context-menu-list-box slot="overlay">
 *     <vaadin-context-menu-item>Edit</vaadin-context-menu-item>
 *     <vaadin-context-menu-item>Delete</vaadin-context-menu-item>
 *   </vaadin-context-menu-list-box>
 * </vaadin-dropdown-menu>
 * ```
 *
 * When an item is selected, the `item-selected` event is fired. Its `detail.value`
 * is the item object with `items`, and the item element with a slotted list-box.
 *
 * ### Custom button
 *
 * To customize the button content, e.g. to add an icon, provide a
 * `<vaadin-dropdown-menu-button>` in the `button` slot. In this case,
 * the `label` property is ignored:
 *
 * ```html
 * <vaadin-dropdown-menu>
 *   <vaadin-dropdown-menu-button slot="button">
 *     <vaadin-icon icon="vaadin:cog" slot="prefix"></vaadin-icon>
 *     Settings
 *   </vaadin-dropdown-menu-button>
 * </vaadin-dropdown-menu>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name  | Description
 * -----------|---------------------------
 * `backdrop` | Backdrop of the overlay
 * `overlay`  | The overlay container
 * `content`  | The overlay content
 *
 * The following state attributes are available for styling:
 *
 * Attribute        | Description
 * -----------------|-------------------------------------------
 * `opened`         | Set when the menu is open
 * `disabled`       | Set when the component is disabled
 * `focus-ring`     | Set when the button is focused using the keyboard
 * `opening`        | Set when the overlay is opening
 * `closing`        | Set when the overlay is closing
 * `top-aligned`    | Set when the overlay is aligned to the top of the button
 * `bottom-aligned` | Set when the overlay is aligned to the bottom of the button
 * `start-aligned`  | Set when the overlay is aligned to the start of the button
 * `end-aligned`    | Set when the overlay is aligned to the end of the button
 *
 * The following custom CSS properties are available for styling:
 *
 * Custom CSS property                     | Description
 * ----------------------------------------|-------------
 * `--vaadin-dropdown-menu-overlay-width`  | Minimum width of the menu overlay. Defaults to the button width
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @slot button - Slot for a custom `<vaadin-dropdown-menu-button>`, used instead of the default one
 *
 * @fires {CustomEvent} item-selected - Fired when an item is selected.
 * @fires {CustomEvent} opened-changed - Fired when the `opened` property changes.
 * @fires {CustomEvent} closed - Fired when the menu is closed.
 */
declare class DropdownMenu<TItem extends DropdownMenuItem = DropdownMenuItem> extends HTMLElement {
  addEventListener<K extends keyof DropdownMenuEventMap>(
    type: K,
    listener: (this: DropdownMenu<TItem>, ev: DropdownMenuEventMap<TItem>[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof DropdownMenuEventMap>(
    type: K,
    listener: (this: DropdownMenu<TItem>, ev: DropdownMenuEventMap<TItem>[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

interface DropdownMenu<TItem extends DropdownMenuItem = DropdownMenuItem>
  extends DropdownMenuMixinClass<TItem>, ElementMixinClass {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-dropdown-menu': DropdownMenu;
  }
}

export { DropdownMenu };
