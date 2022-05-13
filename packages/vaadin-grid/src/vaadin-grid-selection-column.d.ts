/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { GridDefaultItem } from '@datadobi/grid/src/vaadin-grid.js';
import { GridSelectionColumn } from '@datadobi/grid/src/vaadin-grid-selection-column.js';

/**
 * @deprecated Import `GridSelectionColumn` from `@datadobi/grid/vaadin-grid-selection-column` instead.
 */
export type GridSelectionColumnElement<TItem = GridDefaultItem> = GridSelectionColumn<TItem>;

/**
 * @deprecated Import `GridSelectionColumn` from `@datadobi/grid/vaadin-grid-selection-column` instead.
 */
export const GridSelectionColumnElement: typeof GridSelectionColumn;

export * from '@datadobi/grid/src/vaadin-grid-selection-column.js';
