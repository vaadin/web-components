/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { GridDefaultItem } from '@datadobi/grid/src/vaadin-grid.js';
import { GridTreeColumn } from '@datadobi/grid/src/vaadin-grid-tree-column.js';

/**
 * @deprecated Import `GridTreeColumn` from `@datadobi/grid/vaadin-grid-tree-column` instead.
 */
export type GridTreeColumnElement<TItem = GridDefaultItem> = GridTreeColumn<TItem>;

/**
 * @deprecated Import `GridTreeColumn` from `@datadobi/grid/vaadin-grid-tree-column` instead.
 */
export const GridTreeColumnElement: typeof GridTreeColumn;

export * from '@datadobi/grid/src/vaadin-grid-tree-column.js';
