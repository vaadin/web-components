/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import type { GridDefaultItem } from '@vaadin/grid/src/vaadin-grid.js';
import type { GridFilterColumn } from '@vaadin/grid/src/vaadin-grid-filter-column.js';

/**
 * @deprecated Import `GridFilterColumn` from `@vaadin/grid/vaadin-grid-filter-column` instead.
 */
export type GridFilterColumnElement<TItem = GridDefaultItem> = GridFilterColumn<TItem>;

/**
 * @deprecated Import `GridFilterColumn` from `@vaadin/grid/vaadin-grid-filter-column` instead.
 */
export const GridFilterColumnElement: typeof GridFilterColumn;

export * from '@vaadin/grid/src/vaadin-grid-filter-column.js';
