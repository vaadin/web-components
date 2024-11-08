/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { Chart, deepMerge } from './vaadin-chart.js';

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
 *
 * @customElement
 * @extends HTMLElement
 */
class ChartSeries extends PolymerElement {
  static get is() {
    return 'vaadin-chart-series';
  }

  static get properties() {
    return {
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
       * @type {ChartSeriesValues}
       */
      values: {
        type: Array,
        value: () => [],
      },

      /**
       * Value-axis minimum-value.
       * Sets the value to a series bound by 'unit' property.
       * Otherwise sets the value to the first series.
       * Undefined by default (determined from data).
       * @attr {number} value-min
       */
      valueMin: {
        type: Number,
        reflectToAttribute: true,
      },

      /**
       * Value-axis maximum-value.
       * See the 'valueMin'
       * @attr {number} value-max
       */
      valueMax: {
        type: Number,
        reflectToAttribute: true,
      },

      /**
       * A string with the type of the series.
       * Defaults to `'line'` in case no type is set for the chart.
       * Note that `'bar'`, `'gauge'` and `'solidgauge'` should be set as default series type on `<vaadin-chart>`.
       */
      type: {
        type: String,
        reflectToAttribute: true,
      },

      /**
       * The name of the series as shown in the legend, tooltip etc.
       * @type {string}
       */
      title: {
        type: String,
        reflectToAttribute: true,
      },

      /**
       * Shows/hides data-point markers for line-like series.
       * Acceptable input are:
       *  - `shown`: markers are always visible
       *  - `hidden`: markers are always hidden
       *  - `auto`: markers are visible for widespread data and hidden, when data is dense *(default)*
       * @type {ChartSeriesMarkers | undefined}
       */
      markers: {
        type: String,
        reflectToAttribute: true,
      },

      /**
       * Used to connect the series to an axis; if multiple series have the same `unit`, they will share axis.
       * Displayed as a title for the axis.
       * If no unit is defined, then series will be connected to the first axis.
       */
      unit: {
        type: String,
        reflectToAttribute: true,
      },

      /**
       * Used to group series in a different stacks.
       * "stacking" property should be specified either for each series or in plotOptions.
       * It is recommended to place series in a single stack, when they belong to the same yAxis.
       * @type {number | string}
       */
      stack: {
        type: String,
        reflectToAttribute: true,
      },

      /**
       * The height of the neck, the lower part of the funnel.
       * A number defines pixel width, a percentage string defines a percentage of the plot area height. Defaults to 30%.
       * Note that this property only applies for "funnel" charts.
       * @attr {number | string} neck-position
       * @type {number | string}
       */
      neckPosition: {
        type: String,
        reflectToAttribute: true,
      },

      /**
       * The width of the neck, the lower part of the funnel.
       * A number defines pixel width, a percentage string defines a percentage of the plot area width. Defaults to 30%.
       * Note that this property only applies for "funnel" charts.
       * @attr {number | string} neck-width
       * @type {number | string}
       */
      neckWidth: {
        type: String,
        reflectToAttribute: true,
      },

      /**
       * Object with the configured options defined and used to create a series.
       * @type {!ChartSeriesOptions}
       * @readonly
       */
      options: {
        type: Object,
      },

      /**
       * Represents additional JSON configuration.
       * @type {SeriesOptionsType | undefined}
       */
      additionalOptions: {
        type: Object,
        reflectToAttribute: true,
      },

      /**
       * @type {!Series | undefined}
       * @protected
       */
      _series: {
        type: Object,
      },
    };
  }

  static get observers() {
    return [
      '__additionalOptionsObserver(additionalOptions.*, _series)',
      '__markersObserver(markers, _series)',
      '__neckPositionObserver(neckPosition, _series)',
      '__neckWidthObserver(neckWidth, _series)',
      '__stackObserver(stack, _series)',
      '__titleObserver(title, _series)',
      '__typeObserver(type, _series)',
      '__unitObserver(unit, valueMin, valueMax, _series)',
      '__valueMinObserver(valueMin, _series)',
      '__valueMaxObserver(valueMax, _series)',
      '__valuesObserver(values.splices, _series)',
    ];
  }

  get options() {
    const options = deepMerge({}, this.additionalOptions);

    if (this.type) {
      options.type = this.type;
    }

    if (this.title) {
      options.name = this.title;
    }

    if (this.values) {
      options.data = this.values;
    }

    if (this.markers) {
      if (!this.__isMarkersValid()) {
        this.markers = 'auto';
      }
      options.marker = this.__markersConfiguration;
    }

    if (this.unit) {
      options.yAxis = this.unit;
    }

    if (this.stack) {
      options.stack = this.stack;
    }

    if (isFinite(this.valueMin)) {
      options.yAxisValueMin = this.valueMin;
    }

    if (isFinite(this.valueMax)) {
      options.yAxisValueMax = this.valueMax;
    }

    if (this.neckWidth) {
      options.neckWidth = this.neckWidth;
    }

    if (this.neckPosition) {
      options.neckHeight = this.neckPosition;
    }

    return options;
  }

  /** @private */
  get __markersConfiguration() {
    const config = {};
    switch (this.markers) {
      case 'shown':
        config.enabled = true;
        break;
      case 'hidden':
        config.enabled = false;
        break;
      case 'auto':
      default:
        config.enabled = null;
        break;
    }

    return config;
  }

  /**
   * Method to attach a series object of type `Highcharts.Series`.
   * @param {!Series} series Object of type `Highcharts.Series`
   */
  setSeries(series) {
    this._series = series;
  }

  /** @private */
  __valuesObserver(_splices, series) {
    if (series) {
      series.setData(this.values);
    }
  }

  /** @private */
  __additionalOptionsObserver(additionalOptions, series) {
    if (series && additionalOptions.base) {
      series.update(additionalOptions.base);
    }
  }

  /** @private */
  __updateAxis(series, value, key) {
    if (!isFinite(value)) {
      this.__showWarn(`value-${key}`, 'Numbers or null');
      return;
    }

    if (series && series.yAxis) {
      series.yAxis.update({ [key]: value });
    }
  }

  /** @private */
  __valueMinObserver(valueMin, series) {
    if (valueMin === undefined || series == null) {
      return;
    }

    this.__updateAxis(series, valueMin, 'min');
  }

  /** @private */
  __valueMaxObserver(valueMax, series) {
    if (valueMax === undefined || series == null) {
      return;
    }

    this.__updateAxis(series, valueMax, 'max');
  }

  /** @private */
  __typeObserver(type, series) {
    if (type && series) {
      series.update({ type });
    }
  }

  /** @private */
  __titleObserver(title, series) {
    if (title === undefined || series == null) {
      return;
    }
    series.update({ name: title });
  }

  /** @private */
  __stackObserver(stack, series) {
    if (stack === undefined || series == null) {
      return;
    }
    series.update({ stack });
  }

  /** @private */
  __neckPositionObserver(neckPosition, series) {
    if (neckPosition === undefined || series == null) {
      return;
    }

    series.update({ neckHeight: neckPosition });
  }

  /** @private */
  __neckWidthObserver(neckWidth, series) {
    if (neckWidth === undefined || series == null) {
      return;
    }

    series.update({ neckWidth });
  }

  /** @private */
  __unitObserver(unit, valueMin, valueMax, series) {
    if (series && unit !== this.__oldUnit) {
      this.__oldUnit = unit;

      const parent = this.parentNode instanceof Chart && this.parentNode;
      if (parent && parent instanceof Chart) {
        if (unit && !parent.__getAxis(unit)) {
          const title = { title: { text: unit } };
          parent.__addAxis({ id: unit, axisGenerated: true, ...title });
        }
        series.update({ yAxis: unit || 0 });

        if (valueMin !== undefined) {
          this.__updateAxis(series, valueMin, 'min');
        }

        if (valueMax !== undefined) {
          this.__updateAxis(series, valueMax, 'max');
        }

        parent.__removeAxisIfEmpty();
      }
    }
  }

  /** @private */
  __isMarkersValid() {
    if (['shown', 'hidden', 'auto'].indexOf(this.markers) === -1) {
      this.__showWarn('markers', '"shown", "hidden" or "auto"');
      return false;
    }
    return true;
  }

  /** @private */
  __markersObserver(markers, series) {
    if (markers === undefined || series == null) {
      return;
    }

    if (!this.__isMarkersValid()) {
      this.markers = 'auto';
      return;
    }

    series.update({
      marker: this.__markersConfiguration,
    });
  }

  /** @private */
  __showWarn(propertyName, acceptedValues) {
    console.warn(`<vaadin-chart-series> Acceptable values for "${propertyName}" are ${acceptedValues}`);
  }
}

defineCustomElement(ChartSeries);

export { ChartSeries };
