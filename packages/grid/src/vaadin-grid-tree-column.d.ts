/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { GridDefaultItem } from './vaadin-grid.js';
import { GridColumn } from './vaadin-grid-column.js';

/**
 * `<vaadin-grid-tree-column>` is a helper element for the `<vaadin-grid>`
 * that provides default renderer and functionality for toggling tree/hierarchical items.
 *
 * #### Example:
 * ```html
 * <vaadin-grid items="[[items]]">
 *  <vaadin-grid-tree-column path="name.first"></vaadin-grid-tree-column>
 *
 *  <vaadin-grid-column>
 *    ...
 * ```
 */
declare class GridTreeColumn<TItem = GridDefaultItem> extends GridColumn<TItem> {
  /**
   * JS Path of the property in the item used as text content for the tree toggle.
   */
  path: string | null | undefined;

  /**
   * JS Path of the property in the item that indicates whether the item has child items.
   * @attr {string} item-has-children-path
   * @deprecated Use `grid.itemHasChildrenPath` instead.
   */
  itemHasChildrenPath: string | null | undefined;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-grid-tree-column': GridTreeColumn<GridDefaultItem>;
  }
}

export { GridTreeColumn };
