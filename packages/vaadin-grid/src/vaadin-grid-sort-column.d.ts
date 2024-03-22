/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import type { GridDefaultItem } from '@vaadin/grid/src/vaadin-grid.js';
import type { GridSortColumn } from '@vaadin/grid/src/vaadin-grid-sort-column.js';

/**
 * @deprecated Import `GridSortColumn` from `@vaadin/grid/vaadin-grid-sort-column` instead.
 */
export type GridSortColumnElement<TItem = GridDefaultItem> = GridSortColumn<TItem>;

/**
 * @deprecated Import `GridSortColumn` from `@vaadin/grid/vaadin-grid-sort-column` instead.
 */
export const GridSortColumnElement: typeof GridSortColumn;

export * from '@vaadin/grid/src/vaadin-grid-sort-column.js';
