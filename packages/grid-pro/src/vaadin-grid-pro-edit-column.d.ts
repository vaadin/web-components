/**
 * @license
 * Copyright (c) 2000 - 2025 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import type { GridDefaultItem } from '@vaadin/grid/src/vaadin-grid.js';
import type { GridColumn, GridColumnMixin } from '@vaadin/grid/src/vaadin-grid-column.js';
import type { GridProEditColumnMixinClass } from './vaadin-grid-pro-edit-column-mixin.js';

export * from './vaadin-grid-pro-edit-column-mixin.js';

/**
 * `<vaadin-grid-pro-edit-column>` is a helper element for the `<vaadin-grid-pro>`
 * that provides default inline editing for the items.
 *
 * __Note that the `path` property must be explicitly specified for edit column.__
 *
 * #### Example:
 * ```html
 * <vaadin-grid-pro items="[[items]]">
 *  <vaadin-grid-pro-edit-column path="name.first"></vaadin-grid-pro-edit-column>
 *
 *  <vaadin-grid-column>
 *    ...
 * ```
 */
declare class GridProEditColumn<TItem = GridDefaultItem> extends HTMLElement {}

interface GridProEditColumn<TItem = GridDefaultItem>
  extends GridProEditColumnMixinClass<TItem>,
    GridColumnMixin<TItem, GridColumn<TItem>>,
    GridColumn<TItem> {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-grid-pro-edit-column': GridProEditColumn<GridDefaultItem>;
  }
}

export { GridProEditColumn };
