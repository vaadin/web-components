import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles(
  'vaadin-chart',
  css`
    /* Ensure exporting works with complex selectors */
    .highcharts-color-0 {
      stroke: red;
      fill: red;
    }

    :host(#chart) .highcharts-color-0 {
      stroke: blue;
      fill: blue;
    }

    :host(.my-class .dummy-class) .highcharts-color-0 {
      stroke: blue;
      fill: blue;
    }

    :host(.ColumnLineAndPie) g.highcharts-markers > .highcharts-point {
      fill: white;
    }

    :host(.GaugeWithDualAxes) .kmh .highcharts-tick,
    :host(.GaugeWithDualAxes) .kmh .highcharts-axis-line {
      stroke: #339;
      stroke-width: 2;
    }
  `,
);
