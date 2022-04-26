import '../../vaadin-chart.js';
import { Axis, Chart as HighchartsChart, Point, Series } from 'highcharts';
import {
  ChartAddSeriesEvent,
  ChartAfterExportEvent,
  ChartAfterPrintEvent,
  ChartBeforeExportEvent,
  ChartBeforePrintEvent,
  ChartClickEvent,
  ChartDrilldownEvent,
  ChartDrillupallEvent,
  ChartDrillupEvent,
  ChartLoadEvent,
  ChartPointClickEvent,
  ChartPointLegendItemClickEvent,
  ChartPointMouseOutEvent,
  ChartPointMouseOverEvent,
  ChartPointRemoveEvent,
  ChartPointSelectEvent,
  ChartPointUnselectEvent,
  ChartPointUpdateEvent,
  ChartRedrawEvent,
  ChartSelectionEvent,
  ChartSeriesAfterAnimateEvent,
  ChartSeriesCheckboxClickEvent,
  ChartSeriesClickEvent,
  ChartSeriesHideEvent,
  ChartSeriesLegendItemClickEvent,
  ChartSeriesMouseOutEvent,
  ChartSeriesMouseOverEvent,
  ChartSeriesShowEvent,
  ChartXaxesExtremesSetEvent,
  ChartYaxesExtremesSetEvent,
} from '../../vaadin-chart.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const chart = document.createElement('vaadin-chart');

chart.addEventListener('chart-add-series', (event) => {
  assertType<ChartAddSeriesEvent>(event);
  assertType<HighchartsChart>(event.detail.chart);
  assertType<HighchartsChart>(event.detail.originalEvent.target);
});

chart.addEventListener('chart-after-export', (event) => {
  assertType<ChartAfterExportEvent>(event);
  assertType<HighchartsChart>(event.detail.chart);
  assertType<HighchartsChart>(event.detail.originalEvent.target);
});

chart.addEventListener('chart-after-print', (event) => {
  assertType<ChartAfterPrintEvent>(event);
  assertType<HighchartsChart>(event.detail.chart);
  assertType<HighchartsChart>(event.detail.originalEvent.target);
});

chart.addEventListener('chart-before-export', (event) => {
  assertType<ChartBeforeExportEvent>(event);
  assertType<HighchartsChart>(event.detail.chart);
  assertType<HighchartsChart>(event.detail.originalEvent.target);
});

chart.addEventListener('chart-before-print', (event) => {
  assertType<ChartBeforePrintEvent>(event);
  assertType<HighchartsChart>(event.detail.chart);
  assertType<HighchartsChart>(event.detail.originalEvent.target);
});

chart.addEventListener('chart-click', (event) => {
  assertType<ChartClickEvent>(event);
  assertType<HighchartsChart>(event.detail.chart);
  assertType<HighchartsChart>(event.detail.originalEvent.target);
});

chart.addEventListener('chart-drilldown', (event) => {
  assertType<ChartDrilldownEvent>(event);
  assertType<HighchartsChart>(event.detail.chart);
  assertType<HighchartsChart>(event.detail.originalEvent.target);
});

chart.addEventListener('chart-drillup', (event) => {
  assertType<ChartDrillupEvent>(event);
  assertType<HighchartsChart>(event.detail.chart);
  assertType<HighchartsChart>(event.detail.originalEvent.target);
});

chart.addEventListener('chart-drillupall', (event) => {
  assertType<ChartDrillupallEvent>(event);
  assertType<HighchartsChart>(event.detail.chart);
  assertType<HighchartsChart>(event.detail.originalEvent.target);
});

chart.addEventListener('chart-load', (event) => {
  assertType<ChartLoadEvent>(event);
  assertType<HighchartsChart>(event.detail.chart);
  assertType<HighchartsChart>(event.detail.originalEvent.target);
});

chart.addEventListener('chart-redraw', (event) => {
  assertType<ChartRedrawEvent>(event);
  assertType<HighchartsChart>(event.detail.chart);
  assertType<HighchartsChart>(event.detail.originalEvent.target);
});

chart.addEventListener('chart-selection', (event) => {
  assertType<ChartSelectionEvent>(event);
  assertType<HighchartsChart>(event.detail.chart);
  assertType<HighchartsChart>(event.detail.originalEvent.target);
});

chart.addEventListener('series-after-animate', (event) => {
  assertType<ChartSeriesAfterAnimateEvent>(event);
  assertType<Series>(event.detail.series);
  assertType<Series>(event.detail.originalEvent.target);
});

chart.addEventListener('series-checkbox-click', (event) => {
  assertType<ChartSeriesCheckboxClickEvent>(event);
  assertType<Series>(event.detail.series);
  assertType<Series>(event.detail.originalEvent.target);
});

chart.addEventListener('series-click', (event) => {
  assertType<ChartSeriesClickEvent>(event);
  assertType<Series>(event.detail.series);
  assertType<Series>(event.detail.originalEvent.target);
});

chart.addEventListener('series-hide', (event) => {
  assertType<ChartSeriesHideEvent>(event);
  assertType<Series>(event.detail.series);
  assertType<Series>(event.detail.originalEvent.target);
});

chart.addEventListener('series-legend-item-click', (event) => {
  assertType<ChartSeriesLegendItemClickEvent>(event);
  assertType<Series>(event.detail.series);
  assertType<Series>(event.detail.originalEvent.target);
});

chart.addEventListener('series-mouse-out', (event) => {
  assertType<ChartSeriesMouseOutEvent>(event);
  assertType<Series>(event.detail.series);
  assertType<Series>(event.detail.originalEvent.target);
});

chart.addEventListener('series-mouse-over', (event) => {
  assertType<ChartSeriesMouseOverEvent>(event);
  assertType<Series>(event.detail.series);
  assertType<Series>(event.detail.originalEvent.target);
});

chart.addEventListener('series-show', (event) => {
  assertType<ChartSeriesShowEvent>(event);
  assertType<Series>(event.detail.series);
  assertType<Series>(event.detail.originalEvent.target);
});

chart.addEventListener('point-click', (event) => {
  assertType<ChartPointClickEvent>(event);
  assertType<Point>(event.detail.point);
  assertType<Point>(event.detail.originalEvent.target);
});

chart.addEventListener('point-legend-item-click', (event) => {
  assertType<ChartPointLegendItemClickEvent>(event);
  assertType<Point>(event.detail.point);
  assertType<Point>(event.detail.originalEvent.target);
});

chart.addEventListener('point-mouse-out', (event) => {
  assertType<ChartPointMouseOutEvent>(event);
  assertType<Point>(event.detail.point);
  assertType<Point>(event.detail.originalEvent.target);
});

chart.addEventListener('point-mouse-over', (event) => {
  assertType<ChartPointMouseOverEvent>(event);
  assertType<Point>(event.detail.point);
  assertType<Point>(event.detail.originalEvent.target);
});

chart.addEventListener('point-remove', (event) => {
  assertType<ChartPointRemoveEvent>(event);
  assertType<Point>(event.detail.point);
  assertType<Point>(event.detail.originalEvent.target);
});

chart.addEventListener('point-select', (event) => {
  assertType<ChartPointSelectEvent>(event);
  assertType<Point>(event.detail.point);
  assertType<Point>(event.detail.originalEvent.target);
});

chart.addEventListener('point-unselect', (event) => {
  assertType<ChartPointUnselectEvent>(event);
  assertType<Point>(event.detail.point);
  assertType<Point>(event.detail.originalEvent.target);
});

chart.addEventListener('point-update', (event) => {
  assertType<ChartPointUpdateEvent>(event);
  assertType<Point>(event.detail.point);
  assertType<Point>(event.detail.originalEvent.target);
});

chart.addEventListener('xaxes-extremes-set', (event) => {
  assertType<ChartXaxesExtremesSetEvent>(event);
  assertType<Axis>(event.detail.axis);
  assertType<Axis>(event.detail.originalEvent.target);
  assertType<number>(event.detail.originalEvent.min);
  assertType<number>(event.detail.originalEvent.max);
  assertType<number>(event.detail.originalEvent.userMin);
  assertType<number>(event.detail.originalEvent.userMax);
  assertType<number>(event.detail.originalEvent.dataMin);
  assertType<number>(event.detail.originalEvent.dataMax);
});

chart.addEventListener('yaxes-extremes-set', (event) => {
  assertType<ChartYaxesExtremesSetEvent>(event);
  assertType<Axis>(event.detail.axis);
  assertType<Axis>(event.detail.originalEvent.target);
  assertType<number>(event.detail.originalEvent.min);
  assertType<number>(event.detail.originalEvent.max);
  assertType<number>(event.detail.originalEvent.userMin);
  assertType<number>(event.detail.originalEvent.userMax);
  assertType<number>(event.detail.originalEvent.dataMin);
  assertType<number>(event.detail.originalEvent.dataMax);
});
