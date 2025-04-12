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
    overflow: hidden;
    height: 400px;
    flex: 1 1 auto;
    align-self: stretch;
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
    overflow: hidden;
    border-radius: inherit;
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
    border: 1px solid rgba(0, 0, 0, 0.5);
    border-radius: 2px;
    background-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.5);
  }

  .ol-unsupported {
    display: none;
  }

  .ol-viewport,
  .ol-unselectable {
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
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
    box-sizing: border-box;
    padding: var(--vaadin-map-controls-inset, 0.25em);
    grid-template-areas:
      'scale mouse-position fullscreen'
      'overview-map . zoom-extent'
      'overview-map . compass'
      'overview-map . zoom-slider'
      'overview-map . zoom'
      'overview-map attribution attribution';
    grid-template-columns: min-content 1fr min-content;
    grid-template-rows: min-content 1fr min-content min-content min-content min-content;
  }

  .ol-mouse-position {
    align-self: start;
    color: #000;
    filter: drop-shadow(0 0 1px #fff) drop-shadow(0 0 1px #fff);
    font-size: 0.625em;
    grid-area: mouse-position;
    text-align: center;
  }

  .ol-scale-line,
  .ol-scale-bar {
    position: relative;
    color: #000;
    grid-area: scale;
    pointer-events: none !important;
  }

  .ol-scale-line-inner {
    border: 1px solid rgba(0, 0, 0, 0.5);
    border-top: none;
    filter: drop-shadow(0 0 1px #fff) drop-shadow(0 0 1px #fff);
    font-size: 0.625em;
    text-align: center;
    transition: all 0.25s;
    will-change: contents, width, filter;
  }

  .ol-scale-bar-inner {
    overflow: hidden;
    border: 1px solid rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.5);
  }

  .ol-scale-step-marker {
    display: none;
  }

  .ol-scale-step-text {
    position: absolute;
    top: 0.75em;
    overflow: hidden;
    color: #000;
    filter: drop-shadow(0 0 1px #fff) drop-shadow(0 0 1px #fff);
    font-size: 0.625em;
    white-space: nowrap;
  }

  .ol-scale-text {
    position: absolute;
    top: 2em;
    color: #000;
    filter: drop-shadow(0 0 1px #fff) drop-shadow(0 0 1px #fff);
    font-size: 0.625em;
    white-space: nowrap;
  }

  .ol-scale-singlebar {
    height: 0.25em;
    opacity: 0.5;
  }

  .ol-control {
    margin: 0.25em;
  }

  .ol-control button {
    width: 1.5em;
    height: 1.5em;
    padding: 0;
    border: 0;
    margin: 0;
    -webkit-appearance: none;
    background: #fff;
    color: inherit;
    font: inherit;
  }

  .ol-control button::-moz-focus-inner {
    padding: 0;
    border: none;
  }

  .ol-compass {
    display: block;
    grid-area: compass;
    will-change: transform;
  }

  .ol-zoom {
    display: flex;
    flex-direction: column;
    grid-area: zoom;
  }

  .ol-zoom-in:empty::before {
    content: var(--vaadin-map-icon-zoom-in, '+');
  }

  .ol-zoom-out:empty::before {
    content: var(--vaadin-map-icon-zoom-out, '\\\\2013');
  }

  .ol-attribution {
    display: flex;
    flex-flow: row-reverse;
    grid-area: attribution;
    margin-inline-start: auto !important;
  }

  .ol-attribution.ol-uncollapsible {
    margin-block-end: calc(var(--vaadin-map-controls-inset, 0.25em) * -1);
    margin-inline-end: calc(var(--vaadin-map-controls-inset, 0.25em) * -1);
  }

  .ol-attribution button span:empty::before {
    content: var(--vaadin-map-icon-attribution-collapse, '\\\\25B8');
  }

  .ol-attribution.ol-collapsed button span:empty::before {
    content: var(--vaadin-map-icon-attribution-expand, '\\\\2139');
  }

  .ol-attribution ul {
    display: flex;
    align-items: center;
    padding: 0.25em 0.5em;
    margin: 0;
    font-size: 0.8em;
    gap: 1em;
    list-style: none;
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
    content: var(--vaadin-map-icon-compass, '\\\\2191');
  }

  .ol-full-screen {
    grid-area: fullscreen;
  }

  .ol-full-screen button:empty::before {
    content: var(--vaadin-map-icon-fullscreen, '\\\\2922');
  }

  .ol-full-screen .ol-full-screen-true:empty::before {
    content: var(--vaadin-map-icon-close, '\\\\00D7');
  }

  .ol-overviewmap {
    width: max-content;
    align-self: end;
    grid-area: overview-map;
  }

  .ol-overviewmap button span:empty::before {
    content: var(--vaadin-map-icon-overview-map-collapse, '\\\\25BE');
  }

  .ol-overviewmap.ol-collapsed button span:empty::before {
    content: var(--vaadin-map-icon-overview-map-expand, '\\\\25B4');
  }

  .ol-overviewmap-map {
    width: 10em;
    height: 10em;
    border: 1px solid rgba(0, 0, 0, 0.5);
  }

  .ol-overviewmap.ol-collapsed .ol-overviewmap-map,
  .ol-overviewmap.ol-uncollapsible button {
    display: none;
  }

  .ol-overviewmap-box {
    border: 1px dashed rgba(0, 0, 0, 0.5);
    cursor: move;
    filter: drop-shadow(0 0 1px #fff) drop-shadow(0 0 1px #fff);
    will-change: filter;
  }

  .ol-zoomslider {
    height: 8em;
    grid-area: zoom-slider;
  }

  .ol-zoomslider button {
    position: relative;
    display: block;
    height: 0.5em;
    border-radius: inherit;
  }

  .ol-zoom-extent {
    align-self: end;
    grid-area: zoom-extent;
  }
`;
