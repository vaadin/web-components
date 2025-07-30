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
import '@vaadin/component-base/src/style-props.js';
import { css, unsafeCSS } from 'lit';
import { addGlobalThemeStyles } from '@vaadin/vaadin-themable-mixin/register-styles.js';

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

  ${unsafeCSS(scope)} .highcharts-tooltip text {
    fill: var(--vaadin-charts-data-label, var(--vaadin-color));
  }

  ${unsafeCSS(scope)} .highcharts-tooltip .highcharts-header {
    font-size: 0.85em;
    color: var(--vaadin-color-subtle);
  }

  ${unsafeCSS(scope)} .highcharts-tooltip-box {
    stroke-width: 1px;
    stroke: var(--vaadin-charts-tooltip-border, var(--vaadin-border-color));
    fill: var(--vaadin-charts-tooltip-background, var(--vaadin-background-color));
    fill-opacity: var(--vaadin-charts-tooltip-background-opacity, 1);
  }

  ${unsafeCSS(scope)} .highcharts-tooltip-box .highcharts-label-box {
    fill: var(--vaadin-charts-tooltip-background, var(--vaadin-background-color));
    fill-opacity: var(--vaadin-charts-tooltip-background-opacity, 1);
    stroke: var(--vaadin-charts-tooltip-border, var(--vaadin-border-color));
  }

  ${unsafeCSS(scope)} .highcharts-tooltip-header {
    stroke-width: 1px;
    stroke: color-mix(in srgb, var(--vaadin-charts-contrast, var(--_label)) 20%, transparent);
  }

  ${unsafeCSS(scope)} div.highcharts-tooltip {
    filter: none;
  }
`;

addGlobalThemeStyles(
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
    overflow: hidden;
    font-size: var(--vaadin-charts-font-size, 0.75rem);
    line-height: normal;

    /* Needs to be a color, not a background image */
    --_bg: var(--vaadin-charts-background, var(--vaadin-background-color));
    --_hue-scale: 180;
    --_accent: var(--vaadin-charts-accent, #4172d5);
    --_accent-0: var(--vaadin-charts-color-0, var(--_accent));
    --_accent-1: var(
      --vaadin-charts-color-1,
      oklch(from var(--_accent-0) clamp(0.2, l - 0.1, 0.8) c calc(h - var(--_hue-scale) / 9 * 1))
    );
    --_accent-2: var(
      --vaadin-charts-color-2,
      oklch(from var(--_accent-0) clamp(0.2, l + 0.1, 0.8) c calc(h - var(--_hue-scale) / 9 * 2))
    );
    --_accent-3: var(
      --vaadin-charts-color-3,
      oklch(from var(--_accent-0) clamp(0.2, l - 0.1, 0.8) c calc(h - var(--_hue-scale) / 9 * 3))
    );
    --_accent-4: var(
      --vaadin-charts-color-4,
      oklch(from var(--_accent-0) clamp(0.2, l + 0.1, 0.8) c calc(h - var(--_hue-scale) / 9 * 4))
    );
    --_accent-5: var(
      --vaadin-charts-color-5,
      oklch(from var(--_accent-0) clamp(0.2, l - 0.1, 0.8) c calc(h - var(--_hue-scale) / 9 * 5))
    );
    --_accent-6: var(
      --vaadin-charts-color-6,
      oklch(from var(--_accent-0) clamp(0.2, l + 0.1, 0.8) c calc(h - var(--_hue-scale) / 9 * 6))
    );
    --_accent-7: var(
      --vaadin-charts-color-7,
      oklch(from var(--_accent-0) clamp(0.2, l - 0.1, 0.8) c calc(h - var(--_hue-scale) / 9 * 7))
    );
    --_accent-8: var(
      --vaadin-charts-color-8,
      oklch(from var(--_accent-0) clamp(0.2, l + 0.1, 0.8) c calc(h - var(--_hue-scale) / 9 * 8))
    );
    --_accent-9: var(
      --vaadin-charts-color-9,
      oklch(from var(--_accent-0) clamp(0.2, l - 0.1, 0.8) c calc(h - var(--_hue-scale) / 9 * 9))
    );

    --_accent-0-label: oklch(from var(--_accent-0) clamp(0, (0.62 - l) * 1000, 1) 0 0);
    --_accent-1-label: oklch(from var(--_accent-1) clamp(0, (0.62 - l) * 1000, 1) 0 0);
    --_accent-2-label: oklch(from var(--_accent-2) clamp(0, (0.62 - l) * 1000, 1) 0 0);
    --_accent-3-label: oklch(from var(--_accent-3) clamp(0, (0.62 - l) * 1000, 1) 0 0);
    --_accent-4-label: oklch(from var(--_accent-4) clamp(0, (0.62 - l) * 1000, 1) 0 0);
    --_accent-5-label: oklch(from var(--_accent-5) clamp(0, (0.62 - l) * 1000, 1) 0 0);
    --_accent-6-label: oklch(from var(--_accent-6) clamp(0, (0.62 - l) * 1000, 1) 0 0);
    --_accent-7-label: oklch(from var(--_accent-7) clamp(0, (0.62 - l) * 1000, 1) 0 0);
    --_accent-8-label: oklch(from var(--_accent-8) clamp(0, (0.62 - l) * 1000, 1) 0 0);
    --_accent-9-label: oklch(from var(--_accent-9) clamp(0, (0.62 - l) * 1000, 1) 0 0);

    --_accent-positive: light-dark(#19b156, #1ccc62);
    --_accent-negative: light-dark(#dc0611, #f7353f);

    --_label: var(--vaadin-charts-label, var(--vaadin-color));
    --_secondary-label: var(--vaadin-charts-secondary-label, var(--vaadin-color-subtle));
    --_disabled-label: var(--vaadin-charts-disabled-label, var(--vaadin-color-disabled));
    --_point-border: var(--vaadin-charts-point-border, var(--_bg));
    --_axis-line: var(--vaadin-charts-axis-line, var(--vaadin-border-color));
    --_axis-title: var(--vaadin-charts-axis-title, var(--_secondary-label));
    --_axis-label: var(--vaadin-charts-axis-label, var(--_secondary-label));
    --_grid-line: var(--vaadin-charts-grid-line, var(--vaadin-border-color));
    --_minor-grid-line: var(
      --vaadin-charts-minor-grid-line,
      color-mix(in srgb, var(--vaadin-border-color) 60%, transparent)
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
    z-index: 0;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  :where([styled-mode]) .highcharts-root {
    display: block;
  }

  :where([styled-mode]) .highcharts-root text {
    stroke-width: 0;
  }

  :where([styled-mode]) .highcharts-strong {
    font-weight: 600;
  }

  :where([styled-mode]) .highcharts-emphasized {
    font-style: italic;
  }

  :where([styled-mode]) .highcharts-anchor {
    cursor: pointer;
  }

  :where([styled-mode]) .highcharts-background {
    fill: var(--_bg);
  }

  :where([styled-mode]) .highcharts-plot-border,
  :where([styled-mode]) .highcharts-plot-background {
    fill: none;
  }

  :where([styled-mode]) .highcharts-label-box {
    fill: none;
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
    fill: var(--vaadin-charts-title-label, var(--_label));
    font-size: 1.5em;
    font-weight: 600;
  }

  :where([styled-mode]) .highcharts-subtitle {
    fill: var(--_secondary-label);
  }

  /* Axes */
  :where([styled-mode]) .highcharts-axis-line {
    fill: none;
    stroke: var(--_axis-line);
  }

  :where([styled-mode]) .highcharts-yaxis .highcharts-axis-line {
    stroke-width: 0;
  }

  :where([styled-mode]) .highcharts-axis-title {
    fill: var(--_axis-title);
  }

  :where([styled-mode]) .highcharts-axis-labels {
    fill: var(--_axis-label);
    cursor: default;
    font-size: 0.9em;
  }

  :where([styled-mode]) .highcharts-grid-line {
    fill: none;
    stroke: var(--_grid-line);
  }

  :where([styled-mode]) .highcharts-xaxis-grid .highcharts-grid-line {
    stroke-width: var(--vaadin-charts-xaxis-line-width, 0);
  }

  :where([styled-mode]) .highcharts-tick {
    stroke: var(--_grid-line);
  }

  :where([styled-mode]) .highcharts-yaxis .highcharts-tick {
    stroke-width: 0;
  }

  :where([styled-mode]) .highcharts-minor-grid-line {
    stroke: var(--_minor-grid-line);
  }

  :where([styled-mode]) .highcharts-crosshair-thin {
    stroke-width: 1px;
    stroke: var(--_grid-line);
  }

  :where([styled-mode]) .highcharts-crosshair-category {
    stroke: var(--_accent-0);
    stroke-opacity: 0.25;
  }

  /* Credits */
  :where([styled-mode]) .highcharts-credits {
    cursor: pointer;
    fill: var(--_disabled-label);
    font-size: 0.7em;
    transition:
      fill 250ms,
      font-size 250ms;
  }

  :where([styled-mode]) .highcharts-credits:hover {
    fill: black;
    font-size: 1em;
  }

  /* Tooltip */
  ${unsafeCSS(tooltipStyles(':where([styled-mode])'))};

  :where([styled-mode]) .highcharts-selection-marker {
    fill: var(--_accent-0);
    fill-opacity: 0.25;
  }

  :where([styled-mode]) .highcharts-graph {
    fill: none;
    stroke-width: var(--vaadin-chart-graph-stroke-width, 2);
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  :where([styled-mode]) .highcharts-state-hover .highcharts-graph {
    stroke-width: calc(var(--vaadin-chart-graph-stroke-width, 2) + 1);
  }

  :where([styled-mode]) .highcharts-point-inactive {
    opacity: 0.2;
    transition: opacity 50ms;
    /* quick in */
  }

  :where([styled-mode]) .highcharts-series-inactive {
    opacity: 0.2;
    transition: opacity 50ms;
    /* quick in */
  }

  :where([styled-mode]) .highcharts-state-hover path {
    transition: stroke-width 50ms;
    /* quick in */
  }

  :where([styled-mode]) .highcharts-state-normal path {
    transition: stroke-width 250ms;
    /* slow out */
  }

  /* Legend hover affects points and series */
  :where([styled-mode]) g.highcharts-series,
  :where([styled-mode]) .highcharts-point,
  :where([styled-mode]) .highcharts-markers,
  :where([styled-mode]) .highcharts-data-labels {
    transition: opacity 250ms;
  }

  :where([styled-mode]) .highcharts-legend-series-active g.highcharts-series:not(.highcharts-series-hover),
  :where([styled-mode]) .highcharts-legend-point-active .highcharts-point:not(.highcharts-point-hover),
  :where([styled-mode]) .highcharts-legend-series-active .highcharts-markers:not(.highcharts-series-hover),
  :where([styled-mode]) .highcharts-legend-series-active .highcharts-data-labels:not(.highcharts-series-hover) {
    opacity: 0.2;
  }

  /* Series options */
  /* Default colors */
  /* vaadin-charts custom properties */
  /* Use of :where() function to avoid setting classes with high specificity */
  :where([styled-mode]) .highcharts-color-0 {
    fill: var(--_accent-0);
    stroke: var(--_accent-0);
    color: var(--_accent-0-label);
  }

  :where([styled-mode]) .highcharts-color-1 {
    fill: var(--_accent-1);
    stroke: var(--_accent-1);
    color: var(--_accent-1-label);
  }

  :where([styled-mode]) .highcharts-color-2 {
    fill: var(--_accent-2);
    stroke: var(--_accent-2);
    color: var(--_accent-2-label);
  }

  :where([styled-mode]) .highcharts-color-3 {
    fill: var(--_accent-3);
    stroke: var(--_accent-3);
    color: var(--_accent-2-label);
  }

  :where([styled-mode]) .highcharts-color-4 {
    fill: var(--_accent-4);
    stroke: var(--_accent-4);
    color: var(--_accent-4-label);
  }

  :where([styled-mode]) .highcharts-color-5 {
    fill: var(--_accent-5);
    stroke: var(--_accent-5);
    color: var(--_accent-5-label);
  }

  :where([styled-mode]) .highcharts-color-6 {
    fill: var(--_accent-6);
    stroke: var(--_accent-6);
    color: var(--_accent-6-label);
  }

  :where([styled-mode]) .highcharts-color-7 {
    fill: var(--_accent-7);
    stroke: var(--_accent-7);
    color: var(--_accent-7-label);
  }

  :where([styled-mode]) .highcharts-color-8 {
    fill: var(--_accent-8);
    stroke: var(--_accent-8);
    color: var(--_accent-8-label);
  }

  :where([styled-mode]) .highcharts-color-9 {
    fill: var(--_accent-9);
    stroke: var(--_accent-9);
    color: var(--_accent-9-label);
  }

  :where([styled-mode]) .highcharts-data-label-color-0 {
    color: var(--_accent-0-label);
  }

  :where([styled-mode]) .highcharts-data-label-color-1 {
    color: var(--_accent-1-label);
  }

  :where([styled-mode]) .highcharts-data-label-color-2 {
    color: var(--_accent-2-label);
  }

  :where([styled-mode]) .highcharts-data-label-color-3 {
    color: var(--_accent-3-label);
  }

  :where([styled-mode]) .highcharts-data-label-color-4 {
    color: var(--_accent-4-label);
  }

  :where([styled-mode]) .highcharts-data-label-color-5 {
    color: var(--_accent-5-label);
  }

  :where([styled-mode]) .highcharts-data-label-color-6 {
    color: var(--_accent-6-label);
  }

  :where([styled-mode]) .highcharts-data-label-color-7 {
    color: var(--_accent-7-label);
  }

  :where([styled-mode]) .highcharts-data-label-color-8 {
    color: var(--_accent-8-label);
  }

  :where([styled-mode]) .highcharts-data-label-color-9 {
    color: var(--_accent-9-label);
  }

  :where([styled-mode]) [class*='highcharts-data-label-color-'] {
    fill: currentColor;
  }

  /* end of vaadin-charts custom properties */

  :where([styled-mode]) .highcharts-area {
    fill-opacity: 0.5;
    stroke-width: 0;
  }

  :where([styled-mode]) .highcharts-markers {
    stroke-width: 1px;
    stroke: var(--_bg);
  }

  :where([styled-mode])
    .highcharts-a11y-markers-hidden
    .highcharts-point:not(.highcharts-point-hover):not(.highcharts-a11y-marker-visible),
  :where([styled-mode]) .highcharts-a11y-marker-hidden {
    opacity: 0;
  }

  :where([styled-mode]) .highcharts-point {
    stroke-width: 1px;
  }

  :where([styled-mode]) .highcharts-dense-data .highcharts-point {
    stroke-width: 0;
  }

  :where([styled-mode]) .highcharts-data-label {
    font-size: 0.9em;
    font-weight: normal;
  }

  :where([styled-mode]) .highcharts-data-label-box {
    fill: none;
    stroke-width: 0;
  }

  :where([styled-mode]) .highcharts-data-label text,
  :where([styled-mode]) text.highcharts-data-label {
    fill: var(--_data-label);
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

  :where([styled-mode]) .highcharts-series:not(.highcharts-pie-series) .highcharts-point-select,
  :where([styled-mode]) .highcharts-markers .highcharts-point-select {
    /* TODO where are these used? */
    fill: var(--_grid-line);
    stroke: var(--vaadin-charts-contrast, var(--_label));
  }

  :where([styled-mode]) .highcharts-column-series rect.highcharts-point {
    stroke: var(--_point-border);
  }

  :where([styled-mode]) .highcharts-column-series .highcharts-point {
    transition: fill-opacity 250ms;
  }

  :where([styled-mode]) .highcharts-column-series .highcharts-point-hover {
    fill-opacity: 0.75;
    transition: fill-opacity 50ms;
  }

  :where([styled-mode]) .highcharts-pie-series .highcharts-point {
    stroke-linejoin: round;
    stroke: var(--_point-border);
  }

  :where([styled-mode]) .highcharts-pie-series .highcharts-point-hover {
    fill-opacity: 0.75;
    transition: fill-opacity 50ms;
  }

  :where([styled-mode]) .highcharts-funnel-series .highcharts-point {
    stroke-linejoin: round;
    stroke: var(--_point-border);
    stroke-width: 2px;
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
    stroke: var(--_point-border);
    stroke-width: 2px;
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
    stroke-width: 2px;
    stroke: var(--_point-border);
    transition:
      stroke 250ms,
      fill 250ms,
      fill-opacity 250ms;
  }

  :where([styled-mode]) .highcharts-treemap-series .highcharts-point-hover {
    stroke-width: 0;
    stroke: var(--_point-border);
    fill-opacity: 0.75;
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

  :where([styled-mode]) .highcharts-treemap-series [class*='highcharts-data-label-color-'] text {
    fill: inherit;
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
    /* TODO where is this used? */
    stroke: var(--vaadin-charts-contrast, var(--_label));
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

  :where([styled-mode]) .highcharts-legend-item > text {
    fill: var(--_data-label);
    font-weight: normal;
    font-size: 1em;
    cursor: pointer;
    stroke-width: 0;
  }

  :where([styled-mode]) .highcharts-legend-item > .highcharts-point {
    stroke-width: 0;
  }

  :where([styled-mode]) .highcharts-legend-item:hover text {
    fill: var(--vaadin-charts-title-label, var(--_label));
  }

  :where([styled-mode]) .highcharts-legend-item-hidden * {
    fill: var(--_disabled-label) !important;
    stroke: var(--_disabled-label) !important;
    transition: fill 250ms;
  }

  :where([styled-mode]) .highcharts-legend-nav-active {
    fill: var(--vaadin-charts-button-label, var(--_label));
    cursor: pointer;
  }

  :where([styled-mode]) .highcharts-legend-nav-inactive {
    fill: var(--_disabled-label);
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
    fill: var(--_data-label);
  }

  /* Loading */
  :where([styled-mode]) .highcharts-loading {
    position: absolute;
    background-color: var(--_bg);
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
    font-weight: normal;
    position: relative;
    top: 45%;
  }

  /* Plot bands and polar pane backgrounds */
  :where([styled-mode]) .highcharts-plot-band,
  :where([styled-mode]) .highcharts-pane {
    fill: var(--vaadin-charts-contrast, var(--_label));
    fill-opacity: 0.05;
  }

  :where([styled-mode]) .highcharts-plot-line {
    fill: none;
    /* TODO where is this used? */
    stroke: color-mix(in srgb, var(--vaadin-charts-contrast, var(--_label)) 60%, transparent);
    stroke-width: 1px;
  }

  :where([styled-mode]) .highcharts-plot-line-label {
    fill: var(--_data-label);
  }

  /* Highcharts More and modules */
  :where([styled-mode]) .highcharts-boxplot-box {
    fill: var(--_bg);
  }

  :where([styled-mode]) .highcharts-boxplot-median {
    stroke-width: 2px;
  }

  :where([styled-mode]) .highcharts-bubble-series .highcharts-point {
    fill-opacity: 0.5;
  }

  :where([styled-mode]) .highcharts-errorbar-series .highcharts-point {
    stroke: var(--vaadin-charts-contrast, var(--_label));
  }

  :where([styled-mode]) .highcharts-gauge-series .highcharts-data-label-box {
    stroke: var(--_grid-line);
    stroke-width: 1px;
  }

  :where([styled-mode]) .highcharts-gauge-series .highcharts-dial {
    fill: var(--vaadin-charts-contrast, var(--_label));
    stroke-width: 0;
  }

  :where([styled-mode]) .highcharts-polygon-series .highcharts-graph {
    fill: inherit;
    stroke-width: 0;
  }

  :where([styled-mode]) .highcharts-waterfall-series .highcharts-graph {
    stroke: color-mix(in srgb, var(--vaadin-charts-contrast, var(--_label)) 60%, transparent);
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
    stroke: var(--_point-border);
    transition:
      stroke 250ms,
      fill-opacity 250ms;
  }

  :where([styled-mode]) .highcharts-venn-series .highcharts-point-hover {
    fill-opacity: 1;
    stroke: var(--_point-border);
  }

  /* Highstock */
  :where([styled-mode]) .highcharts-navigator-mask-outside {
    fill-opacity: 0;
  }

  :where([styled-mode]) .highcharts-navigator-mask-inside {
    fill: var(--_accent-0);
    /* navigator.maskFill option */
    fill-opacity: 0.2;
    cursor: ew-resize;
  }

  :where([styled-mode]) .highcharts-navigator-outline {
    stroke: var(--_grid-line);
    fill: none;
  }

  :where([styled-mode]) .highcharts-navigator-handle {
    stroke: var(--_grid-line);
    fill: var(--_bg);
    cursor: ew-resize;
  }

  :where([styled-mode]) .highcharts-navigator-series {
    fill: var(--_accent-1);
    stroke: var(--_accent-1);
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
    stroke: var(--_grid-line);
  }

  :where([styled-mode]) .highcharts-navigator-xaxis.highcharts-axis-labels {
    fill: var(--_secondary-label);
  }

  :where([styled-mode]) .highcharts-navigator-yaxis .highcharts-grid-line {
    stroke-width: 0;
  }

  :where([styled-mode]) .highcharts-scrollbar-thumb {
    fill: color-mix(in srgb, var(--vaadin-charts-contrast, var(--_label)) 20%, transparent);
  }

  :where([styled-mode]) .highcharts-scrollbar-button {
    fill: var(--_bg);
  }

  :where([styled-mode]) .highcharts-scrollbar-arrow {
    fill: var(--_data-label);
  }

  :where([styled-mode]) .highcharts-scrollbar-rifles {
    stroke: var(--_data-label);
    stroke-width: 1px;
  }

  :where([styled-mode]) .highcharts-scrollbar-track {
    fill: color-mix(in srgb, var(--vaadin-charts-contrast, var(--_label)) 5%, transparent);
  }

  :where([styled-mode]) .highcharts-button {
    fill: var(--vaadin-charts-button-background, var(--vaadin-background-container));
    cursor: default;
    transition: fill 250ms;
  }

  :where([styled-mode]) .highcharts-button text {
    fill: var(--vaadin-charts-button-label, var(--_label));
    font-weight: 600;
  }

  :where([styled-mode]) .highcharts-button-hover {
    transition: fill 0ms;
    fill: var(--vaadin-charts-button-hover-background, var(--vaadin-background-container));
    stroke-width: 0;
  }

  :where([styled-mode]) .highcharts-button-hover text {
    fill: var(--vaadin-charts-button-label, var(--_label));
  }

  :where([styled-mode]) .highcharts-button-pressed {
    fill: var(--vaadin-charts-button-active-background, var(--_label));
  }

  :where([styled-mode]) .highcharts-button-pressed text {
    fill: var(--vaadin-charts-button-active-label, var(--_bg));
  }

  :where([styled-mode]) .highcharts-button-disabled text {
    fill: var(--vaadin-charts-button-disabled-label, var(--vaadin-color-disabled));
  }

  :where([styled-mode]) .highcharts-range-selector-buttons > :is(text, .highcharts-label) {
    fill: var(--_secondary-label);
  }

  :where([styled-mode]) .highcharts-range-selector-buttons .highcharts-button {
    stroke-width: 0;
  }

  :where([styled-mode]) .highcharts-range-label rect {
    fill: none;
  }

  :where([styled-mode]) .highcharts-range-label text {
    fill: var(--_secondary-label);
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
    fill: var(--_data-label);
  }

  :where([styled-mode]) input.highcharts-range-selector {
    position: absolute;
    border: 0;
    width: 1px;
    /* Chrome needs a pixel to see it */
    height: 1px;
    padding: 0;
    text-align: center;
    left: -9em;
    /* #4798 */
  }

  :where([styled-mode]) .highcharts-crosshair-label text {
    fill: var(--_bg);
    font-size: 1.1em;
  }

  :where([styled-mode]) .highcharts-crosshair-label .highcharts-label-box {
    fill: inherit;
  }

  :where([styled-mode]) .highcharts-candlestick-series .highcharts-point {
    stroke: var(--vaadin-charts-candlestick-line, var(--vaadin-border-color-strong));
    stroke-width: 1px;
  }

  :where([styled-mode]) .highcharts-candlestick-series .highcharts-point-up {
    fill: var(--_accent-positive);
  }

  :where([styled-mode]) .highcharts-candlestick-series .highcharts-point-down {
    fill: var(--_accent-negative);
  }

  :where([styled-mode]) .highcharts-ohlc-series .highcharts-point-hover {
    stroke-width: 3px;
  }

  :where([styled-mode]) .highcharts-flags-series .highcharts-point .highcharts-label-box {
    stroke: var(--_grid-line);
    fill: var(--_bg);
    transition: fill 250ms;
  }

  :where([styled-mode]) .highcharts-flags-series .highcharts-point-hover .highcharts-label-box {
    stroke: color-mix(in srgb, var(--vaadin-charts-contrast, var(--_label)) 60%, transparent);
    fill: var(--_bg);
  }

  :where([styled-mode]) .highcharts-flags-series .highcharts-point text {
    fill: var(--_data-label);
    font-size: 0.9em;
    font-weight: normal;
  }

  :where([styled-mode]) .highcharts-flags-series .highcharts-point-hover text {
    fill: var(--vaadin-charts-title-label, var(--_label));
  }

  /* Highmaps */
  :where([styled-mode]) .highcharts-map-series .highcharts-point {
    transition:
      fill 500ms,
      fill-opacity 500ms,
      stroke-width 250ms;
    stroke: color-mix(in srgb, var(--vaadin-charts-contrast, var(--_label)) 20%, transparent);
  }

  :where([styled-mode]) .highcharts-map-series .highcharts-point-hover {
    transition:
      fill 0ms,
      fill-opacity 0ms;
    fill-opacity: 0.5;
    stroke-width: 2px;
  }

  :where([styled-mode]) .highcharts-mapline-series .highcharts-point {
    fill: none;
  }

  :where([styled-mode]) .highcharts-heatmap-series .highcharts-point {
    stroke-width: 0;
  }

  :where([styled-mode]) .highcharts-map-navigation {
    font-size: 1.3em;
    font-weight: normal;
    text-align: center;
  }

  :where([styled-mode]) .highcharts-coloraxis {
    stroke-width: 0;
  }

  :where([styled-mode]) .highcharts-coloraxis-grid .highcharts-grid-line {
    stroke: var(--_bg);
  }

  :where([styled-mode]) .highcharts-coloraxis-marker {
    fill: var(--_axis-label);
    stroke-width: 0;
  }

  :where([styled-mode]) .highcharts-null-point {
    fill: transparent;
    stroke: var(--vaadin-border-color);
  }

  /* 3d charts */
  :where([styled-mode]) .highcharts-3d-frame {
    fill: transparent;
  }

  /* Exporting module */
  :where([styled-mode]) .highcharts-contextbutton {
    fill: #fff;
    /* needed to capture hover */
    stroke: none;
    stroke-linecap: round;
  }

  :where([styled-mode]) .highcharts-contextbutton:hover {
    fill: #e6e6e6;
    stroke: #e6e6e6;
  }

  :where([styled-mode]) .highcharts-button-symbol {
    stroke: var(--_secondary-label);
    stroke-width: 3px;
  }

  :where([styled-mode]) .highcharts-menu {
    border: 1px solid #999;
    background: #fff;
    padding: 5px 0;
    box-shadow: 3px 3px 10px #888;
  }

  :where([styled-mode]) .highcharts-menu-item {
    padding: 0.5em 1em;
    background: none;
    color: var(--vaadin-charts-button-label, var(--_label));
    cursor: pointer;
    transition:
      background 250ms,
      color 250ms;
  }

  :where([styled-mode]) .highcharts-menu-item:hover {
    background: #335cad;
    color: #fff;
  }

  /* Drilldown module */
  :where([styled-mode]) .highcharts-drilldown-point {
    cursor: pointer;
  }

  :where([styled-mode]) .highcharts-drilldown-data-label text,
  :where([styled-mode]) text.highcharts-drilldown-data-label,
  :where([styled-mode]) .highcharts-drilldown-axis-label {
    cursor: pointer;
    fill: var(--vaadin-charts-button-label, var(--_label));
    font-weight: normal;
    text-decoration: underline;
  }

  /* No-data module */
  :where([styled-mode]) .highcharts-no-data text {
    font-weight: normal;
    font-size: 1rem;
    fill: var(--_secondary-label);
  }

  /* Drag-panes module */
  :where([styled-mode]) .highcharts-axis-resizer {
    cursor: ns-resize;
    stroke: black;
    stroke-width: 2px;
  }

  /* Bullet type series */
  :where([styled-mode]) .highcharts-bullet-target {
    stroke-width: 0;
  }

  /* Lineargauge type series */
  :where([styled-mode]) .highcharts-lineargauge-target {
    stroke-width: 1px;
    stroke: color-mix(in srgb, var(--vaadin-charts-contrast, var(--_label)) 60%, transparent);
  }

  :where([styled-mode]) .highcharts-lineargauge-target-line {
    stroke-width: 1px;
    stroke: color-mix(in srgb, var(--vaadin-charts-contrast, var(--_label)) 60%, transparent);
  }

  /* Annotations module */
  :where([styled-mode]) .highcharts-annotation-label-box {
    stroke-width: 1px;
    stroke: var(--vaadin-charts-contrast, var(--_label));
    fill: var(--vaadin-charts-contrast, var(--_label));
    fill-opacity: 0.75;
  }

  :where([styled-mode]) .highcharts-annotation-label text {
    fill: var(--_disabled-label);
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
    stroke-width: 1px;
  }

  :where([styled-mode]) .highcharts-grid-axis .highcharts-axis-line {
    stroke-width: 1px;
  }

  :where([styled-mode]) .highcharts-organization-series .highcharts-link {
    stroke: var(--vaadin-charts-org-line, color-mix(in srgb, var(--_label) 50%, var(--_bg)));
    stroke-width: var(--vaadin-charts-org-line-width, 1);
  }

  /* Workaround for https://github.com/highcharts/highcharts/issues/22490 */
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

  /* https://github.com/highcharts/highcharts/issues/16282 */
  /* without this the resize callback always calls __reflow */
  ul[aria-hidden='false'] {
    margin: 0;
  }
`;
