import '../../vaadin-chart.js';
import {
  ChartAddSeries,
  ChartAfterExport,
  ChartAfterPrint,
  ChartBeforeExport,
  ChartBeforePrint,
  ChartClick,
  ChartDrilldown,
  ChartDrillup,
  ChartDrillupall,
  ChartLoad,
  ChartPointClick,
  ChartPointLegendItemClick,
  ChartPointMouseOut,
  ChartPointMouseOver,
  ChartPointRemove,
  ChartPointSelect,
  ChartPointUnselect,
  ChartPointUpdate,
  ChartRedraw,
  ChartSelection,
  ChartSeriesAfterAnimate,
  ChartSeriesCheckboxClick,
  ChartSeriesClick,
  ChartSeriesHide,
  ChartSeriesLegendItemClick,
  ChartSeriesMouseOut,
  ChartSeriesMouseOver,
  ChartSeriesShow,
  ChartXaxesExtremesSet,
  ChartYaxesExtremesSet
} from '../../vaadin-chart.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const chart = document.createElement('vaadin-chart');

chart.addEventListener('chart-add-series', (event) => {
  assertType<ChartAddSeries>(event);
});

chart.addEventListener('chart-after-export', (event) => {
  assertType<ChartAfterExport>(event);
});

chart.addEventListener('chart-after-print', (event) => {
  assertType<ChartAfterPrint>(event);
});

chart.addEventListener('chart-before-export', (event) => {
  assertType<ChartBeforeExport>(event);
});

chart.addEventListener('chart-before-print', (event) => {
  assertType<ChartBeforePrint>(event);
});

chart.addEventListener('chart-click', (event) => {
  assertType<ChartClick>(event);
});

chart.addEventListener('chart-drilldown', (event) => {
  assertType<ChartDrilldown>(event);
});

chart.addEventListener('chart-drillup', (event) => {
  assertType<ChartDrillup>(event);
});

chart.addEventListener('chart-drillupall', (event) => {
  assertType<ChartDrillupall>(event);
});

chart.addEventListener('chart-load', (event) => {
  assertType<ChartLoad>(event);
});

chart.addEventListener('chart-redraw', (event) => {
  assertType<ChartRedraw>(event);
});

chart.addEventListener('chart-selection', (event) => {
  assertType<ChartSelection>(event);
});

chart.addEventListener('series-after-animate', (event) => {
  assertType<ChartSeriesAfterAnimate>(event);
});

chart.addEventListener('series-checkbox-click', (event) => {
  assertType<ChartSeriesCheckboxClick>(event);
});

chart.addEventListener('series-click', (event) => {
  assertType<ChartSeriesClick>(event);
});

chart.addEventListener('series-hide', (event) => {
  assertType<ChartSeriesHide>(event);
});

chart.addEventListener('series-legend-item-click', (event) => {
  assertType<ChartSeriesLegendItemClick>(event);
});

chart.addEventListener('series-mouse-out', (event) => {
  assertType<ChartSeriesMouseOut>(event);
});

chart.addEventListener('series-mouse-over', (event) => {
  assertType<ChartSeriesMouseOver>(event);
});

chart.addEventListener('series-show', (event) => {
  assertType<ChartSeriesShow>(event);
});

chart.addEventListener('point-click', (event) => {
  assertType<ChartPointClick>(event);
});

chart.addEventListener('point-legend-item-click', (event) => {
  assertType<ChartPointLegendItemClick>(event);
});

chart.addEventListener('point-mouse-out', (event) => {
  assertType<ChartPointMouseOut>(event);
});

chart.addEventListener('point-mouse-over', (event) => {
  assertType<ChartPointMouseOver>(event);
});

chart.addEventListener('point-remove', (event) => {
  assertType<ChartPointRemove>(event);
});

chart.addEventListener('point-select', (event) => {
  assertType<ChartPointSelect>(event);
});

chart.addEventListener('point-unselect', (event) => {
  assertType<ChartPointUnselect>(event);
});

chart.addEventListener('point-update', (event) => {
  assertType<ChartPointUpdate>(event);
});

chart.addEventListener('xaxes-extremes-set', (event) => {
  assertType<ChartXaxesExtremesSet>(event);
});

chart.addEventListener('yaxes-extremes-set', (event) => {
  assertType<ChartYaxesExtremesSet>(event);
});
