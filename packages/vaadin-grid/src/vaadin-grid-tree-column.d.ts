/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
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
