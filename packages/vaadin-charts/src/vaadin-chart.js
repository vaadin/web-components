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
import { Chart } from '@vaadin/charts/src/vaadin-chart.js';

/**
 * @deprecated Import `Chart` from `@vaadin/charts` instead.
 */
export const ChartElement = Chart;

export * from '@vaadin/charts/src/vaadin-chart.js';

console.warn('WARNING: Since Vaadin 23.2, "@vaadin/vaadin-charts" is deprecated. Use "@vaadin/charts" instead.');
