/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { GridDefaultItem } from './vaadin-grid.js';
import { ColumnBaseMixinClass } from './vaadin-grid-column.js';

/**
 * A `<vaadin-grid-column-group>` is used to make groups of columns in `<vaadin-grid>` and
 * to configure additional headers and footers.
 *
 * Groups can be nested to create complex header and footer configurations.
 *
 * #### Example:
 * ```html
 * <vaadin-grid-column-group resizable id="columnGroup">
 *   <vaadin-grid-column id="column1"></vaadin-grid-column>
 *   <vaadin-grid-column id="column2"></vaadin-grid-column>
 * </vaadin-grid-column-group>
 * ```
 *
 * ```js
 * const columnGroup = document.querySelector('#columnGroup');
 * columnGroup.headerRenderer = (root, columnGroup) => {
 *   root.textContent = 'header';
 * }
 *
 * const column1 = document.querySelector('#column1');
 * column1.headerRenderer = (root, column) => { ... };
 * column1.renderer = (root, column, model) => { ... };
 *
 * const column2 = document.querySelector('#column2');
 * column2.headerRenderer = (root, column) => { ... };
 * column2.renderer = (root, column, model) => { ... };
 * ```
 */
declare class GridColumnGroup extends HTMLElement {
  /**
   * Flex grow ratio for the column group as the sum of the ratios of its child columns.
   * @attr {number} flex-grow
   */
  readonly flexGrow: number | null | undefined;

  /**
   * Width of the column group as the sum of the widths of its child columns.
   */
  readonly width: string | null | undefined;
}

interface GridColumnGroup<TItem = GridDefaultItem> extends ColumnBaseMixinClass<TItem> {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-grid-column-group': GridColumnGroup<GridDefaultItem>;
  }
}

export { GridColumnGroup };
