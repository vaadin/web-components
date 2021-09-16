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
export type ChartAddSeriesEvent = CustomEvent<{ chart: Chart; originalEvent: ChartEvent }>;

/**
 * Fired after a chart is exported.
 */
export type ChartAfterExportEvent = CustomEvent<{ chart: Chart; originalEvent: ChartEvent }>;

/**
 * Fired after a chart is printed.
 */
export type ChartAfterPrintEvent = CustomEvent<{ chart: Chart; originalEvent: ChartEvent }>;

/**
 * Fired before a chart is exported.
 */
export type ChartBeforeExportEvent = CustomEvent<{ chart: Chart; originalEvent: ChartEvent }>;

/**
 * Fired before a chart is printed.
 */
export type ChartBeforePrintEvent = CustomEvent<{ chart: Chart; originalEvent: ChartEvent }>;

/**
 * Fired when clicking on the plot background.
 */
export type ChartClickEvent = CustomEvent<{ chart: Chart; originalEvent: ChartEvent }>;

/**
 * Fired when the chart has finished loading.
 */
export type ChartLoadEvent = CustomEvent<{ chart: Chart; originalEvent: ChartEvent }>;

/**
 * Fired when drilldown point is clicked.
 */
export type ChartDrilldownEvent = CustomEvent<{ chart: Chart; originalEvent: ChartEvent }>;

/**
 * Fired when drilling up from a drilldown series.
 */
export type ChartDrillupEvent = CustomEvent<{ chart: Chart; originalEvent: ChartEvent }>;

/**
 * Fired after all the series has been drilled up if chart has multiple drilldown series.
 */
export type ChartDrillupallEvent = CustomEvent<{ chart: Chart; originalEvent: ChartEvent }>;

/**
 * Fired when the chart is redraw. Can be called after a `Chart.configuration.redraw()`
 * or after an axis, series or point is modified with the `redraw` option set to `true`.
 */
export type ChartRedrawEvent = CustomEvent<{ chart: Chart; originalEvent: ChartEvent }>;

/**
 * Fired when an area of the chart has been selected.
 */
export type ChartSelectionEvent = CustomEvent<{ chart: Chart; originalEvent: ChartEvent }>;

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

export interface ChartElementEventMap {
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

  'xaxes-extremes-set': ChartXaxesExtremesSetEvent;

  'yaxes-extremes-set': ChartYaxesExtremesSetEvent;
}

export type ChartEventMap = HTMLElementEventMap & ChartElementEventMap;
