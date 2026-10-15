import Highcharts from 'highcharts/es-modules/masters/highstock.src.js';
import { addGlobalStyles } from '@vaadin/component-base/src/css-utils.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin';

// Highcharts' own animations. The CSS transitions the base styles declare are
// disabled by the rules below.
Highcharts.setOptions({
  chart: { animation: false },
  plotOptions: { series: { animation: false } },
  tooltip: { animation: false, hideDelay: 0 },
});

// An `outside` tooltip renders into `document.body`, so the `registerStyles`
// rules below cannot reach it. The base styles apply theirs at both scopes too.
addGlobalStyles(
  'vaadin-chart-not-animated-tooltip',
  css`
    .highcharts-tooltip-container .highcharts-tooltip,
    .highcharts-tooltip-container .highcharts-label-box {
      transition: none;
    }
  `,
);

registerStyles(
  'vaadin-chart',
  css`
    :where([styled-mode]) .highcharts-point {
      transition: none;
    }

    :where([styled-mode]) .highcharts-credits {
      transition: none;
    }

    /* Tooltip */
    :where([styled-mode]) .highcharts-tooltip {
      transition: none;
    }

    :where([styled-mode]) .highcharts-point-inactive {
      transition: none;
    }

    :where([styled-mode]) .highcharts-series-inactive {
      transition: none;
    }

    :where([styled-mode]) .highcharts-state-hover path {
      transition: none;
    }

    :where([styled-mode]) .highcharts-state-normal path {
      transition: none;
    }

    /* Legend hover affects points and series */
    :where([styled-mode]) g.highcharts-series,
    :where([styled-mode]) .highcharts-point,
    :where([styled-mode]) .highcharts-markers,
    :where([styled-mode]) .highcharts-data-labels {
      transition: none;
    }

    :where([styled-mode]) .highcharts-column-series .highcharts-point {
      transition: none;
    }

    :where([styled-mode]) .highcharts-column-series .highcharts-point-hover {
      transition: none;
    }

    :where([styled-mode]) .highcharts-pie-series .highcharts-point-hover {
      transition: none;
    }

    :where([styled-mode]) .highcharts-funnel-series .highcharts-point-hover {
      transition: none;
    }

    :where([styled-mode]) .highcharts-pyramid-series .highcharts-point-hover {
      transition: none;
    }

    :where([styled-mode]) .highcharts-treemap-series .highcharts-point {
      transition: none;
    }

    :where([styled-mode]) .highcharts-treemap-series .highcharts-point-hover {
      transition: none;
    }

    :where([styled-mode]) .highcharts-legend-item-hidden * {
      transition: none;
    }

    /* Loading */
    :where([styled-mode]) .highcharts-loading {
      transition: none;
    }

    :where([styled-mode]) .highcharts-loading-hidden {
      transition: none;
    }

    :where([styled-mode]) .highcharts-sankey-series .highcharts-link {
      transition: none;
    }

    :where([styled-mode]) .highcharts-sankey-series .highcharts-point-hover.highcharts-link {
      transition: none;
    }

    :where([styled-mode]) .highcharts-venn-series .highcharts-point {
      transition: none;
    }

    :where([styled-mode]) .highcharts-button {
      transition: none;
    }

    :where([styled-mode]) .highcharts-button-hover {
      transition: none;
    }

    :where([styled-mode]) .highcharts-range-input:hover rect {
      transition: none;
    }

    :where([styled-mode]) .highcharts-flags-series .highcharts-point .highcharts-label-box {
      transition: none;
    }

    :where([styled-mode]) .highcharts-menu-item {
      transition: none;
    }
  `,
);
