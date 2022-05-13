/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { GridDefaultItem } from '@datadobi/grid/src/vaadin-grid.js';
import { GridFilterColumn } from '@datadobi/grid/src/vaadin-grid-filter-column.js';

/**
 * @deprecated Import `GridFilterColumn` from `@datadobi/grid/vaadin-grid-filter-column` instead.
 */
export type GridFilterColumnElement<TItem = GridDefaultItem> = GridFilterColumn<TItem>;

/**
 * @deprecated Import `GridFilterColumn` from `@datadobi/grid/vaadin-grid-filter-column` instead.
 */
export const GridFilterColumnElement: typeof GridFilterColumn;

export * from '@datadobi/grid/src/vaadin-grid-filter-column.js';
