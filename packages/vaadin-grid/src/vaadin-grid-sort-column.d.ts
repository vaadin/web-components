/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { GridDefaultItem } from '@vaadin/grid/src/vaadin-grid.js';
import { GridSortColumn } from '@vaadin/grid/src/vaadin-grid-sort-column.js';

/**
 * @deprecated Import `GridSortColumn` from `@vaadin/grid/vaadin-grid-sort-column` instead.
 */
export type GridSortColumnElement<TItem = GridDefaultItem> = GridSortColumn<TItem>;

/**
 * @deprecated Import `GridSortColumn` from `@vaadin/grid/vaadin-grid-sort-column` instead.
 */
export const GridSortColumnElement: typeof GridSortColumn;

export * from '@vaadin/grid/src/vaadin-grid-sort-column.js';
