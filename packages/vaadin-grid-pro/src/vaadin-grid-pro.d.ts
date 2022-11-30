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
import { GridDefaultItem } from '@vaadin/grid/src/vaadin-grid.js';
import { GridPro } from '@vaadin/grid-pro/src/vaadin-grid-pro.js';

/**
 * @deprecated Import `GridPro` from `@vaadin/grid-pro` instead.
 */
export type GridProElement<TItem = GridDefaultItem> = GridPro<TItem>;

/**
 * @deprecated Import `GridPro` from `@vaadin/grid-pro` instead.
 */
export const GridProElement: typeof GridPro;

export * from '@vaadin/grid-pro/src/vaadin-grid-pro.js';
