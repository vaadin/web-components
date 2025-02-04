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
import type { Axis, Chart as HighchartsChart, ExtremesObject, Options, Point, Series } from 'highcharts';
import type { ResizeMixinClass } from '@vaadin/component-base/src/resize-mixin.js';

export type ChartCategories = string[] | { [key: number]: string };

export type ChartCategoryPosition = 'bottom' | 'left' | 'right' | 'top';

export type ChartStacking = 'normal' | 'percent' | null;

export type ChartEvent = { target: HighchartsChart; type: string };

export type ChartSeriesEvent = { target: Series; type: string };

export type ChartPointEvent = { target: Point; type: string };

/**
 * Fired when a new series is added.
 */
export type ChartAddSeriesEvent = CustomEvent<{ chart: HighchartsChart; originalEvent: ChartEvent }>;

/**
 * Fired after a chart is exported.
 */
export type ChartAfterExportEvent = CustomEvent<{ chart: HighchartsChart; originalEvent: ChartEvent }>;

/**
 * Fired after a chart is printed.
 */
export type ChartAfterPrintEvent = CustomEvent<{ chart: HighchartsChart; originalEvent: ChartEvent }>;

/**
 * Fired before a chart is exported.
 */
export type ChartBeforeExportEvent = CustomEvent<{ chart: HighchartsChart; originalEvent: ChartEvent }>;

/**
 * Fired before a chart is printed.
 */
export type ChartBeforePrintEvent = CustomEvent<{ chart: HighchartsChart; originalEvent: ChartEvent }>;

/**
 * Fired when clicking on the plot background.
 */
export type ChartClickEvent = CustomEvent<{ chart: HighchartsChart; originalEvent: ChartEvent }>;

/**
 * Fired when the chart has finished loading.
 */
export type ChartLoadEvent = CustomEvent<{ chart: HighchartsChart; originalEvent: ChartEvent }>;

/**
 * Fired when drilldown point is clicked.
 */
export type ChartDrilldownEvent = CustomEvent<{ chart: HighchartsChart; originalEvent: ChartEvent }>;

/**
 * Fired when drilling up from a drilldown series.
 */
export type ChartDrillupEvent = CustomEvent<{ chart: HighchartsChart; originalEvent: ChartEvent }>;

/**
 * Fired after all the series has been drilled up if chart has multiple drilldown series.
 */
export type ChartDrillupallEvent = CustomEvent<{ chart: HighchartsChart; originalEvent: ChartEvent }>;

/**
 * Fired when the chart is redraw. Can be called after a `Chart.configuration.redraw()`
 * or after an axis, series or point is modified with the `redraw` option set to `true`.
 */
export type ChartRedrawEvent = CustomEvent<{ chart: HighchartsChart; originalEvent: ChartEvent }>;

/**
 * Fired when an area of the chart has been selected.
 */
export type ChartSelectionEvent = CustomEvent<{ chart: HighchartsChart; originalEvent: ChartEvent }>;

/**
 * Fired when the series has finished its initial animation.
 */
export type ChartSeriesAfterAnimateEvent = CustomEvent<{ series: Series; originalEvent: ChartSeriesEvent }>;

/**
 * Fired when the checkbox next to the series' name in the legend is clicked.
 */
export type ChartSeriesCheckboxClickEvent = CustomEvent<{ series: Series; originalEvent: ChartSeriesEvent }>;

/**
 * Fired when the series is clicked.
 */
export type ChartSeriesClickEvent = CustomEvent<{ series: Series; originalEvent: ChartSeriesEvent }>;

/**
 * Fired when the series is hidden after chart generation time.
 */
export type ChartSeriesHideEvent = CustomEvent<{ series: Series; originalEvent: ChartSeriesEvent }>;

/**
 * Fired when the legend item belonging to the series is clicked.
 */
export type ChartSeriesLegendItemClickEvent = CustomEvent<{ series: Series; originalEvent: ChartSeriesEvent }>;

/**
 * Fired when the mouse leaves the graph.
 */
export type ChartSeriesMouseOutEvent = CustomEvent<{ series: Series; originalEvent: ChartSeriesEvent }>;

/**
 * Fired when the mouse enters the graph.
 */
export type ChartSeriesMouseOverEvent = CustomEvent<{ series: Series; originalEvent: ChartSeriesEvent }>;

/**
 * Fired when the series is shown after chart generation time.
 */
export type ChartSeriesShowEvent = CustomEvent<{ series: Series; originalEvent: ChartSeriesEvent }>;

/**
 * Fired when the point is clicked.
 */
export type ChartPointClickEvent = CustomEvent<{ point: Point; originalEvent: ChartPointEvent }>;

/**
 * Fired when the legend item belonging to the point is clicked.
 */
export type ChartPointLegendItemClickEvent = CustomEvent<{ point: Point; originalEvent: ChartPointEvent }>;

/**
 * Fired when the mouse leaves the area close to the point.
 */
export type ChartPointMouseOutEvent = CustomEvent<{ point: Point; originalEvent: ChartPointEvent }>;

/**
 * Fired when the mouse enters the area close to the point.
 */
export type ChartPointMouseOverEvent = CustomEvent<{ point: Point; originalEvent: ChartPointEvent }>;

/**
 * Fired when the point is removed from the series.
 */
export type ChartPointRemoveEvent = CustomEvent<{ point: Point; originalEvent: ChartPointEvent }>;

/**
 * Fired when the point is selected either programmatically or by clicking on the point.
 */
export type ChartPointSelectEvent = CustomEvent<{ point: Point; originalEvent: ChartPointEvent }>;

/**
 * Fired when the point is unselected either programmatically or by clicking on the point.
 */
export type ChartPointUnselectEvent = CustomEvent<{ point: Point; originalEvent: ChartPointEvent }>;

/**
 * Fired when the point is updated programmatically through `.updateConfiguration()` method.
 */
export type ChartPointUpdateEvent = CustomEvent<{ point: Point; originalEvent: ChartPointEvent }>;

/**
 * Fired when starting to drag a point.
 */
export type ChartPointDragStartEvent = CustomEvent<{ point: Point; originalEvent: ChartPointEvent }>;

/**
 * Fired when the point is dropped.
 */
export type ChartPointDropEvent = CustomEvent<{ point: Point; originalEvent: ChartPointEvent }>;

/**
 * Fired while dragging a point.
 */
export type ChartPointDragEvent = CustomEvent<{ point: Point; originalEvent: ChartPointEvent }>;

/**
 * Fired when when the minimum and maximum is set for the X axis.
 */
export type ChartXaxesExtremesSetEvent = CustomEvent<{
  axis: Axis;
  originalEvent: ExtremesObject & {
    target: Axis;
    type: string;
  };
}>;

/**
 * Fired when when the minimum and maximum is set for the Y axis.
 */
export type ChartYaxesExtremesSetEvent = CustomEvent<{
  axis: Axis;
  originalEvent: ExtremesObject & {
    target: Axis;
    type: string;
  };
}>;

export interface ChartCustomEventMap {
  'chart-add-series': ChartAddSeriesEvent;

  'chart-after-export': ChartAfterExportEvent;

  'chart-after-print': ChartAfterPrintEvent;

  'chart-before-export': ChartBeforeExportEvent;

  'chart-before-print': ChartBeforePrintEvent;

  'chart-click': ChartClickEvent;

  'chart-drilldown': ChartDrilldownEvent;

  'chart-drillup': ChartDrillupEvent;

  'chart-drillupall': ChartDrillupallEvent;

  'chart-load': ChartLoadEvent;

  'chart-redraw': ChartRedrawEvent;

  'chart-selection': ChartSelectionEvent;

  'series-after-animate': ChartSeriesAfterAnimateEvent;

  'series-checkbox-click': ChartSeriesCheckboxClickEvent;

  'series-click': ChartSeriesClickEvent;

  'series-hide': ChartSeriesHideEvent;

  'series-legend-item-click': ChartSeriesLegendItemClickEvent;

  'series-mouse-out': ChartSeriesMouseOutEvent;

  'series-mouse-over': ChartSeriesMouseOverEvent;

  'series-show': ChartSeriesShowEvent;

  'point-click': ChartPointClickEvent;

  'point-legend-item-click': ChartPointLegendItemClickEvent;

  'point-mouse-out': ChartPointMouseOutEvent;

  'point-mouse-over': ChartPointMouseOverEvent;

  'point-remove': ChartPointRemoveEvent;

  'point-select': ChartPointSelectEvent;

  'point-unselect': ChartPointUnselectEvent;

  'point-update': ChartPointUpdateEvent;

  'point-drag-start': ChartPointDragStartEvent;

  'point-drop': ChartPointDropEvent;

  'point-drag': ChartPointDragEvent;

  'xaxes-extremes-set': ChartXaxesExtremesSetEvent;

  'yaxes-extremes-set': ChartYaxesExtremesSetEvent;
}

export type ChartEventMap = ChartCustomEventMap & HTMLElementEventMap;

export declare function ChartMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<ChartMixinClass> & Constructor<ResizeMixinClass> & T;

export declare class ChartMixinClass {
  readonly options: Options;

  /**
   * Configuration object that exposes the JS Api to configure the chart.
   *
   * Most important methods are:
   * - `addSeries (Object options, [Boolean redraw], [Mixed animation])`
   * - `addAxis (Object options, [Boolean isX], [Boolean redraw], [Mixed animation])`
   * - `setTitle (Object title, object subtitle, Boolean redraw)`
   *
   * Most important properties are:
   * - `configuration.series`: An array of the chart's series. Detailed API for Series object is
   *     available in [API Site](http://api.highcharts.com/class-reference/Highcharts.Series)
   * - `configuration.xAxis`: An array of the chart's x axes. Detailed API for Axis object is
   *     available in [API Site](http://api.highcharts.com/class-reference/Highcharts.Axis)
   * - `configuration.yAxis`: An array of the chart's y axes. Detailed API for Axis object is
   *     available in [API Site](http://api.highcharts.com/class-reference/Highcharts.Axis)
   * - `configuration.title`: The chart title.
   *
   * For detailed documentation of available API check the [API site](http://api.highcharts.com/class-reference/classes.list)
   */
  configuration: HighchartsChart | undefined;

  /**
   * If categories are present names are used instead of numbers for the category axis.
   * The format of categories can be an `Array` with a list of categories, such as `['2010', '2011', '2012']`
   * or a mapping `Object`, like `{0:'1',9:'Target (10)', 15: 'Max'}`.
   */
  categories: ChartCategories | null | undefined;

  /**
   * Category-axis maximum value. Defaults to `undefined`.
   * @attr {number} category-max
   */
  categoryMax: number | null | undefined;

  /**
   * Category-axis minimum value. Defaults to `undefined`.
   * @attr {number} category-min
   */
  categoryMin: number | null | undefined;

  /**
   * The position of the category axis. Acceptable values are `left`, `right`, `top` and `bottom`
   * except for bar charts which only accept `left` and `right`.
   * With the default value, charts appear as though they have `category-position="bottom"`
   * except for bar charts that appear as though they have `category-position="left"`.
   *
   * Defaults to `undefined`
   * @attr {left|right|top|bottom} category-position
   */
  categoryPosition: ChartCategoryPosition | null | undefined;

  /**
   * Specifies whether to hide legend or show.
   * Legend configuration can be set up via additionalOptions property
   * @attr {boolean} no-legend
   */
  noLegend: boolean | null | undefined;

  /**
   * Specifies how series are stacked on top of each other.
   * Possible values are null, "normal" or "percent".
   * If "stack" property is not defined on the vaadin-chart-series elements, then series will be put into
   * the default stack.
   * @attr {normal|percent} stacking
   */
  stacking: ChartStacking | null | undefined;

  /**
   * Specifies whether the chart is a normal chart or a timeline chart.
   * Value of this property is ignored for Gantt charts (type="gantt").
   */
  timeline: boolean | null | undefined;

  /**
   * Represents the title of the chart.
   */
  title: string;

  /**
   * Whether or not to show tooltip when hovering data points.
   */
  tooltip: boolean | null | undefined;

  /**
   * Sets the default series type of the chart.
   * Note that `'bar'`, `'gauge'` and `'solidgauge'` should be set as default series type.
   */
  type: string | null | undefined;

  /**
   * Represents the subtitle of the chart.
   */
  subtitle: string | undefined;

  /**
   * Specifies whether to show chart in 3 or in 2 dimensions.
   * Some display angles are added by default to the "chart.options3d" (`{alpha: 15, beta: 15, depth: 50}`).
   * 3D display options can be modified via `additionalOptions`.
   * The thickness of a Pie chart can be set on `additionalOptions` through `plotOptions.pie.depth`.
   * 3D is supported by Bar, Column, Pie and Scatter3D charts.
   * More info available at [Highcharts](https://www.highcharts.com/docs/chart-concepts/3d-charts).
   */
  chart3d: boolean | null | undefined;

  /**
   * Specifies the message displayed on a chart without displayable data.
   * @attr {string} empty-text
   */
  emptyText: string;

  /**
   * Represents additional JSON configuration.
   */
  additionalOptions: Options | null | undefined;

  /**
   * When present, cartesian charts like line, spline, area and column are transformed
   * into the polar coordinate system.
   */
  polar: boolean | null | undefined;

  /**
   * Update the chart configuration.
   * This JSON API provides a simple single-argument alternative to the configuration property.
   *
   * Styling properties specified in this configuration will be ignored. To learn about chart styling
   * please see the CSS Styling section above.
   *
   * @param {!Options} jsonConfiguration Object chart configuration. Most important properties are:
   *
   * - annotations `Object[]` custom labels or shapes that can be tied to points, axis coordinates or chart pixel coordinates.
   *    Detailed API for annotations object is available in [API Site](http://api.highcharts.com/highcharts/annotations)
   * - chart `Object` with options regarding the chart area and plot area as well as general chart options.
   *    Detailed API for chart object is available in [API Site](http://api.highcharts.com/highcharts/chart)
   * - credits `Object` with options regarding the chart area and plot area as well as general chart options.
   *    Detailed API for credits object is available in [API Site](http://api.highcharts.com/highcharts/credits)
   * - plotOptions `Object` wrapper for config objects for each series type.
   *    Detailed API for plotOptions object is available in [API Site](http://api.highcharts.com/highcharts/plotOptions)
   * - series `Object[]` the actual series to append to the chart.
   *    Detailed API for series object is available in [API Site](http://api.highcharts.com/highcharts/series)
   * - subtitle `Object` the chart's subtitle.
   *    Detailed API for subtitle object is available in [API Site](http://api.highcharts.com/highcharts/subtitle)
   * - title `Object` the chart's main title.
   *    Detailed API for title object is available in [API Site](http://api.highcharts.com/highcharts/title)
   * - tooltip `Object` Options for the tooltip that appears when the user hovers over a series or point.
   *    Detailed API for tooltip object is available in [API Site](http://api.highcharts.com/highcharts/tooltip)
   * - xAxis `Object[]` The X axis or category axis. Normally this is the horizontal axis.
   *    Detailed API for xAxis object is available in [API Site](http://api.highcharts.com/highcharts/xAxis)
   * - yAxis `Object[]` The Y axis or value axis. Normally this is the vertical axis.
   *    Detailed API for yAxis object is available in [API Site](http://api.highcharts.com/highcharts/yAxis)
   * - zAxis `Object[]` The Z axis or depth axis for 3D plots.
   *    Detailed API for zAxis object is available in [API Site](http://api.highcharts.com/highcharts/zAxis)
   *
   * @param {boolean=} resetConfiguration Optional boolean that should be set to true if no other chart configuration was set before or
   *    if existing configuration should be discarded.
   */
  updateConfiguration(jsonConfiguration: Options, resetConfiguration?: boolean): void;
}
