/**
 * @license
 * Copyright (c) 2000 - 2023 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
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
