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
import { GridPro } from '@vaadin/grid-pro/src/vaadin-grid-pro.js';

/**
 * @deprecated Import `GridPro` from `@vaadin/grid-pro` instead.
 */
export const GridProElement = GridPro;

export * from '@vaadin/grid-pro/src/vaadin-grid-pro.js';

console.warn('WARNING: Since Vaadin 23.2, "@vaadin/vaadin-grid-pro" is deprecated. Use "@vaadin/grid-pro" instead.');
