import { Axis, Chart, ExtremesObject, Point, PointOptionsObject, Series, SeriesOptionsType } from 'highcharts';

export type ChartCategories = Array<string> | { [key: number]: string };

export type ChartCategoryPosition = 'left' | 'right' | 'top' | 'bottom';

export type ChartSeriesMarkers = 'shown' | 'hidden' | 'auto';

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

export type ChartSeriesValues = Array<number | Array<number> | PointOptionsObject>;

export type ChartStacking = 'normal' | 'percent' | null;

export type ChartEvent = { target: Chart; type: string };

export type ChartSeriesEvent = { target: Series; type: string };

export type ChartPointEvent = { target: Point; type: string };

/**
 * Fired when a new series is added.
 */
export type ChartAddSeries = CustomEvent<{ chart: Chart; originalEvent: ChartEvent }>;

/**
 * Fired after a chart is exported.
 */
export type ChartAfterExport = CustomEvent<{ chart: Chart; originalEvent: ChartEvent }>;

/**
 * Fired after a chart is printed.
 */
export type ChartAfterPrint = CustomEvent<{ chart: Chart; originalEvent: ChartEvent }>;

/**
 * Fired before a chart is exported.
 */
export type ChartBeforeExport = CustomEvent<{ chart: Chart; originalEvent: ChartEvent }>;

/**
 * Fired before a chart is printed.
 */
export type ChartBeforePrint = CustomEvent<{ chart: Chart; originalEvent: ChartEvent }>;

/**
 * Fired when clicking on the plot background.
 */
export type ChartClick = CustomEvent<{ chart: Chart; originalEvent: ChartEvent }>;

/**
 * Fired when the chart has finished loading.
 */
export type ChartLoad = CustomEvent<{ chart: Chart; originalEvent: ChartEvent }>;

/**
 * Fired when drilldown point is clicked.
 */
export type ChartDrilldown = CustomEvent<{ chart: Chart; originalEvent: ChartEvent }>;

/**
 * Fired when drilling up from a drilldown series.
 */
export type ChartDrillup = CustomEvent<{ chart: Chart; originalEvent: ChartEvent }>;

/**
 * Fired after all the series has been drilled up if chart has multiple drilldown series.
 */
export type ChartDrillupall = CustomEvent<{ chart: Chart; originalEvent: ChartEvent }>;

/**
 * Fired when the chart is redraw. Can be called after a `Chart.configuration.redraw()`
 * or after an axis, series or point is modified with the `redraw` option set to `true`.
 */
export type ChartRedraw = CustomEvent<{ chart: Chart; originalEvent: ChartEvent }>;

/**
 * Fired when an area of the chart has been selected.
 */
export type ChartSelection = CustomEvent<{ chart: Chart; originalEvent: ChartEvent }>;

/**
 * Fired when the series has finished its initial animation.
 */
export type ChartSeriesAfterAnimate = CustomEvent<{ series: Series; originalEvent: ChartSeriesEvent }>;

/**
 * Fired when the checkbox next to the series' name in the legend is clicked.
 */
export type ChartSeriesCheckboxClick = CustomEvent<{ series: Series; originalEvent: ChartSeriesEvent }>;

/**
 * Fired when the series is clicked.
 */
export type ChartSeriesClick = CustomEvent<{ series: Series; originalEvent: ChartSeriesEvent }>;

/**
 * Fired when the series is hidden after chart generation time.
 */
export type ChartSeriesHide = CustomEvent<{ series: Series; originalEvent: ChartSeriesEvent }>;

/**
 * Fired when the legend item belonging to the series is clicked.
 */
export type ChartSeriesLegendItemClick = CustomEvent<{ series: Series; originalEvent: ChartSeriesEvent }>;

/**
 * Fired when the mouse leaves the graph.
 */
export type ChartSeriesMouseOut = CustomEvent<{ series: Series; originalEvent: ChartSeriesEvent }>;

/**
 * Fired when the mouse enters the graph.
 */
export type ChartSeriesMouseOver = CustomEvent<{ series: Series; originalEvent: ChartSeriesEvent }>;

/**
 * Fired when the series is shown after chart generation time.
 */
export type ChartSeriesShow = CustomEvent<{ series: Series; originalEvent: ChartSeriesEvent }>;

/**
 * Fired when the point is clicked.
 */
export type ChartPointClick = CustomEvent<{ point: Point; originalEvent: ChartPointEvent }>;

/**
 * Fired when the legend item belonging to the point is clicked.
 */
export type ChartPointLegendItemClick = CustomEvent<{ point: Point; originalEvent: ChartPointEvent }>;

/**
 * Fired when the mouse leaves the area close to the point.
 */
export type ChartPointMouseOut = CustomEvent<{ point: Point; originalEvent: ChartPointEvent }>;

/**
 * Fired when the mouse enters the area close to the point.
 */
export type ChartPointMouseOver = CustomEvent<{ point: Point; originalEvent: ChartPointEvent }>;

/**
 * Fired when the point is removed from the series.
 */
export type ChartPointRemove = CustomEvent<{ point: Point; originalEvent: ChartPointEvent }>;

/**
 * Fired when the point is selected either programmatically or by clicking on the point.
 */
export type ChartPointSelect = CustomEvent<{ point: Point; originalEvent: ChartPointEvent }>;

/**
 * Fired when the point is unselected either programmatically or by clicking on the point.
 */
export type ChartPointUnselect = CustomEvent<{ point: Point; originalEvent: ChartPointEvent }>;

/**
 * Fired when the point is updated programmatically through `.update()` method.
 */
export type ChartPointUpdate = CustomEvent<{ point: Point; originalEvent: ChartPointEvent }>;

/**
 * Fired when when the minimum and maximum is set for the X axis.
 */
export type ChartXaxesExtremesSet = CustomEvent<{
  axis: Axis;
  originalEvent: ExtremesObject & {
    target: Axis;
    type: string;
  };
}>;

/**
 * Fired when when the minimum and maximum is set for the Y axis.
 */
export type ChartYaxesExtremesSet = CustomEvent<{
  axis: Axis;
  originalEvent: ExtremesObject & {
    target: Axis;
    type: string;
  };
}>;

export interface ChartElementEventMap {
  'chart-add-series': ChartAddSeries;

  'chart-after-export': ChartAfterExport;

  'chart-after-print': ChartAfterPrint;

  'chart-before-export': ChartBeforeExport;

  'chart-before-print': ChartBeforePrint;

  'chart-click': ChartClick;

  'chart-drilldown': ChartDrilldown;

  'chart-drillup': ChartDrillup;

  'chart-drillupall': ChartDrillupall;

  'chart-load': ChartLoad;

  'chart-redraw': ChartRedraw;

  'chart-selection': ChartSelection;

  'series-after-animate': ChartSeriesAfterAnimate;

  'series-checkbox-click': ChartSeriesCheckboxClick;

  'series-click': ChartSeriesClick;

  'series-hide': ChartSeriesHide;

  'series-legend-item-click': ChartSeriesLegendItemClick;

  'series-mouse-out': ChartSeriesMouseOut;

  'series-mouse-over': ChartSeriesMouseOver;

  'series-show': ChartSeriesShow;

  'point-click': ChartPointClick;

  'point-legend-item-click': ChartPointLegendItemClick;

  'point-mouse-out': ChartPointMouseOut;

  'point-mouse-over': ChartPointMouseOver;

  'point-remove': ChartPointRemove;

  'point-select': ChartPointSelect;

  'point-unselect': ChartPointUnselect;

  'point-update': ChartPointUpdate;

  'xaxes-extremes-set': ChartXaxesExtremesSet;

  'yaxes-extremes-set': ChartYaxesExtremesSet;
}

export type ChartEventMap = HTMLElementEventMap & ChartElementEventMap;
