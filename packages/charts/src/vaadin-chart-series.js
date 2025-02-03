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
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ChartSeriesMixin } from './vaadin-chart-series-mixin.js';

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
 * @mixes ChartSeriesMixin
 */
class ChartSeries extends ChartSeriesMixin(PolymerElement) {
  static get is() {
    return 'vaadin-chart-series';
  }
}

defineCustomElement(ChartSeries);

export { ChartSeries };
