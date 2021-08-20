/**
 * @license
 * Copyright (c) 2015 - 2021 Vaadin Ltd
 * This program is available under Commercial Vaadin Developer License 4.0, available at https://vaadin.com/license/cvdl-4.0.
 */
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import { beforeNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';
import '@vaadin/vaadin-license-checker/vaadin-license-checker.js';
import { ChartSeriesElement } from './vaadin-chart-series.js';
import Highcharts from 'highcharts/es-modules/masters/highstock.src.js';
import 'highcharts/es-modules/masters/modules/accessibility.src.js';
import 'highcharts/es-modules/masters/highcharts-more.src.js';
import 'highcharts/es-modules/masters/highcharts-3d.src.js';
import 'highcharts/es-modules/masters/modules/data.src.js';
import 'highcharts/es-modules/masters/modules/drilldown.src.js';
import 'highcharts/es-modules/masters/modules/exporting.src.js';
import 'highcharts/es-modules/masters/modules/funnel.src.js';
import 'highcharts/es-modules/masters/modules/heatmap.src.js';
import 'highcharts/es-modules/masters/modules/solid-gauge.src.js';
import 'highcharts/es-modules/masters/modules/treemap.src.js';
import 'highcharts/es-modules/masters/modules/no-data-to-display.src.js';
import 'highcharts/es-modules/masters/modules/sankey.src.js';
import 'highcharts/es-modules/masters/modules/timeline.src.js';
import 'highcharts/es-modules/masters/modules/organization.src.js';
import 'highcharts/es-modules/masters/modules/xrange.src.js';
import 'highcharts/es-modules/masters/modules/bullet.src.js';

/** @private */
export const deepMerge = function deepMerge(target, source) {
  const isObject = (item) => item && typeof item === 'object' && !Array.isArray(item);

  if (isObject(source) && isObject(target)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} });
        }

        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return target;
};

['exportChart', 'exportChartLocal', 'getSVG'].forEach((methodName) => {
  Highcharts.wrap(Highcharts.Chart.prototype, methodName, function (proceed) {
    Highcharts.fireEvent(this, 'beforeExport');
    const result = proceed.apply(this, Array.prototype.slice.call(arguments, 1));
    Highcharts.fireEvent(this, 'afterExport');
    return result;
  });
});

/**
 * `<vaadin-chart>` is a Web Component for creating high quality charts.
 *
 * ### Basic use
 *
 * There are two ways of configuring your `<vaadin-chart>` element: **HTML API**, **JS API** and **JSON API**.
 * Note that you can make use of all APIs in your element.
 *
 * #### Configuring your chart using HTML API
 *
 * `vaadin-chart` has a set of attributes to make it easier for you to customize your chart.
 *
 * ```html
 *  <vaadin-chart title="The chart title" subtitle="The chart subtitle">
 *    <vaadin-chart-series
 *          type="column"
 *          title="The series title"
 *          values="[10,20,30]">
 *    </vaadin-chart-series>
 *  </vaadin-chart>
 * ```
 *
 * > Note that while you can set type for each series individually, for some types, such as `'bar'`, `'gauge'` and `'solidgauge'`, you
 * > have to set it as the default series type on `<vaadin-chart>` in order to work properly.
 *
 * #### Configuring your chart using JS API
 *
 * 1. Set an id for the `<vaadin-chart>` in the template
 * ```html
 *     <vaadin-chart id="mychart"></vaadin-chart>
 * ```
 * 1. Add a function that uses `configuration` property (JS Api) to set chart title, categories and data
 * ```js
 * initChartWithJSApi() {
 *     requestAnimationFrame(() => {
 *        const configuration = this.$.mychart.configuration;
 *        configuration.setTitle({ text: 'The chart title' });
 *        // By default there is one X axis, it is referenced by configuration.xAxis[0].
 *        configuration.xAxis[0].setCategories(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
 *        configuration.addSeries({
 *            type: 'column',
 *            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
 *        });
 *     });
 * }
 * ```
 * 1. Call that function from connectedCallback (when the element is added to a document)
 * ```js
 * connectedCallback() {
 *     super.connectedCallback();
 *     this.initChartWithJSApi();
 * }
 * ```
 *
 * #### Configuring your chart using JS JSON API
 *
 * JS JSON API is a simple alternative to the JS API.
 *
 * 1. Set an id for the `<vaadin-chart>` in the template
 * ```html
 *     <vaadin-chart id="mychart"></vaadin-chart>
 * ```
 * 1. Add a function that uses `updateConfiguration` method (JS JSON Api) to set chart title, categories and data
 * ```js
 * initChartWithJSJSONApi() {
 *     this.$.mychart.updateConfiguration({
 *       title: {
 *         text: 'The chart title'
 *       },
 *       subtitle: {
 *         text: 'Subtitle'
 *       },
 *       xAxis: {
 *         categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
 *       },
 *       series: [{
 *         type: 'column',
 *         data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
 *       }]
 *     });
 * }
 * ```
 * 1. Call that function from connectedCallback (when the element is added to a document)
 * ```js
 * connectedCallback() {
 *     super.connectedCallback();
 *     this.initChartWithJSJSONApi();
 * }
 * ```
 *
 * It should be noted that chart style customization cannot be done via the JS or JSON API.
 * Styling properties in the JSON configuration will be ignored. The following section discusses chart styling.
 *
 * ### CSS Styling
 *
 * Chart appearance is primarily controlled by CSS style rules.
 * A comprehensive list of the supported style classes can be found at
 * https://www.highcharts.com/docs/chart-design-and-style/style-by-css
 *
 * See also the documentation for styling Vaadin components at
 * https://vaadin.com/docs/v14/themes/themes-and-styling-overview.html
 *
 * ### RTL support
 *
 * `vaadin-charts` as well as [Highcharts](https://www.highcharts.com/) by itself are not adjusting the layout
 * based on the `dir` attribute. In order to make `vaadin-charts` display RTL content properly additional
 * JSON configuration should be used.
 * Each chart should be updated based on the specific needs, but general recommendations are:
 *
 *  1. Set `reversed` to true for xAxis (https://api.highcharts.com/highcharts/xAxis.reversed).
 *  2. Set `useHTML` to true for text elements, i.e. `tooltip` (https://api.highcharts.com/highcharts/tooltip.useHTML).
 *  3. Set `rtl` to true for `legend` (https://api.highcharts.com/highcharts/legend.rtl).
 *
 * Using as a base the project created with in Quick Start and an `additionalOptions` in order to make RTL adjustments:
 *
 * ```html
 *  <vaadin-chart title="۱- عنوان نمودار" subtitle="۲- عنوان فرعی نمودار"
 *    additional-options='{"title": {"useHTML": true}, "tooltip": {"useHTML": true}, "subtitle": {"useHTML": true},
 *    "legend": {"rtl": true}, "yAxis": [{"id": "۴- مقادیر", "title": {"text": "۴- مقادیر", "useHTML": true}}],
 *    "xAxis": {"reversed": true}}'>
 *    <vaadin-chart-series
 *          type= "column"
 *          title="۳- عنوان ردیف"
 *          unit="۴- مقادیر"
 *          values="[10,20,30]">
 *    </vaadin-chart-series>
 *  </vaadin-chart>
 * ```
 *
 * ### Setting colors
 *
 * Although charts can be styled as described above, there is a simpler way for setting colors.
 * Colors can be set using CSS custom properties `--vaadin-charts-color-{n}` (where `n` goes from `0 - 9`).
 *
 * For example `--vaadin-charts-color-0` sets the color of the first series on a chart.
 *
 * ### Validating your License
 *
 * When using Vaadin Charts in a development environment, you will see a pop-up that asks you
 * to validate your license by signing in to vaadin.com.
 *
 * @fires {CustomEvent} chart-add-series - Fired when a new series is added.
 * @fires {CustomEvent} chart-after-export - Fired after a chart is exported.
 * @fires {CustomEvent} chart-after-print - Fired after a chart is printed.
 * @fires {CustomEvent} chart-before-export - Fired before a chart is exported.
 * @fires {CustomEvent} chart-before-print - Fired before a chart is printed.
 * @fires {CustomEvent} chart-click - Fired when clicking on the plot background.
 * @fires {CustomEvent} chart-load - Fired when the chart has finished loading.
 * @fires {CustomEvent} chart-drilldown - Fired when drilldown point is clicked.
 * @fires {CustomEvent} chart-drillup - Fired when drilling up from a drilldown series.
 * @fires {CustomEvent} chart-drillupall - Fired after all the drilldown series has been drilled up.
 * @fires {CustomEvent} chart-redraw - Fired after the chart redraw.
 * @fires {CustomEvent} chart-selection - Fired when an area of the chart has been selected.
 * @fires {CustomEvent} series-after-animate - Fired when the series has finished its initial animation.
 * @fires {CustomEvent} series-checkbox-click - Fired when the checkbox next to the series' name in the legend is clicked.
 * @fires {CustomEvent} series-click - Fired when the series is clicked.
 * @fires {CustomEvent} series-hide - Fired when the series is hidden after chart generation time.
 * @fires {CustomEvent} series-legend-item-click - Fired when the legend item belonging to the series is clicked.
 * @fires {CustomEvent} series-mouse-out - Fired when the mouse leaves the graph.
 * @fires {CustomEvent} series-mouse-enter - Fired when the mouse enters the graph.
 * @fires {CustomEvent} series-show - Fired when the series is shown after chart generation time.
 * @fires {CustomEvent} point-click - Fired when the point is clicked.
 * @fires {CustomEvent} point-legend-item-click - Fired when the legend item belonging to the point is clicked.
 * @fires {CustomEvent} point-mouse-out - Fired when the mouse leaves the area close to the point.
 * @fires {CustomEvent} point-mouse-over - Fired when the mouse enters the area close to the point.
 * @fires {CustomEvent} point-remove - Fired when the point is removed from the series.
 * @fires {CustomEvent} point-select -Fired when the point is selected either programmatically or by clicking on the point.
 * @fires {CustomEvent} point-unselect - Fired when the point is unselected either programmatically or by clicking on the point.
 * @fires {CustomEvent} point-update - Fired when the point is updated programmatically through `.updateConfiguration()` method.
 * @fires {CustomEvent} xaxes-extremes-set - Fired when when the minimum and maximum is set for the X axis.
 * @fires {CustomEvent} yaxes-extremes-set - Fired when when the minimum and maximum is set for the Y axis.
 *
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes ElementMixin
 */
class ChartElement extends ElementMixin(ThemableMixin(PolymerElement)) {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          width: 100%;
          overflow: hidden;
        }

        :host([hidden]) {
          display: none !important;
        }
      
        .highcharts-container {
          position: relative;
          overflow: hidden;
          width: 100%;
          height: 100%;
          text-align: left;
          line-height: normal;
          z-index: 0;
          /* #1072 */
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
          font-family: -apple-system, BlinkMacSystemFont, 'Roboto', 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
          font-size: 12px;
        }
    
        .highcharts-root {
          display: block;
        }
    
        .highcharts-root text {
          stroke-width: 0;
        }
    
        .highcharts-strong {
          font-weight: 600;
        }
    
        .highcharts-emphasized {
          font-style: italic;
        }
    
        .highcharts-anchor {
          cursor: pointer;
        }
    
        .highcharts-background {
          fill: var(--vaadin-charts-background, #fff);
        }
    
        .highcharts-plot-border,
        .highcharts-plot-background {
          fill: none;
        }
    
        .highcharts-label-box {
          fill: none;
        }
    
        .highcharts-button-box {
          fill: inherit;
        }
    
        .highcharts-tracker-line {
          stroke-linejoin: round;
          stroke: rgba(192, 192, 192, 0.0001);
          stroke-width: 22;
          fill: none;
        }
    
        .highcharts-tracker-area {
          fill: rgba(192, 192, 192, 0.0001);
          stroke-width: 0;
        }
    
        /* Titles */
        .highcharts-title {
          fill: var(--vaadin-charts-title-label, hsl(214, 35%, 15%));
          font-size: 1.5em;
          font-weight: 600;
        }
    
        .highcharts-subtitle {
          fill: var(--vaadin-charts-secondary-label, hsla(214, 42%, 18%, 0.72));
        }
    
        /* Axes */
        .highcharts-axis-line {
          fill: none;
          stroke: var(--vaadin-charts-axis-line, hsla(214, 61%, 25%, 0.05));
        }
    
        .highcharts-yaxis .highcharts-axis-line {
          stroke-width: 0;
        }
    
        .highcharts-axis-title {
          fill: var(--vaadin-charts-axis-title, hsla(214, 42%, 18%, 0.72));
        }
    
        .highcharts-axis-labels {
          fill: var(--vaadin-charts-axis-label, hsla(214, 42%, 18%, 0.72));
          cursor: default;
          font-size: 0.9em;
        }
    
        .highcharts-grid-line {
          fill: none;
          stroke: var(--vaadin-charts-grid-line, hsla(214, 53%, 23%, 0.16));
        }
    
        .highcharts-xaxis-grid .highcharts-grid-line {
          stroke-width: var(--vaadin-charts-xaxis-line-width, 0px);
        }
    
        .highcharts-tick {
          stroke: var(--vaadin-charts-grid-line, hsla(214, 53%, 23%, 0.16));
        }
    
        .highcharts-yaxis .highcharts-tick {
          stroke-width: 0;
        }
    
        .highcharts-minor-grid-line {
          stroke: var(--vaadin-charts-contrast-5pct, hsla(214, 61%, 25%, 0.05));
        }
    
        .highcharts-crosshair-thin {
          stroke-width: 1px;
          stroke: var(--vaadin-charts-grid-line, hsla(214, 53%, 23%, 0.16));
        }
    
        .highcharts-crosshair-category {
          stroke: var(--vaadin-charts-color-0, #5AC2F7);
          stroke-opacity: 0.25;
        }
    
        /* Credits */
        .highcharts-credits {
          cursor: pointer;
          fill: var(--vaadin-charts-disabled-label, hsla(214, 50%, 22%, 0.26));
          font-size: 0.7em;
          transition: fill 250ms, font-size 250ms;
        }
    
        .highcharts-credits:hover {
          fill: black;
          font-size: 1em;
        }
    
        /* Tooltip */
        .highcharts-tooltip {
          cursor: default;
          pointer-events: none;
          white-space: nowrap;
          transition: stroke 150ms;
        }
    
        .highcharts-tooltip {
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.05)) !important;
        }
        
        .highcharts-tooltip text {
          fill: var(--vaadin-charts-data-label, hsla(214, 40%, 16%, 0.94));
        }
    
        .highcharts-tooltip .highcharts-header {
          font-size: 0.85em;
          color: var(--vaadin-charts-secondary-label, hsla(214, 42%, 18%, 0.72));
        }
    
        .highcharts-tooltip-box {
          stroke-width: 1px;
          stroke: var(--vaadin-charts-tooltip-border-color, inherit);
          fill: var(--vaadin-charts-tooltip-background, #fff);
          fill-opacity: var(--vaadin-charts-tooltip-background-opacity, 1);
        }
    
        .highcharts-tooltip-box .highcharts-label-box {
          fill: var(--vaadin-charts-tooltip-background, #fff);
          fill-opacity: var(--vaadin-charts-tooltip-background-opacity, 1);
        }
        
        .highcharts-tooltip-header {
          stroke-width: 1px;
          stroke: var(--vaadin-charts-contrast-20pct, hsla(214, 53%, 23%, 0.16));
        }
    
        div.highcharts-tooltip {
          filter: none;
        }
    
        .highcharts-selection-marker {
          fill: var(--vaadin-charts-color-0, #5AC2F7);
          fill-opacity: 0.25;
        }
    
        .highcharts-graph {
          fill: none;
          stroke-width: 2px;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
    
        .highcharts-state-hover .highcharts-graph {
          stroke-width: 3;
        }
    
        .highcharts-point-inactive {
          opacity: 0.2;
          transition: opacity 50ms;
          /* quick in */
        }
    
        .highcharts-series-inactive {
          opacity: 0.2;
          transition: opacity 50ms;
          /* quick in */
        }
    
        .highcharts-state-hover path {
          transition: stroke-width 50ms;
          /* quick in */
        }
    
        .highcharts-state-normal path {
          transition: stroke-width 250ms;
          /* slow out */
        }
    
        /* Legend hover affects points and series */
        g.highcharts-series,
        .highcharts-point,
        .highcharts-markers,
        .highcharts-data-labels {
          transition: opacity 250ms;
        }
    
        .highcharts-legend-series-active g.highcharts-series:not(.highcharts-series-hover),
        .highcharts-legend-point-active .highcharts-point:not(.highcharts-point-hover),
        .highcharts-legend-series-active .highcharts-markers:not(.highcharts-series-hover),
        .highcharts-legend-series-active .highcharts-data-labels:not(.highcharts-series-hover) {
          opacity: 0.2;
        }
    
        /* Series options */
        /* Default colors */
        /* vaadin-charts custom properties */
        .highcharts-color-0 {
          fill: var(--vaadin-charts-color-0, #5AC2F7);
          stroke: var(--vaadin-charts-color-0, #5AC2F7);
        }
    
        .highcharts-color-1 {
          fill: var(--vaadin-charts-color-1, #1676F3);
          stroke: var(--vaadin-charts-color-1, #1676F3);
        }
    
        .highcharts-color-2 {
          fill: var(--vaadin-charts-color-2, #FF7D94);
          stroke: var(--vaadin-charts-color-2, #FF7D94);
        }
    
        .highcharts-color-3 {
          fill: var(--vaadin-charts-color-3, #C5164E);
          stroke: var(--vaadin-charts-color-3, #C5164E);
        }
    
        .highcharts-color-4 {
          fill: var(--vaadin-charts-color-4, #15C15D);
          stroke: var(--vaadin-charts-color-4, #15C15D);
        }
    
        .highcharts-color-5 {
          fill: var(--vaadin-charts-color-5, #0E8151);
          stroke: var(--vaadin-charts-color-5, #0E8151);
        }
        
        .highcharts-color-6 {
          fill: var(--vaadin-charts-color-6, #C18ED2);
          stroke: var(--vaadin-charts-color-6, #C18ED2);
        }
    
        .highcharts-color-7 {
          fill: var(--vaadin-charts-color-7, #9233B3);
          stroke: var(--vaadin-charts-color-7, #9233B3);
        }
    
        .highcharts-color-8 {
          fill: var(--vaadin-charts-color-8, #FDA253);
          stroke: var(--vaadin-charts-color-8, #FDA253);
        }
    
        .highcharts-color-9 {
          fill: var(--vaadin-charts-color-9, #E24932);
          stroke: var(--vaadin-charts-color-9, #E24932);
        }
    
        /* end of vaadin-charts custom properties */
        
        .highcharts-area {
          fill-opacity: 0.5;
          stroke-width: 0;
        }
        
        .highcharts-markers {
          stroke-width: 1px;
          stroke: var(--vaadin-charts-background, #fff);
        }
        
        .highcharts-a11y-markers-hidden .highcharts-point:not(.highcharts-point-hover):not(.highcharts-a11y-marker-visible),
        .highcharts-a11y-marker-hidden {
          opacity: 0;
        }
        
        .highcharts-point {
          stroke-width: 1px;
        }
        
        .highcharts-dense-data .highcharts-point {
          stroke-width: 0;
        }
        
        .highcharts-data-label {
          font-size: 0.9em;
          font-weight: normal;
        }
        
        .highcharts-data-label-box {
          fill: none;
          stroke-width: 0;
        }
        
        .highcharts-data-label text,
        text.highcharts-data-label {
          fill: var(--vaadin-charts-data-label, hsla(214, 40%, 16%, 0.94));
        }
        
        .highcharts-data-label-connector {
          fill: none;
        }
        
        .highcharts-data-label-hidden {
          pointer-events: none;
        }
        
        .highcharts-halo {
          fill-opacity: 0.25;
          stroke-width: 0;
        }
        
        .highcharts-series:not(.highcharts-pie-series) .highcharts-point-select,
        .highcharts-markers .highcharts-point-select {
          fill: var(--vaadin-charts-grid-line, hsla(214, 53%, 23%, 0.16));
          stroke: var(--vaadin-charts-contrast, hsl(214, 35%, 15%));
        }
        
        .highcharts-column-series rect.highcharts-point {
          stroke: var(--vaadin-charts-background, #fff);
        }
        
        .highcharts-column-series .highcharts-point {
          transition: fill-opacity 250ms;
        }
        
        .highcharts-column-series .highcharts-point-hover {
          fill-opacity: 0.75;
          transition: fill-opacity 50ms;
        }
        
        .highcharts-pie-series .highcharts-point {
          stroke-linejoin: round;
          stroke: var(--vaadin-charts-background, #fff);
        }
        
        .highcharts-pie-series .highcharts-point-hover {
          fill-opacity: 0.75;
          transition: fill-opacity 50ms;
        }
        
        .highcharts-funnel-series .highcharts-point {
          stroke-linejoin: round;
          stroke: var(--vaadin-charts-background, #fff);
          stroke-width: 2px;
        }
        
        .highcharts-funnel-series .highcharts-point-hover {
          fill-opacity: 0.75;
          transition: fill-opacity 50ms;
        }
        
        .highcharts-funnel-series .highcharts-point-select {
          fill: inherit;
          stroke: inherit;
        }
        
        .highcharts-pyramid-series .highcharts-point {
          stroke-linejoin: round;
          stroke: var(--vaadin-charts-background, #fff);
          stroke-width: 2px;
        }
        
        .highcharts-pyramid-series .highcharts-point-hover {
          fill-opacity: 0.75;
          transition: fill-opacity 50ms;
        }
        
        .highcharts-pyramid-series .highcharts-point-select {
          fill: inherit;
          stroke: inherit;
        }
        
        .highcharts-solidgauge-series .highcharts-point {
          stroke-width: 0;
        }
        
        .highcharts-treemap-series .highcharts-point {
          stroke-width: 2px;
          stroke: var(--vaadin-charts-background, #fff);
          transition: stroke 250ms, fill 250ms, fill-opacity 250ms;
        }
        
        .highcharts-treemap-series .highcharts-point-hover {
          stroke-width: 0px;
          stroke: var(--vaadin-charts-background, #fff);
          fill-opacity: 0.75;
          transition: stroke 25ms, fill 25ms, fill-opacity 25ms;
        }
        
        .highcharts-treemap-series .highcharts-above-level {
          display: none;
        }
        
        .highcharts-treemap-series .highcharts-internal-node {
          fill: none;
        }
        
        .highcharts-treemap-series .highcharts-internal-node-interactive {
          fill-opacity: 0.15;
          cursor: pointer;
        }
        
        .highcharts-treemap-series .highcharts-internal-node-interactive:hover {
          fill-opacity: 0.75;
        }
        
        .highcharts-vector-series .highcharts-point {
          fill: none;
          stroke-width: 2px;
        }
        
        .highcharts-windbarb-series .highcharts-point {
          fill: none;
          stroke-width: 2px;
        }
        
        .highcharts-lollipop-stem {
          stroke: var(--vaadin-charts-contrast, hsl(214, 35%, 15%));
        }
        
        .highcharts-focus-border {
          fill: none;
          stroke-width: 2px;
        }
        
        .highcharts-legend-item-hidden .highcharts-focus-border {
          fill: none !important;
        }
        
        /* Legend */
        .highcharts-legend-box {
          fill: none;
          stroke-width: 0;
        }
        
        .highcharts-legend-item > text {
          fill: var(--vaadin-charts-data-label, hsla(214, 40%, 16%, 0.94));
          font-weight: normal;
          font-size: 1em;
          cursor: pointer;
          stroke-width: 0;
        }
        
        .highcharts-legend-item > .highcharts-point {
          stroke-width: 0px;
        }
        
        .highcharts-legend-item:hover text {
          fill: var(--vaadin-charts-title-label, hsl(214, 35%, 15%));
        }
        
        .highcharts-legend-item-hidden * {
          fill: var(--vaadin-charts-disabled-label, hsla(214, 50%, 22%, 0.26)) !important;
          stroke: var(--vaadin-charts-disabled-label, hsla(214, 50%, 22%, 0.26)) !important;
          transition: fill 250ms;
        }
        
        .highcharts-legend-nav-active {
          fill: var(--vaadin-charts-button-label, hsl(214, 90%, 52%));
          cursor: pointer;
        }
        
        .highcharts-legend-nav-inactive {
          fill: var(--vaadin-charts-disabled-label, hsla(214, 50%, 22%, 0.26));
        }
        
        circle.highcharts-legend-nav-active,
        circle.highcharts-legend-nav-inactive {
          /* tracker */
          fill: rgba(192, 192, 192, 0.0001);
        }
        
        .highcharts-legend-title-box {
          fill: none;
          stroke-width: 0;
        }
        
        /* Bubble legend */
        .highcharts-bubble-legend-symbol {
          stroke-width: 2;
          fill-opacity: 0.5;
        }
        
        .highcharts-bubble-legend-connectors {
          stroke-width: 1;
        }
        
        .highcharts-bubble-legend-labels {
          fill: var(--vaadin-charts-data-label, hsla(214, 40%, 16%, 0.94));
        }
        
        /* Loading */
        .highcharts-loading {
          position: absolute;
          background-color: var(--vaadin-charts-background, #fff);
          opacity: 0.5;
          text-align: center;
          z-index: 10;
          transition: opacity 250ms;
        }
        
        .highcharts-loading-hidden {
          height: 0 !important;
          opacity: 0;
          overflow: hidden;
          transition: opacity 250ms, height 250ms step-end;
        }
        
        .highcharts-loading-inner {
          font-weight: normal;
          position: relative;
          top: 45%;
        }
        
        /* Plot bands and polar pane backgrounds */
        .highcharts-plot-band,
        .highcharts-pane {
          fill: var(--vaadin-charts-contrast, hsl(214, 35%, 15%));
          fill-opacity: 0.05;
        }
        
        .highcharts-plot-line {
          fill: none;
          stroke: var(--vaadin-charts-contrast-60pct, hsla(214, 43%, 19%, 0.61));
          stroke-width: 1px;
        }
        
        .highcharts-plot-line-label {
          fill: var(--vaadin-charts-data-label, hsla(214, 40%, 16%, 0.94));
        }
        
          /* Highcharts More and modules */
        .highcharts-boxplot-box {
          fill: var(--vaadin-charts-background, #fff);
        }
        
        .highcharts-boxplot-median {
          stroke-width: 2px;
        }
        
        .highcharts-bubble-series .highcharts-point {
          fill-opacity: 0.5;
        }
        
        .highcharts-errorbar-series .highcharts-point {
          stroke: var(--vaadin-charts-contrast, hsl(214, 35%, 15%));
        }
        
        .highcharts-gauge-series .highcharts-data-label-box {
          stroke: var(--vaadin-charts-grid-line, hsla(214, 53%, 23%, 0.16));
          stroke-width: 1px;
        }
        
        .highcharts-gauge-series .highcharts-dial {
          fill: var(--vaadin-charts-contrast, hsl(214, 35%, 15%));
          stroke-width: 0;
        }
        
        .highcharts-polygon-series .highcharts-graph {
          fill: inherit;
          stroke-width: 0;
        }
        
        .highcharts-waterfall-series .highcharts-graph {
          stroke: var(--vaadin-charts-contrast-60pct, hsla(214, 43%, 19%, 0.61));
          stroke-dasharray: 1, 3;
        }
        
        .highcharts-sankey-series .highcharts-point {
          stroke-width: 0;
        }
        
        .highcharts-sankey-series .highcharts-link {
          transition: fill 250ms, fill-opacity 250ms;
          fill-opacity: 0.5;
        }
        
        .highcharts-sankey-series .highcharts-point-hover.highcharts-link {
          transition: fill 50ms, fill-opacity 50ms;
          fill-opacity: 1;
        }
        
        .highcharts-venn-series .highcharts-point {
          fill-opacity: 0.75;
          stroke: var(--vaadin-charts-background, #fff);
          transition: stroke 250ms, fill-opacity 250ms;
        }
        
        .highcharts-venn-series .highcharts-point-hover {
          fill-opacity: 1;
          stroke: var(--vaadin-charts-background, #fff);
        }
        
        /* Highstock */
        .highcharts-navigator-mask-outside {
          fill-opacity: 0;
        }
        
        .highcharts-navigator-mask-inside {
          fill: var(--vaadin-charts-color-0, #5AC2F7);
          /* navigator.maskFill option */
          fill-opacity: 0.2;
          cursor: ew-resize;
        }
        
        .highcharts-navigator-outline {
          stroke: var(--vaadin-charts-grid-line, hsla(214, 53%, 23%, 0.16));
          fill: none;
        }
        
        .highcharts-navigator-handle {
          stroke: var(--vaadin-charts-contrast-20pct, hsla(214, 53%, 23%, 0.16));
          fill: var(--vaadin-charts-background, #fff);
          cursor: ew-resize;
        }
        
        .highcharts-navigator-series {
          fill: var(--vaadin-charts-color-1, #1676F3);
          stroke: var(--vaadin-charts-color-1, #1676F3);
        }
        
        .highcharts-navigator-series .highcharts-graph {
          stroke-width: 1px;
        }
        
        .highcharts-navigator-series .highcharts-area {
          fill-opacity: 0.05;
        }
        
        .highcharts-navigator-xaxis .highcharts-axis-line {
          stroke-width: 0;
        }
        
        .highcharts-navigator-xaxis .highcharts-grid-line {
          stroke-width: 1px;
          stroke: var(--vaadin-charts-grid-line, hsla(214, 53%, 23%, 0.16));
        }
        
        .highcharts-navigator-xaxis.highcharts-axis-labels {
          fill: var(--vaadin-charts-secondary-label, hsla(214, 42%, 18%, 0.72));
        }
        
        .highcharts-navigator-yaxis .highcharts-grid-line {
          stroke-width: 0;
        }
        
        .highcharts-navigator + .highcharts-tooltip > .highcharts-tooltip-box {
          stroke: var(--vaadin-charts-tooltip-border-color, inherit);
        }
        
        .highcharts-scrollbar-thumb {
          fill: var(--vaadin-charts-contrast-20pct, hsla(214, 53%, 23%, 0.16));
        }
        
        .highcharts-scrollbar-button {
          fill: var(--vaadin-charts-background, #fff);
        }
        
        .highcharts-scrollbar-arrow {
          fill: var(--vaadin-charts-data-label, hsla(214, 40%, 16%, 0.94));
        }
        
        .highcharts-scrollbar-rifles {
          stroke: var(--vaadin-charts-data-label, hsla(214, 40%, 16%, 0.94));
          stroke-width: 1px;
        }
        
        .highcharts-scrollbar-track {
          fill: var(--vaadin-charts-contrast-5pct, hsla(214, 61%, 25%, 0.05));
        }
        
        .highcharts-button {
          fill: var(--vaadin-charts-button-background, hsla(214, 61%, 25%, 0.05));
          cursor: default;
          transition: fill 250ms;
        }
        
        .highcharts-button text {
          fill: var(--vaadin-charts-button-label, hsl(214, 90%, 52%));
          font-weight: 600;
        }
        
        .highcharts-button-hover {
          transition: fill 0ms;
          fill: var(--vaadin-charts-button-hover-background, hsla(214, 90%, 52%, 0.1));
          stroke-width: 0px;
        }
        
        .highcharts-button-hover text {
          fill: var(--vaadin-charts-button-label, hsl(214, 90%, 52%));
        }
        
        .highcharts-button-pressed {
          fill: var(--vaadin-charts-button-active-background, hsl(214, 90%, 52%));
        }
        
        .highcharts-button-pressed text {
          fill: var(--vaadin-charts-button-active-label, #fff);
        }
        
        .highcharts-button-disabled text {
          fill: var(--vaadin-charts-button-label, hsl(214, 90%, 52%));
        }
        
        .highcharts-range-selector-buttons > text {
          fill: var(--vaadin-charts-secondary-label, hsla(214, 42%, 18%, 0.72));
        }
        
        .highcharts-range-selector-buttons .highcharts-button {
          stroke-width: 0;
        }
        
        .highcharts-range-label rect {
          fill: none;
        }
        
        .highcharts-range-label text {
          fill: var(--vaadin-charts-secondary-label, hsla(214, 42%, 18%, 0.72));
        }
        
        .highcharts-range-input rect {
          fill: var(--vaadin-charts-contrast-10pct, hsla(214, 57%, 24%, 0.1));
          rx: 2;
          ry: 2;
        }
        
        .highcharts-range-input:hover rect {
          fill: var(--vaadin-charts-contrast-20pct, hsla(214, 53%, 23%, 0.16));
          transition: fill 250ms;
        }
        
        .highcharts-range-input text {
          fill: var(--vaadin-charts-data-label, hsla(214, 40%, 16%, 0.94));
        }
        
        input.highcharts-range-selector {
          position: absolute;
          border: 0;
          width: 1px;
          /* Chrome needs a pixel to see it */
          height: 1px;
          padding: 0;
          text-align: center;
          left: -9em;
          /* #4798 */
        }
        
        .highcharts-crosshair-label text {
          fill: var(--vaadin-charts-background, #fff);
          font-size: 1.1em;
        }
        
        .highcharts-crosshair-label .highcharts-label-box {
          fill: inherit;
        }
        
        .highcharts-candlestick-series .highcharts-point {
          stroke: var(--vaadin-charts-contrast-60pct, hsla(214, 43%, 19%, 0.61));
          stroke-width: 1px;
        }
        
        .highcharts-candlestick-series .highcharts-point-up {
          fill: var(--vaadin-charts-color-positive, #15C15D);
        }
        
        .highcharts-candlestick-series .highcharts-point-down {
          fill: var(--vaadin-charts-color-negative, #E24932);
        }
        
        .highcharts-ohlc-series .highcharts-point-hover {
          stroke-width: 3px;
        }
        
        .highcharts-flags-series .highcharts-point .highcharts-label-box {
          stroke: var(--vaadin-charts-grid-line, hsla(214, 53%, 23%, 0.16));
          fill: var(--vaadin-charts-background, #fff);
          transition: fill 250ms;
        }
        
        .highcharts-flags-series .highcharts-point-hover .highcharts-label-box {
          stroke: var(--vaadin-charts-contrast-60pct, hsla(214, 43%, 19%, 0.61));
          fill: var(--vaadin-charts-background, #fff);
        }
        
        .highcharts-flags-series .highcharts-point text {
          fill: var(--vaadin-charts-data-label, hsla(214, 40%, 16%, 0.94));
          font-size: 0.9em;
          font-weight: normal;
        }
        
        .highcharts-flags-series .highcharts-point-hover text {
          fill: var(--vaadin-charts-title-label, hsl(214, 35%, 15%));
        }
        
        /* Highmaps */
        .highcharts-map-series .highcharts-point {
          transition: fill 500ms, fill-opacity 500ms, stroke-width 250ms;
          stroke: var(--vaadin-charts-contrast-20pct, hsla(214, 53%, 23%, 0.16));
        }
        
        .highcharts-map-series .highcharts-point-hover {
          transition: fill 0ms, fill-opacity 0ms;
          fill-opacity: 0.5;
          stroke-width: 2px;
        }
        
        .highcharts-mapline-series .highcharts-point {
          fill: none;
        }
        
        .highcharts-heatmap-series .highcharts-point {
          stroke-width: 0;
        }
        
        .highcharts-map-navigation {
          font-size: 1.3em;
          font-weight: normal;
          text-align: center;
        }
        
        .highcharts-coloraxis {
          stroke-width: 0;
        }
        
        .highcharts-coloraxis-grid .highcharts-grid-line {
          stroke: var(--vaadin-charts-background, #fff);
        }
        
        .highcharts-coloraxis-marker {
          fill: var(--vaadin-charts-axis-label, hsla(214, 42%, 18%, 0.72));
          stroke-width: 0px;
        }
        
        .highcharts-null-point {
          fill: var(--vaadin-charts-contrast-5pct, hsla(214, 61%, 25%, 0.05));
          stroke: var(--vaadin-charts-contrast-60pct, hsla(214, 43%, 19%, 0.61));
        }
        
        /* 3d charts */
        .highcharts-3d-frame {
          fill: transparent;
        }
        
        /* Exporting module */
        .highcharts-contextbutton {
          fill: #fff;
          /* needed to capture hover */
          stroke: none;
          stroke-linecap: round;
        }
        
        .highcharts-contextbutton:hover {
          fill: #e6e6e6;
          stroke: #e6e6e6;
        }
        
        .highcharts-button-symbol {
          stroke: var(--vaadin-charts-secondary-label, hsla(214, 42%, 18%, 0.72));
          stroke-width: 3px;
        }
        
        .highcharts-menu {
          border: 1px solid #999;
          background: #fff;
          padding: 5px 0;
          box-shadow: 3px 3px 10px #888;
        }
        
        .highcharts-menu-item {
          padding: 0.5em 1em;
          background: none;
          color: var(--vaadin-charts-button-label, hsl(214, 90%, 52%));
          cursor: pointer;
          transition: background 250ms, color 250ms;
        }
        
        .highcharts-menu-item:hover {
          background: #335cad;
          color: #fff;
        }
        
        /* Drilldown module */
        .highcharts-drilldown-point {
          cursor: pointer;
        }
        
        .highcharts-drilldown-data-label text,
        text.highcharts-drilldown-data-label,
        .highcharts-drilldown-axis-label {
          cursor: pointer;
          fill: var(--vaadin-charts-button-label, hsl(214, 90%, 52%));
          font-weight: normal;
          text-decoration: underline;
        }
        
        /* No-data module */
        .highcharts-no-data text {
          font-weight: normal;
          font-size: 1rem;
          fill: var(--vaadin-charts-secondary-label, hsla(214, 42%, 18%, 0.72));
        }
        
        /* Drag-panes module */
        .highcharts-axis-resizer {
          cursor: ns-resize;
          stroke: black;
          stroke-width: 2px;
        }
        
        /* Bullet type series */
        .highcharts-bullet-target {
          stroke-width: 0;
        }
        
        /* Lineargauge type series */
        .highcharts-lineargauge-target {
          stroke-width: 1px;
          stroke: var(--vaadin-charts-contrast-60pct, hsla(214, 43%, 19%, 0.61));
        }
        
        .highcharts-lineargauge-target-line {
          stroke-width: 1px;
          stroke: var(--vaadin-charts-contrast-60pct, hsla(214, 43%, 19%, 0.61));
        }
        
        /* Annotations module */
        .highcharts-annotation-label-box {
          stroke-width: 1px;
          stroke: var(--vaadin-charts-contrast, hsl(214, 35%, 15%));
          fill: var(--vaadin-charts-contrast, hsl(214, 35%, 15%));
          fill-opacity: 0.75;
        }
        
        .highcharts-annotation-label text {
          fill: var(--vaadin-charts-disabled-label, hsla(214, 50%, 22%, 0.26));
        }
        
        /* Gantt */
        .highcharts-treegrid-node-collapsed,
        .highcharts-treegrid-node-expanded {
          cursor: pointer;
        }
        
        .highcharts-point-connecting-path {
          fill: none;
        }
        
        .highcharts-grid-axis .highcharts-tick {
          stroke-width: 1px;
        }
        
        .highcharts-grid-axis .highcharts-axis-line {
          stroke-width: 1px;
        }
        
        /* RTL styles */
        :host([dir='rtl']) .highcharts-container {
          text-align: right;
        }
        
        :host([dir='rtl']) input.highcharts-range-selector {
          left: auto;
          right: -9em;
        }
        
        :host([dir='rtl']) .highcharts-menu {
          box-shadow: -3px 3px 10px #888;
        }
      </style>
      <div id="chart"></div>
      <slot id="slot"></slot>
    `;
  }

  static get is() {
    return 'vaadin-chart';
  }

  static get version() {
    return '22.0.0-alpha1';
  }

  /** @private */
  static __callHighchartsFunction(functionName, redrawCharts) {
    const functionToCall = Highcharts[functionName];
    const argumentsForCall = Array.prototype.splice.call(arguments, 2);
    if (functionToCall && typeof functionToCall === 'function') {
      functionToCall.apply(this.configuration, argumentsForCall);
      if (redrawCharts) {
        Highcharts.charts.forEach((c) => c.redraw());
      }
    }
  }

  static get properties() {
    return {
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
       * @type {!Chart | undefined}
       */
      configuration: Object,

      /**
       * If categories are present names are used instead of numbers for the category axis.
       * The format of categories can be an `Array` with a list of categories, such as `['2010', '2011', '2012']`
       * or a mapping `Object`, like `{0:'1',9:'Target (10)', 15: 'Max'}`.
       * @type {ChartCategories | undefined}
       */
      categories: {
        type: Object,
        reflectToAttribute: true
      },

      /**
       * Category-axis maximum value. Defaults to `undefined`.
       * @attr {number} category-max
       */
      categoryMax: {
        type: Number,
        reflectToAttribute: true
      },

      /**
       * Category-axis minimum value. Defaults to `undefined`.
       * @attr {number} category-min
       */
      categoryMin: {
        type: Number,
        reflectToAttribute: true
      },

      /**
       * The position of the category axis. Acceptable values are `left`, `right`, `top` and `bottom`
       * except for bar charts which only accept `left` and `right`.
       * With the default value, charts appear as though they have `category-position="bottom"`
       * except for bar charts that appear as though they have `category-position="left"`.
       *
       * Defaults to `undefined`
       *
       * @attr {left|right|top|bottom} category-position
       * @type {ChartCategoryPosition | undefined}
       */
      categoryPosition: {
        type: String,
        reflectToAttribute: true
      },

      /**
       * Specifies whether to hide legend or show.
       * Legend configuration can be set up via additionalOptions property
       * @attr {boolean} no-legend
       */
      noLegend: {
        type: Boolean,
        reflectToAttribute: true
      },

      /**
       * Specifies how series are stacked on top of each other.
       * Possible values are null, "normal" or "percent".
       * If "stack" property is not defined on the vaadin-chart-series elements, then series will be put into
       * the default stack.
       * @attr {normal|percent} stacking
       * @type {ChartStacking | undefined}
       */
      stacking: {
        type: String,
        reflectToAttribute: true
      },

      /**
       * Specifies whether the chart is a normal chart or a timeline chart.
       */
      timeline: {
        type: Boolean,
        reflectToAttribute: true
      },

      /**
       * Represents the title of the chart.
       * @type {string}
       */
      title: {
        type: String,
        reflectToAttribute: true
      },

      /**
       * Whether or not to show tooltip when hovering data points.
       */
      tooltip: {
        type: Boolean,
        reflectToAttribute: true
      },

      /**
       * Sets the default series type of the chart.
       * Note that `'bar'`, `'gauge'` and `'solidgauge'` should be set as default series type.
       */
      type: {
        type: String,
        reflectToAttribute: true
      },

      /**
       * Represents the subtitle of the chart.
       * @type {string | undefined}
       */
      subtitle: {
        type: String,
        reflectToAttribute: true
      },

      /**
       * Specifies whether to show chart in 3 or in 2 dimensions.
       * Some display angles are added by default to the "chart.options3d" (`{alpha: 15, beta: 15, depth: 50}`).
       * 3D display options can be modified via `additionalOptions`.
       * The thickness of a Pie chart can be set on `additionalOptions` through `plotOptions.pie.depth`.
       * 3D is supported by Bar, Column, Pie and Scatter3D charts.
       * More info available at [Highcharts](https://www.highcharts.com/docs/chart-concepts/3d-charts).
       */
      chart3d: {
        type: Boolean,
        reflectToAttribute: true
      },

      /**
       * Specifies the message displayed on a chart without displayable data.
       * @attr {string} empty-text
       * @type {string}
       */
      emptyText: {
        type: String,
        value: ' ',
        reflectToAttribute: true
      },

      /**
       * Represents additional JSON configuration.
       * @type {Options | undefined}
       */
      additionalOptions: {
        type: Object,
        reflectToAttribute: true
      },

      /**
       * When present, cartesian charts like line, spline, area and column are transformed
       * into the polar coordinate system.
       */
      polar: {
        type: Boolean,
        reflectToAttribute: true
      }
    };
  }

  static get observers() {
    return [
      '__chart3dObserver(chart3d, configuration)',
      '__emptyTextObserver(emptyText, configuration)',
      '__hideLegend(noLegend, configuration)',
      '__polarObserver(polar, configuration)',
      '__stackingObserver(stacking, configuration)',
      '__tooltipObserver(tooltip, configuration)',
      '__updateCategories(categories, configuration)',
      '__updateCategoryMax(categoryMax, configuration)',
      '__updateCategoryMin(categoryMin, configuration)',
      '__updateCategoryPosition(categoryPosition, configuration)',
      '__updateSubtitle(subtitle, configuration)',
      '__updateTitle(title, configuration)',
      '__updateType(type, configuration)',
      '__updateAdditionalOptions(additionalOptions.*)'
    ];
  }

  /**
   * @protected
   */
  static _finalizeClass() {
    super._finalizeClass();

    const devModeCallback = window.Vaadin.developmentModeCallback;
    const licenseChecker = devModeCallback && devModeCallback['vaadin-license-checker'];
    /* c8 ignore next 3 */
    if (typeof licenseChecker === 'function') {
      licenseChecker(ChartElement);
    }
  }

  constructor() {
    super();

    this._baseConfig = {
      chart: {
        styledMode: true
      },
      credits: {
        enabled: false
      },
      exporting: {
        enabled: false
      },
      title: {
        text: null
      },
      series: [],
      xAxis: {},
      yAxis: {
        axisGenerated: true
      }
    };

    this._baseChart3d = {
      enabled: true,
      alpha: 15,
      beta: 15,
      depth: 50
    };

    this.__mutationCallback = this.__mutationCallback.bind(this);
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();
    this.__updateStyles();
    beforeNextRender(this, () => {
      // Detect if the chart had already been initialized. This might happen in
      // environments where the chart is lazily attached (e.g Grid).
      if (this.configuration) {
        this.__reflow();
        return;
      }

      const options = Object.assign({}, this.options, this._jsonConfigurationBuffer);
      this._jsonConfigurationBuffer = null;
      this.__initChart(options);
      this.__addChildObserver();
      const config = { attributes: true, characterData: true };
      this.__mutationObserver = new MutationObserver(this.__mutationCallback);
      this.__mutationObserver.observe(this, config);
    });
  }

  /**
   * @return {!Options}
   */
  get options() {
    const options = Object.assign({}, this._baseConfig);
    deepMerge(options, this.additionalOptions);

    if (this.type) {
      options.chart = options.chart || {};
      options.chart.type = this.type;
    }

    if (this.polar) {
      options.chart = options.chart || {};
      options.chart.polar = true;
    }

    if (this.title) {
      options.title = {
        text: this.title
      };
    }

    if (!options.tooltip) {
      // Workaround for highcharts#7398 to make updating tooltip works
      options.tooltip = {};
      if (!this.tooltip) {
        options.tooltip.enabled = false;
      }
    }

    if (this.subtitle) {
      options.subtitle = {
        text: this.subtitle
      };
    }

    if (this.categories) {
      options.xAxis = options.xAxis || {};
      if (Array.isArray(options.xAxis)) {
        // Set categories on first X axis
        options.xAxis[0].categories = this.categories;
      } else {
        options.xAxis.categories = this.categories;
      }
    }

    if (isFinite(this.categoryMin)) {
      options.xAxis = options.xAxis || {};
      if (Array.isArray(options.xAxis)) {
        // Set category-min on first X axis
        options.xAxis[0].min = this.categoryMin;
      } else {
        options.xAxis.min = this.categoryMin;
      }
    }

    if (isFinite(this.categoryMax)) {
      options.xAxis = options.xAxis || {};
      if (Array.isArray(options.xAxis)) {
        // Set category-max on first x axis
        options.xAxis[0].max = this.categoryMax;
      } else {
        options.xAxis.max = this.categoryMax;
      }
    }

    if (this.noLegend) {
      options.legend = {
        enabled: false
      };
    }

    if (this.emptyText) {
      options.lang = options.lang || {};
      options.lang.noData = this.emptyText;
    }

    if (this.categoryPosition) {
      options.chart = options.chart || {};

      options.chart.inverted = this.__shouldInvert();

      if (Array.isArray(options.xAxis)) {
        options.xAxis.forEach((e) => (e.opposite = this.__shouldFlipOpposite()));
      } else if (options.xAxis) {
        options.xAxis.opposite = this.__shouldFlipOpposite();
      }
    }

    if (this.stacking) {
      options.plotOptions = options.plotOptions || {};
      options.plotOptions.series = options.plotOptions.series || {};
      options.plotOptions.series.stacking = this.stacking;
    }

    if (this.chart3d) {
      options.chart = options.chart || {};

      options.chart.options3d = Object.assign({}, this._baseChart3d, options.chart.options3d);
    }

    return options;
  }

  /**
   * Name of the chart events to add to the configuration and its corresponding event for the chart element
   * @private
   */
  get __chartEventNames() {
    return {
      /**
       * Fired when a new series is added.
       * @event chart-add-series
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} chart Chart object where the event was sent from
       */
      addSeries: 'chart-add-series',

      /**
       * Fired after a chart is exported.
       * @event chart-after-export
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} chart Chart object where the event was sent from
       */
      afterExport: 'chart-after-export',

      /**
       * Fired after a chart is printed.
       * @event chart-after-print
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} chart Chart object where the event was sent from
       */
      afterPrint: 'chart-after-print',

      /**
       * Fired before a chart is exported.
       * @event chart-before-export
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} chart Chart object where the event was sent from
       */
      beforeExport: 'chart-before-export',

      /**
       * Fired before a chart is printed.
       * @event chart-before-print
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} chart Chart object where the event was sent from
       */
      beforePrint: 'chart-before-print',

      /**
       * Fired when clicking on the plot background.
       * @event chart-click
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} chart Chart object where the event was sent from
       */
      click: 'chart-click',

      /**
       * Fired when drilldown point is clicked.
       * @event chart-drilldown
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} chart Chart object where the event was sent from
       */
      drilldown: 'chart-drilldown',

      /**
       * Fired when drilling up from a drilldown series.
       * @event chart-drillup
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} chart Chart object where the event was sent from
       */
      drillup: 'chart-drillup',

      /**
       * Fired after all the series has been drilled up if chart has multiple drilldown series.
       * @event chart-drillupall
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} chart Chart object where the event was sent from
       */
      drillupall: 'chart-drillupall',

      /**
       * Fired when the chart is finished loading.
       * @event chart-load
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} chart Chart object where the event was sent from
       */
      load: 'chart-load',

      /**
       * Fired when the chart is redraw. Can be called after a `Chart.configuration.redraw()`
       * or after an axis, series or point is modified with the `redraw` option set to `true`.
       * @event chart-redraw
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} chart Chart object where the event was sent from
       */
      redraw: 'chart-redraw',

      /**
       * Fired when an area of the chart has been selected.
       * @event chart-selection
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} chart Chart object where the event was sent from
       */
      selection: 'chart-selection'
    };
  }

  /**
   * Name of the series events to add to the configuration and its corresponding event for the chart element
   * @private
   */
  get __seriesEventNames() {
    return {
      /**
       * Fired when the series has finished its initial animation.
       * @event series-after-animate
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} series Series object where the event was sent from
       */
      afterAnimate: 'series-after-animate',

      /**
       * Fired when the checkbox next to the series' name in the legend is clicked.
       * @event series-checkbox-click
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} series Series object where the event was sent from
       */
      checkboxClick: 'series-checkbox-click',

      /**
       * Fired when the series is clicked.
       * @event series-click
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} series Series object where the event was sent from
       */
      click: 'series-click',

      /**
       * Fired when the series is hidden after chart generation time.
       * @event series-hide
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} series Series object where the event was sent from
       */
      hide: 'series-hide',

      /**
       * Fired when the legend item belonging to the series is clicked.
       * @event series-legend-item-click
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} series Series object where the event was sent from
       */
      legendItemClick: 'series-legend-item-click',

      /**
       * Fired when the mouses leave the graph.
       * @event series-mouse-out
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} series Series object where the event was sent from
       */
      mouseOut: 'series-mouse-out',

      /**
       * Fired when the mouse enters the graph.
       * @event series-mouse-over
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} series Series object where the event was sent from
       */
      mouseOver: 'series-mouse-over',

      /**
       * Fired when the series is show after chart generation time.
       * @event series-show
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} series Series object where the event was sent from
       */
      show: 'series-show'
    };
  }

  /**
   * Name of the point events to add to the configuration and its corresponding event for the chart element
   * @private
   */
  get __pointEventNames() {
    return {
      /**
       * Fired when the point is clicked.
       * @event point-click
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} point Point object where the event was sent from
       */
      click: 'point-click',

      /**
       * Fired when the legend item belonging to the point is clicked.
       * @event point-legend-item-click
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} point Point object where the event was sent from
       */
      legendItemClick: 'point-legend-item-click',

      /**
       * Fired when the mouse leaves the area close to the point.
       * @event point-mouse-out
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} point Point object where the event was sent from
       */
      mouseOut: 'point-mouse-out',

      /**
       * Fired when the mouse enters the area close to the point.
       * @event point-mouse-over
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} point Point object where the event was sent from
       */
      mouseOver: 'point-mouse-over',

      /**
       * Fired when the point is removed from the series.
       * @event point-remove
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} point Point object where the event was sent from
       */
      remove: 'point-remove',

      /**
       * Fired when the point is selected either programmatically or by clicking on the point.
       * @event point-select
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} point Point object where the event was sent from
       */
      select: 'point-select',

      /**
       * Fired when the point is unselected either programmatically or by clicking on the point
       * @event point-unselect
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} point Point object where the event was sent from
       */
      unselect: 'point-unselect',

      /**
       * Fired when the point is updated programmatically through `.updateConfiguration()` method.
       * @event point-update
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} point Point object where the event was sent from
       */
      update: 'point-update'
    };
  }

  /** @private */
  get __xAxesEventNames() {
    return {
      /**
       * Fired when when the minimum and maximum is set for the x axis.
       * @event xaxes-extremes-set
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} axis Point object where the event was sent from
       */
      afterSetExtremes: 'xaxes-extremes-set'
    };
  }

  /** @private */
  get __yAxesEventNames() {
    return {
      /**
       * Fired when when the minimum and maximum is set for the y axis.
       * @event yaxes-extremes-set
       * @param {Object} detail.originalEvent object with details about the event sent
       * @param {Object} axis Point object where the event was sent from
       */
      afterSetExtremes: 'yaxes-extremes-set'
    };
  }

  /** @private */
  __reflow() {
    if (!this.configuration) {
      return;
    }
    this.configuration.reflow();
  }

  /** @private */
  __mutationCallback() {
    const { height: componentHeight } = this.getBoundingClientRect();
    const { chartHeight } = this.configuration;

    if (componentHeight !== chartHeight) {
      this.__reflow();
    }
  }

  /** @private */
  __addChildObserver() {
    this._childObserver = new FlattenedNodesObserver(this.$.slot, (info) => {
      this.__addSeries(info.addedNodes.filter(this.__filterSeriesNodes));
      this.__removeSeries(info.removedNodes.filter(this.__filterSeriesNodes));
      this.__cleanupAfterSeriesRemoved(info.removedNodes.filter(this.__filterSeriesNodes));
    });
  }

  /** @private */
  __filterSeriesNodes(node) {
    return node.nodeType === Node.ELEMENT_NODE && node instanceof ChartSeriesElement;
  }

  /** @private */
  __addSeries(series) {
    if (this.__isSeriesEmpty(series)) {
      return;
    }
    const seriesNodes = Array.from(this.childNodes).filter(this.__filterSeriesNodes);

    const yAxes = this.configuration.yAxis.reduce((acc, axis, index) => {
      acc[axis.options.id || index] = axis;
      return acc;
    }, {});

    for (let i = 0, len = series.length; i < len; i++) {
      const seriesElement = series[i];
      const { yAxis: unit, yAxisValueMin: valueMin, yAxisValueMax: valueMax } = seriesElement.options;

      const idxOnChildList = seriesNodes.indexOf(seriesElement);
      if (!unit && !this.configuration.yAxis.some((e) => e.userOptions.id === undefined)) {
        yAxes[unit] = this.__addAxis({ axisGenerated: true });
      } else if (unit && !yAxes[unit]) {
        yAxes[unit] = this.__addAxis({ id: unit, title: { text: unit }, axisGenerated: true });
      }
      if (isFinite(valueMin)) {
        this.__setYAxisProps(yAxes, unit, { min: valueMin });
      }
      if (isFinite(valueMax)) {
        this.__setYAxisProps(yAxes, unit, { max: valueMax });
      }

      const seriesConfiguration = this.__updateOrAddSeriesInstance(seriesElement.options, idxOnChildList);

      seriesElement.setSeries(seriesConfiguration);
    }
    this.__removeAxisIfEmpty();
  }

  /** @private */
  __removeSeries(seriesNodes) {
    if (this.__isSeriesEmpty(seriesNodes)) {
      return;
    }

    seriesNodes.forEach((series) => {
      if (series instanceof ChartSeriesElement) {
        series._series.remove();
      }
    });
  }

  /** @private */
  __setYAxisProps(yAxes, yAxisId, props) {
    if (yAxisId) {
      yAxes[yAxisId].update(props);
    } else {
      this.configuration.yAxis[0].update(props);
    }
  }

  /** @private */
  __isSeriesEmpty(series) {
    return series === null || series.length === 0;
  }

  /** @private */
  __cleanupAfterSeriesRemoved(series) {
    if (this.__isSeriesEmpty(series)) {
      return;
    }

    this.__removeAxisIfEmpty();

    // Best effort to make chart display custom empty-text messages when series are removed.
    // This is needed because Highcharts currently doesn't react. A condition not catered for is
    // when all points are removed from all series without removing any series.
    const isEmpty =
      this.configuration.series.length === 0 ||
      this.configuration.series.map((e) => e.data.length === 0).reduce((e1, e2) => e1 && e2, true);
    if (isEmpty) {
      this.configuration.hideNoData();
      this.configuration.showNoData(this.emptyText);
    }
  }

  /** @private */
  __initChart(options) {
    this.__initEventsListeners(options);
    if (this.timeline) {
      this.configuration = Highcharts.stockChart(this.$.chart, options);
    } else {
      this.configuration = Highcharts.chart(this.$.chart, options);
    }
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.__mutationObserver && this.__mutationObserver.disconnect();
    this._childObserver && this._childObserver.disconnect();
  }

  /**
   * Search for axis with given `id`.
   *
   * @param {string} id contains the id that will be searched
   * @param {boolean} isXAxis indicates if it will remove x or y axes. Defaults to `false`.
   * @return {Axis}
   * @protected
   */
  __getAxis(id, isXAxis) {
    id = Number.parseInt(id) || id;
    if (this.configuration) {
      return (isXAxis ? this.configuration.xAxis : this.configuration.yAxis).find((axis) => axis.options.id === id);
    }
  }

  /**
   * Add an axis with given options
   *
   * @param {Object} options axis options
   * @param {boolean} isXAxis indicates if axis is X (`true`) or Y (`false`). Defaults to `false`.
   * @return {!Axis}
   * @protected
   */
  __addAxis(options, isXAxis) {
    if (this.configuration) {
      this.__createEventListeners(isXAxis ? this.__xAxesEventNames : this.__yAxesEventNames, options, 'events', 'axis');
      return this.configuration.addAxis(options, isXAxis);
    }
  }

  /**
   * Iterates over axes (y or x) and removes whenever it doesn't contain any series and was created for unit
   *
   * @param {boolean} isXAxis indicates if it will remove x or y axes. Defaults to `false`.
   * @protected
   */
  __removeAxisIfEmpty(isXAxis) {
    if (this.configuration) {
      (isXAxis ? this.configuration.xAxis : this.configuration.yAxis).forEach((axis) => {
        if (axis.userOptions.axisGenerated && axis.series.length === 0) {
          axis.remove();
        }
      });
    }
  }

  /**
   * Update the chart configuration.
   * This JSON API provides a simple single-argument alternative to the configuration property.
   *
   * Styling properties specified in this configuration will be ignored. To learn about chart styling
   * please see the CSS Styling section above.
   *
   * @param {!Options} jsonConfiguration Object chart configuration. Most important properties are:
   *
   * - chart `Object` with options regarding the chart area and plot area as well as general chart options.
   *    Detailed API for chart object is available in [API Site](http://api.highcharts.com/highcharts/chart)
   * - credits `Object` with options regarding the chart area and plot area as well as general chart options.
   *    Detailed API for credits object is available in [API Site](http://api.highcharts.com/highcharts/credits)
   * - labels `Object[]` with HTML labels that can be positioned anywhere in the chart area
   *    Detailed API for labels object is available in [API Site](http://api.highcharts.com/highcharts/labels)
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
  updateConfiguration(jsonConfiguration, resetConfiguration) {
    if (resetConfiguration || !this._jsonConfigurationBuffer) {
      this._jsonConfigurationBuffer = {};
    }

    const configCopy = deepMerge({}, jsonConfiguration);
    this.__inflateFunctions(configCopy);
    this._jsonConfigurationBuffer = this.__makeConfigurationBuffer(this._jsonConfigurationBuffer, configCopy);

    beforeNextRender(this, () => {
      if (!this.configuration || !this._jsonConfigurationBuffer) {
        return;
      }

      if (resetConfiguration) {
        const initialOptions = Object.assign({}, this.options, this._jsonConfigurationBuffer);

        this.__initChart(initialOptions);

        this._jsonConfigurationBuffer = null;
        return;
      }

      this.configuration.update(this._jsonConfigurationBuffer);
      if (this._jsonConfigurationBuffer.credits) {
        this.__updateOrAddCredits(this._jsonConfigurationBuffer.credits);
      }
      if (this._jsonConfigurationBuffer.xAxis) {
        this.__updateOrAddAxes(this._jsonConfigurationBuffer.xAxis, true);
      }
      if (this._jsonConfigurationBuffer.yAxis) {
        this.__updateOrAddAxes(this._jsonConfigurationBuffer.yAxis, false);
      }
      if (this._jsonConfigurationBuffer.series) {
        this.__updateOrAddSeries(this._jsonConfigurationBuffer.series);
      }
      this._jsonConfigurationBuffer = null;
    });
  }

  /**
   * Update the chart configuration.
   * This JSON API provides a simple single-argument alternative to the configuration property.
   *
   * Styling properties specified in this configuration will be ignored. To learn about chart styling
   * please see the CSS Styling section above.
   *
   * @param {!Options} jsonConfiguration Object chart configuration. Most important properties are:
   *
   * - chart `Object` with options regarding the chart area and plot area as well as general chart options.
   *    Detailed API for chart object is available in [API Site](http://api.highcharts.com/highcharts/chart)
   * - credits `Object` with options regarding the chart area and plot area as well as general chart options.
   *    Detailed API for credits object is available in [API Site](http://api.highcharts.com/highcharts/credits)
   * - labels `Object[]` with HTML labels that can be positioned anywhere in the chart area
   *    Detailed API for labels object is available in [API Site](http://api.highcharts.com/highcharts/labels)
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
   *
   * @deprecated Since Vaadin 21, `update()` is deprecated. Please use `updateConfiguration()` instead.
   */
  update(jsonConfiguration, resetConfiguration) {
    console.warn('WARNING: Since Vaadin 21, update() is deprecated. Please use updateConfiguration() instead.');

    this.updateConfiguration(jsonConfiguration, resetConfiguration);
  }

  /** @private */
  __makeConfigurationBuffer(target, source) {
    const _source = Highcharts.merge(source);
    const _target = Highcharts.merge(target);

    this.__mergeConfigurationArray(_target, _source, 'series');
    this.__mergeConfigurationArray(_target, _source, 'xAxis');
    this.__mergeConfigurationArray(_target, _source, 'yAxis');

    return Highcharts.merge(_target, _source);
  }

  /** @private */
  __mergeConfigurationArray(target, configuration, entry) {
    if (!configuration || !configuration[entry] || !Array.isArray(configuration[entry])) {
      return;
    }

    if (!target[entry]) {
      target[entry] = Array.from(configuration[entry]);
      return;
    }

    const maxLength = Math.max(target[entry].length, configuration[entry].length);
    for (let i = 0; i < maxLength; i++) {
      target[entry][i] = Highcharts.merge(target[entry][i], configuration[entry][i]);
    }
    delete configuration[entry];
  }

  /** @private */
  __inflateFunctions(jsonConfiguration) {
    for (const attr in jsonConfiguration) {
      // eslint-disable-next-line no-prototype-builtins
      if (jsonConfiguration.hasOwnProperty(attr)) {
        const targetProperty = jsonConfiguration[attr];
        if (attr.indexOf('_fn_') === 0 && (typeof targetProperty === 'string' || targetProperty instanceof String)) {
          try {
            jsonConfiguration[attr.substr(4)] = eval('(' + targetProperty + ')');
          } catch (e) {
            jsonConfiguration[attr.substr(4)] = eval('(function(){' + targetProperty + '})');
          }
          delete jsonConfiguration[attr];
        } else if (targetProperty instanceof Object) {
          this.__inflateFunctions(targetProperty);
        }
      }
    }
  }

  /** @private */
  __initEventsListeners(configuration) {
    this.__initChartEventsListeners(configuration);
    this.__initSeriesEventsListeners(configuration);
    this.__initPointsEventsListeners(configuration);
    this.__initAxisEventsListeners(configuration, true);
    this.__initAxisEventsListeners(configuration, false);
  }

  /** @private */
  __initChartEventsListeners(configuration) {
    this.__createEventListeners(this.__chartEventNames, configuration, 'chart.events', 'chart');
  }

  /** @private */
  __initSeriesEventsListeners(configuration) {
    this.__createEventListeners(this.__seriesEventNames, configuration, 'plotOptions.series.events', 'series');
  }

  /** @private */
  __initPointsEventsListeners(configuration) {
    this.__createEventListeners(this.__pointEventNames, configuration, 'plotOptions.series.point.events', 'point');
  }

  /** @private */
  __initAxisEventsListeners(configuration, isXAxis) {
    let eventNames, axes;

    if (isXAxis) {
      eventNames = this.__xAxesEventNames;
      axes = configuration.xAxis;
    } else {
      eventNames = this.__yAxesEventNames;
      axes = configuration.yAxis;
    }

    if (Array.isArray(axes)) {
      axes.forEach((axis) => this.__createEventListeners(eventNames, axis, 'events', 'axis'));
    } else {
      this.__createEventListeners(eventNames, axes, 'events', 'axis');
    }
  }

  /** @private */
  __createEventListeners(eventList, configuration, pathToAdd, eventType) {
    const eventObject = this.__ensureObjectPath(configuration, pathToAdd);

    for (let keys = Object.keys(eventList), i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (!eventObject[key]) {
        eventObject[key] = (event) => {
          const customEvent = {
            bubbles: false,
            composed: true,
            detail: {
              originalEvent: event,
              [eventType]: event.target
            }
          };

          if (event.type === 'afterSetExtremes') {
            if (event.min == null || event.max == null) {
              return;
            }
          }

          // Workaround for vaadin-charts-flow because of https://github.com/vaadin/flow/issues/3102
          if (event.type === 'selection') {
            if (event.xAxis && event.xAxis[0]) {
              customEvent.detail.xAxisMin = event.xAxis[0].min;
              customEvent.detail.xAxisMax = event.xAxis[0].max;
            }
            if (event.yAxis && event.yAxis[0]) {
              customEvent.detail.yAxisMin = event.yAxis[0].min;
              customEvent.detail.yAxisMax = event.yAxis[0].max;
            }
          }
          if (event.type === 'click') {
            if (event.xAxis && event.xAxis[0]) {
              customEvent.detail.xValue = event.xAxis[0].value;
            }
            if (event.yAxis && event.yAxis[0]) {
              customEvent.detail.yValue = event.yAxis[0].value;
            }
          }

          // Workaround for https://github.com/vaadin/vaadin-charts/issues/389
          // Hook into beforePrint and beforeExport to ensure correct styling
          if (['beforePrint', 'beforeExport'].indexOf(event.type) >= 0) {
            // Guard against another print 'before print' event coming before
            // the 'after print' event.
            if (!this.tempBodyStyle) {
              let effectiveCss = '';

              const shadowStyles = this.shadowRoot.querySelectorAll('style');
              for (let i = 0; i < shadowStyles.length; i++) {
                effectiveCss = effectiveCss + shadowStyles[i].textContent;
              }

              // Strip off host selectors that target individual instances
              effectiveCss = effectiveCss.replace(/:host\(.+?\)/g, (match) => {
                const selector = match.substr(6, match.length - 7);
                return this.matches(selector) ? '' : match;
              });

              // Zoom out a bit to avoid clipping the chart's edge on paper
              effectiveCss =
                effectiveCss +
                +'body {' +
                '    -moz-transform: scale(0.9, 0.9);' + // Mozilla
                '    zoom: 0.9;' + // Others
                '    zoom: 90%;' + // Webkit
                '}';

              this.tempBodyStyle = document.createElement('style');
              this.tempBodyStyle.textContent = effectiveCss;
              document.body.appendChild(this.tempBodyStyle);
            }
          }

          // Hook into afterPrint and afterExport to revert changes made before
          if (['afterPrint', 'afterExport'].indexOf(event.type) >= 0) {
            if (this.tempBodyStyle) {
              document.body.removeChild(this.tempBodyStyle);
              delete this.tempBodyStyle;
            }
          }

          this.dispatchEvent(new CustomEvent(eventList[key], customEvent));

          if (event.type === 'legendItemClick' && this._visibilityTogglingDisabled) {
            return false;
          }
        };
      }
    }
  }

  /** @private */
  __ensureObjectPath(object, path) {
    if (typeof path !== 'string') {
      return;
    }

    path = path.split('.');
    return path.reduce((obj, key) => {
      obj[key] = obj[key] || {};
      return obj[key];
    }, object);
  }

  /** @private */
  __updateOrAddCredits(credits) {
    if (this.configuration.credits) {
      this.configuration.credits.update(credits);
    } else {
      this.configuration.addCredits(credits);
    }
  }

  /** @private */
  __updateOrAddAxes(axes, isX) {
    if (!Array.isArray(axes)) {
      axes = [axes];
    }
    const confAxes = isX ? this.configuration.xAxis : this.configuration.yAxis;
    for (let i = 0; i < axes.length; i++) {
      const axis = axes[i];
      if (confAxes[i]) {
        confAxes[i].update(axis);
      } else {
        this.configuration.addAxis(axis, isX);
      }
    }
  }

  /** @private */
  __updateOrAddSeries(series) {
    if (!Array.isArray(series)) {
      throw new Error('The type of jsonConfiguration.series should be Object[]');
    }
    for (let i = 0; i < series.length; i++) {
      const currentSeries = series[i];
      this.__updateOrAddSeriesInstance(currentSeries, i);
    }
  }

  /** @private */
  __updateOrAddSeriesInstance(seriesOptions, position) {
    if (this.configuration.series[position]) {
      this.configuration.series[position].update(seriesOptions);
    } else {
      this.configuration.addSeries(seriesOptions);
    }
    return this.configuration.series[position];
  }

  /** @private */
  __updateCategories(categories, config) {
    if (categories === undefined || !config) {
      return;
    }

    this.__updateOrAddAxes([{ categories }], true);
  }

  /** @private */
  __updateCategoryMax(max, config) {
    if (max === undefined || !config) {
      return;
    }

    if (!isFinite(max)) {
      console.warn('<vaadin-chart> Acceptable value for "category-max" are Numbers or null');
      return;
    }

    this.__updateOrAddAxes([{ max }], true);
  }

  /** @private */
  __updateCategoryMin(min, config) {
    if (min === undefined || !config) {
      return;
    }

    if (!isFinite(min)) {
      console.warn('<vaadin-chart> Acceptable value for "category-min" are Numbers or null');
      return;
    }

    this.__updateOrAddAxes([{ min }], true);
  }

  /** @private */
  __shouldInvert() {
    // A bar chart will never be inverted, consider using a column chart.
    // See https://stackoverflow.com/questions/11235251#answer-21739793
    if (this.type === 'bar' && ['top', 'bottom'].indexOf(this.categoryPosition) >= 0) {
      console.warn(`<vaadin-chart> Acceptable "category-position" values for bar charts are
          "left" and "right". For "top" and "bottom" positions please consider using a column chart.`);
      return;
    }

    const inverted = ['left', 'right'];
    return inverted.indexOf(this.categoryPosition) >= 0;
  }

  /** @private */
  __shouldFlipOpposite() {
    const opposite = ['top', 'right'];
    const oppositeBar = ['right'];
    return (this.type === 'bar' ? oppositeBar : opposite).indexOf(this.categoryPosition) >= 0;
  }

  /** @private */
  __updateCategoryPosition(categoryPosition, config) {
    if (categoryPosition === undefined || !config) {
      return;
    }

    const validPositions = ['left', 'right', 'top', 'bottom'];

    if (validPositions.indexOf(categoryPosition) < 0) {
      console.warn(`<vaadin-chart> Acceptable "category-position" values are ${validPositions}`);
      return;
    }

    config.update({
      chart: {
        inverted: this.__shouldInvert()
      }
    });

    config.xAxis.forEach((e) =>
      e.update({
        opposite: this.__shouldFlipOpposite()
      })
    );
  }

  /** @private */
  __hideLegend(noLegend, config) {
    if (noLegend === undefined || !config) {
      return;
    }

    if (config.legend) {
      config.legend.update({ enabled: !noLegend });
    } else {
      config.legend = { enabled: !noLegend };
    }
  }

  /** @private */
  __updateTitle(title, config) {
    if (title === undefined || !config) {
      return;
    }

    if (title && title.length > 0) {
      config.title.update({ text: title });
    }
  }

  /** @private */
  __tooltipObserver(tooltip, config) {
    if (tooltip === undefined || !config) {
      return;
    }

    config.tooltip.update({ enabled: tooltip });
  }

  /** @private */
  __updateType(type, config) {
    if (type === undefined || !config) {
      return;
    }

    if (type && type.length > 0) {
      config.update({
        chart: { type }
      });
    }
  }

  /** @private */
  __updateSubtitle(subtitle, config) {
    if (subtitle === undefined || !config) {
      return;
    }

    if (subtitle && subtitle.length > 0) {
      if (!config.subtitle) {
        config.setSubtitle({ text: subtitle });
      } else {
        config.subtitle.update({ text: subtitle });
      }
    }
  }

  /** @private */
  __updateAdditionalOptions(options) {
    if (this.configuration && options.base) {
      this.updateConfiguration(options.base);
    }
  }

  /** @private */
  __isStackingValid() {
    if (['normal', 'percent', null].indexOf(this.stacking) === -1) {
      this.__showWarn('stacking', '"normal", "percent" or null');
      return false;
    }
    return true;
  }

  /** @private */
  __stackingObserver(stacking, config) {
    if (stacking === undefined || !config) {
      return;
    }

    if (!this.__isStackingValid()) {
      this.stacking = null;
      return;
    }

    config.update({
      plotOptions: {
        series: { stacking }
      }
    });
  }

  /** @private */
  __chart3dObserver(chart3d, config) {
    if (chart3d === undefined || !config) {
      return;
    }

    if (chart3d) {
      config.update({
        chart: {
          options3d: Object.assign(
            {},
            this._baseChart3d,
            this.additionalOptions && this.additionalOptions.chart && this.additionalOptions.chart.options3d,
            { enabled: true }
          )
        }
      });
    } else {
      config.update({
        chart: {
          options3d: {
            enabled: false
          }
        }
      });
    }
  }

  /** @private */
  __polarObserver(polar, config) {
    if (polar === undefined || !config) {
      return;
    }

    config.update({
      chart: { polar }
    });
  }

  /** @private */
  __emptyTextObserver(emptyText, config) {
    if (emptyText === undefined || !config) {
      return;
    }

    config.update({
      lang: {
        noData: emptyText
      }
    });
    config.hideNoData();
    config.showNoData(emptyText);
  }

  /** @private */
  __callChartFunction(functionName) {
    if (this.configuration) {
      const functionToCall = this.configuration[functionName];
      const argumentsForCall = Array.prototype.splice.call(arguments, 1);
      if (functionToCall && typeof functionToCall === 'function') {
        functionToCall.apply(this.configuration, argumentsForCall);
      }
    }
  }

  /** @private */
  __callSeriesFunction(functionName, seriesIndex) {
    if (this.configuration && this.configuration.series[seriesIndex]) {
      const series = this.configuration.series[seriesIndex];
      const functionToCall = series[functionName];
      const argumentsForCall = Array.prototype.splice.call(arguments, 2);
      if (functionToCall && typeof functionToCall === 'function') {
        functionToCall.apply(series, argumentsForCall);
      }
    }
  }

  /** @private */
  __callAxisFunction(functionName, axisCategory, axisIndex) {
    /*
     * axisCategory:
     * 0 - xAxis
     * 1 - yAxis
     * 2 - zAxis
     * 3 - colorAxis
     */
    if (this.configuration) {
      let axes;
      switch (axisCategory) {
        case 0:
          axes = this.configuration.xAxis;
          break;
        case 1:
          axes = this.configuration.yAxis;
          break;
        case 2:
          axes = this.configuration.zAxis;
          break;
        case 3:
          axes = this.configuration.colorAxis;
          break;
      }
      if (axes && axes[axisIndex]) {
        const axis = axes[axisIndex];
        const functionToCall = axis[functionName];
        const argumentsForCall = Array.prototype.splice.call(arguments, 3);
        if (functionToCall && typeof functionToCall === 'function') {
          functionToCall.apply(axis, argumentsForCall);
        }
      }
    }
  }

  /** @private */
  __callPointFunction(functionName, seriesIndex, pointIndex) {
    if (
      this.configuration &&
      this.configuration.series[seriesIndex] &&
      this.configuration.series[seriesIndex].data[pointIndex]
    ) {
      const point = this.configuration.series[seriesIndex].data[pointIndex];
      const functionToCall = point[functionName];
      const argumentsForCall = Array.prototype.splice.call(arguments, 3);
      if (functionToCall && typeof functionToCall === 'function') {
        functionToCall.apply(point, argumentsForCall);
      }
    }
  }

  /**
   * Updates chart container and current chart style property depending on flex status
   * @private
   */
  __updateStyles() {
    // Chrome returns default value if property is not set
    // check if flex is defined for chart, and different than default value
    const isFlex = getComputedStyle(this).flex != '0 1 auto';

    // If chart element is a flexible item the chartContainer should be flex too
    if (isFlex) {
      this.$.chart.setAttribute('style', 'flex: 1; ');
      let style = '';
      if (this.hasAttribute('style')) {
        style = this.getAttribute('style');
        if (style.charAt(style.length - 1) !== ';') {
          style += ';';
        }
      }
      style += 'display: flex;';
      this.setAttribute('style', style);
    } else {
      this.$.chart.setAttribute('style', 'height:100%; width:100%;');
    }
  }

  /** @private */
  __showWarn(propertyName, acceptedValues) {
    console.warn('<vaadin-chart> Acceptable values for "' + propertyName + '" are ' + acceptedValues);
  }
}

customElements.define(ChartElement.is, ChartElement);

export { ChartElement };
