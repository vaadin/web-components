import { ItemElement } from '@vaadin/vaadin-item/src/vaadin-item.js';

import { ListBoxElement } from '@vaadin/vaadin-list-box/src/vaadin-list-box.js';

import { ContextMenuElement } from './vaadin-context-menu.js';

import { ContextMenuItem, ContextMenuRendererContext } from './interfaces';

/**
 * An element used internally by `<vaadin-context-menu>`. Not intended to be used separately.
 *
 * @protected
 */
declare class ContextMenuItemElement extends ItemElement {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-context-menu-item': ContextMenuItemElement;
    'vaadin-context-menu-list-box': ContextMenuListBoxElement;
  }
}

/**
 * An element used internally by `<vaadin-context-menu>`. Not intended to be used separately.
 *
 * @protected
 */
declare class ContextMenuListBoxElement extends ListBoxElement {}

declare function ItemsMixin<T extends new (...args: any[]) => {}>(base: T): T & ItemsMixinConstructor;

interface ItemsMixinConstructor {
  new (...args: any[]): ItemsMixin;
}

interface ItemsMixin {
  readonly __isRTL: boolean;

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
   *   {text: 'Menu Item 1', children:
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

  __forwardFocus(): void;

  __itemsRenderer(root: HTMLElement, menu: ContextMenuElement, context: ContextMenuRendererContext): void;
}

export { ItemsMixin, ItemsMixinConstructor };
