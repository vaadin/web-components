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
import { css } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

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
    padding: var(--vaadin-map-controls-inset, 0.25em);
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
    top: 0.75em;
    font-size: 0.625em;
    color: #000;
    filter: drop-shadow(0 0 1px #fff) drop-shadow(0 0 1px #fff);
    white-space: nowrap;
    overflow: hidden;
  }

  .ol-scale-text {
    position: absolute;
    font-size: 0.625em;
    top: 2em;
    color: #000;
    white-space: nowrap;
    filter: drop-shadow(0 0 1px #fff) drop-shadow(0 0 1px #fff);
  }

  .ol-scale-singlebar {
    height: 0.25em;
    opacity: 0.5;
  }

  .ol-control {
    margin: 0.25em;
  }

  .ol-control button {
    -webkit-appearance: none;
    border: 0;
    margin: 0;
    padding: 0;
    background: #fff;
    font: inherit;
    color: inherit;
    width: 1.5em;
    height: 1.5em;
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
  }

  .ol-zoom-in:empty::before {
    content: var(--vaadin-map-icon-zoom-in, '+');
  }

  .ol-zoom-out:empty::before {
    content: var(--vaadin-map-icon-zoom-out, '\\2013');
  }

  .ol-attribution {
    grid-area: attribution;
    margin-inline-start: auto !important;
    display: flex;
    flex-flow: row-reverse;
  }

  .ol-attribution.ol-uncollapsible {
    margin-inline-end: calc(var(--vaadin-map-controls-inset, 0.25em) * -1);
    margin-block-end: calc(var(--vaadin-map-controls-inset, 0.25em) * -1);
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
    padding: 0.25em 0.5em;
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
    content: var(--vaadin-map-icon-compass, '\\2191');
  }

  .ol-full-screen {
    grid-area: fullscreen;
  }

  .ol-full-screen button:empty::before {
    content: var(--vaadin-map-icon-fullscreen, '\\2922');
  }

  .ol-full-screen .ol-full-screen-true:empty::before {
    content: var(--vaadin-map-icon-close, '\\00D7');
  }

  .ol-overviewmap {
    grid-area: overview-map;
    align-self: end;
    width: max-content;
  }

  .ol-overviewmap button span:empty::before {
    content: var(--vaadin-map-icon-overview-map-collapse, '\\25BE');
  }

  .ol-overviewmap.ol-collapsed button span:empty::before {
    content: var(--vaadin-map-icon-overview-map-expand, '\\25B4');
  }

  .ol-overviewmap-map {
    height: 10em;
    width: 10em;
    border: 1px solid rgba(0, 0, 0, 0.5);
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
    height: 8em;
  }

  .ol-zoomslider button {
    position: relative;
    height: 0.5em;
    display: block;
    border-radius: inherit;
  }

  .ol-zoom-extent {
    grid-area: zoom-extent;
    align-self: end;
  }
`;
