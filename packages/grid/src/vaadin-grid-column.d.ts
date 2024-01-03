/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */

import type { GridDefaultItem } from './vaadin-grid.js';
import type {
  GridBodyRenderer as GridMixinBodyRenderer,
  GridColumnMixin,
  GridHeaderFooterRenderer as GridMixinHeaderFooterRenderer,
} from './vaadin-grid-column-mixin.js';

export * from './vaadin-grid-column-mixin.js';
export type GridBodyRenderer<TItem = GridDefaultItem> = GridMixinBodyRenderer<TItem, GridColumn<TItem>>;
export type GridHeaderFooterRenderer<TItem = GridDefaultItem> = GridMixinHeaderFooterRenderer<TItem, GridColumn<TItem>>;

/**
 * A `<vaadin-grid-column>` is used to configure how a column in `<vaadin-grid>`
 * should look like.
 *
 * See [`<vaadin-grid>`](#/elements/vaadin-grid) documentation for instructions on how
 * to configure the `<vaadin-grid-column>`.
 */
declare class GridColumn<TItem = GridDefaultItem> extends HTMLElement {}

interface GridColumn<TItem = GridDefaultItem> extends GridColumnMixin<TItem, GridColumn<TItem>>, HTMLElement {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-grid-column': GridColumn<GridDefaultItem>;
  }
}

export { GridColumn };
