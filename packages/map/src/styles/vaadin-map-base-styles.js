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
import '@vaadin/component-base/src/style-props.js';
import { css } from 'lit';

export const mapStyles = css`
  :host {
    display: block;
    height: 400px;
    flex: 1 1 auto;
    align-self: stretch;
    overflow: hidden;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host([focus-ring]) {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
  }

  :host(:not([theme~='no-border'])) {
    border-radius: var(--vaadin-map-border-radius, var(--vaadin-radius-m));
    position: relative;
  }

  :host(:not([theme~='no-border']))::before {
    content: '';
    position: absolute;
    inset: 0;
    border: 1px solid var(--vaadin-map-border-color, var(--vaadin-border-color));
    border-radius: inherit;
    z-index: 1;
    pointer-events: none;
  }

  #map {
    width: 100%;
    height: 100%;
    outline: none;
  }

  #map,
  .ol-viewport,
  .ol-layers {
    border-radius: inherit;
    overflow: hidden;
  }

  #map:fullscreen {
    border-radius: 0;
  }

  #map:-webkit-full-screen {
    border-radius: 0;
  }

  /* Functional styles, copied from 'ol/ol.css' */

  .ol-box {
    box-sizing: border-box;
    border-radius: 2px;
    border: 1px solid rgba(0, 0, 0, 0.5);
    background-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.5);
  }

  .ol-unsupported {
    display: none;
  }

  .ol-viewport,
  .ol-unselectable {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .ol-viewport canvas {
    all: unset;
  }

  .ol-selectable {
    -webkit-touch-callout: default;
    -webkit-user-select: text;
    user-select: text;
  }

  .ol-grabbing {
    cursor: grabbing;
  }

  .ol-grab {
    cursor: move;
    cursor: grab;
  }

  /* Control positioning and styling */

  .ol-overlaycontainer-stopevent {
    /* stylelint-disable declaration-block-no-redundant-longhand-properties */
    display: grid;
    grid-template-columns: min-content 1fr min-content;
    grid-template-rows: min-content 1fr min-content min-content min-content min-content;
    padding: var(--vaadin-map-controls-inset, 4px);
    box-sizing: border-box;
    grid-template-areas:
      'scale mouse-position fullscreen'
      'overview-map . zoom-extent'
      'overview-map . compass'
      'overview-map . zoom-slider'
      'overview-map . zoom'
      'overview-map attribution attribution';
  }

  .ol-mouse-position {
    grid-area: mouse-position;
    align-self: start;
    text-align: center;
    font-size: 0.625em;
    color: #000;
    filter: drop-shadow(0 0 1px #fff) drop-shadow(0 0 1px #fff);
  }

  .ol-scale-line,
  .ol-scale-bar {
    grid-area: scale;
    position: relative;
    pointer-events: none !important;
    color: #000;
  }

  .ol-scale-line-inner {
    border: 1px solid rgba(0, 0, 0, 0.5);
    border-top: none;
    font-size: 0.625em;
    text-align: center;
    will-change: contents, width, filter;
    transition: all 0.25s;
    filter: drop-shadow(0 0 1px #fff) drop-shadow(0 0 1px #fff);
  }

  .ol-scale-bar-inner {
    border: 1px solid rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.5);
    overflow: hidden;
  }

  .ol-scale-step-marker {
    display: none;
  }

  .ol-scale-step-text {
    position: absolute;
    top: 12px;
    font-size: 0.625em;
    color: #000;
    filter: drop-shadow(0 0 1px #fff) drop-shadow(0 0 1px #fff);
    white-space: nowrap;
    overflow: hidden;
  }

  .ol-scale-text {
    position: absolute;
    font-size: 0.625em;
    top: 32px;
    color: #000;
    white-space: nowrap;
    filter: drop-shadow(0 0 1px #fff) drop-shadow(0 0 1px #fff);
  }

  .ol-scale-singlebar {
    height: 4px;
    opacity: 0.5;
  }

  .ol-control {
    margin: 4px;
    border-radius: var(--vaadin-button-border-radius, var(--vaadin-radius-m));
  }

  .ol-control button {
    appearance: none;
    display: block;
    border: 0;
    margin: 0;
    padding: 0;
    color: inherit;
    font: inherit;
    width: var(--vaadin-map-control-size, 24px);
    height: var(--vaadin-map-control-size, 24px);
    border-radius: inherit;
  }

  .ol-control button::-moz-focus-inner {
    border: none;
    padding: 0;
  }

  .ol-compass {
    grid-area: compass;
    display: block;
    will-change: transform;
  }

  .ol-zoom {
    grid-area: zoom;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .ol-attribution {
    grid-area: attribution;
    margin-inline-start: auto !important;
    display: flex;
    flex-flow: row-reverse;
  }

  .ol-attribution.ol-uncollapsible {
    margin-inline-end: calc(var(--vaadin-map-controls-inset, 4px) * -1);
    margin-block-end: calc(var(--vaadin-map-controls-inset, 4px) * -1);
    border-radius: var(--vaadin-radius) 0 0 0;
  }

  .ol-attribution button span:empty::before {
    content: var(--vaadin-map-icon-attribution-collapse, '\\25B8');
  }

  .ol-attribution.ol-collapsed button span:empty::before {
    content: var(--vaadin-map-icon-attribution-expand, '\\2139');
  }

  .ol-attribution ul {
    display: flex;
    align-items: center;
    gap: 1em;
    list-style: none;
    margin: 0;
    color: var(--vaadin-map-attribution-color, var(--vaadin-color-subtle));
    padding: var(--vaadin-padding-container);
    font-size: 0.8em;
  }

  .ol-attribution.ol-collapsed ul {
    display: none;
  }

  .ol-attribution.ol-uncollapsible button {
    display: none;
  }

  .ol-rotate {
    grid-area: compass;
  }

  .ol-compass:empty::before {
    mask-image: var(--_vaadin-icon-arrow-up);
  }

  .ol-full-screen {
    grid-area: fullscreen;
  }

  .ol-full-screen button:empty::before {
    mask-image: var(--_vaadin-icon-fullscreen);
  }

  .ol-full-screen .ol-full-screen-true:empty::before {
    mask-image: var(--_vaadin-icon-cross);
  }

  .ol-overviewmap {
    grid-area: overview-map;
    align-self: end;
    width: max-content;
  }

  .ol-overviewmap-map {
    height: 160px;
    width: 160px;
    margin: 4px;
    border: 0;
    border-radius: var(--vaadin-button-border-radius, var(--vaadin-radius));
  }

  .ol-overviewmap:not(.ol-uncollapsible) .ol-overviewmap-map {
    margin-bottom: 0;
  }

  .ol-overviewmap.ol-collapsed .ol-overviewmap-map,
  .ol-overviewmap.ol-uncollapsible button {
    display: none;
  }

  .ol-overviewmap-box {
    border: 1px dashed rgba(0, 0, 0, 0.5);
    filter: drop-shadow(0 0 1px #fff) drop-shadow(0 0 1px #fff);
    will-change: filter;
    cursor: move;
  }

  .ol-zoomslider {
    grid-area: zoom-slider;
    height: 128px;
  }

  .ol-zoomslider button {
    position: relative;
    height: 8px;
    display: block;
    border-radius: inherit;
  }

  .ol-zoom-extent {
    grid-area: zoom-extent;
    align-self: end;
  }

  /* icons & controls styles */
  .ol-overviewmap button span:empty {
    display: contents;
  }

  .ol-overviewmap button span:empty::before {
    mask-image: var(--vaadin-map-icon-overview-map-collapse, var(--_vaadin-icon-chevron-down));
  }

  .ol-overviewmap.ol-collapsed button {
    rotate: 180deg;
  }

  .ol-overviewmap button span:empty::before,
  .ol-zoom-in:empty::before,
  .ol-zoom-out:empty::before,
  .ol-compass:empty::before,
  .ol-full-screen button:empty::before,
  .ol-full-screen-true:empty::before {
    content: '';
    display: block;
    background: currentColor;
    width: var(--vaadin-icon-size, 1lh);
    height: var(--vaadin-icon-size, 1lh);
    flex: none;
  }

  .ol-zoom-in:empty::before {
    mask-image: var(--vaadin-map-icon-zoom-in, var(--_vaadin-icon-plus));
  }

  .ol-zoom-out:empty::before {
    mask-image: var(--vaadin-map-icon-zoom-out, var(--_vaadin-icon-minus));
  }

  .ol-zoom button.ol-zoom-in {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .ol-zoom button.ol-zoom-out {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  .ol-control button,
  .ol-attribution:not(.ol-uncollapsible) ul {
    transition: 0.15s opacity;
    background: var(--vaadin-map-control-background, var(--vaadin-background-color));
    color: var(--vaadin-map-control-color, var(--vaadin-subtle));
    opacity: 0.65;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ol-control:not(.ol-uncollapsible):hover {
    box-shadow: var(--vaadin-map-control-shadow, 0 3px 8px -1px rgba(0, 0, 0, 0.2));
  }

  .ol-attribution a {
    color: inherit;
    cursor: pointer;
  }

  .ol-control:hover button,
  .ol-control button:focus,
  .ol-attribution:hover ul {
    opacity: 1;
  }

  .ol-control button:hover {
    color: var(--vaadin-map-control-color-hover, var(--vaadin-color));
  }

  .ol-control button:focus-visible {
    outline: var(--vaadin-focus-ring-width) solid var(--vaadin-focus-ring-color);
  }

  .ol-overviewmap:not(.ol-collapsed),
  .ol-overviewmap:not(.ol-collapsed):hover {
    background: var(--vaadin-map-control-background, var(--vaadin-background-color));
    box-shadow: var(--vaadin-map-control-shadow, 0 3px 8px -1px rgba(0, 0, 0, 0.2));
    transition: 0.15s box-shadow;
  }
`;
