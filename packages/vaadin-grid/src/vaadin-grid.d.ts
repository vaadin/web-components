/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { GridDefaultItem } from '@datadobi/grid/src/vaadin-grid.js';
import { Grid } from '@datadobi/grid/src/vaadin-grid.js';

/**
 * @deprecated Import `Grid` from `@datadobi/grid` instead.
 */
export type GridElement<TItem = GridDefaultItem> = Grid<TItem>;

/**
 * @deprecated Import `Grid` from `@datadobi/grid` instead.
 */
export const GridElement: typeof Grid;

export * from '@datadobi/grid/src/vaadin-grid.js';
