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
import { Grid } from '@vaadin/grid/src/vaadin-grid.js';

/**
 * @deprecated Import `Grid` from `@vaadin/grid` instead.
 */
export const GridElement = Grid;

export * from '@vaadin/grid/src/vaadin-grid.js';

console.warn('WARNING: Since Vaadin 23.2, "@vaadin/vaadin-grid" is deprecated. Use "@vaadin/grid" instead.');
