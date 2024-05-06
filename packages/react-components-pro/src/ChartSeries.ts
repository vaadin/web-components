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
import type { HTMLAttributes, ReactElement, RefAttributes } from 'react';
import {
  ChartSeriesElement,
  ChartSeries as _ChartSeries,
  type ChartSeriesProps as _ChartSeriesProps,
} from './generated/ChartSeries.js';

export * from './generated/ChartSeries.js';

type OmittedChartSeriesHTMLAttributes = Omit<
  HTMLAttributes<ChartSeriesElement>,
  'id' | 'className' | 'dangerouslySetInnerHTML' | 'slot' | 'title'
>;

export type ChartSeriesProps = Partial<Omit<_ChartSeriesProps, keyof OmittedChartSeriesHTMLAttributes>>;

export const ChartSeries = _ChartSeries as (
  props: ChartSeriesProps & RefAttributes<ChartSeriesElement>,
) => ReactElement | null;
