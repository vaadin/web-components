/**
 * @license
 * Copyright (c) 2015 - 2022 Vaadin Ltd.
 * This program is available under Commercial Vaadin Developer License 4.0, available at https://vaadin.com/license/cvdl-4.0.
 */
import { Chart } from '@vaadin/charts/src/vaadin-chart.js';

/**
 * @deprecated Import `Chart` from `@vaadin/charts` instead.
 */
export const ChartElement = Chart;

export * from '@vaadin/charts/src/vaadin-chart.js';

console.warn('WARNING: Since Vaadin 23.2, "@vaadin/vaadin-charts" is deprecated. Use "@vaadin/charts" instead.');
