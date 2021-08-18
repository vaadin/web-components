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
import { registerStyles, css } from '@vaadin/vaadin-themable-mixin/register-styles.js';

/* When updating this file do not override vaadin-charts custom properties section */
registerStyles(
  'vaadin-chart',
  css`
    :host([theme~="gradient"]) {
      --vaadin-charts-color-0: #1676F3;
      --vaadin-charts-color-1: #13BBF0;
      --vaadin-charts-color-2: #11EEEE;
      --vaadin-charts-color-3: #0CD9BF;
      --vaadin-charts-color-4: #06BE81;
      --vaadin-charts-color-5: #00A344;
      --vaadin-charts-color-6: #41C639;
      --vaadin-charts-color-7: #8AED2C;
      --vaadin-charts-color-8: #C0E632;
      --vaadin-charts-color-9: #F6DB3A;
      --vaadin-charts-color-positive: var(--vaadin-charts-color-6);
      --vaadin-charts-color-negative: var(--vaadin-charts-color-1);
    }
    
    :host([theme~="monotone"]) {
        --vaadin-charts-color-0: #1676F3;
        --vaadin-charts-color-1: #4795F5;
        --vaadin-charts-color-2: #71B0F7;
        --vaadin-charts-color-3: #A0CEF9;
        --vaadin-charts-color-4: #BCE0FA;
        --vaadin-charts-color-5: #A8D8ED;
        --vaadin-charts-color-6: #7FC3DD;
        --vaadin-charts-color-7: #54ADCC;
        --vaadin-charts-color-8: #2B99BC;
        --vaadin-charts-color-9: #0284AC;
        --vaadin-charts-color-positive: var(--vaadin-charts-color-3);
        --vaadin-charts-color-negative: var(--vaadin-charts-color-9);
      }
  
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
      font-family: -apple-system, BlinkMacSystemFont, 'Roboto', 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
      font-size: 12px;
    }

    .highcharts-root {
      display: block;
    }

    .highcharts-root text {
      stroke-width: 0;
    }

    .highcharts-strong {
      font-weight: 600;
    }

    .highcharts-emphasized {
      font-style: italic;
    }

    .highcharts-anchor {
      cursor: pointer;
    }

    .highcharts-background {
      fill: var(--vaadin-charts-background, #fff);
    }

    .highcharts-plot-border,
    .highcharts-plot-background {
      fill: none;
    }

    .highcharts-label-box {
      fill: none;
    }

    .highcharts-button-box {
      fill: inherit;
    }

    .highcharts-tracker-line {
      stroke-linejoin: round;
      stroke: rgba(192, 192, 192, 0.0001);
      stroke-width: 22;
      fill: none;
    }

    .highcharts-tracker-area {
      fill: rgba(192, 192, 192, 0.0001);
      stroke-width: 0;
    }

    /* Titles */
    .highcharts-title {
      fill: var(--vaadin-charts-title-label, hsl(214, 35%, 15%));
      font-size: 1.5em;
      font-weight: 600;
    }

    .highcharts-subtitle {
      fill: var(--vaadin-charts-secondary-label, hsla(214, 42%, 18%, 0.72));
    }

    /* Axes */
    .highcharts-axis-line {
      fill: none;
      stroke: var(--vaadin-charts-axis-line, hsla(214, 61%, 25%, 0.05));
    }

    .highcharts-yaxis .highcharts-axis-line {
      stroke-width: 0;
    }

    .highcharts-axis-title {
      fill: var(--vaadin-charts-axis-title, hsla(214, 42%, 18%, 0.72));
    }

    .highcharts-axis-labels {
      fill: var(--vaadin-charts-axis-label, hsla(214, 42%, 18%, 0.72));
      cursor: default;
      font-size: 0.9em;
    }

    .highcharts-grid-line {
      fill: none;
      stroke: var(--vaadin-charts-grid-line, hsla(214, 53%, 23%, 0.16));
    }

    .highcharts-xaxis-grid .highcharts-grid-line {
      stroke-width: var(--vaadin-charts-xaxis-line-width, 0px);
    }

    .highcharts-tick {
      stroke: var(--vaadin-charts-grid-line, hsla(214, 53%, 23%, 0.16));
    }

    .highcharts-yaxis .highcharts-tick {
      stroke-width: 0;
    }

    .highcharts-minor-grid-line {
      stroke: var(--vaadin-charts-contrast-5pct, hsla(214, 61%, 25%, 0.05));
    }

    .highcharts-crosshair-thin {
      stroke-width: 1px;
      stroke: var(--vaadin-charts-grid-line, hsla(214, 53%, 23%, 0.16));
    }

    .highcharts-crosshair-category {
      stroke: var(--vaadin-charts-color-0, #5AC2F7);
      stroke-opacity: 0.25;
    }

    /* Credits */
    .highcharts-credits {
      cursor: pointer;
      fill: var(--vaadin-charts-disabled-label, hsla(214, 50%, 22%, 0.26));
      font-size: 0.7em;
      transition: fill 250ms, font-size 250ms;
    }

    .highcharts-credits:hover {
      fill: black;
      font-size: 1em;
    }

    /* Tooltip */
    .highcharts-tooltip {
      cursor: default;
      pointer-events: none;
      white-space: nowrap;
      transition: stroke 150ms;
    }

    .highcharts-tooltip {
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.05)) !important;
    }
    
    .highcharts-tooltip text {
      fill: var(--vaadin-charts-data-label, hsla(214, 40%, 16%, 0.94));
    }

    .highcharts-tooltip .highcharts-header {
      font-size: 0.85em;
      color: var(--vaadin-charts-secondary-label, hsla(214, 42%, 18%, 0.72));
    }

    .highcharts-tooltip-box {
      stroke-width: 1px;
      stroke: var(--vaadin-charts-tooltip-border, inherit);
      fill: var(--vaadin-charts-tooltip-background, #fff);
      fill-opacity: var(--vaadin-charts-tooltip-background-opacity, 1);
    }

    .highcharts-tooltip-box .highcharts-label-box {
      fill: var(--vaadin-charts-tooltip-background, #fff);
      fill-opacity: var(--vaadin-charts-tooltip-background-opacity, 1);
    }
    
    .highcharts-tooltip-header {
      stroke-width: 1px;
      stroke: var(--vaadin-charts-contrast-20pct, hsla(214, 53%, 23%, 0.16));
    }

    div.highcharts-tooltip {
      filter: none;
    }

    .highcharts-selection-marker {
      fill: var(--vaadin-charts-color-0, #5AC2F7);
      fill-opacity: 0.25;
    }

    .highcharts-graph {
      fill: none;
      stroke-width: 2px;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .highcharts-state-hover .highcharts-graph {
      stroke-width: 3;
    }

    .highcharts-point-inactive {
      opacity: 0.2;
      transition: opacity 50ms;
      /* quick in */
    }

    .highcharts-series-inactive {
      opacity: 0.2;
      transition: opacity 50ms;
      /* quick in */
    }

    .highcharts-state-hover path {
      transition: stroke-width 50ms;
      /* quick in */
    }

    .highcharts-state-normal path {
      transition: stroke-width 250ms;
      /* slow out */
    }

    /* Legend hover affects points and series */
    g.highcharts-series,
    .highcharts-point,
    .highcharts-markers,
    .highcharts-data-labels {
      transition: opacity 250ms;
    }

    .highcharts-legend-series-active g.highcharts-series:not(.highcharts-series-hover),
    .highcharts-legend-point-active .highcharts-point:not(.highcharts-point-hover),
    .highcharts-legend-series-active .highcharts-markers:not(.highcharts-series-hover),
    .highcharts-legend-series-active .highcharts-data-labels:not(.highcharts-series-hover) {
      opacity: 0.2;
    }

    /* Series options */
    /* Default colors */
    /* vaadin-charts custom properties */
    .highcharts-color-0 {
      fill: var(--vaadin-charts-color-0, #5AC2F7);
      stroke: var(--vaadin-charts-color-0, #5AC2F7);
    }

    .highcharts-color-1 {
      fill: var(--vaadin-charts-color-1, #1676F3);
      stroke: var(--vaadin-charts-color-1, #1676F3);
    }

    .highcharts-color-2 {
      fill: var(--vaadin-charts-color-2, #FF7D94);
      stroke: var(--vaadin-charts-color-2, #FF7D94);
    }

    .highcharts-color-3 {
      fill: var(--vaadin-charts-color-3, #C5164E);
      stroke: var(--vaadin-charts-color-3, #C5164E);
    }

    .highcharts-color-4 {
      fill: var(--vaadin-charts-color-4, #15C15D);
      stroke: var(--vaadin-charts-color-4, #15C15D);
    }

    .highcharts-color-5 {
      fill: var(--vaadin-charts-color-5, #0E8151);
      stroke: var(--vaadin-charts-color-5, #0E8151);
    }
    
    .highcharts-color-6 {
      fill: var(--vaadin-charts-color-6, #C18ED2);
      stroke: var(--vaadin-charts-color-6, #C18ED2);
    }

    .highcharts-color-7 {
      fill: var(--vaadin-charts-color-7, #9233B3);
      stroke: var(--vaadin-charts-color-7, #9233B3);
    }

    .highcharts-color-8 {
      fill: var(--vaadin-charts-color-8, #FDA253);
      stroke: var(--vaadin-charts-color-8, #FDA253);
    }

    .highcharts-color-9 {
      fill: var(--vaadin-charts-color-9, #E24932);
      stroke: var(--vaadin-charts-color-9, #E24932);
    }

    /* end of vaadin-charts custom properties */
    
    .highcharts-area {
      fill-opacity: 0.5;
      stroke-width: 0;
    }
    
    .highcharts-markers {
      stroke-width: 1px;
      stroke: var(--vaadin-charts-background, #fff);
    }
    
    .highcharts-a11y-markers-hidden .highcharts-point:not(.highcharts-point-hover):not(.highcharts-a11y-marker-visible),
    .highcharts-a11y-marker-hidden {
      opacity: 0;
    }
    
    .highcharts-point {
      stroke-width: 1px;
    }
    
    .highcharts-dense-data .highcharts-point {
      stroke-width: 0;
    }
    
    .highcharts-data-label {
      font-size: 0.9em;
      font-weight: normal;
    }
    
    .highcharts-data-label-box {
      fill: none;
      stroke-width: 0;
    }
    
    .highcharts-data-label text,
    text.highcharts-data-label {
      fill: var(--vaadin-charts-data-label, hsla(214, 40%, 16%, 0.94));
    }
    
    .highcharts-data-label-connector {
      fill: none;
    }
    
    .highcharts-data-label-hidden {
      pointer-events: none;
    }
    
    .highcharts-halo {
      fill-opacity: 0.25;
      stroke-width: 0;
    }
    
    .highcharts-series:not(.highcharts-pie-series) .highcharts-point-select,
    .highcharts-markers .highcharts-point-select {
      fill: var(--vaadin-charts-grid-line, hsla(214, 53%, 23%, 0.16));
      stroke: var(--vaadin-charts-contrast, hsl(214, 35%, 15%));
    }
    
    .highcharts-column-series rect.highcharts-point {
      stroke: var(--vaadin-charts-background, #fff);
    }
    
    .highcharts-column-series .highcharts-point {
      transition: fill-opacity 250ms;
    }
    
    .highcharts-column-series .highcharts-point-hover {
      fill-opacity: 0.75;
      transition: fill-opacity 50ms;
    }
    
    .highcharts-pie-series .highcharts-point {
      stroke-linejoin: round;
      stroke: var(--vaadin-charts-background, #fff);
    }
    
    .highcharts-pie-series .highcharts-point-hover {
      fill-opacity: 0.75;
      transition: fill-opacity 50ms;
    }
    
    .highcharts-funnel-series .highcharts-point {
      stroke-linejoin: round;
      stroke: var(--vaadin-charts-background, #fff);
      stroke-width: 2px;
    }
    
    .highcharts-funnel-series .highcharts-point-hover {
      fill-opacity: 0.75;
      transition: fill-opacity 50ms;
    }
    
    .highcharts-funnel-series .highcharts-point-select {
      fill: inherit;
      stroke: inherit;
    }
    
    .highcharts-pyramid-series .highcharts-point {
      stroke-linejoin: round;
      stroke: var(--vaadin-charts-background, #fff);
      stroke-width: 2px;
    }
    
    .highcharts-pyramid-series .highcharts-point-hover {
      fill-opacity: 0.75;
      transition: fill-opacity 50ms;
    }
    
    .highcharts-pyramid-series .highcharts-point-select {
      fill: inherit;
      stroke: inherit;
    }
    
    .highcharts-solidgauge-series .highcharts-point {
      stroke-width: 0;
    }
    
    .highcharts-treemap-series .highcharts-point {
      stroke-width: 2px;
      stroke: var(--vaadin-charts-background, #fff);
      transition: stroke 250ms, fill 250ms, fill-opacity 250ms;
    }
    
    .highcharts-treemap-series .highcharts-point-hover {
      stroke-width: 0px;
      stroke: var(--vaadin-charts-background, #fff);
      fill-opacity: 0.75;
      transition: stroke 25ms, fill 25ms, fill-opacity 25ms;
    }
    
    .highcharts-treemap-series .highcharts-above-level {
      display: none;
    }
    
    .highcharts-treemap-series .highcharts-internal-node {
      fill: none;
    }
    
    .highcharts-treemap-series .highcharts-internal-node-interactive {
      fill-opacity: 0.15;
      cursor: pointer;
    }
    
    .highcharts-treemap-series .highcharts-internal-node-interactive:hover {
      fill-opacity: 0.75;
    }
    
    .highcharts-vector-series .highcharts-point {
      fill: none;
      stroke-width: 2px;
    }
    
    .highcharts-windbarb-series .highcharts-point {
      fill: none;
      stroke-width: 2px;
    }
    
    .highcharts-lollipop-stem {
      stroke: var(--vaadin-charts-contrast, hsl(214, 35%, 15%));
    }
    
    .highcharts-focus-border {
      fill: none;
      stroke-width: 2px;
    }
    
    .highcharts-legend-item-hidden .highcharts-focus-border {
      fill: none !important;
    }
    
    /* Legend */
    .highcharts-legend-box {
      fill: none;
      stroke-width: 0;
    }
    
    .highcharts-legend-item > text {
      fill: var(--vaadin-charts-data-label, hsla(214, 40%, 16%, 0.94));
      font-weight: normal;
      font-size: 1em;
      cursor: pointer;
      stroke-width: 0;
    }
    
    .highcharts-legend-item > .highcharts-point {
      stroke-width: 0px;
    }
    
    .highcharts-legend-item:hover text {
      fill: var(--vaadin-charts-title-label, hsl(214, 35%, 15%));
    }
    
    .highcharts-legend-item-hidden * {
      fill: var(--vaadin-charts-disabled-label, hsla(214, 50%, 22%, 0.26)) !important;
      stroke: var(--vaadin-charts-disabled-label, hsla(214, 50%, 22%, 0.26)) !important;
      transition: fill 250ms;
    }
    
    .highcharts-legend-nav-active {
      fill: var(--vaadin-charts-button-label, hsl(214, 90%, 52%));
      cursor: pointer;
    }
    
    .highcharts-legend-nav-inactive {
      fill: var(--vaadin-charts-disabled-label, hsla(214, 50%, 22%, 0.26));
    }
    
    circle.highcharts-legend-nav-active,
    circle.highcharts-legend-nav-inactive {
      /* tracker */
      fill: rgba(192, 192, 192, 0.0001);
    }
    
    .highcharts-legend-title-box {
      fill: none;
      stroke-width: 0;
    }
    
    /* Bubble legend */
    .highcharts-bubble-legend-symbol {
      stroke-width: 2;
      fill-opacity: 0.5;
    }
    
    .highcharts-bubble-legend-connectors {
      stroke-width: 1;
    }
    
    .highcharts-bubble-legend-labels {
      fill: var(--vaadin-charts-data-label, hsla(214, 40%, 16%, 0.94));
    }
    
    /* Loading */
    .highcharts-loading {
      position: absolute;
      background-color: var(--vaadin-charts-background, #fff);
      opacity: 0.5;
      text-align: center;
      z-index: 10;
      transition: opacity 250ms;
    }
    
    .highcharts-loading-hidden {
      height: 0 !important;
      opacity: 0;
      overflow: hidden;
      transition: opacity 250ms, height 250ms step-end;
    }
    
    .highcharts-loading-inner {
      font-weight: normal;
      position: relative;
      top: 45%;
    }
    
    /* Plot bands and polar pane backgrounds */
    .highcharts-plot-band,
    .highcharts-pane {
      fill: var(--vaadin-charts-contrast, hsl(214, 35%, 15%));
      fill-opacity: 0.05;
    }
    
    .highcharts-plot-line {
      fill: none;
      stroke: var(--vaadin-charts-contrast-60pct, hsla(214, 43%, 19%, 0.61));
      stroke-width: 1px;
    }
    
    .highcharts-plot-line-label {
      fill: var(--vaadin-charts-data-label, hsla(214, 40%, 16%, 0.94));
    }
    
      /* Highcharts More and modules */
    .highcharts-boxplot-box {
      fill: var(--vaadin-charts-background, #fff);
    }
    
    .highcharts-boxplot-median {
      stroke-width: 2px;
    }
    
    .highcharts-bubble-series .highcharts-point {
      fill-opacity: 0.5;
    }
    
    .highcharts-errorbar-series .highcharts-point {
      stroke: var(--vaadin-charts-contrast, hsl(214, 35%, 15%));
    }
    
    .highcharts-gauge-series .highcharts-data-label-box {
      stroke: var(--vaadin-charts-grid-line, hsla(214, 53%, 23%, 0.16));
      stroke-width: 1px;
    }
    
    .highcharts-gauge-series .highcharts-dial {
      fill: var(--vaadin-charts-contrast, hsl(214, 35%, 15%));
      stroke-width: 0;
    }
    
    .highcharts-polygon-series .highcharts-graph {
      fill: inherit;
      stroke-width: 0;
    }
    
    .highcharts-waterfall-series .highcharts-graph {
      stroke: var(--vaadin-charts-contrast-60pct, hsla(214, 43%, 19%, 0.61));
      stroke-dasharray: 1, 3;
    }
    
    .highcharts-sankey-series .highcharts-point {
      stroke-width: 0;
    }
    
    .highcharts-sankey-series .highcharts-link {
      transition: fill 250ms, fill-opacity 250ms;
      fill-opacity: 0.5;
    }
    
    .highcharts-sankey-series .highcharts-point-hover.highcharts-link {
      transition: fill 50ms, fill-opacity 50ms;
      fill-opacity: 1;
    }
    
    .highcharts-venn-series .highcharts-point {
      fill-opacity: 0.75;
      stroke: var(--vaadin-charts-background, #fff);
      transition: stroke 250ms, fill-opacity 250ms;
    }
    
    .highcharts-venn-series .highcharts-point-hover {
      fill-opacity: 1;
      stroke: var(--vaadin-charts-background, #fff);
    }
    
    /* Highstock */
    .highcharts-navigator-mask-outside {
      fill-opacity: 0;
    }
    
    .highcharts-navigator-mask-inside {
      fill: var(--vaadin-charts-color-0, #5AC2F7);
      /* navigator.maskFill option */
      fill-opacity: 0.2;
      cursor: ew-resize;
    }
    
    .highcharts-navigator-outline {
      stroke: var(--vaadin-charts-grid-line, hsla(214, 53%, 23%, 0.16));
      fill: none;
    }
    
    .highcharts-navigator-handle {
      stroke: var(--vaadin-charts-contrast-20pct, hsla(214, 53%, 23%, 0.16));
      fill: var(--vaadin-charts-background, #fff);
      cursor: ew-resize;
    }
    
    .highcharts-navigator-series {
      fill: var(--vaadin-charts-color-1, #1676F3);
      stroke: var(--vaadin-charts-color-1, #1676F3);
    }
    
    .highcharts-navigator-series .highcharts-graph {
      stroke-width: 1px;
    }
    
    .highcharts-navigator-series .highcharts-area {
      fill-opacity: 0.05;
    }
    
    .highcharts-navigator-xaxis .highcharts-axis-line {
      stroke-width: 0;
    }
    
    .highcharts-navigator-xaxis .highcharts-grid-line {
      stroke-width: 1px;
      stroke: var(--vaadin-charts-grid-line, hsla(214, 53%, 23%, 0.16));
    }
    
    .highcharts-navigator-xaxis.highcharts-axis-labels {
      fill: var(--vaadin-charts-secondary-label, hsla(214, 42%, 18%, 0.72));
    }
    
    .highcharts-navigator-yaxis .highcharts-grid-line {
      stroke-width: 0;
    }
    
    .highcharts-scrollbar-thumb {
      fill: var(--vaadin-charts-contrast-20pct, hsla(214, 53%, 23%, 0.16));
    }
    
    .highcharts-scrollbar-button {
      fill: var(--vaadin-charts-background, #fff);
    }
    
    .highcharts-scrollbar-arrow {
      fill: var(--vaadin-charts-data-label, hsla(214, 40%, 16%, 0.94));
    }
    
    .highcharts-scrollbar-rifles {
      stroke: var(--vaadin-charts-data-label, hsla(214, 40%, 16%, 0.94));
      stroke-width: 1px;
    }
    
    .highcharts-scrollbar-track {
      fill: var(--vaadin-charts-contrast-5pct, hsla(214, 61%, 25%, 0.05));
    }
    
    .highcharts-button {
      fill: var(--vaadin-charts-button-background, hsla(214, 61%, 25%, 0.05));
      cursor: default;
      transition: fill 250ms;
    }
    
    .highcharts-button text {
      fill: var(--vaadin-charts-button-label, hsl(214, 90%, 52%));
      font-weight: 600;
    }
    
    .highcharts-button-hover {
      transition: fill 0ms;
      fill: var(--vaadin-charts-button-hover-background, hsla(214, 90%, 52%, 0.1));
      stroke-width: 0px;
    }
    
    .highcharts-button-hover text {
      fill: var(--vaadin-charts-button-label, hsl(214, 90%, 52%));
    }
    
    .highcharts-button-pressed {
      fill: var(--vaadin-charts-button-active-background, hsl(214, 90%, 52%));
    }
    
    .highcharts-button-pressed text {
      fill: var(--vaadin-charts-button-active-label, #fff);
    }
    
    .highcharts-button-disabled text {
      fill: var(--vaadin-charts-button-label, hsl(214, 90%, 52%));
    }
    
    .highcharts-range-selector-buttons > text {
      fill: var(--vaadin-charts-secondary-label, hsla(214, 42%, 18%, 0.72));
    }
    
    .highcharts-range-selector-buttons .highcharts-button {
      stroke-width: 0;
    }
    
    .highcharts-range-label rect {
      fill: none;
    }
    
    .highcharts-range-label text {
      fill: var(--vaadin-charts-secondary-label, hsla(214, 42%, 18%, 0.72));
    }
    
    .highcharts-range-input rect {
      fill: var(--vaadin-charts-contrast-10pct, hsla(214, 57%, 24%, 0.1));
      rx: 2;
      ry: 2;
    }
    
    .highcharts-range-input:hover rect {
      fill: var(--vaadin-charts-contrast-20pct, hsla(214, 53%, 23%, 0.16));
      transition: fill 250ms;
    }
    
    .highcharts-range-input text {
      fill: var(--vaadin-charts-data-label, hsla(214, 40%, 16%, 0.94));
    }
    
    input.highcharts-range-selector {
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
    
    .highcharts-crosshair-label text {
      fill: var(--vaadin-charts-background, #fff);
      font-size: 1.1em;
    }
    
    .highcharts-crosshair-label .highcharts-label-box {
      fill: inherit;
    }
    
    .highcharts-candlestick-series .highcharts-point {
      stroke: var(--vaadin-charts-contrast-60pct, hsla(214, 43%, 19%, 0.61));
      stroke-width: 1px;
    }
    
    .highcharts-candlestick-series .highcharts-point-up {
      fill: var(--vaadin-charts-color-positive, #15C15D);
    }
    
    .highcharts-candlestick-series .highcharts-point-down {
      fill: var(--vaadin-charts-color-negative, #E24932);
    }
    
    .highcharts-ohlc-series .highcharts-point-hover {
      stroke-width: 3px;
    }
    
    .highcharts-flags-series .highcharts-point .highcharts-label-box {
      stroke: var(--vaadin-charts-grid-line, hsla(214, 53%, 23%, 0.16));
      fill: var(--vaadin-charts-background, #fff);
      transition: fill 250ms;
    }
    
    .highcharts-flags-series .highcharts-point-hover .highcharts-label-box {
      stroke: var(--vaadin-charts-contrast-60pct, hsla(214, 43%, 19%, 0.61));
      fill: var(--vaadin-charts-background, #fff);
    }
    
    .highcharts-flags-series .highcharts-point text {
      fill: var(--vaadin-charts-data-label, hsla(214, 40%, 16%, 0.94));
      font-size: 0.9em;
      font-weight: normal;
    }
    
    .highcharts-flags-series .highcharts-point-hover text {
      fill: var(--vaadin-charts-title-label, hsl(214, 35%, 15%));
    }
    
    /* Highmaps */
    .highcharts-map-series .highcharts-point {
      transition: fill 500ms, fill-opacity 500ms, stroke-width 250ms;
      stroke: var(--vaadin-charts-contrast-20pct, hsla(214, 53%, 23%, 0.16));
    }
    
    .highcharts-map-series .highcharts-point-hover {
      transition: fill 0ms, fill-opacity 0ms;
      fill-opacity: 0.5;
      stroke-width: 2px;
    }
    
    .highcharts-mapline-series .highcharts-point {
      fill: none;
    }
    
    .highcharts-heatmap-series .highcharts-point {
      stroke-width: 0;
    }
    
    .highcharts-map-navigation {
      font-size: 1.3em;
      font-weight: normal;
      text-align: center;
    }
    
    .highcharts-coloraxis {
      stroke-width: 0;
    }
    
    .highcharts-coloraxis-grid .highcharts-grid-line {
      stroke: var(--vaadin-charts-background, #fff);
    }
    
    .highcharts-coloraxis-marker {
      fill: var(--vaadin-charts-axis-label, hsla(214, 42%, 18%, 0.72));
      stroke-width: 0px;
    }
    
    .highcharts-null-point {
      fill: var(--vaadin-charts-contrast-5pct, hsla(214, 61%, 25%, 0.05));
      stroke: var(--vaadin-charts-contrast-60pct, hsla(214, 43%, 19%, 0.61));
    }
    
    /* 3d charts */
    .highcharts-3d-frame {
      fill: transparent;
    }
    
    /* Exporting module */
    .highcharts-contextbutton {
      fill: #fff;
      /* needed to capture hover */
      stroke: none;
      stroke-linecap: round;
    }
    
    .highcharts-contextbutton:hover {
      fill: #e6e6e6;
      stroke: #e6e6e6;
    }
    
    .highcharts-button-symbol {
      stroke: var(--vaadin-charts-secondary-label, hsla(214, 42%, 18%, 0.72));
      stroke-width: 3px;
    }
    
    .highcharts-menu {
      border: 1px solid #999;
      background: #fff;
      padding: 5px 0;
      box-shadow: 3px 3px 10px #888;
    }
    
    .highcharts-menu-item {
      padding: 0.5em 1em;
      background: none;
      color: var(--vaadin-charts-button-label, hsl(214, 90%, 52%));
      cursor: pointer;
      transition: background 250ms, color 250ms;
    }
    
    .highcharts-menu-item:hover {
      background: #335cad;
      color: #fff;
    }
    
    /* Drilldown module */
    .highcharts-drilldown-point {
      cursor: pointer;
    }
    
    .highcharts-drilldown-data-label text,
    text.highcharts-drilldown-data-label,
    .highcharts-drilldown-axis-label {
      cursor: pointer;
      fill: var(--vaadin-charts-button-label, hsl(214, 90%, 52%));
      font-weight: normal;
      text-decoration: underline;
    }
    
    /* No-data module */
    .highcharts-no-data text {
      font-weight: normal;
      font-size: 1rem;
      fill: var(--vaadin-charts-secondary-label, hsla(214, 42%, 18%, 0.72));
    }
    
    /* Drag-panes module */
    .highcharts-axis-resizer {
      cursor: ns-resize;
      stroke: black;
      stroke-width: 2px;
    }
    
    /* Bullet type series */
    .highcharts-bullet-target {
      stroke-width: 0;
    }
    
    /* Lineargauge type series */
    .highcharts-lineargauge-target {
      stroke-width: 1px;
      stroke: var(--vaadin-charts-contrast-60pct, hsla(214, 43%, 19%, 0.61));
    }
    
    .highcharts-lineargauge-target-line {
      stroke-width: 1px;
      stroke: var(--vaadin-charts-contrast-60pct, hsla(214, 43%, 19%, 0.61));
    }
    
    /* Annotations module */
    .highcharts-annotation-label-box {
      stroke-width: 1px;
      stroke: var(--vaadin-charts-contrast, hsl(214, 35%, 15%));
      fill: var(--vaadin-charts-contrast, hsl(214, 35%, 15%));
      fill-opacity: 0.75;
    }
    
    .highcharts-annotation-label text {
      fill: var(--vaadin-charts-disabled-label, hsla(214, 50%, 22%, 0.26));
    }
    
    /* Gantt */
    .highcharts-treegrid-node-collapsed,
    .highcharts-treegrid-node-expanded {
      cursor: pointer;
    }
    
    .highcharts-point-connecting-path {
      fill: none;
    }
    
    .highcharts-grid-axis .highcharts-tick {
      stroke-width: 1px;
    }
    
    .highcharts-grid-axis .highcharts-axis-line {
      stroke-width: 1px;
    }
    
    /* RTL styles */
    :host([dir='rtl']) .highcharts-container {
      text-align: right;
    }
    
    :host([dir='rtl']) input.highcharts-range-selector {
      left: auto;
      right: -9em;
    }
    
    :host([dir='rtl']) .highcharts-menu {
      box-shadow: -3px 3px 10px #888;
    }
  `,
  { moduleId: 'vaadin-chart-default-theme' }
);
