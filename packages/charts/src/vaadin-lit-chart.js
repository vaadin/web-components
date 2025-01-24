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
import 'highcharts/es-modules/masters/highstock.src.js';
import 'highcharts/es-modules/masters/modules/accessibility.src.js';
import 'highcharts/es-modules/masters/modules/annotations.src.js';
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
import 'highcharts/es-modules/masters/modules/gantt.src.js';
import 'highcharts/es-modules/masters/modules/draggable-points.src.js';
import './vaadin-lit-chart-series.js';
import { css, html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ChartMixin } from './vaadin-chart-mixin.js';

/**
 * LitElement based version of `<vaadin-chart>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 */
class Chart extends ChartMixin(ThemableMixin(ElementMixin(PolylitMixin(LitElement)))) {
  static get styles() {
    return css`
      :host {
        display: block;
        width: 100%;
        overflow: hidden;
      }

      :host([hidden]) {
        display: none !important;
      }
    `;
  }

  /** @protected */
  render() {
    return html`
      <div id="chart"></div>
      <slot id="slot"></slot>
    `;
  }

  static get is() {
    return 'vaadin-chart';
  }

  static get cvdlName() {
    return 'vaadin-chart';
  }
}

defineCustomElement(Chart);

export { Chart };
