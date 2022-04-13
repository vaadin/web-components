/**
 * @license
 * Copyright (c) 2015 - 2022 Vaadin Ltd.
 * This program is available under Commercial Vaadin Developer License 4.0, available at https://vaadin.com/license/cvdl-4.0.
 */
import '@vaadin/vaadin-license-checker/vaadin-license-checker.js';
import 'highcharts/es-modules/masters/highstock.src.js';
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
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import { beforeNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import Highcharts from 'highcharts/es-modules/masters/highstock.src.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ChartSeries } from './vaadin-chart-series.js';

/** @private */
export function deepMerge(target, source) {
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
}

['exportChart', 'exportChartLocal', 'getSVG'].forEach((methodName) => {
  /* eslint-disable no-invalid-this */
  Highcharts.wrap(Highcharts.Chart.prototype, methodName, function (proceed, ...args) {
    Highcharts.fireEvent(this, 'beforeExport');
    const result = proceed.apply(this, args);
    Highcharts.fireEvent(this, 'afterExport');
    return result;
  });
  /* eslint-enable no-invalid-this */
});

// Init Highcharts global language defaults
// No data message should be empty by default
Highcharts.setOptions({ lang: { noData: '' } });

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
 * @mixes ResizeMixin
 * @mixes ThemableMixin
 * @mixes ElementMixin
 */
class Chart extends ResizeMixin(ElementMixin(ThemableMixin(PolymerElement))) {
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
      </style>
      <div id="chart"></div>
      <slot id="slot"></slot>
    `;
  }

  static get is() {
    return 'vaadin-chart';
  }

  /** @private */
  static __callHighchartsFunction(functionName, redrawCharts, ...args) {
    const functionToCall = Highcharts[functionName];
    if (functionToCall && typeof functionToCall === 'function') {
      functionToCall.apply(this.configuration, args);
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
       * @type {!Highcharts.Chart | undefined}
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
      licenseChecker(Chart);
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

      const options = { ...this.options, ...this._jsonConfigurationBuffer };
      this._jsonConfigurationBuffer = null;
      this.__initChart(options);
      this.__addChildObserver();
    });
  }

  /**
   * @return {!Options}
   */
  get options() {
    const options = { ...this._baseConfig };
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

      options.chart.options3d = { ...this._baseChart3d, ...options.chart.options3d };
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

  /**
   * Implements resize callback from `ResizeMixin`
   * to reflow when the chart element is resized.
   * @protected
   * @override
   */
  _onResize(contentRect) {
    if (!this.configuration) {
      return;
    }

    const { height, width } = contentRect;
    const { chartHeight, chartWidth } = this.configuration;

    if (height !== chartHeight || width !== chartWidth) {
      this.__reflow();
    }
  }

  /** @private */
  __reflow() {
    if (!this.configuration) {
      return;
    }
    this.configuration.reflow();
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
    return node.nodeType === Node.ELEMENT_NODE && node instanceof ChartSeries;
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

      const seriesConfiguration = this.__updateOrAddSeriesInstance(seriesElement.options, idxOnChildList, false);

      seriesElement.setSeries(seriesConfiguration);
    }
    this.__removeAxisIfEmpty();

    this.configuration.redraw();
  }

  /** @private */
  __removeSeries(seriesNodes) {
    if (this.__isSeriesEmpty(seriesNodes)) {
      return;
    }

    seriesNodes.forEach((series) => {
      if (series instanceof ChartSeries) {
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
    this.__updateNoDataElement(this.configuration);
  }

  /** @private */
  __initChart(options) {
    this.__initEventsListeners(options);
    this.__updateStyledMode(options);
    if (this.timeline) {
      this.configuration = Highcharts.stockChart(this.$.chart, options);
    } else {
      this.configuration = Highcharts.chart(this.$.chart, options);
    }
  }

  /** @private */
  __updateStyledMode(options) {
    const styledMode = options.chart.styledMode;
    this.$.chart.toggleAttribute('styled-mode', !!styledMode);
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();
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
        const initialOptions = { ...this.options, ...this._jsonConfigurationBuffer };

        this.__initChart(initialOptions);

        this._jsonConfigurationBuffer = null;
        return;
      }

      this.configuration.update(this._jsonConfigurationBuffer, false);
      if (this._jsonConfigurationBuffer.credits) {
        this.__updateOrAddCredits(this._jsonConfigurationBuffer.credits);
      }
      if (this._jsonConfigurationBuffer.xAxis) {
        this.__updateOrAddAxes(this._jsonConfigurationBuffer.xAxis, true, false);
      }
      if (this._jsonConfigurationBuffer.yAxis) {
        this.__updateOrAddAxes(this._jsonConfigurationBuffer.yAxis, false, false);
      }
      if (this._jsonConfigurationBuffer.series) {
        this.__updateOrAddSeries(this._jsonConfigurationBuffer.series, false);
      }
      this._jsonConfigurationBuffer = null;

      this.configuration.redraw();
    });
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
            // eslint-disable-next-line no-eval
            jsonConfiguration[attr.substr(4)] = eval('(' + targetProperty + ')');
          } catch (e) {
            // eslint-disable-next-line no-eval
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
                effectiveCss += shadowStyles[i].textContent;
              }

              // Strip off host selectors that target individual instances
              effectiveCss = effectiveCss.replace(/:host\(.+?\)/g, (match) => {
                const selector = match.substr(6, match.length - 7);
                return this.matches(selector) ? '' : match;
              });

              // Zoom out a bit to avoid clipping the chart's edge on paper
              effectiveCss =
                effectiveCss +
                'body {' +
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
  __updateOrAddAxes(axes, isX, redraw) {
    if (!Array.isArray(axes)) {
      axes = [axes];
    }
    const confAxes = isX ? this.configuration.xAxis : this.configuration.yAxis;
    for (let i = 0; i < axes.length; i++) {
      const axis = axes[i];
      if (confAxes[i]) {
        confAxes[i].update(axis, redraw);
      } else {
        this.configuration.addAxis(axis, isX, redraw);
      }
    }
  }

  /** @private */
  __updateOrAddSeries(series, redraw) {
    if (!Array.isArray(series)) {
      throw new Error('The type of jsonConfiguration.series should be Object[]');
    }
    for (let i = 0; i < series.length; i++) {
      const currentSeries = series[i];
      this.__updateOrAddSeriesInstance(currentSeries, i, redraw);
    }
  }

  /** @private */
  __updateOrAddSeriesInstance(seriesOptions, position, redraw) {
    if (this.configuration.series[position]) {
      this.configuration.series[position].update(seriesOptions, redraw);
    } else {
      this.configuration.addSeries(seriesOptions, redraw);
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
          options3d: {
            ...this._baseChart3d,
            ...(this.additionalOptions && this.additionalOptions.chart && this.additionalOptions.chart.options3d),
            enabled: true
          }
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
    this.__updateNoDataElement(config);
  }

  /**
   * Force the no data text element to become visible if the chart has no data.
   * This is necessary in cases where Highcharts does not update the element
   * automatically, for example when setting the language config
   * @private
   */
  __updateNoDataElement(config) {
    const isEmpty = config.series.every((e) => e.data.length === 0);
    if (isEmpty) {
      config.hideNoData();
      config.showNoData(this.emptyText);
    }
  }

  /** @private */
  __callChartFunction(functionName, ...args) {
    if (this.configuration) {
      const functionToCall = this.configuration[functionName];
      if (functionToCall && typeof functionToCall === 'function') {
        functionToCall.apply(this.configuration, args);
      }
    }
  }

  /** @private */
  __callSeriesFunction(functionName, seriesIndex, ...args) {
    if (this.configuration && this.configuration.series[seriesIndex]) {
      const series = this.configuration.series[seriesIndex];
      const functionToCall = series[functionName];
      if (functionToCall && typeof functionToCall === 'function') {
        functionToCall.apply(series, args);
      }
    }
  }

  /** @private */
  __callAxisFunction(functionName, axisCategory, axisIndex, ...args) {
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
        default:
          break;
      }
      if (axes && axes[axisIndex]) {
        const axis = axes[axisIndex];
        const functionToCall = axis[functionName];
        if (functionToCall && typeof functionToCall === 'function') {
          functionToCall.apply(axis, args);
        }
      }
    }
  }

  /** @private */
  __callPointFunction(functionName, seriesIndex, pointIndex, ...args) {
    if (
      this.configuration &&
      this.configuration.series[seriesIndex] &&
      this.configuration.series[seriesIndex].data[pointIndex]
    ) {
      const point = this.configuration.series[seriesIndex].data[pointIndex];
      const functionToCall = point[functionName];
      if (functionToCall && typeof functionToCall === 'function') {
        functionToCall.apply(point, args);
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

customElements.define(Chart.is, Chart);

export { Chart };
