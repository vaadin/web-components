/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-context-menu-item.js';
import './vaadin-context-menu-list-box.js';
import type { Constructor } from '@open-wc/dedupe-mixin';

export type ContextMenuItemData<TItemData extends object = object> = {
  text?: string;
  /**
   * Text to be set as the menu item's tooltip.
   * Requires a `<vaadin-tooltip slot="tooltip">` element to be added inside the `<vaadin-context-menu>`.
   */
  tooltip?: string;
  /**
   * Position of the item's tooltip relative to the item
   * (e.g. `end`, `top`, `bottom-start`). Items with a sub-menu default to `start` to
   * avoid overlap with the opening sub-menu; all other items, including disabled ones
   * (whose sub-menus cannot be opened), default to `end`. If the slotted
   * `<vaadin-tooltip>` has its `position` property set, that value is used instead.
   */
  tooltipPosition?: string;
  component?: HTMLElement | string;
  disabled?: boolean;
  checked?: boolean;
  keepOpen?: boolean;
  theme?: string[] | string;
  className?: string;
  children?: Array<ContextMenuItemData<TItemData>>;
} & TItemData;

/**
 * @deprecated Use `ContextMenuItemData` instead.
 */
export type ContextMenuItem<TItemData extends object = object> = ContextMenuItemData<TItemData>;

export declare function ItemsMixin<T extends Constructor<HTMLElement>>(base: T): Constructor<ItemsMixinClass> & T;

export declare class ItemsMixinClass<TItem extends ContextMenuItemData = ContextMenuItemData> {
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
   *
   * #### Item tooltips
   *
   * Menu items can have tooltips that are shown on hover and keyboard
   * focus. To enable them, add a slotted `<vaadin-tooltip>` element
   * and set the `tooltip` property on each item that should have one:
   *
   * ```html
   * <vaadin-context-menu>
   *   <vaadin-tooltip slot="tooltip"></vaadin-tooltip>
   * </vaadin-context-menu>
   * ```
   */
  items: TItem[] | undefined;

  /**
   * Tag name prefix used by overlay, list-box and items.
   */
  protected readonly _tagNamePrefix: string;
}
