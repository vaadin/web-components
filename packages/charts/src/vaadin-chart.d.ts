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
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { type ChartEventMap, ChartMixin } from './vaadin-chart-mixin.js';
export * from './vaadin-chart-mixin.js';

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
 * See also the [Chart Styling](https://vaadin.com/docs/latest/components/charts/css-styling) documentation.
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
 * @fires {CustomEvent} point-drag-start - Fired when starting to drag a point.
 * @fires {CustomEvent} point-drop - Fired when the point is dropped.
 * @fires {CustomEvent} point-drag - Fired while dragging a point.
 * @fires {CustomEvent} xaxes-extremes-set - Fired when when the minimum and maximum is set for the X axis.
 * @fires {CustomEvent} yaxes-extremes-set - Fired when when the minimum and maximum is set for the Y axis.
 */
declare class Chart extends ChartMixin(ThemableMixin(ElementMixin(HTMLElement))) {
  addEventListener<K extends keyof ChartEventMap>(
    type: K,
    listener: (this: Chart, ev: ChartEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof ChartEventMap>(
    type: K,
    listener: (this: Chart, ev: ChartEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-chart': Chart;
  }
}

export { Chart };
