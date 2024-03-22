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
import type { GridTreeColumn } from '@vaadin/grid/src/vaadin-grid-tree-column.js';

/**
 * @deprecated Import `GridTreeColumn` from `@vaadin/grid/vaadin-grid-tree-column` instead.
 */
export type GridTreeColumnElement<TItem = GridDefaultItem> = GridTreeColumn<TItem>;

/**
 * @deprecated Import `GridTreeColumn` from `@vaadin/grid/vaadin-grid-tree-column` instead.
 */
export const GridTreeColumnElement: typeof GridTreeColumn;

export * from '@vaadin/grid/src/vaadin-grid-tree-column.js';
