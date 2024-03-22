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
