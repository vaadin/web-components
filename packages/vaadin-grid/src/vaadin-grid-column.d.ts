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
import type { GridColumn } from '@vaadin/grid/src/vaadin-grid-column.js';

/**
 * @deprecated Import `GridColumn` from `@vaadin/grid/vaadin-grid-column` instead.
 */
export type GridColumnElement<TItem = GridDefaultItem> = GridColumn<TItem>;

/**
 * @deprecated Import `GridColumn` from `@vaadin/grid/vaadin-grid-column` instead.
 */
export const GridColumnElement: typeof GridColumn;

export * from '@vaadin/grid/src/vaadin-grid-column.js';
