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
    align-self: stretch;
    display: block;
    flex: 1 1 auto;
    height: 400px;
    overflow: hidden;
  }

  :host([hidden]) {
    display: none !important;
  }

  #map {
    height: 100%;
    outline: none;
    width: 100%;
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
    background-color: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(0, 0, 0, 0.5);
    border-radius: 2px;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.5);
    box-sizing: border-box;
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
    box-sizing: border-box;
    /* stylelint-disable declaration-block-no-redundant-longhand-properties */
    display: grid;
    grid-template-areas:
      'scale mouse-position fullscreen'
      'overview-map . zoom-extent'
      'overview-map . compass'
      'overview-map . zoom-slider'
      'overview-map . zoom'
      'overview-map attribution attribution';
    grid-template-columns: min-content 1fr min-content;
    grid-template-rows: min-content 1fr min-content min-content min-content min-content;
    padding: var(--vaadin-map-controls-inset, 0.25em);
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
    color: #000;
    grid-area: scale;
    pointer-events: none !important;
    position: relative;
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
    border: 1px solid rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.5);
    overflow: hidden;
  }

  .ol-scale-step-marker {
    display: none;
  }

  .ol-scale-step-text {
    color: #000;
    filter: drop-shadow(0 0 1px #fff) drop-shadow(0 0 1px #fff);
    font-size: 0.625em;
    overflow: hidden;
    position: absolute;
    top: 0.75em;
    white-space: nowrap;
  }

  .ol-scale-text {
    color: #000;
    filter: drop-shadow(0 0 1px #fff) drop-shadow(0 0 1px #fff);
    font-size: 0.625em;
    position: absolute;
    top: 2em;
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
    -webkit-appearance: none;
    background: #fff;
    border: 0;
    color: inherit;
    font: inherit;
    height: 1.5em;
    margin: 0;
    padding: 0;
    width: 1.5em;
  }

  .ol-control button::-moz-focus-inner {
    border: none;
    padding: 0;
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
    content: var(--vaadin-map-icon-zoom-out, '\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\2013');
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
    content: var(--vaadin-map-icon-attribution-collapse, '\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\25B8');
  }

  .ol-attribution.ol-collapsed button span:empty::before {
    content: var(--vaadin-map-icon-attribution-expand, '\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\2139');
  }

  .ol-attribution ul {
    align-items: center;
    display: flex;
    font-size: 0.8em;
    gap: 1em;
    list-style: none;
    margin: 0;
    padding: 0.25em 0.5em;
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
    content: var(--vaadin-map-icon-compass, '\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\2191');
  }

  .ol-full-screen {
    grid-area: fullscreen;
  }

  .ol-full-screen button:empty::before {
    content: var(--vaadin-map-icon-fullscreen, '\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\2922');
  }

  .ol-full-screen .ol-full-screen-true:empty::before {
    content: var(--vaadin-map-icon-close, '\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\00D7');
  }

  .ol-overviewmap {
    align-self: end;
    grid-area: overview-map;
    width: max-content;
  }

  .ol-overviewmap button span:empty::before {
    content: var(--vaadin-map-icon-overview-map-collapse, '\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\25BE');
  }

  .ol-overviewmap.ol-collapsed button span:empty::before {
    content: var(--vaadin-map-icon-overview-map-expand, '\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\25B4');
  }

  .ol-overviewmap-map {
    border: 1px solid rgba(0, 0, 0, 0.5);
    height: 10em;
    width: 10em;
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
    grid-area: zoom-slider;
    height: 8em;
  }

  .ol-zoomslider button {
    border-radius: inherit;
    display: block;
    height: 0.5em;
    position: relative;
  }

  .ol-zoom-extent {
    align-self: end;
    grid-area: zoom-extent;
  }
`;
