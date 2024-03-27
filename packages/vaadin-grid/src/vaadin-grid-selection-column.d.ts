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
import type { GridSelectionColumn } from '@vaadin/grid/src/vaadin-grid-selection-column.js';

/**
 * @deprecated Import `GridSelectionColumn` from `@vaadin/grid/vaadin-grid-selection-column` instead.
 */
export type GridSelectionColumnElement<TItem = GridDefaultItem> = GridSelectionColumn<TItem>;

/**
 * @deprecated Import `GridSelectionColumn` from `@vaadin/grid/vaadin-grid-selection-column` instead.
 */
export const GridSelectionColumnElement: typeof GridSelectionColumn;

export * from '@vaadin/grid/src/vaadin-grid-selection-column.js';
