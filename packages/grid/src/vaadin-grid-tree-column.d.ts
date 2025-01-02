/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { GridDefaultItem } from './vaadin-grid.js';
import type { GridColumn, GridColumnMixin } from './vaadin-grid-column.js';
import type { GridTreeColumnMixinClass } from './vaadin-grid-tree-column-mixin.js';

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

declare class GridTreeColumn<TItem = GridDefaultItem> extends HTMLElement {}

interface GridTreeColumn<TItem = GridDefaultItem>
  extends GridTreeColumnMixinClass<TItem>,
    GridColumnMixin<TItem, GridColumn<TItem>>,
    GridColumn<TItem> {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-grid-tree-column': GridTreeColumn<GridDefaultItem>;
  }
}

export { GridTreeColumn };
