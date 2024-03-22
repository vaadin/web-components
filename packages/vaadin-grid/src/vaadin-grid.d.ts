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
import type { Grid } from '@vaadin/grid/src/vaadin-grid.js';

/**
 * @deprecated Import `Grid` from `@vaadin/grid` instead.
 */
export type GridElement<TItem = GridDefaultItem> = Grid<TItem>;

/**
 * @deprecated Import `Grid` from `@vaadin/grid` instead.
 */
export const GridElement: typeof Grid;

export * from '@vaadin/grid/src/vaadin-grid.js';
