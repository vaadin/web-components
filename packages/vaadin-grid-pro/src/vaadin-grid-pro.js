/**
 * @license
 * Copyright (c) 2019 - 2022 Vaadin Ltd.
 * This program is available under Commercial Vaadin Developer License 4.0 (CVDLv4).
 * See <a href="https://vaadin.com/license/cvdl-4.0">the website</a> for the complete license.
 */
import { GridPro } from '@vaadin/grid-pro/src/vaadin-grid-pro.js';

/**
 * @deprecated Import `GridPro` from `@vaadin/grid-pro` instead.
 */
export const GridProElement = GridPro;

export * from '@vaadin/grid-pro/src/vaadin-grid-pro.js';

console.warn('WARNING: Since Vaadin 23.2, "@vaadin/vaadin-grid-pro" is deprecated. Use "@vaadin/grid-pro" instead.');
