/**
 * @license
 * Copyright (c) 2000 - 2025 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import type { Constructor } from '@open-wc/dedupe-mixin';
import type { GanttPointOptionsObject, PointOptionsObject, Series, SeriesOptionsType } from 'highcharts';

export type ChartSeriesMarkers = 'auto' | 'hidden' | 'shown';

export interface ChartSeriesConfig {
  data?: ChartSeriesValues;
  marker?: { enabled: boolean | null };
  name?: string;
  neckWidth?: number | string;
  neckHeight?: number | string;
  stack?: number | string;
  type?: string;
  yAxis?: string;
  yAxisValueMin?: number;
  yAxisValueMax?: number;
}

export type ChartSeriesOptions = ChartSeriesConfig & SeriesOptionsType;

export type ChartSeriesValues = Array<number[] | PointOptionsObject | GanttPointOptionsObject | number>;

export declare function ChartSeriesMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ChartSeriesMixinClass> & T;

export declare class ChartSeriesMixinClass {
  /**
   * Object with the configured options defined and used to create a series.
   */
  readonly options: ChartSeriesOptions;

  /**
   * An array of data used by the series.
   * Format depends on the chart type and can be:
   *   - An array of numerical values `[y0, y1, y2, y3,...]`
   *   - An array of arrays with 2 values (`x`, `y`) `[ [x0, y0], [x1, y1], [x2, y2], ... ]`
   *   - An array of objects, each one describing one point `[ {x: x0, y: y0, name: 'Point0', color: '#FF0000'}, {...}, ...]`
   *
   *  See more in [API Site](https://api.highcharts.com/highcharts/series)
   */
  values: ChartSeriesValues | null;

  /**
   * Value-axis minimum-value.
   * Sets the value to a series bound by 'unit' property.
   * Otherwise sets the value to the first series.
   * Undefined by default (determined from data).
   * @attr {number} value-min
   */
  valueMin: number | null | undefined;

  /**
   * Value-axis maximum-value.
   * See the 'valueMin'
   * @attr {number} value-max
   */
  valueMax: number | null | undefined;

  /**
   * A string with the type of the series.
   * Defaults to `'line'` in case no type is set for the chart.
   * Note that `'bar'`, `'gauge'` and `'solidgauge'` should be set as default series type on `<vaadin-chart>`.
   */
  type: string | null | undefined;

  /**
   * The name of the series as shown in the legend, tooltip etc.
   */
  title: string;

  /**
   * Shows/hides data-point markers for line-like series.
   * Acceptable input are:
   *  - `shown`: markers are always visible
   *  - `hidden`: markers are always hidden
   *  - `auto`: markers are visible for widespread data and hidden, when data is dense *(default)*
   */
  markers: ChartSeriesMarkers | null | undefined;

  /**
   * Used to connect the series to an axis; if multiple series have the same `unit`, they will share axis.
   * Displayed as a title for the axis.
   * If no unit is defined, then series will be connected to the first axis.
   */
  unit: string | null | undefined;

  /**
   * Used to group series in a different stacks.
   * "stacking" property should be specified either for each series or in plotOptions.
   * It is recommended to place series in a single stack, when they belong to the same yAxis.
   */
  stack: number | string;

  /**
   * The height of the neck, the lower part of the funnel.
   * A number defines pixel width, a percentage string defines a percentage of the plot area height. Defaults to 30%.
   * Note that this property only applies for "funnel" charts.
   * @attr {number | string} neck-position
   */
  neckPosition: number | string;

  /**
   * The width of the neck, the lower part of the funnel.
   * A number defines pixel width, a percentage string defines a percentage of the plot area width. Defaults to 30%.
   * Note that this property only applies for "funnel" charts.
   * @attr {number | string} neck-width
   */
  neckWidth: number | string;

  /**
   * Represents additional JSON configuration.
   */
  additionalOptions: SeriesOptionsType | null | undefined;

  /**
   * Method to attach a series object of type `Highcharts.Series`.
   *
   * @param series Object of type `Highcharts.Series`
   */
  setSeries(series: Series): void;
}
