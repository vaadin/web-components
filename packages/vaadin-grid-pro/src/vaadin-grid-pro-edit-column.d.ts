/**
 * @license
 * Copyright (c) 2019 - 2022 Vaadin Ltd.
 * This program is available under Commercial Vaadin Developer License 4.0 (CVDLv4).
 * See <a href="https://vaadin.com/license/cvdl-4.0">the website</a> for the complete license.
 */
import { GridDefaultItem } from '@vaadin/grid/src/vaadin-grid.js';
import { GridProEditColumn } from '@vaadin/grid-pro/src/vaadin-grid-pro-edit-column.js';

/**
 * @deprecated Import `GridProEditColumn` from `@vaadin/grid-pro/vaadin-grid-pro-edit-column` instead.
 */
export type GridProEditColumnElement<TItem = GridDefaultItem> = GridProEditColumn<TItem>;

/**
 * @deprecated Import `GridProEditColumn` from `@vaadin/grid-pro/vaadin-grid-pro-edit-column` instead.
 */
export const GridProEditColumnElement: typeof GridProEditColumn;

export * from '@vaadin/grid-pro/src/vaadin-grid-pro-edit-column.js';
