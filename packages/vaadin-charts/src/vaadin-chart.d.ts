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
import type { Chart } from '@vaadin/charts/src/vaadin-chart.js';

/**
 * @deprecated Import `Chart` from `@vaadin/charts` instead.
 */
export type ChartElement = Chart;

/**
 * @deprecated Import `Chart` from `@vaadin/charts` instead.
 */
export const ChartElement: typeof Chart;

export * from '@vaadin/charts/src/vaadin-chart.js';
