import { css, registerStyles } from '@vaadin/vaadin-themable-mixin';

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
