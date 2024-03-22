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
import type { GridColumnGroup } from '@vaadin/grid/src/vaadin-grid-column-group.js';

/**
 * @deprecated Import `GridColumnGroup` from `@vaadin/grid/vaadin-grid-column-group` instead.
 */
export type GridColumnGroupElement<TItem = GridDefaultItem> = GridColumnGroup<TItem>;

/**
 * @deprecated Import `GridColumnGroup` from `@vaadin/grid/vaadin-grid-column-group` instead.
 */
export const GridColumnGroupElement: typeof GridColumnGroup;

export * from '@vaadin/grid/src/vaadin-grid-column-group.js';
