/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import { Item } from '@vaadin/item/src/vaadin-item.js';
import { ListBox } from '@vaadin/list-box/src/vaadin-list-box.js';

export interface ContextMenuItem {
  text?: string;
  component?: HTMLElement | string;
  disabled?: boolean;
  checked?: boolean;
  theme?: string[] | string;
  children?: ContextMenuItem[];
}

/**
 * An element used internally by `<vaadin-context-menu>`. Not intended to be used separately.
 *
 * @protected
 */
declare class ContextMenuItemElement extends Item {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-context-menu-item': ContextMenuItemElement;
    'vaadin-context-menu-list-box': ContextMenuListBox;
  }
}

/**
 * An element used internally by `<vaadin-context-menu>`. Not intended to be used separately.
 *
 * @protected
 */
declare class ContextMenuListBox extends ListBox {}

export declare function ItemsMixin<T extends Constructor<HTMLElement>>(base: T): Constructor<ItemsMixinClass> & T;

export declare class ItemsMixinClass {
  /**
   * Defines a (hierarchical) menu structure for the component.
   * If a menu item has a non-empty `children` set, a sub-menu with the child items is opened
   * next to the parent menu on mouseover, tap or a right arrow keypress.
   *
   * The items API can't be used together with a renderer!
   *
   * #### Example
   *
   * ```javascript
   * contextMenu.items = [
   *   {text: 'Menu Item 1', theme: 'primary', children:
   *     [
   *       {text: 'Menu Item 1-1', checked: true},
   *       {text: 'Menu Item 1-2'}
   *     ]
   *   },
   *   {component: 'hr'},
   *   {text: 'Menu Item 2', children:
   *     [
   *       {text: 'Menu Item 2-1'},
   *       {text: 'Menu Item 2-2', disabled: true}
   *     ]
   *   },
   *   {text: 'Menu Item 3', disabled: true}
   * ];
   * ```
   */
  items: ContextMenuItem[] | undefined;

  protected readonly __isRTL: boolean;
}
