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
import './vaadin-lit-chart.js';
import { LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ChartSeriesMixin } from './vaadin-chart-series-mixin.js';

/**
 * LitElement based version of `<vaadin-chart-series>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 */
class ChartSeries extends ChartSeriesMixin(PolylitMixin(LitElement)) {
  static get is() {
    return 'vaadin-chart-series';
  }
}

defineCustomElement(ChartSeries);

export { ChartSeries };
