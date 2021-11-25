/**
 * @license
 * Copyright (c) 2015 - 2021 Vaadin Ltd
 * This program is available under Commercial Vaadin Developer License 4.0, available at https://vaadin.com/license/cvdl-4.0.
 */

/**
 * @license Highcharts
 *
 * (c) 2009-2016 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/* When updating this file do not override vaadin-charts custom properties section */

const chartBaseTheme = css`
  .highcharts-container {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;
    text-align: left;
    line-height: normal;
    z-index: 0;
    /* #1072 */
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    font-family: -apple-system, BlinkMacSystemFont, 'Roboto', 'Segoe UI', Helvetica, Arial, sans-serif,
      'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
    font-size: 12px;
  }

  :where(div#chart[styled-mode]) .highcharts-root {
    display: block;
  }

  :where(div#chart[styled-mode]) .highcharts-root text {
    stroke-width: 0;
  }

  :where(div#chart[styled-mode]) .highcharts-strong {
    font-weight: 600;
  }

  :where(div#chart[styled-mode]) .highcharts-emphasized {
    font-style: italic;
  }

  :where(div#chart[styled-mode]) .highcharts-anchor {
    cursor: pointer;
  }

  :where(div#chart[styled-mode]) .highcharts-background {
    fill: var(--vaadin-charts-background, #fff);
  }

  :where(div#chart[styled-mode]) .highcharts-plot-border,
  :where(div#chart[styled-mode]) .highcharts-plot-background {
    fill: none;
  }

  :where(div#chart[styled-mode]) .highcharts-label-box {
    fill: none;
  }

  :where(div#chart[styled-mode]) .highcharts-button-box {
    fill: inherit;
  }

  :where(div#chart[styled-mode]) .highcharts-tracker-line {
    stroke-linejoin: round;
    stroke: rgba(192, 192, 192, 0.0001);
    stroke-width: 22;
    fill: none;
  }

  :where(div#chart[styled-mode]) .highcharts-tracker-area {
    fill: rgba(192, 192, 192, 0.0001);
    stroke-width: 0;
  }

  /* Titles */
  :where(div#chart[styled-mode]) .highcharts-title {
    fill: var(--vaadin-charts-title-label, hsl(214, 35%, 15%));
    font-size: 1.5em;
    font-weight: 600;
  }

  :where(div#chart[styled-mode]) .highcharts-subtitle {
    fill: var(--vaadin-charts-secondary-label, hsla(214, 42%, 18%, 0.72));
  }

  /* Axes */
  :where(div#chart[styled-mode]) .highcharts-axis-line {
    fill: none;
    stroke: var(--vaadin-charts-axis-line, hsla(214, 61%, 25%, 0.05));
  }

  :where(div#chart[styled-mode]) .highcharts-yaxis .highcharts-axis-line {
    stroke-width: 0;
  }

  :where(div#chart[styled-mode]) .highcharts-axis-title {
    fill: var(--vaadin-charts-axis-title, hsla(214, 42%, 18%, 0.72));
  }

  :where(div#chart[styled-mode]) .highcharts-axis-labels {
    fill: var(--vaadin-charts-axis-label, hsla(214, 42%, 18%, 0.72));
    cursor: default;
    font-size: 0.9em;
  }

  :where(div#chart[styled-mode]) .highcharts-grid-line {
    fill: none;
    stroke: var(--vaadin-charts-grid-line, hsla(214, 53%, 23%, 0.16));
  }

  :where(div#chart[styled-mode]) .highcharts-xaxis-grid .highcharts-grid-line {
    stroke-width: var(--vaadin-charts-xaxis-line-width, 0px);
  }

  :where(div#chart[styled-mode]) .highcharts-tick {
    stroke: var(--vaadin-charts-grid-line, hsla(214, 53%, 23%, 0.16));
  }

  :where(div#chart[styled-mode]) .highcharts-yaxis .highcharts-tick {
    stroke-width: 0;
  }

  :where(div#chart[styled-mode]) .highcharts-minor-grid-line {
    stroke: var(--vaadin-charts-contrast-5pct, hsla(214, 61%, 25%, 0.05));
  }

  :where(div#chart[styled-mode]) .highcharts-crosshair-thin {
    stroke-width: 1px;
    stroke: var(--vaadin-charts-grid-line, hsla(214, 53%, 23%, 0.16));
  }

  :where(div#chart[styled-mode]) .highcharts-crosshair-category {
    stroke: var(--vaadin-charts-color-0, #5ac2f7);
    stroke-opacity: 0.25;
  }

  /* Credits */
  :where(div#chart[styled-mode]) .highcharts-credits {
    cursor: pointer;
    fill: var(--vaadin-charts-disabled-label, hsla(214, 50%, 22%, 0.26));
    font-size: 0.7em;
    transition: fill 250ms, font-size 250ms;
  }

  :where(div#chart[styled-mode]) .highcharts-credits:hover {
    fill: black;
    font-size: 1em;
  }

  /* Tooltip */
  :where(div#chart[styled-mode]) .highcharts-tooltip {
    cursor: default;
    pointer-events: none;
    white-space: nowrap;
    transition: stroke 150ms;
  }

  :where(div#chart[styled-mode]) .highcharts-tooltip {
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.05)) !important;
  }

  :where(div#chart[styled-mode]) .highcharts-tooltip text {
    fill: var(--vaadin-charts-data-label, hsla(214, 40%, 16%, 0.94));
  }

  :where(div#chart[styled-mode]) .highcharts-tooltip .highcharts-header {
    font-size: 0.85em;
    color: var(--vaadin-charts-secondary-label, hsla(214, 42%, 18%, 0.72));
  }

  :where(div#chart[styled-mode]) .highcharts-tooltip-box {
    stroke-width: 1px;
    stroke: var(--vaadin-charts-tooltip-border, inherit);
    fill: var(--vaadin-charts-tooltip-background, #fff);
    fill-opacity: var(--vaadin-charts-tooltip-background-opacity, 1);
  }

  :where(div#chart[styled-mode]) .highcharts-tooltip-box .highcharts-label-box {
    fill: var(--vaadin-charts-tooltip-background, #fff);
    fill-opacity: var(--vaadin-charts-tooltip-background-opacity, 1);
  }

  :where(div#chart[styled-mode]) .highcharts-tooltip-header {
    stroke-width: 1px;
    stroke: var(--vaadin-charts-contrast-20pct, hsla(214, 53%, 23%, 0.16));
  }

  :where(div#chart[styled-mode]) div.highcharts-tooltip {
    filter: none;
  }

  :where(div#chart[styled-mode]) .highcharts-selection-marker {
    fill: var(--vaadin-charts-color-0, #5ac2f7);
    fill-opacity: 0.25;
  }

  :where(div#chart[styled-mode]) .highcharts-graph {
    fill: none;
    stroke-width: 2px;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  :where(div#chart[styled-mode]) .highcharts-state-hover .highcharts-graph {
    stroke-width: 3;
  }

  :where(div#chart[styled-mode]) .highcharts-point-inactive {
    opacity: 0.2;
    transition: opacity 50ms;
    /* quick in */
  }

  :where(div#chart[styled-mode]) .highcharts-series-inactive {
    opacity: 0.2;
    transition: opacity 50ms;
    /* quick in */
  }

  :where(div#chart[styled-mode]) .highcharts-state-hover path {
    transition: stroke-width 50ms;
    /* quick in */
  }

  :where(div#chart[styled-mode]) .highcharts-state-normal path {
    transition: stroke-width 250ms;
    /* slow out */
  }

  /* Legend hover affects points and series */
  :where(div#chart[styled-mode]) g.highcharts-series,
  :where(div#chart[styled-mode]) .highcharts-point,
  :where(div#chart[styled-mode]) .highcharts-markers,
  :where(div#chart[styled-mode]) .highcharts-data-labels {
    transition: opacity 250ms;
  }

  :where(div#chart[styled-mode]) .highcharts-legend-series-active g.highcharts-series:not(.highcharts-series-hover),
  :where(div#chart[styled-mode]) .highcharts-legend-point-active .highcharts-point:not(.highcharts-point-hover),
  :where(div#chart[styled-mode]) .highcharts-legend-series-active .highcharts-markers:not(.highcharts-series-hover),
  :where(div#chart[styled-mode])
    .highcharts-legend-series-active
    .highcharts-data-labels:not(.highcharts-series-hover) {
    opacity: 0.2;
  }

  /* Series options */
  /* Default colors */
  /* vaadin-charts custom properties */
  /* Use of :where() function to avoid setting classes with high specificity */
  :where(div#chart[styled-mode]) .highcharts-color-0 {
    fill: var(--vaadin-charts-color-0, #5ac2f7);
    stroke: var(--vaadin-charts-color-0, #5ac2f7);
  }

  :where(div#chart[styled-mode]) .highcharts-color-1 {
    fill: var(--vaadin-charts-color-1, #1676f3);
    stroke: var(--vaadin-charts-color-1, #1676f3);
  }

  :where(div#chart[styled-mode]) .highcharts-color-2 {
    fill: var(--vaadin-charts-color-2, #ff7d94);
    stroke: var(--vaadin-charts-color-2, #ff7d94);
  }

  :where(div#chart[styled-mode]) .highcharts-color-3 {
    fill: var(--vaadin-charts-color-3, #c5164e);
    stroke: var(--vaadin-charts-color-3, #c5164e);
  }

  :where(div#chart[styled-mode]) .highcharts-color-4 {
    fill: var(--vaadin-charts-color-4, #15c15d);
    stroke: var(--vaadin-charts-color-4, #15c15d);
  }

  :where(div#chart[styled-mode]) .highcharts-color-5 {
    fill: var(--vaadin-charts-color-5, #0e8151);
    stroke: var(--vaadin-charts-color-5, #0e8151);
  }

  :where(div#chart[styled-mode]) .highcharts-color-6 {
    fill: var(--vaadin-charts-color-6, #c18ed2);
    stroke: var(--vaadin-charts-color-6, #c18ed2);
  }

  :where(div#chart[styled-mode]) .highcharts-color-7 {
    fill: var(--vaadin-charts-color-7, #9233b3);
    stroke: var(--vaadin-charts-color-7, #9233b3);
  }

  :where(div#chart[styled-mode]) .highcharts-color-8 {
    fill: var(--vaadin-charts-color-8, #fda253);
    stroke: var(--vaadin-charts-color-8, #fda253);
  }

  :where(div#chart[styled-mode]) .highcharts-color-9 {
    fill: var(--vaadin-charts-color-9, #e24932);
    stroke: var(--vaadin-charts-color-9, #e24932);
  }

  /* end of vaadin-charts custom properties */

  :where(div#chart[styled-mode]) .highcharts-area {
    fill-opacity: 0.5;
    stroke-width: 0;
  }

  :where(div#chart[styled-mode]) .highcharts-markers {
    stroke-width: 1px;
    stroke: var(--vaadin-charts-background, #fff);
  }

  :where(div#chart[styled-mode])
    .highcharts-a11y-markers-hidden
    .highcharts-point:not(.highcharts-point-hover):not(.highcharts-a11y-marker-visible),
  :where(div#chart[styled-mode]) .highcharts-a11y-marker-hidden {
    opacity: 0;
  }

  :where(div#chart[styled-mode]) .highcharts-point {
    stroke-width: 1px;
  }

  :where(div#chart[styled-mode]) .highcharts-dense-data .highcharts-point {
    stroke-width: 0;
  }

  :where(div#chart[styled-mode]) .highcharts-data-label {
    font-size: 0.9em;
    font-weight: normal;
  }

  :where(div#chart[styled-mode]) .highcharts-data-label-box {
    fill: none;
    stroke-width: 0;
  }

  :where(div#chart[styled-mode]) .highcharts-data-label text,
  :where(div#chart[styled-mode]) text.highcharts-data-label {
    fill: var(--vaadin-charts-data-label, hsla(214, 40%, 16%, 0.94));
  }

  :where(div#chart[styled-mode]) .highcharts-data-label-connector {
    fill: none;
  }

  :where(div#chart[styled-mode]) .highcharts-data-label-hidden {
    pointer-events: none;
  }

  :where(div#chart[styled-mode]) .highcharts-halo {
    fill-opacity: 0.25;
    stroke-width: 0;
  }

  :where(div#chart[styled-mode]) .highcharts-series:not(.highcharts-pie-series) .highcharts-point-select,
  :where(div#chart[styled-mode]) .highcharts-markers .highcharts-point-select {
    fill: var(--vaadin-charts-grid-line, hsla(214, 53%, 23%, 0.16));
    stroke: var(--vaadin-charts-contrast, hsl(214, 35%, 15%));
  }

  :where(div#chart[styled-mode]) .highcharts-column-series rect.highcharts-point {
    stroke: var(--vaadin-charts-background, #fff);
  }

  :where(div#chart[styled-mode]) .highcharts-column-series .highcharts-point {
    transition: fill-opacity 250ms;
  }

  :where(div#chart[styled-mode]) .highcharts-column-series .highcharts-point-hover {
    fill-opacity: 0.75;
    transition: fill-opacity 50ms;
  }

  :where(div#chart[styled-mode]) .highcharts-pie-series .highcharts-point {
    stroke-linejoin: round;
    stroke: var(--vaadin-charts-background, #fff);
  }

  :where(div#chart[styled-mode]) .highcharts-pie-series .highcharts-point-hover {
    fill-opacity: 0.75;
    transition: fill-opacity 50ms;
  }

  :where(div#chart[styled-mode]) .highcharts-funnel-series .highcharts-point {
    stroke-linejoin: round;
    stroke: var(--vaadin-charts-background, #fff);
    stroke-width: 2px;
  }

  :where(div#chart[styled-mode]) .highcharts-funnel-series .highcharts-point-hover {
    fill-opacity: 0.75;
    transition: fill-opacity 50ms;
  }

  :where(div#chart[styled-mode]) .highcharts-funnel-series .highcharts-point-select {
    fill: inherit;
    stroke: inherit;
  }

  :where(div#chart[styled-mode]) .highcharts-pyramid-series .highcharts-point {
    stroke-linejoin: round;
    stroke: var(--vaadin-charts-background, #fff);
    stroke-width: 2px;
  }

  :where(div#chart[styled-mode]) .highcharts-pyramid-series .highcharts-point-hover {
    fill-opacity: 0.75;
    transition: fill-opacity 50ms;
  }

  :where(div#chart[styled-mode]) .highcharts-pyramid-series .highcharts-point-select {
    fill: inherit;
    stroke: inherit;
  }

  :where(div#chart[styled-mode]) .highcharts-solidgauge-series .highcharts-point {
    stroke-width: 0;
  }

  :where(div#chart[styled-mode]) .highcharts-treemap-series .highcharts-point {
    stroke-width: 2px;
    stroke: var(--vaadin-charts-background, #fff);
    transition: stroke 250ms, fill 250ms, fill-opacity 250ms;
  }

  :where(div#chart[styled-mode]) .highcharts-treemap-series .highcharts-point-hover {
    stroke-width: 0px;
    stroke: var(--vaadin-charts-background, #fff);
    fill-opacity: 0.75;
    transition: stroke 25ms, fill 25ms, fill-opacity 25ms;
  }

  :where(div#chart[styled-mode]) .highcharts-treemap-series .highcharts-above-level {
    display: none;
  }

  :where(div#chart[styled-mode]) .highcharts-treemap-series .highcharts-internal-node {
    fill: none;
  }

  :where(div#chart[styled-mode]) .highcharts-treemap-series .highcharts-internal-node-interactive {
    fill-opacity: 0.15;
    cursor: pointer;
  }

  :where(div#chart[styled-mode]) .highcharts-treemap-series .highcharts-internal-node-interactive:hover {
    fill-opacity: 0.75;
  }

  :where(div#chart[styled-mode]) .highcharts-vector-series .highcharts-point {
    fill: none;
    stroke-width: 2px;
  }

  :where(div#chart[styled-mode]) .highcharts-windbarb-series .highcharts-point {
    fill: none;
    stroke-width: 2px;
  }

  :where(div#chart[styled-mode]) .highcharts-lollipop-stem {
    stroke: var(--vaadin-charts-contrast, hsl(214, 35%, 15%));
  }

  :where(div#chart[styled-mode]) .highcharts-focus-border {
    fill: none;
    stroke-width: 2px;
  }

  :where(div#chart[styled-mode]) .highcharts-legend-item-hidden .highcharts-focus-border {
    fill: none !important;
  }

  /* Legend */
  :where(div#chart[styled-mode]) .highcharts-legend-box {
    fill: none;
    stroke-width: 0;
  }

  :where(div#chart[styled-mode]) .highcharts-legend-item > text {
    fill: var(--vaadin-charts-data-label, hsla(214, 40%, 16%, 0.94));
    font-weight: normal;
    font-size: 1em;
    cursor: pointer;
    stroke-width: 0;
  }

  :where(div#chart[styled-mode]) .highcharts-legend-item > .highcharts-point {
    stroke-width: 0px;
  }

  :where(div#chart[styled-mode]) .highcharts-legend-item:hover text {
    fill: var(--vaadin-charts-title-label, hsl(214, 35%, 15%));
  }

  :where(div#chart[styled-mode]) .highcharts-legend-item-hidden * {
    fill: var(--vaadin-charts-disabled-label, hsla(214, 50%, 22%, 0.26)) !important;
    stroke: var(--vaadin-charts-disabled-label, hsla(214, 50%, 22%, 0.26)) !important;
    transition: fill 250ms;
  }

  :where(div#chart[styled-mode]) .highcharts-legend-nav-active {
    fill: var(--vaadin-charts-button-label, hsl(214, 90%, 52%));
    cursor: pointer;
  }

  :where(div#chart[styled-mode]) .highcharts-legend-nav-inactive {
    fill: var(--vaadin-charts-disabled-label, hsla(214, 50%, 22%, 0.26));
  }

  :where(div#chart[styled-mode]) circle.highcharts-legend-nav-active,
  :where(div#chart[styled-mode]) circle.highcharts-legend-nav-inactive {
    /* tracker */
    fill: rgba(192, 192, 192, 0.0001);
  }

  :where(div#chart[styled-mode]) .highcharts-legend-title-box {
    fill: none;
    stroke-width: 0;
  }

  /* Bubble legend */
  :where(div#chart[styled-mode]) .highcharts-bubble-legend-symbol {
    stroke-width: 2;
    fill-opacity: 0.5;
  }

  :where(div#chart[styled-mode]) .highcharts-bubble-legend-connectors {
    stroke-width: 1;
  }

  :where(div#chart[styled-mode]) .highcharts-bubble-legend-labels {
    fill: var(--vaadin-charts-data-label, hsla(214, 40%, 16%, 0.94));
  }

  /* Loading */
  :where(div#chart[styled-mode]) .highcharts-loading {
    position: absolute;
    background-color: var(--vaadin-charts-background, #fff);
    opacity: 0.5;
    text-align: center;
    z-index: 10;
    transition: opacity 250ms;
  }

  :where(div#chart[styled-mode]) .highcharts-loading-hidden {
    height: 0 !important;
    opacity: 0;
    overflow: hidden;
    transition: opacity 250ms, height 250ms step-end;
  }

  :where(div#chart[styled-mode]) .highcharts-loading-inner {
    font-weight: normal;
    position: relative;
    top: 45%;
  }

  /* Plot bands and polar pane backgrounds */
  :where(div#chart[styled-mode]) .highcharts-plot-band,
  :where(div#chart[styled-mode]) .highcharts-pane {
    fill: var(--vaadin-charts-contrast, hsl(214, 35%, 15%));
    fill-opacity: 0.05;
  }

  :where(div#chart[styled-mode]) .highcharts-plot-line {
    fill: none;
    stroke: var(--vaadin-charts-contrast-60pct, hsla(214, 43%, 19%, 0.61));
    stroke-width: 1px;
  }

  :where(div#chart[styled-mode]) .highcharts-plot-line-label {
    fill: var(--vaadin-charts-data-label, hsla(214, 40%, 16%, 0.94));
  }

  /* Highcharts More and modules */
  :where(div#chart[styled-mode]) .highcharts-boxplot-box {
    fill: var(--vaadin-charts-background, #fff);
  }

  :where(div#chart[styled-mode]) .highcharts-boxplot-median {
    stroke-width: 2px;
  }

  :where(div#chart[styled-mode]) .highcharts-bubble-series .highcharts-point {
    fill-opacity: 0.5;
  }

  :where(div#chart[styled-mode]) .highcharts-errorbar-series .highcharts-point {
    stroke: var(--vaadin-charts-contrast, hsl(214, 35%, 15%));
  }

  :where(div#chart[styled-mode]) .highcharts-gauge-series .highcharts-data-label-box {
    stroke: var(--vaadin-charts-grid-line, hsla(214, 53%, 23%, 0.16));
    stroke-width: 1px;
  }

  :where(div#chart[styled-mode]) .highcharts-gauge-series .highcharts-dial {
    fill: var(--vaadin-charts-contrast, hsl(214, 35%, 15%));
    stroke-width: 0;
  }

  :where(div#chart[styled-mode]) .highcharts-polygon-series .highcharts-graph {
    fill: inherit;
    stroke-width: 0;
  }

  :where(div#chart[styled-mode]) .highcharts-waterfall-series .highcharts-graph {
    stroke: var(--vaadin-charts-contrast-60pct, hsla(214, 43%, 19%, 0.61));
    stroke-dasharray: 1, 3;
  }

  :where(div#chart[styled-mode]) .highcharts-sankey-series .highcharts-point {
    stroke-width: 0;
  }

  :where(div#chart[styled-mode]) .highcharts-sankey-series .highcharts-link {
    transition: fill 250ms, fill-opacity 250ms;
    fill-opacity: 0.5;
  }

  :where(div#chart[styled-mode]) .highcharts-sankey-series .highcharts-point-hover.highcharts-link {
    transition: fill 50ms, fill-opacity 50ms;
    fill-opacity: 1;
  }

  :where(div#chart[styled-mode]) .highcharts-venn-series .highcharts-point {
    fill-opacity: 0.75;
    stroke: var(--vaadin-charts-background, #fff);
    transition: stroke 250ms, fill-opacity 250ms;
  }

  :where(div#chart[styled-mode]) .highcharts-venn-series .highcharts-point-hover {
    fill-opacity: 1;
    stroke: var(--vaadin-charts-background, #fff);
  }

  /* Highstock */
  :where(div#chart[styled-mode]) .highcharts-navigator-mask-outside {
    fill-opacity: 0;
  }

  :where(div#chart[styled-mode]) .highcharts-navigator-mask-inside {
    fill: var(--vaadin-charts-color-0, #5ac2f7);
    /* navigator.maskFill option */
    fill-opacity: 0.2;
    cursor: ew-resize;
  }

  :where(div#chart[styled-mode]) .highcharts-navigator-outline {
    stroke: var(--vaadin-charts-grid-line, hsla(214, 53%, 23%, 0.16));
    fill: none;
  }

  :where(div#chart[styled-mode]) .highcharts-navigator-handle {
    stroke: var(--vaadin-charts-contrast-20pct, hsla(214, 53%, 23%, 0.16));
    fill: var(--vaadin-charts-background, #fff);
    cursor: ew-resize;
  }

  :where(div#chart[styled-mode]) .highcharts-navigator-series {
    fill: var(--vaadin-charts-color-1, #1676f3);
    stroke: var(--vaadin-charts-color-1, #1676f3);
  }

  :where(div#chart[styled-mode]) .highcharts-navigator-series .highcharts-graph {
    stroke-width: 1px;
  }

  :where(div#chart[styled-mode]) .highcharts-navigator-series .highcharts-area {
    fill-opacity: 0.05;
  }

  :where(div#chart[styled-mode]) .highcharts-navigator-xaxis .highcharts-axis-line {
    stroke-width: 0;
  }

  :where(div#chart[styled-mode]) .highcharts-navigator-xaxis .highcharts-grid-line {
    stroke-width: 1px;
    stroke: var(--vaadin-charts-grid-line, hsla(214, 53%, 23%, 0.16));
  }

  :where(div#chart[styled-mode]) .highcharts-navigator-xaxis.highcharts-axis-labels {
    fill: var(--vaadin-charts-secondary-label, hsla(214, 42%, 18%, 0.72));
  }

  :where(div#chart[styled-mode]) .highcharts-navigator-yaxis .highcharts-grid-line {
    stroke-width: 0;
  }

  :where(div#chart[styled-mode]) .highcharts-scrollbar-thumb {
    fill: var(--vaadin-charts-contrast-20pct, hsla(214, 53%, 23%, 0.16));
  }

  :where(div#chart[styled-mode]) .highcharts-scrollbar-button {
    fill: var(--vaadin-charts-background, #fff);
  }

  :where(div#chart[styled-mode]) .highcharts-scrollbar-arrow {
    fill: var(--vaadin-charts-data-label, hsla(214, 40%, 16%, 0.94));
  }

  :where(div#chart[styled-mode]) .highcharts-scrollbar-rifles {
    stroke: var(--vaadin-charts-data-label, hsla(214, 40%, 16%, 0.94));
    stroke-width: 1px;
  }

  :where(div#chart[styled-mode]) .highcharts-scrollbar-track {
    fill: var(--vaadin-charts-contrast-5pct, hsla(214, 61%, 25%, 0.05));
  }

  :where(div#chart[styled-mode]) .highcharts-button {
    fill: var(--vaadin-charts-button-background, hsla(214, 61%, 25%, 0.05));
    cursor: default;
    transition: fill 250ms;
  }

  :where(div#chart[styled-mode]) .highcharts-button text {
    fill: var(--vaadin-charts-button-label, hsl(214, 90%, 52%));
    font-weight: 600;
  }

  :where(div#chart[styled-mode]) .highcharts-button-hover {
    transition: fill 0ms;
    fill: var(--vaadin-charts-button-hover-background, hsla(214, 90%, 52%, 0.1));
    stroke-width: 0px;
  }

  :where(div#chart[styled-mode]) .highcharts-button-hover text {
    fill: var(--vaadin-charts-button-label, hsl(214, 90%, 52%));
  }

  :where(div#chart[styled-mode]) .highcharts-button-pressed {
    fill: var(--vaadin-charts-button-active-background, hsl(214, 90%, 52%));
  }

  :where(div#chart[styled-mode]) .highcharts-button-pressed text {
    fill: var(--vaadin-charts-button-active-label, #fff);
  }

  :where(div#chart[styled-mode]) .highcharts-button-disabled text {
    fill: var(--vaadin-charts-button-label, hsl(214, 90%, 52%));
  }

  :where(div#chart[styled-mode]) .highcharts-range-selector-buttons > text {
    fill: var(--vaadin-charts-secondary-label, hsla(214, 42%, 18%, 0.72));
  }

  :where(div#chart[styled-mode]) .highcharts-range-selector-buttons .highcharts-button {
    stroke-width: 0;
  }

  :where(div#chart[styled-mode]) .highcharts-range-label rect {
    fill: none;
  }

  :where(div#chart[styled-mode]) .highcharts-range-label text {
    fill: var(--vaadin-charts-secondary-label, hsla(214, 42%, 18%, 0.72));
  }

  :where(div#chart[styled-mode]) .highcharts-range-input rect {
    fill: var(--vaadin-charts-contrast-10pct, hsla(214, 57%, 24%, 0.1));
    rx: 2;
    ry: 2;
  }

  :where(div#chart[styled-mode]) .highcharts-range-input:hover rect {
    fill: var(--vaadin-charts-contrast-20pct, hsla(214, 53%, 23%, 0.16));
    transition: fill 250ms;
  }

  :where(div#chart[styled-mode]) .highcharts-range-input text {
    fill: var(--vaadin-charts-data-label, hsla(214, 40%, 16%, 0.94));
  }

  :where(div#chart[styled-mode]) input.highcharts-range-selector {
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

  :where(div#chart[styled-mode]) .highcharts-crosshair-label text {
    fill: var(--vaadin-charts-background, #fff);
    font-size: 1.1em;
  }

  :where(div#chart[styled-mode]) .highcharts-crosshair-label .highcharts-label-box {
    fill: inherit;
  }

  :where(div#chart[styled-mode]) .highcharts-candlestick-series .highcharts-point {
    stroke: var(--vaadin-charts-contrast-60pct, hsla(214, 43%, 19%, 0.61));
    stroke-width: 1px;
  }

  :where(div#chart[styled-mode]) .highcharts-candlestick-series .highcharts-point-up {
    fill: var(--vaadin-charts-color-positive, #15c15d);
  }

  :where(div#chart[styled-mode]) .highcharts-candlestick-series .highcharts-point-down {
    fill: var(--vaadin-charts-color-negative, #e24932);
  }

  :where(div#chart[styled-mode]) .highcharts-ohlc-series .highcharts-point-hover {
    stroke-width: 3px;
  }

  :where(div#chart[styled-mode]) .highcharts-flags-series .highcharts-point .highcharts-label-box {
    stroke: var(--vaadin-charts-grid-line, hsla(214, 53%, 23%, 0.16));
    fill: var(--vaadin-charts-background, #fff);
    transition: fill 250ms;
  }

  :where(div#chart[styled-mode]) .highcharts-flags-series .highcharts-point-hover .highcharts-label-box {
    stroke: var(--vaadin-charts-contrast-60pct, hsla(214, 43%, 19%, 0.61));
    fill: var(--vaadin-charts-background, #fff);
  }

  :where(div#chart[styled-mode]) .highcharts-flags-series .highcharts-point text {
    fill: var(--vaadin-charts-data-label, hsla(214, 40%, 16%, 0.94));
    font-size: 0.9em;
    font-weight: normal;
  }

  :where(div#chart[styled-mode]) .highcharts-flags-series .highcharts-point-hover text {
    fill: var(--vaadin-charts-title-label, hsl(214, 35%, 15%));
  }

  /* Highmaps */
  :where(div#chart[styled-mode]) .highcharts-map-series .highcharts-point {
    transition: fill 500ms, fill-opacity 500ms, stroke-width 250ms;
    stroke: var(--vaadin-charts-contrast-20pct, hsla(214, 53%, 23%, 0.16));
  }

  :where(div#chart[styled-mode]) .highcharts-map-series .highcharts-point-hover {
    transition: fill 0ms, fill-opacity 0ms;
    fill-opacity: 0.5;
    stroke-width: 2px;
  }

  :where(div#chart[styled-mode]) .highcharts-mapline-series .highcharts-point {
    fill: none;
  }

  :where(div#chart[styled-mode]) .highcharts-heatmap-series .highcharts-point {
    stroke-width: 0;
  }

  :where(div#chart[styled-mode]) .highcharts-map-navigation {
    font-size: 1.3em;
    font-weight: normal;
    text-align: center;
  }

  :where(div#chart[styled-mode]) .highcharts-coloraxis {
    stroke-width: 0;
  }

  :where(div#chart[styled-mode]) .highcharts-coloraxis-grid .highcharts-grid-line {
    stroke: var(--vaadin-charts-background, #fff);
  }

  :where(div#chart[styled-mode]) .highcharts-coloraxis-marker {
    fill: var(--vaadin-charts-axis-label, hsla(214, 42%, 18%, 0.72));
    stroke-width: 0px;
  }

  :where(div#chart[styled-mode]) .highcharts-null-point {
    fill: var(--vaadin-charts-contrast-5pct, hsla(214, 61%, 25%, 0.05));
    stroke: var(--vaadin-charts-contrast-60pct, hsla(214, 43%, 19%, 0.61));
  }

  /* 3d charts */
  :where(div#chart[styled-mode]) .highcharts-3d-frame {
    fill: transparent;
  }

  /* Exporting module */
  :where(div#chart[styled-mode]) .highcharts-contextbutton {
    fill: #fff;
    /* needed to capture hover */
    stroke: none;
    stroke-linecap: round;
  }

  :where(div#chart[styled-mode]) .highcharts-contextbutton:hover {
    fill: #e6e6e6;
    stroke: #e6e6e6;
  }

  :where(div#chart[styled-mode]) .highcharts-button-symbol {
    stroke: var(--vaadin-charts-secondary-label, hsla(214, 42%, 18%, 0.72));
    stroke-width: 3px;
  }

  :where(div#chart[styled-mode]) .highcharts-menu {
    border: 1px solid #999;
    background: #fff;
    padding: 5px 0;
    box-shadow: 3px 3px 10px #888;
  }

  :where(div#chart[styled-mode]) .highcharts-menu-item {
    padding: 0.5em 1em;
    background: none;
    color: var(--vaadin-charts-button-label, hsl(214, 90%, 52%));
    cursor: pointer;
    transition: background 250ms, color 250ms;
  }

  :where(div#chart[styled-mode]) .highcharts-menu-item:hover {
    background: #335cad;
    color: #fff;
  }

  /* Drilldown module */
  :where(div#chart[styled-mode]) .highcharts-drilldown-point {
    cursor: pointer;
  }

  :where(div#chart[styled-mode]) .highcharts-drilldown-data-label text,
  :where(div#chart[styled-mode]) text.highcharts-drilldown-data-label,
  :where(div#chart[styled-mode]) .highcharts-drilldown-axis-label {
    cursor: pointer;
    fill: var(--vaadin-charts-button-label, hsl(214, 90%, 52%));
    font-weight: normal;
    text-decoration: underline;
  }

  /* No-data module */
  :where(div#chart[styled-mode]) .highcharts-no-data text {
    font-weight: normal;
    font-size: 1rem;
    fill: var(--vaadin-charts-secondary-label, hsla(214, 42%, 18%, 0.72));
  }

  /* Drag-panes module */
  :where(div#chart[styled-mode]) .highcharts-axis-resizer {
    cursor: ns-resize;
    stroke: black;
    stroke-width: 2px;
  }

  /* Bullet type series */
  :where(div#chart[styled-mode]) .highcharts-bullet-target {
    stroke-width: 0;
  }

  /* Lineargauge type series */
  :where(div#chart[styled-mode]) .highcharts-lineargauge-target {
    stroke-width: 1px;
    stroke: var(--vaadin-charts-contrast-60pct, hsla(214, 43%, 19%, 0.61));
  }

  :where(div#chart[styled-mode]) .highcharts-lineargauge-target-line {
    stroke-width: 1px;
    stroke: var(--vaadin-charts-contrast-60pct, hsla(214, 43%, 19%, 0.61));
  }

  /* Annotations module */
  :where(div#chart[styled-mode]) .highcharts-annotation-label-box {
    stroke-width: 1px;
    stroke: var(--vaadin-charts-contrast, hsl(214, 35%, 15%));
    fill: var(--vaadin-charts-contrast, hsl(214, 35%, 15%));
    fill-opacity: 0.75;
  }

  :where(div#chart[styled-mode]) .highcharts-annotation-label text {
    fill: var(--vaadin-charts-disabled-label, hsla(214, 50%, 22%, 0.26));
  }

  /* Gantt */
  :where(div#chart[styled-mode]) .highcharts-treegrid-node-collapsed,
  :where(div#chart[styled-mode]) .highcharts-treegrid-node-expanded {
    cursor: pointer;
  }

  :where(div#chart[styled-mode]) .highcharts-point-connecting-path {
    fill: none;
  }

  :where(div#chart[styled-mode]) .highcharts-grid-axis .highcharts-tick {
    stroke-width: 1px;
  }

  :where(div#chart[styled-mode]) .highcharts-grid-axis .highcharts-axis-line {
    stroke-width: 1px;
  }

  /* RTL styles */
  :host([dir='rtl']) :where(div#chart[styled-mode]) .highcharts-container {
    text-align: right;
  }

  :host([dir='rtl']) :where(div#chart[styled-mode]) input.highcharts-range-selector {
    left: auto;
    right: -9em;
  }

  :host([dir='rtl']) :where(div#chart[styled-mode]) .highcharts-menu {
    box-shadow: -3px 3px 10px #888;
  }

  /* https://github.com/highcharts/highcharts/issues/16282 */
  /* without this __mutationCallback always calls __reflow */
  ul[aria-hidden='false'] {
    margin: 0px;
  }
`;

registerStyles('vaadin-chart', chartBaseTheme, { moduleId: 'vaadin-chart-base-theme' });

export { chartBaseTheme };
