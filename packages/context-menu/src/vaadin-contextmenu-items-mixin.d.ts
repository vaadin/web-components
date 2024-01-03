/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-context-menu-item.js';
import './vaadin-context-menu-list-box.js';
import type { Constructor } from '@open-wc/dedupe-mixin';

export interface ContextMenuItem {
  text?: string;
  component?: HTMLElement | string;
  disabled?: boolean;
  checked?: boolean;
  keepOpen?: boolean;
  theme?: string[] | string;
  className?: string;
  children?: ContextMenuItem[];
}

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
   *   { text: 'Menu Item 1', theme: 'primary', className: 'first', children:
   *     [
   *       { text: 'Menu Item 1-1', checked: true, keepOpen: true },
   *       { text: 'Menu Item 1-2' }
   *     ]
   *   },
   *   { component: 'hr' },
   *   { text: 'Menu Item 2', children:
   *     [
   *       { text: 'Menu Item 2-1' },
   *       { text: 'Menu Item 2-2', disabled: true }
   *     ]
   *   },
   *   { text: 'Menu Item 3', disabled: true, className: 'last' }
   * ];
   * ```
   */
  items: ContextMenuItem[] | undefined;

  /**
   * Tag name prefix used by overlay, list-box and items.
   */
  protected readonly _tagNamePrefix: string;
}
