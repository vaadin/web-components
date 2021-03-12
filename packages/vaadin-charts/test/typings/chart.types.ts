import { Axis, Chart, Point, Series } from 'highcharts';
import '../../src/vaadin-chart';

const assert = <T>(value: T) => value;

const chart = document.createElement('vaadin-chart');

chart.addEventListener('chart-add-series', (event) => {
  assert<Chart>(event.detail.chart);
  assert<Chart>(event.detail.originalEvent.target);
});

chart.addEventListener('chart-after-export', (event) => {
  assert<Chart>(event.detail.chart);
  assert<Chart>(event.detail.originalEvent.target);
});

chart.addEventListener('chart-after-print', (event) => {
  assert<Chart>(event.detail.chart);
  assert<Chart>(event.detail.originalEvent.target);
});

chart.addEventListener('chart-before-export', (event) => {
  assert<Chart>(event.detail.chart);
  assert<Chart>(event.detail.originalEvent.target);
});

chart.addEventListener('chart-before-print', (event) => {
  assert<Chart>(event.detail.chart);
  assert<Chart>(event.detail.originalEvent.target);
});

chart.addEventListener('chart-click', (event) => {
  assert<Chart>(event.detail.chart);
  assert<Chart>(event.detail.originalEvent.target);
});

chart.addEventListener('chart-drilldown', (event) => {
  assert<Chart>(event.detail.chart);
  assert<Chart>(event.detail.originalEvent.target);
});

chart.addEventListener('chart-drillup', (event) => {
  assert<Chart>(event.detail.chart);
  assert<Chart>(event.detail.originalEvent.target);
});

chart.addEventListener('chart-drillupall', (event) => {
  assert<Chart>(event.detail.chart);
  assert<Chart>(event.detail.originalEvent.target);
});

chart.addEventListener('chart-load', (event) => {
  assert<Chart>(event.detail.chart);
  assert<Chart>(event.detail.originalEvent.target);
});

chart.addEventListener('chart-redraw', (event) => {
  assert<Chart>(event.detail.chart);
  assert<Chart>(event.detail.originalEvent.target);
});

chart.addEventListener('chart-selection', (event) => {
  assert<Chart>(event.detail.chart);
  assert<Chart>(event.detail.originalEvent.target);
});

chart.addEventListener('series-after-animate', (event) => {
  assert<Series>(event.detail.series);
  assert<Series>(event.detail.originalEvent.target);
});

chart.addEventListener('series-checkbox-click', (event) => {
  assert<Series>(event.detail.series);
  assert<Series>(event.detail.originalEvent.target);
});

chart.addEventListener('series-click', (event) => {
  assert<Series>(event.detail.series);
  assert<Series>(event.detail.originalEvent.target);
});

chart.addEventListener('series-hide', (event) => {
  assert<Series>(event.detail.series);
  assert<Series>(event.detail.originalEvent.target);
});

chart.addEventListener('series-legend-item-click', (event) => {
  assert<Series>(event.detail.series);
  assert<Series>(event.detail.originalEvent.target);
});

chart.addEventListener('series-mouse-out', (event) => {
  assert<Series>(event.detail.series);
  assert<Series>(event.detail.originalEvent.target);
});

chart.addEventListener('series-mouse-over', (event) => {
  assert<Series>(event.detail.series);
  assert<Series>(event.detail.originalEvent.target);
});

chart.addEventListener('series-show', (event) => {
  assert<Series>(event.detail.series);
  assert<Series>(event.detail.originalEvent.target);
});

chart.addEventListener('point-click', (event) => {
  assert<Point>(event.detail.point);
  assert<Point>(event.detail.originalEvent.target);
});

chart.addEventListener('point-legend-item-click', (event) => {
  assert<Point>(event.detail.point);
  assert<Point>(event.detail.originalEvent.target);
});

chart.addEventListener('point-mouse-out', (event) => {
  assert<Point>(event.detail.point);
  assert<Point>(event.detail.originalEvent.target);
});

chart.addEventListener('point-mouse-over', (event) => {
  assert<Point>(event.detail.point);
  assert<Point>(event.detail.originalEvent.target);
});

chart.addEventListener('point-remove', (event) => {
  assert<Point>(event.detail.point);
  assert<Point>(event.detail.originalEvent.target);
});

chart.addEventListener('point-select', (event) => {
  assert<Point>(event.detail.point);
  assert<Point>(event.detail.originalEvent.target);
});

chart.addEventListener('point-unselect', (event) => {
  assert<Point>(event.detail.point);
  assert<Point>(event.detail.originalEvent.target);
});

chart.addEventListener('point-update', (event) => {
  assert<Point>(event.detail.point);
  assert<Point>(event.detail.originalEvent.target);
});

chart.addEventListener('xaxes-extremes-set', (event) => {
  assert<Axis>(event.detail.axis);
  assert<Axis>(event.detail.originalEvent.target);
  assert<number>(event.detail.originalEvent.min);
  assert<number>(event.detail.originalEvent.max);
  assert<number>(event.detail.originalEvent.userMin);
  assert<number>(event.detail.originalEvent.userMax);
  assert<number>(event.detail.originalEvent.dataMin);
  assert<number>(event.detail.originalEvent.dataMax);
});

chart.addEventListener('yaxes-extremes-set', (event) => {
  assert<Axis>(event.detail.axis);
  assert<Axis>(event.detail.originalEvent.target);
  assert<number>(event.detail.originalEvent.min);
  assert<number>(event.detail.originalEvent.max);
  assert<number>(event.detail.originalEvent.userMin);
  assert<number>(event.detail.originalEvent.userMax);
  assert<number>(event.detail.originalEvent.dataMin);
  assert<number>(event.detail.originalEvent.dataMax);
});
