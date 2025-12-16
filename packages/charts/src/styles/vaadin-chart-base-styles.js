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

/**
 * @license Highcharts
 *
 * (c) 2009-2016 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
import '@vaadin/component-base/src/styles/style-props.js';
import '@vaadin/component-base/src/styles/user-colors.js';
import { css, unsafeCSS } from 'lit';
import { addGlobalStyles } from '@vaadin/component-base/src/styles/add-global-styles.js';

/* Tooltip styles, to support `"tooltip": { "outside": true }` config option */
// postcss-lit-disable-next-line
const tooltipStyles = (scope) => css`
  ${unsafeCSS(scope)} .highcharts-tooltip {
    cursor: default;
    pointer-events: none;
    white-space: nowrap;
    transition: stroke 150ms;
    filter: drop-shadow(var(--vaadin-charts-tooltip-shadow, 0 4px 8px rgba(0, 0, 0, 0.2))) !important;
  }

  ${unsafeCSS(scope)} .highcharts-tooltip text,
  ${unsafeCSS(scope)} .highcharts-tooltip foreignObject span {
    fill: var(--highcharts-neutral-color-80, var(--vaadin-charts-data-label, var(--vaadin-text-color)));
  }

  ${unsafeCSS(scope)} .highcharts-tooltip .highcharts-tracker {
    fill: none;
    stroke: none;
  }

  ${unsafeCSS(scope)} .highcharts-tooltip .highcharts-header {
    font-size: 0.85em;
    color: var(--highcharts-neutral-color-60, var(--vaadin-text-color-secondary));
  }

  ${unsafeCSS(scope)} .highcharts-tooltip-box {
    stroke-width: 0;
    fill: var(--highcharts-background-color, var(--vaadin-charts-tooltip-background, var(--vaadin-background-color)));
  }

  ${unsafeCSS(scope)} .highcharts-tooltip-box .highcharts-label-box {
    fill: var(--highcharts-background-color, var(--vaadin-charts-tooltip-background, var(--vaadin-background-color)));
  }

  ${unsafeCSS(scope)} div.highcharts-tooltip {
    filter: none;
    font-size: 0.8em;
  }
`;

addGlobalStyles(
  'vaadin-charts-tooltip',
  css`
    .highcharts-tooltip-container .highcharts-root {
      overflow: visible;
      font-size: var(--vaadin-charts-font-size, 0.75rem);
      line-height: normal;
    }
  `,
  tooltipStyles('.highcharts-tooltip-container'),
);

export const chartStyles = css`
  :host {
    display: block;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  :host,
  :root {
    font-size: var(--vaadin-charts-font-size, 0.75rem);
    line-height: normal;

    /* Needs to be a color, not a background image */
    --_bg: var(--vaadin-charts-background, var(--vaadin-background-color));

    --_color-0: var(--highcharts-color-0, var(--vaadin-charts-color-0, var(--vaadin-user-color-0)));
    --_color-1: var(--highcharts-color-1, var(--vaadin-charts-color-1, var(--vaadin-user-color-1)));
    --_color-2: var(--highcharts-color-2, var(--vaadin-charts-color-2, var(--vaadin-user-color-2)));
    --_color-3: var(--highcharts-color-3, var(--vaadin-charts-color-3, var(--vaadin-user-color-3)));
    --_color-4: var(--highcharts-color-4, var(--vaadin-charts-color-4, var(--vaadin-user-color-4)));
    --_color-5: var(--highcharts-color-5, var(--vaadin-charts-color-5, var(--vaadin-user-color-5)));
    --_color-6: var(--highcharts-color-6, var(--vaadin-charts-color-6, var(--vaadin-user-color-6)));
    --_color-7: var(--highcharts-color-7, var(--vaadin-charts-color-7, var(--vaadin-user-color-7)));
    --_color-8: var(--highcharts-color-8, var(--vaadin-charts-color-8, var(--vaadin-user-color-8)));
    --_color-9: var(--highcharts-color-9, var(--vaadin-charts-color-9, var(--vaadin-user-color-9)));

    --_color-0-label: oklch(from var(--_color-0) clamp(0, (0.62 - l) * 1000, 1) 0 0);
    --_color-1-label: oklch(from var(--_color-1) clamp(0, (0.62 - l) * 1000, 1) 0 0);
    --_color-2-label: oklch(from var(--_color-2) clamp(0, (0.62 - l) * 1000, 1) 0 0);
    --_color-3-label: oklch(from var(--_color-3) clamp(0, (0.62 - l) * 1000, 1) 0 0);
    --_color-4-label: oklch(from var(--_color-4) clamp(0, (0.62 - l) * 1000, 1) 0 0);
    --_color-5-label: oklch(from var(--_color-5) clamp(0, (0.62 - l) * 1000, 1) 0 0);
    --_color-6-label: oklch(from var(--_color-6) clamp(0, (0.62 - l) * 1000, 1) 0 0);
    --_color-7-label: oklch(from var(--_color-7) clamp(0, (0.62 - l) * 1000, 1) 0 0);
    --_color-8-label: oklch(from var(--_color-8) clamp(0, (0.62 - l) * 1000, 1) 0 0);
    --_color-9-label: oklch(from var(--_color-9) clamp(0, (0.62 - l) * 1000, 1) 0 0);

    --_color-positive: light-dark(#19b156, #1ccc62);
    --_color-negative: light-dark(#dc0611, #f7353f);

    --_label: var(--vaadin-charts-label, var(--vaadin-text-color));
    --_secondary-label: var(--vaadin-charts-secondary-label, var(--vaadin-text-color-secondary));
    --_disabled-label: var(--vaadin-charts-disabled-label, var(--vaadin-text-color-disabled));
    --_point-border: var(--vaadin-charts-point-border, var(--_bg));
    --_axis-line: var(--vaadin-charts-axis-line, var(--vaadin-border-color-secondary));
    --_axis-title: var(--vaadin-charts-axis-title, var(--_secondary-label));
    --_axis-label: var(--vaadin-charts-axis-label, var(--_secondary-label));
    --_grid-line: var(--vaadin-charts-grid-line, var(--vaadin-border-color-secondary));
    --_minor-grid-line: var(
      --vaadin-charts-minor-grid-line,
      color-mix(in srgb, var(--vaadin-border-color-secondary) 60%, transparent)
    );
    --_data-label: var(--vaadin-charts-data-label, var(--_label));
  }

  /* Safari 17 doesn't support relative colors from light-dark() */
  @supports not (color: oklch(from light-dark(red, red) l c h)) {
    :host {
      /* Safari 17 wants degrees instead of raw numbers */
      --_hue-scale: 180deg;
    }
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
    z-index: 0; /* highcharts/highcharts#1072 */
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    user-select: none;
    touch-action: manipulation;
    outline: none;
  }

  :where([styled-mode]) .highcharts-no-touch-action {
    touch-action: none;
  }

  :where([styled-mode]) .highcharts-root {
    display: block;
  }

  :where([styled-mode]) .highcharts-root text {
    stroke-width: 0;
  }

  :where([styled-mode]) .highcharts-strong {
    font-weight: bold;
  }

  :where([styled-mode]) .highcharts-emphasized {
    font-style: italic;
  }

  :where([styled-mode]) .highcharts-anchor {
    cursor: pointer;
  }

  :where([styled-mode]) .highcharts-background {
    fill: var(--highcharts-background-color, var(--_bg));
  }

  :where([styled-mode]) .highcharts-plot-border,
  :where([styled-mode]) .highcharts-plot-background {
    fill: none;
  }

  :where([styled-mode]) .highcharts-label-box {
    fill: none;
  }

  :where([styled-mode]) .highcharts-label text {
    fill: var(--highcharts-neutral-color-80, var(--_data-label));
  }

  :where([styled-mode]) .highcharts-button-box {
    fill: inherit;
    rx: var(--vaadin-charts-button-border-radius, var(--vaadin-radius-m));
    ry: var(--vaadin-charts-button-border-radius, var(--vaadin-radius-m));
  }

  :where([styled-mode]) .highcharts-tracker-line {
    stroke-linejoin: round;
    stroke: rgba(192, 192, 192, 0.0001);
    stroke-width: 22;
    fill: none;
  }

  :where([styled-mode]) .highcharts-tracker-area {
    fill: rgba(192, 192, 192, 0.0001);
    stroke-width: 0;
  }

  /* Titles */
  :where([styled-mode]) .highcharts-title {
    fill: var(--highcharts-neutral-color-80, var(--vaadin-charts-title-label, var(--_label)));
    font-size: 1.6em;
    font-weight: bold;
  }

  :where([styled-mode]) .highcharts-subtitle {
    fill: var(--highcharts-neutral-color-60, var(--_secondary-label));
    font-size: 1em;
  }

  /* Axes */
  :where([styled-mode]) .highcharts-axis-line {
    fill: none;
    stroke: var(--highcharts-neutral-color-80, var(--_axis-line));
  }

  :where([styled-mode]) .highcharts-yaxis .highcharts-axis-line {
    stroke-width: 0;
  }

  :where([styled-mode]) .highcharts-axis-title {
    fill: var(--highcharts-neutral-color-60, var(--_axis-title));
    font-size: 1em;
  }

  :where([styled-mode]) .highcharts-axis-labels {
    fill: var(--highcharts-neutral-color-80, var(--_axis-label));
    cursor: default;
  }

  :where([styled-mode]) .highcharts-grid-line {
    fill: none;
    stroke: var(--highcharts-neutral-color-10, var(--_grid-line));
  }

  :where([styled-mode]) .highcharts-xaxis-grid .highcharts-grid-line {
    stroke-width: var(--vaadin-charts-xaxis-line-width, 0);
  }

  :where([styled-mode]) .highcharts-tick {
    stroke: var(--highcharts-neutral-color-80, var(--_grid-line));
  }

  :where([styled-mode]) .highcharts-yaxis .highcharts-tick {
    stroke-width: 0;
  }

  :where([styled-mode]) .highcharts-minor-grid-line {
    stroke: var(--highcharts-neutral-color-5, var(--_minor-grid-line));
  }

  :where([styled-mode]) .highcharts-crosshair-thin {
    stroke-width: 1px;
    stroke: var(--highcharts-neutral-color-20, var(--_grid-line));
  }

  :where([styled-mode]) .highcharts-crosshair-category {
    stroke: var(--highcharts-highlight-color-20, var(--_color-0));
    stroke-opacity: 0.25;
  }

  /* Credits */
  :where([styled-mode]) .highcharts-credits {
    cursor: pointer;
    fill: var(--highcharts-neutral-color-40, var(--_disabled-label));
    font-size: 0.7em;
    transition:
      fill 250ms,
      font-size 250ms;
  }

  :where([styled-mode]) .highcharts-credits:hover {
    fill: var(--highcharts-neutral-color-100, black);
    font-size: 0.8em;
  }

  /* Tooltip */
  ${unsafeCSS(tooltipStyles(':where([styled-mode])'))};

  :where([styled-mode]) .highcharts-selection-marker {
    fill: var(--highcharts-highlight-color-80, var(--_color-0));
    fill-opacity: 0.25;
  }

  :where([styled-mode]) .highcharts-graph {
    fill: none;
    stroke-width: var(--vaadin-chart-graph-stroke-width, 2);
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  :where([styled-mode]) .highcharts-empty-series {
    stroke-width: 1px;
    fill: none;
    stroke: var(--highcharts-neutral-color-20, var(--_color-0));
  }

  :where([styled-mode]) .highcharts-state-hover .highcharts-graph {
    stroke-width: calc(var(--vaadin-chart-graph-stroke-width, 2) + 1);
  }

  :where([styled-mode]) .highcharts-point-inactive {
    opacity: 0.2;
    transition: opacity 50ms; /* quick in */
  }

  :where([styled-mode]) .highcharts-series-inactive {
    opacity: 0.2;
    transition: opacity 50ms; /* quick in */
  }

  :where([styled-mode]) .highcharts-state-hover path {
    transition: stroke-width 50ms; /* quick in */
  }

  :where([styled-mode]) .highcharts-state-normal path {
    transition: stroke-width 250ms; /* slow out */
  }

  /* Legend hover affects points and series */
  :where([styled-mode]) g.highcharts-series,
  :where([styled-mode]) .highcharts-point,
  :where([styled-mode]) .highcharts-markers,
  :where([styled-mode]) .highcharts-data-labels {
    transition: opacity 250ms;
  }

  :where([styled-mode]) .highcharts-legend-series-active g.highcharts-series:not(.highcharts-series-hover),
  :where([styled-mode])
    .highcharts-legend-point-active
    .highcharts-point:not(.highcharts-point-hover, .highcharts-point-select),
  :where([styled-mode]) .highcharts-legend-series-active .highcharts-markers:not(.highcharts-series-hover),
  :where([styled-mode]) .highcharts-legend-series-active .highcharts-data-labels:not(.highcharts-series-hover) {
    opacity: 0.2;
  }

  /* Series options */

  /* Default colors */
  :where([styled-mode]) .highcharts-color-0 {
    fill: var(--_color-0);
    stroke: var(--_color-0);
  }

  :where([styled-mode]) .highcharts-color-1 {
    fill: var(--_color-1);
    stroke: var(--_color-1);
  }

  :where([styled-mode]) .highcharts-color-2 {
    fill: var(--_color-2);
    stroke: var(--_color-2);
  }

  :where([styled-mode]) .highcharts-color-3 {
    fill: var(--_color-3);
    stroke: var(--_color-3);
  }

  :where([styled-mode]) .highcharts-color-4 {
    fill: var(--_color-4);
    stroke: var(--_color-4);
  }

  :where([styled-mode]) .highcharts-color-5 {
    fill: var(--_color-5);
    stroke: var(--_color-5);
  }

  :where([styled-mode]) .highcharts-color-6 {
    fill: var(--_color-6);
    stroke: var(--_color-6);
  }

  :where([styled-mode]) .highcharts-color-7 {
    fill: var(--_color-7);
    color: var(--_color-7-label);
  }

  :where([styled-mode]) .highcharts-color-8 {
    fill: var(--_color-8);
    stroke: var(--_color-8);
  }

  :where([styled-mode]) .highcharts-color-9 {
    fill: var(--_color-9);
    stroke: var(--_color-9);
  }

  :where([styled-mode])
    :where(.highcharts-treemap-series, .highcharts-organization-series, .highcharts-gantt-series)
    .highcharts-data-label-color-0 {
    color: var(--_color-0-label);
  }

  :where([styled-mode])
    :where(.highcharts-treemap-series, .highcharts-organization-series, .highcharts-gantt-series)
    .highcharts-data-label-color-1 {
    color: var(--_color-1-label);
  }

  :where([styled-mode])
    :where(.highcharts-treemap-series, .highcharts-organization-series, .highcharts-gantt-series)
    .highcharts-data-label-color-2 {
    color: var(--_color-2-label);
  }

  :where([styled-mode])
    :where(.highcharts-treemap-series, .highcharts-organization-series, .highcharts-gantt-series)
    .highcharts-data-label-color-3 {
    color: var(--_color-3-label);
  }

  :where([styled-mode])
    :where(.highcharts-treemap-series, .highcharts-organization-series, .highcharts-gantt-series)
    .highcharts-data-label-color-4 {
    color: var(--_color-4-label);
  }

  :where([styled-mode])
    :where(.highcharts-treemap-series, .highcharts-organization-series, .highcharts-gantt-series)
    .highcharts-data-label-color-5 {
    color: var(--_color-5-label);
  }

  :where([styled-mode])
    :where(.highcharts-treemap-series, .highcharts-organization-series, .highcharts-gantt-series)
    .highcharts-data-label-color-6 {
    color: var(--_color-6-label);
  }

  :where([styled-mode])
    :where(.highcharts-treemap-series, .highcharts-organization-series, .highcharts-gantt-series)
    .highcharts-data-label-color-7 {
    color: var(--_color-7-label);
  }

  :where([styled-mode])
    :where(.highcharts-treemap-series, .highcharts-organization-series, .highcharts-gantt-series)
    .highcharts-data-label-color-8 {
    color: var(--_color-8-label);
  }

  :where([styled-mode])
    :where(.highcharts-treemap-series, .highcharts-organization-series, .highcharts-gantt-series)
    .highcharts-data-label-color-9 {
    color: var(--_color-9-label);
  }

  :where([styled-mode]) [class*='highcharts-data-label-color-'] {
    fill: currentColor;
  }

  /* Various series-specific */
  :where([styled-mode]) .highcharts-area {
    fill-opacity: 0.75;
    stroke-width: 0;
  }

  :where([styled-mode]) .highcharts-markers {
    stroke-width: 1px;
    stroke: var(--highcharts-background-color, var(--_bg));
  }

  :where([styled-mode])
    .highcharts-a11y-markers-hidden
    .highcharts-point:not(.highcharts-point-hover, .highcharts-a11y-marker-visible),
  :where([styled-mode]) .highcharts-a11y-marker-hidden {
    opacity: 0;
  }

  :where([styled-mode]) .highcharts-point {
    stroke-width: 1px;
  }

  :where([styled-mode]) .highcharts-dense-data .highcharts-point {
    stroke-width: 0;
  }

  :where([styled-mode]) .highcharts-data-label text,
  :where([styled-mode]) .highcharts-data-label span,
  :where([styled-mode]) text.highcharts-data-label {
    font-size: 0.9em;
  }

  :where([styled-mode]) .highcharts-data-label-box {
    fill: none;
    stroke-width: 0;
  }

  :where([styled-mode]) .highcharts-data-label text,
  :where([styled-mode]) text.highcharts-data-label {
    fill: var(--highcharts-neutral-color-80, var(--_data-label));
  }

  :where([styled-mode]) .highcharts-data-label-connector {
    fill: none;
  }

  :where([styled-mode]) .highcharts-data-label-hidden {
    pointer-events: none;
  }

  :where([styled-mode]) .highcharts-halo {
    fill-opacity: 0.25;
    stroke-width: 0;
  }

  :where([styled-mode]) .highcharts-series-label text {
    fill: inherit;
    font-weight: bold;
  }

  :where([styled-mode]) .highcharts-series:not(.highcharts-pie-series) .highcharts-point-select,
  :where([styled-mode]) .highcharts-markers .highcharts-point-select {
    fill: var(--highcharts-neutral-color-20, var(--_grid-line));
    stroke: var(--highcharts-neutral-color-100, var(--vaadin-charts-contrast, var(--_label)));
  }

  :where([styled-mode]) .highcharts-column-series path.highcharts-point,
  :where([styled-mode]) .highcharts-bar-series path.highcharts-point {
    /* path to prevent stroke on 3D columns and bars */
    stroke: var(--highcharts-background-color, var(--_point-border));
  }

  :where([styled-mode]) .highcharts-column-series .highcharts-point,
  :where([styled-mode]) .highcharts-bar-series .highcharts-point {
    transition: fill-opacity 250ms;
  }

  :where([styled-mode]) .highcharts-column-series .highcharts-point-hover,
  :where([styled-mode]) .highcharts-bar-series .highcharts-point-hover {
    fill-opacity: 0.75;
    transition: fill-opacity 50ms;
  }

  :where([styled-mode]) .highcharts-pie-series .highcharts-point {
    stroke-linejoin: round;
    stroke: var(--highcharts-background-color, var(--_point-border));
  }

  :where([styled-mode]) .highcharts-pie-series .highcharts-point-hover {
    fill-opacity: 0.75;
    transition: fill-opacity 50ms;
  }

  :where([styled-mode]) .highcharts-funnel-series .highcharts-point {
    stroke-linejoin: round;
    stroke: var(--highcharts-background-color, var(--_point-border));
  }

  :where([styled-mode]) .highcharts-funnel-series .highcharts-point-hover {
    fill-opacity: 0.75;
    transition: fill-opacity 50ms;
  }

  :where([styled-mode]) .highcharts-funnel-series .highcharts-point-select {
    fill: inherit;
    stroke: inherit;
  }

  :where([styled-mode]) .highcharts-pyramid-series .highcharts-point {
    stroke-linejoin: round;
    stroke: var(--highcharts-background-color, var(--_point-border));
  }

  :where([styled-mode]) .highcharts-pyramid-series .highcharts-point-hover {
    fill-opacity: 0.75;
    transition: fill-opacity 50ms;
  }

  :where([styled-mode]) .highcharts-pyramid-series .highcharts-point-select {
    fill: inherit;
    stroke: inherit;
  }

  :where([styled-mode]) .highcharts-solidgauge-series .highcharts-point {
    stroke-width: 0;
  }

  :where([styled-mode]) .highcharts-treemap-series .highcharts-point {
    stroke-width: 1px;
    stroke: var(--highcharts-background-color, var(--_point-border));
    transition:
      stroke 250ms,
      fill 250ms,
      fill-opacity 250ms;
  }

  :where([styled-mode]) .highcharts-treemap-series .highcharts-point-hover {
    stroke: var(--highcharts-neutral-color-40, var(--_point-border));
    transition:
      stroke 25ms,
      fill 25ms,
      fill-opacity 25ms;
  }

  :where([styled-mode]) .highcharts-treemap-series .highcharts-above-level {
    display: none;
  }

  :where([styled-mode]) .highcharts-treemap-series .highcharts-internal-node {
    fill: none;
  }

  :where([styled-mode]) .highcharts-treemap-series .highcharts-internal-node-interactive {
    fill-opacity: 0.15;
    cursor: pointer;
  }

  :where([styled-mode]) .highcharts-treemap-series .highcharts-internal-node-interactive:hover {
    fill-opacity: 0.75;
  }

  :where([styled-mode]) .highcharts-vector-series .highcharts-point {
    fill: none;
    stroke-width: 2px;
  }

  :where([styled-mode]) .highcharts-windbarb-series .highcharts-point {
    fill: none;
    stroke-width: 2px;
  }

  :where([styled-mode]) .highcharts-lollipop-stem {
    stroke: var(--highcharts-neutral-color-100, var(--vaadin-charts-contrast, var(--_label)));
  }

  :where([styled-mode]) .highcharts-focus-border {
    fill: none;
    stroke-width: 2px;
  }

  :where([styled-mode]) .highcharts-legend-item-hidden .highcharts-focus-border {
    fill: none !important;
  }

  /* Legend */
  :where([styled-mode]) .highcharts-legend-box {
    fill: none;
    stroke-width: 0;
  }

  :where([styled-mode]) .highcharts-legend-item > text,
  :where([styled-mode]) .highcharts-legend-item span {
    fill: var(--highcharts-neutral-color-80, var(--_data-label));
    font-size: 1em;
    cursor: pointer;
    stroke-width: 0;
  }

  :where([styled-mode]) .highcharts-legend-item:hover text {
    fill: var(--highcharts-neutral-color-100, var(--vaadin-charts-title-label, var(--_label)));
  }

  :where([styled-mode]) .highcharts-legend-item-hidden * {
    fill: var(--highcharts-neutral-color-60, var(--_disabled-label)) !important;
    stroke: var(--highcharts-neutral-color-60, var(--_disabled-label)) !important;
    transition: fill 250ms;
    text-decoration: line-through;
  }

  :where([styled-mode]) .highcharts-legend-nav-active {
    fill: var(--highcharts-highlight-color-100, var(--vaadin-charts-button-label, var(--_label)));
    cursor: pointer;
  }

  :where([styled-mode]) .highcharts-legend-nav-inactive {
    fill: var(--highcharts-neutral-color-20, var(--_disabled-label));
  }

  :where([styled-mode]) circle.highcharts-legend-nav-active,
  :where([styled-mode]) circle.highcharts-legend-nav-inactive {
    /* tracker */
    fill: rgba(192, 192, 192, 0.0001);
  }

  :where([styled-mode]) .highcharts-legend-title-box {
    fill: none;
    stroke-width: 0;
  }

  /* Bubble legend */
  :where([styled-mode]) .highcharts-bubble-legend-symbol {
    stroke-width: 2;
    fill-opacity: 0.5;
  }

  :where([styled-mode]) .highcharts-bubble-legend-connectors {
    stroke-width: 1;
  }

  :where([styled-mode]) .highcharts-bubble-legend-labels {
    fill: var(--highcharts-neutral-color-80, var(--_data-label));
    font-size: 0.95em;
  }

  /* Loading */
  :where([styled-mode]) .highcharts-loading {
    position: absolute;
    background-color: var(--highcharts-background-color, var(--_bg));
    opacity: 0.5;
    text-align: center;
    z-index: 10;
    transition: opacity 250ms;
  }

  :where([styled-mode]) .highcharts-loading-hidden {
    height: 0 !important;
    opacity: 0;
    overflow: hidden;
    transition:
      opacity 250ms,
      height 250ms step-end;
  }

  :where([styled-mode]) .highcharts-loading-inner {
    font-weight: bold;
    position: relative;
    top: 45%;
  }

  /* Plot bands and polar pane backgrounds */
  :where([styled-mode]) .highcharts-plot-band,
  :where([styled-mode]) .highcharts-pane {
    fill: var(--highcharts-neutral-color-100, var(--vaadin-charts-contrast, var(--_label)));
    fill-opacity: 0.05;
  }

  :where([styled-mode]) .highcharts-plot-line {
    fill: none;
    stroke: var(
      --highcharts-neutral-color-40,
      color-mix(in srgb, var(--vaadin-charts-contrast, var(--_label)) 60%, transparent)
    );
    stroke-width: 1px;
  }

  :where([styled-mode]) .highcharts-plot-line-label {
    font-size: 1em;
  }

  /* Highcharts More and modules */
  :where([styled-mode]) .highcharts-boxplot-box {
    fill: var(--highcharts-background-color, var(--_bg));
  }

  :where([styled-mode]) .highcharts-boxplot-median {
    stroke-width: 2px;
  }

  :where([styled-mode]) .highcharts-bubble-series .highcharts-point {
    fill-opacity: 0.5;
  }

  :where([styled-mode]) .highcharts-errorbar-series .highcharts-point {
    stroke: var(--highcharts-neutral-color-100, var(--vaadin-charts-contrast, var(--_label)));
  }

  :where([styled-mode]) .highcharts-gauge-series .highcharts-data-label-box {
    stroke: var(--highcharts-neutral-color-20, var(--_grid-line));
    stroke-width: 1px;
  }

  :where([styled-mode]) .highcharts-gauge-series .highcharts-dial {
    fill: var(--highcharts-neutral-color-100, var(--vaadin-charts-contrast, var(--_label)));
    stroke-width: 0;
  }

  :where([styled-mode]) .highcharts-organization-series .highcharts-null-point {
    fill: transparent;
  }

  :where([styled-mode]) .highcharts-polygon-series .highcharts-graph {
    fill: inherit;
    stroke-width: 0;
  }

  :where([styled-mode]) .highcharts-waterfall-series .highcharts-graph {
    stroke: var(
      --highcharts-neutral-color-80,
      color-mix(in srgb, var(--vaadin-charts-contrast, var(--_label)) 60%, transparent)
    );
    stroke-dasharray: 1, 3;
  }

  :where([styled-mode]) .highcharts-sankey-series .highcharts-point {
    stroke-width: 0;
  }

  :where([styled-mode]) .highcharts-sankey-series .highcharts-link {
    transition:
      fill 250ms,
      fill-opacity 250ms;
    fill-opacity: 0.5;
  }

  :where([styled-mode]) .highcharts-sankey-series .highcharts-point-hover.highcharts-link {
    transition:
      fill 50ms,
      fill-opacity 50ms;
    fill-opacity: 1;
  }

  :where([styled-mode]) .highcharts-venn-series .highcharts-point {
    fill-opacity: 0.75;
    stroke: var(--highcharts-neutral-color-20, var(--_point-border));
    transition:
      stroke 250ms,
      fill-opacity 250ms;
  }

  :where([styled-mode]) .highcharts-venn-series .highcharts-point-hover {
    fill-opacity: 1;
    stroke: var(--highcharts-neutral-color-20, var(--_point-border));
  }

  :where([styled-mode]) .highcharts-timeline-series .highcharts-graph {
    stroke: var(--highcharts-neutral-color-20, var(--_point-border));
  }

  /* Highstock */
  :where([styled-mode]) .highcharts-navigator-mask-outside {
    fill-opacity: 0;
  }

  :where([styled-mode]) .highcharts-navigator-mask-inside {
    fill: var(--highcharts-highlight-color-60, var(--_color-0)); /* navigator.maskFill option */
    fill-opacity: 0.25;
    cursor: ew-resize;
  }

  :where([styled-mode]) .highcharts-navigator-outline {
    stroke: var(--highcharts-neutral-color-40, var(--_grid-line));
    fill: none;
  }

  :where([styled-mode]) .highcharts-navigator-handle {
    stroke: var(--highcharts-neutral-color-40, var(--_grid-line));
    fill: var(--highcharts-neutral-color-5, var(--_bg));
    cursor: ew-resize;
  }

  :where([styled-mode]) .highcharts-navigator-series {
    fill: var(--highcharts-highlight-color-80, var(--_color-1));
    stroke: var(--highcharts-highlight-color-80, var(--_color-1));
  }

  :where([styled-mode]) .highcharts-navigator-series .highcharts-graph {
    stroke-width: 1px;
  }

  :where([styled-mode]) .highcharts-navigator-series .highcharts-area {
    fill-opacity: 0.05;
  }

  :where([styled-mode]) .highcharts-navigator-xaxis .highcharts-axis-line {
    stroke-width: 0;
  }

  :where([styled-mode]) .highcharts-navigator-xaxis .highcharts-grid-line {
    stroke-width: 1px;
    stroke: var(--highcharts-neutral-color-10, var(--_grid-line));
  }

  :where([styled-mode]) .highcharts-navigator-xaxis.highcharts-axis-labels {
    fill: var(--highcharts-neutral-color-100, var(--_secondary-label));
    font-size: 0.95em;
    opacity: 0.6;
  }

  :where([styled-mode]) .highcharts-navigator-yaxis .highcharts-grid-line {
    stroke-width: 0;
  }

  :where([styled-mode]) .highcharts-scrollbar-thumb {
    fill: var(
      --highcharts-neutral-color-20,
      color-mix(in srgb, var(--vaadin-charts-contrast, var(--_label)) 20%, transparent)
    );
  }

  :where([styled-mode]) .highcharts-scrollbar-button {
    fill: var(--highcharts-neutral-color-10, var(--_bg));
    stroke: var(--highcharts-neutral-color-20);
    stroke-width: 1px;
  }

  :where([styled-mode]) .highcharts-scrollbar-arrow {
    fill: var(--highcharts-neutral-color-60, var(--_data-label));
  }

  :where([styled-mode]) .highcharts-scrollbar-rifles {
    stroke: none;
    stroke-width: 1px;
  }

  :where([styled-mode]) .highcharts-scrollbar-track {
    fill: color-mix(in srgb, var(--vaadin-charts-contrast, var(--_label)) 5%, transparent);
    stroke: var(--highcharts-neutral-color-20);
    stroke-width: 1px;
  }

  :where([styled-mode]) .highcharts-button {
    fill: var(--highcharts-neutral-color-3, var(--vaadin-charts-button-background, var(--vaadin-background-container)));
    stroke: var(--highcharts-neutral-color-20);
    cursor: default;
    stroke-width: 1px;
    transition: fill 250ms;
  }

  :where([styled-mode]) .highcharts-button text {
    fill: var(--highcharts-neutral-color-80, var(--vaadin-charts-button-label, var(--_label)));
    font-size: 1em;
  }

  :where([styled-mode]) .highcharts-button-hover {
    transition: fill 0ms;
    fill: var(
      --highcharts-neutral-color-10,
      var(--vaadin-charts-button-hover-background, var(--vaadin-background-container))
    );
    stroke: var(--highcharts-neutral-color-20);
  }

  :where([styled-mode]) .highcharts-button-hover text {
    fill: var(--highcharts-neutral-color-80, var(--vaadin-charts-button-label, var(--_label)));
  }

  :where([styled-mode]) .highcharts-button-pressed {
    font-weight: bold;
    fill: var(--highcharts-highlight-color-10, var(--vaadin-charts-button-active-background, var(--_label)));
    stroke: var(--highcharts-neutral-color-20);
  }

  :where([styled-mode]) .highcharts-button-pressed text {
    fill: var(--highcharts-neutral-color-80, var(--vaadin-charts-button-active-label, var(--_bg)));
    font-weight: bold;
  }

  :where([styled-mode]) .highcharts-button-disabled text {
    fill: var(
      --highcharts-neutral-color-80,
      var(--vaadin-charts-button-disabled-label, var(--vaadin-text-color-disabled))
    );
  }

  :where([styled-mode]) .highcharts-range-selector-buttons .highcharts-button {
    stroke-width: 0;
  }

  :where([styled-mode]) .highcharts-range-label rect {
    fill: none;
  }

  :where([styled-mode]) .highcharts-range-label text {
    fill: var(--highcharts-neutral-color-60, var(--_secondary-label));
  }

  :where([styled-mode]) .highcharts-range-input rect {
    fill: var(--vaadin-charts-range-input-background, var(--vaadin-background-container));
    rx: var(--vaadin-charts-button-border-radius, var(--vaadin-radius-m));
    ry: var(--vaadin-charts-button-border-radius, var(--vaadin-radius-m));
    transition: fill 250ms;
  }

  :where([styled-mode]) .highcharts-range-input:hover rect {
    fill: var(--vaadin-charts-range-input-background-hover, var(--vaadin-background-container));
  }

  :where([styled-mode]) .highcharts-range-input text {
    fill: var(--highcharts-neutral-color-80, var(--_data-label));
    font-size: 1em;
  }

  :where([styled-mode]) .highcharts-range-input {
    stroke-width: 1px;
    stroke: var(--highcharts-neutral-color-20);
  }

  :where([styled-mode]) input.highcharts-range-selector {
    position: absolute;
    border: 0;
    padding: 0;
    text-align: center;
    top: -9999em;
  }

  :where([styled-mode]) .highcharts-crosshair-label text {
    fill: var(--highcharts-background-color, var(--_bg));
    font-size: 0.9em;
  }

  :where([styled-mode]) .highcharts-crosshair-label .highcharts-label-box {
    fill: inherit;
  }

  :where([styled-mode]) .highcharts-candlestick-series .highcharts-point {
    stroke: var(--highcharts-neutral-color-100, var(--vaadin-charts-candlestick-line, var(--vaadin-border-color)));
    stroke-width: 1px;
  }

  :where([styled-mode]) .highcharts-candlestick-series .highcharts-point-up {
    fill: var(--highcharts-background-color, var(--_color-positive));
  }

  :where([styled-mode]) .highcharts-renko-series .highcharts-point-down,
  :where([styled-mode]) .highcharts-hollowcandlestick-series .highcharts-point-down {
    fill: var(--highcharts-negative-color, var(--_color-negative));
    stroke: var(--highcharts-negative-color, var(--_color-negative));
  }

  :where([styled-mode]) .highcharts-renko-series .highcharts-point-up,
  :where([styled-mode]) .highcharts-hollowcandlestick-series .highcharts-point-down-bearish-up {
    fill: var(--highcharts-positive-color, var(--_color-positive));
    stroke: var(--highcharts-positive-color, var(--_color-positive));
  }

  :where([styled-mode]) .highcharts-hollowcandlestick-series .highcharts-point-up {
    fill: transparent;
    stroke: var(--highcharts-positive-color, var(--_color-positive));
  }

  :where([styled-mode]) .highcharts-ohlc-series .highcharts-point-hover {
    stroke-width: 3px;
  }

  :where([styled-mode]) .highcharts-flags-series .highcharts-point .highcharts-label-box {
    stroke: var(--highcharts-neutral-color-40, var(--_grid-line));
    fill: var(--highcharts-background-color, var(--_bg));
    transition: fill 250ms;
  }

  :where([styled-mode]) .highcharts-flags-series .highcharts-point-hover .highcharts-label-box {
    stroke: var(
      --highcharts-neutral-color-100,
      color-mix(in srgb, var(--vaadin-charts-contrast, var(--_label)) 60%, transparent)
    );
    fill: var(--highcharts-highlight-color-20, var(--_bg));
  }

  :where([styled-mode]) .highcharts-flags-series .highcharts-point text {
    fill: var(--highcharts-neutral-color-100, var(--_data-label));
    font-size: 0.9em;
    font-weight: bold;
  }

  /* Highcharts Maps */
  :where([styled-mode]) .highcharts-map-series .highcharts-point {
    transition:
      fill 500ms,
      fill-opacity 500ms,
      stroke-width 250ms;
    stroke: var(--highcharts-neutral-color-20);
    stroke-width: inherit;
  }

  :where([styled-mode]) .highcharts-map-series .highcharts-point-hover {
    transition:
      fill 0ms,
      fill-opacity 0ms;
    fill-opacity: 0.5;
  }

  :where([styled-mode]) .highcharts-mapline-series .highcharts-point {
    fill: none;
  }

  :where([styled-mode]) .highcharts-heatmap-series .highcharts-point {
    stroke-width: 0;
  }

  :where([styled-mode]) .highcharts-map-navigation {
    font-size: 1.3em;
    font-weight: bold;
    text-align: center;
  }

  :where([styled-mode]) .highcharts-map-navigation.highcharts-button {
    fill: var(--highcharts-background-color);
    stroke: var(--highcharts-neutral-color-10);
  }

  :where([styled-mode]) .highcharts-map-navigation.highcharts-button:hover {
    fill: var(--highcharts-neutral-color-10);
  }

  :where([styled-mode]) .highcharts-map-navigation.highcharts-button .highcharts-button-symbol {
    stroke-width: 2px;
  }

  :where([styled-mode]) .highcharts-mapview-inset-border {
    stroke: var(--highcharts-neutral-color-20);
    stroke-width: 1px;
    fill: none;
  }

  :where([styled-mode]) .highcharts-coloraxis {
    stroke-width: 0;
  }

  :where([styled-mode]) .highcharts-coloraxis-marker {
    fill: var(--highcharts-neutral-color-40);
  }

  :where([styled-mode]) .highcharts-null-point {
    fill: var(--highcharts-neutral-color-3, var(--vaadin-charts-button-background, var(--vaadin-background-container)));
  }

  /* 3d charts */
  :where([styled-mode]) .highcharts-3d-frame {
    fill: transparent;
  }

  /* Exporting module */
  :where([styled-mode]) .highcharts-contextbutton {
    /* Fill is needed to capture hover */
    fill: var(--highcharts-background-color, var(--_bg));
    stroke: none;
    stroke-linecap: round;
  }

  :where([styled-mode]) .highcharts-contextbutton:hover {
    fill: var(--highcharts-neutral-color-10, #e6e6e6);
    stroke: var(--highcharts-neutral-color-10, #e6e6e6);
  }

  :where([styled-mode]) .highcharts-button-symbol {
    stroke: var(--highcharts-neutral-color-60, var(--_secondary-label));
    stroke-width: 3px;
  }

  :where([styled-mode]) .highcharts-menu {
    border: none;
    background: var(--highcharts-background-color, var(--_bg));
    border-radius: 3px;
    padding: 0.5em;
    box-shadow: 3px 3px 10px #888;
  }

  :where([styled-mode]) .highcharts-menu-item {
    background: none;
    border-radius: 3px;
    color: var(--highcharts-neutral-color-80, var(--vaadin-charts-button-label, var(--_label)));
    cursor: pointer;
    font-size: 1em;
    list-style-type: none;
    padding: 0.5em;
    transition:
      background 250ms,
      color 250ms;
  }

  :where([styled-mode]) .highcharts-menu-item:hover {
    background: var(--highcharts-neutral-color-5, var(--_bg));
  }

  /* Breadcrumbs */
  :where([styled-mode]) .highcharts-breadcrumbs-button {
    fill: none;
    stroke-width: 0;
    cursor: pointer;
  }

  :where([styled-mode]) .highcharts-breadcrumbs-separator {
    fill: var(--highcharts-neutral-color-60, var(--_secondary-label));
  }

  /* Drilldown module */
  :where([styled-mode]) .highcharts-drilldown-point {
    cursor: pointer;
  }

  :where([styled-mode]) .highcharts-drilldown-data-label text,
  :where([styled-mode]) text.highcharts-drilldown-data-label,
  :where([styled-mode]) .highcharts-drilldown-axis-label {
    cursor: pointer;
    fill: var(--highcharts-highlight-color-100, var(--vaadin-charts-button-label, var(--_label)));
    font-weight: bold;
    text-decoration: underline;
  }

  /* No-data module */
  :where([styled-mode]) .highcharts-no-data text {
    font-weight: bold;
    font-size: 1em;
    fill: var(--highcharts-neutral-color-60, var(--_secondary-label));
  }

  /* Drag-panes module */
  :where([styled-mode]) .highcharts-axis-resizer {
    cursor: ns-resize;
    stroke: var(--highcharts-neutral-color-100, black);
    stroke-width: 2px;
  }

  /* Bullet type series */
  :where([styled-mode]) .highcharts-bullet-target {
    stroke-width: 0;
  }

  /* Lineargauge type series */
  :where([styled-mode]) .highcharts-lineargauge-target {
    stroke-width: 1px;
    stroke: var(
      --highcharts-neutral-color-80,
      color-mix(in srgb, var(--vaadin-charts-contrast, var(--_label)) 60%, transparent)
    );
  }

  :where([styled-mode]) .highcharts-lineargauge-target-line {
    stroke-width: 1px;
    stroke: var(
      --highcharts-neutral-color-80,
      color-mix(in srgb, var(--vaadin-charts-contrast, var(--_label)) 60%, transparent)
    );
  }

  /* Advanced annotations module */
  :where([styled-mode]) .highcharts-fibonacci-background-0,
  :where([styled-mode]) .highcharts-pitchfork-inner-background,
  :where([styled-mode]) .highcharts-measure-background {
    fill: var(--highcharts-annotation-color-0);
  }

  :where([styled-mode]) .highcharts-fibonacci-background-1 {
    fill: var(--highcharts-annotation-color-1);
  }

  :where([styled-mode]) .highcharts-fibonacci-background-2 {
    fill: var(--highcharts-annotation-color-2);
  }

  :where([styled-mode]) .highcharts-fibonacci-background-3,
  :where([styled-mode]) .highcharts-pitchfork-outer-background {
    fill: var(--highcharts-annotation-color-3);
  }

  :where([styled-mode]) .highcharts-fibonacci-background-4 {
    fill: var(--highcharts-annotation-color-4);
  }

  :where([styled-mode]) .highcharts-fibonacci-background-5 {
    fill: var(--highcharts-annotation-color-5);
  }

  :where([styled-mode]) .highcharts-fibonacci-line {
    stroke: var(--highcharts-neutral-color-40);
  }

  :where([styled-mode]) .highcharts-crooked-lines,
  :where([styled-mode]) .highcharts-tunnel-lines,
  :where([styled-mode]) .highcharts-infinity-lines,
  :where([styled-mode]) .highcharts-timecycles-lines,
  :where([styled-mode]) .highcharts-fibonacci-timezones-lines,
  :where([styled-mode]) .highcharts-pitchfork-lines,
  :where([styled-mode]) .highcharts-vertical-line,
  :where([styled-mode]) .highcharts-measure-crosshair-x,
  :where([styled-mode]) .highcharts-measure-crosshair-y {
    stroke: var(--highcharts-neutral-color-100);
    stroke-opacity: 0.75;
    fill: none;
  }

  :where([styled-mode]) .highcharts-measure-crosshair-x,
  :where([styled-mode]) .highcharts-measure-crosshair-y {
    stroke-dasharray: 1, 3;
  }

  :where([styled-mode]) .highcharts-tunnel-background {
    fill: var(--highcharts-color-0);
  }

  :where([styled-mode]) .highcharts-annotation-shapes {
    cursor: move;
  }

  :where([styled-mode]) .highcharts-basic-shape {
    fill: var(--highcharts-neutral-color-100);
    stroke: var(--highcharts-neutral-color-100);
    opacity: 0.74;
  }

  /* Annotations module */

  :where([styled-mode]) .highcharts-annotation-label-box {
    stroke-width: 1px;
    stroke: var(--highcharts-neutral-color-100, var(--vaadin-charts-contrast, var(--_label)));
    fill: var(--highcharts-neutral-color-100, var(--vaadin-charts-contrast, var(--_label)));
    fill-opacity: 0.75;
  }

  :where([styled-mode]) .highcharts-annotation-label text {
    fill: var(--highcharts-neutral-color-10, var(--_label));
    font-size: 1em;
  }

  /* A11y module */
  :where([styled-mode]) .highcharts-a11y-proxy-element {
    border-width: 0;
    background-color: transparent;
    cursor: pointer;
    outline: none;
    opacity: 0.001;
    z-index: 999;
    overflow: hidden;
    padding: 0;
    margin: 0;
    display: block;
    position: absolute;
  }

  :where([styled-mode]) .highcharts-a11y-proxy-group li {
    list-style: none;
  }

  :where([styled-mode]) .highcharts-visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    white-space: nowrap;
    clip: rect(1px, 1px, 1px, 1px);
    margin-top: -3px;
    opacity: 0.01;
  }

  :where([styled-mode]) .highcharts-a11y-invisible {
    visibility: hidden;
  }

  :where([styled-mode]) .highcharts-a11y-proxy-container,
  :where([styled-mode]) .highcharts-a11y-proxy-container-before,
  :where([styled-mode]) .highcharts-a11y-proxy-container-after {
    position: absolute;
    white-space: nowrap;
  }

  :where([styled-mode]) g.highcharts-series,
  :where([styled-mode]) .highcharts-markers,
  :where([styled-mode]) .highcharts-point {
    outline: none;
  }

  /* Gantt */
  :where([styled-mode]) .highcharts-treegrid-node-collapsed,
  :where([styled-mode]) .highcharts-treegrid-node-expanded {
    cursor: pointer;
  }

  :where([styled-mode]) .highcharts-point-connecting-path {
    fill: none;
  }

  :where([styled-mode]) .highcharts-grid-axis .highcharts-tick {
    stroke: var(--highcharts-neutral-color-20, var(--_grid-line));
    stroke-width: 1px;
  }

  :where([styled-mode]) .highcharts-grid-axis .highcharts-axis-line {
    stroke: var(--highcharts-neutral-color-20, var(--_grid-line));
    stroke-width: 1px;
  }

  :where([styled-mode]) .highcharts-gantt-series .highcharts-partfill-overlay {
    fill: hsla(0, 0%, 0%, 0.3);
    stroke: hsla(0, 0%, 0%, 0.3);
  }

  /* RTL styles */
  :host([dir='rtl']) :where([styled-mode]) .highcharts-container {
    text-align: right;
  }

  :host([dir='rtl']) :where([styled-mode]) input.highcharts-range-selector {
    left: auto;
    right: -9em;
  }

  :host([dir='rtl']) :where([styled-mode]) .highcharts-menu {
    box-shadow: -3px 3px 10px #888;
  }
`;
