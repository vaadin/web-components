/**
 * @license
 * Copyright (c) 2000 - 2022 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import type { GridDefaultItem } from '@vaadin/grid/src/vaadin-grid.js';
import type { GridProEditColumn } from '@vaadin/grid-pro/src/vaadin-grid-pro-edit-column.js';

/**
 * @deprecated Import `GridProEditColumn` from `@vaadin/grid-pro/vaadin-grid-pro-edit-column` instead.
 */
export type GridProEditColumnElement<TItem = GridDefaultItem> = GridProEditColumn<TItem>;

/**
 * @deprecated Import `GridProEditColumn` from `@vaadin/grid-pro/vaadin-grid-pro-edit-column` instead.
 */
export const GridProEditColumnElement: typeof GridProEditColumn;

export * from '@vaadin/grid-pro/src/vaadin-grid-pro-edit-column.js';
