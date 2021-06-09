import { GridDefaultItem } from './interfaces';
import { ColumnBaseMixin, GridColumnElement } from './vaadin-grid-column.js';

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
declare class GridColumnGroupElement<TItem = GridDefaultItem> extends HTMLElement {
  /**
   * Flex grow ratio for the column group as the sum of the ratios of its child columns.
   * @attr {number} flex-grow
   */
  readonly flexGrow: number | null | undefined;

  /**
   * Width of the column group as the sum of the widths of its child columns.
   */
  readonly width: string | null | undefined;

  _columnPropChanged(path: string, value?: unknown | null): void;

  _updateFlexAndWidth(): void;

  _getChildColumns(el: GridColumnGroupElement<TItem>): GridColumnElement<TItem>[];

  _isColumnElement(node: Node): boolean;
}

interface GridColumnGroupElement<TItem = GridDefaultItem> extends ColumnBaseMixin<TItem> {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-grid-column-group': GridColumnGroupElement<GridDefaultItem>;
  }
}

export { GridColumnGroupElement };
