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
import type { PointOptionsObject, Series, SeriesOptionsType } from 'highcharts';

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

export type ChartSeriesValues = Array<number[] | PointOptionsObject | number>;

/**
 * `<vaadin-chart-series>` is a custom element for creating series for Vaadin Charts.
 *
 * ### Basic use
 *
 * To use `<vaadin-chart-series>`, add it inside a `<vaadin-chart>` element:
 *
 * ```html
 *  <vaadin-chart>
 *    <vaadin-chart-series></vaadin-chart-series>
 *  </vaadin-chart>
 * ```
 *
 * `<vaadin-chart-series>` accepts `values` as an array attribute, so you can add it to your element definition:
 *
 * ```html
 *  <vaadin-chart-series values="[10,20,30,40,50]"></vaadin-chart-series>
 * ```
 *
 * which will add a new line series, where each value will be a data point.
 * Look for the Properties session to see all available attributes.
 *
 * ### Dynamically adding and removing series
 *
 * You are also able to add and remove series by using DOM API.
 *
 * To create a new series, call `document.createElement('vaadin-chart-series')` and append it to your `<vaadin-chart>`:
 *
 * ```js
 *  const chart = \* a <vaadin-chart> reference *\
 *  const newSeries = document.createElement('vaadin-chart-series');
 *  newSeries.values = [10,20,30,40,50];
 *  chart.appendChild(newSeries);
 * ```
 *
 * In order to remove it, you should use the series to be removed as a reference for the `#removeChild()` call:
 *
 * ```js
 *  const chart = \* a <vaadin-chart> reference *\
 *  const seriesToBeRemoved = \* a <vaadin-chart-series> reference to remove*\
 *  chart.removeChild(seriesToBeRemoved);
 * ```
 */
declare class ChartSeries extends HTMLElement {
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
   *
   * Note that you should always use [Polymer API](https://www.polymer-project.org/2.0/docs/devguide/model-data#array-mutation)
   * to mutate the values array in order to make the component aware of the
   * change and be able to synchronize it.
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
   * Used to connect the series to an axis; if multiple series have the same “unit”, they will share axis.
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

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-chart-series': ChartSeries;
  }
}

export { ChartSeries };
