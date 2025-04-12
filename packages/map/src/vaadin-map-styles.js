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
    flex: 1 1 auto;
    align-self: stretch;
    height: 400px;
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
    grid-area: mouse-position;
    align-self: start;
    color: #000;
    font-size: 0.625em;
    text-align: center;
    filter: drop-shadow(0 0 1px #fff) drop-shadow(0 0 1px #fff);
  }

  .ol-scale-line,
  .ol-scale-bar {
    position: relative;
    grid-area: scale;
    color: #000;
    pointer-events: none !important;
  }

  .ol-scale-line-inner {
    transition: all 0.25s;
    border: 1px solid rgba(0, 0, 0, 0.5);
    border-top: none;
    font-size: 0.625em;
    text-align: center;
    filter: drop-shadow(0 0 1px #fff) drop-shadow(0 0 1px #fff);
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
    margin: 0;
    padding: 0;
    border: 0;
    background: #fff;
    color: inherit;
    font: inherit;
    -webkit-appearance: none;
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
    grid-area: zoom;
    flex-direction: column;
  }

  .ol-zoom-in:empty::before {
    content: var(--vaadin-map-icon-zoom-in, '+');
  }

  .ol-zoom-out:empty::before {
    content: var(--vaadin-map-icon-zoom-out, '\\\\\\\\2013');
  }

  .ol-attribution {
    display: flex;
    grid-area: attribution;
    flex-flow: row-reverse;
    margin-inline-start: auto !important;
  }

  .ol-attribution.ol-uncollapsible {
    margin-block-end: calc(var(--vaadin-map-controls-inset, 0.25em) * -1);
    margin-inline-end: calc(var(--vaadin-map-controls-inset, 0.25em) * -1);
  }

  .ol-attribution button span:empty::before {
    content: var(--vaadin-map-icon-attribution-collapse, '\\\\\\\\25B8');
  }

  .ol-attribution.ol-collapsed button span:empty::before {
    content: var(--vaadin-map-icon-attribution-expand, '\\\\\\\\2139');
  }

  .ol-attribution ul {
    display: flex;
    align-items: center;
    margin: 0;
    padding: 0.25em 0.5em;
    font-size: 0.8em;
    list-style: none;
    gap: 1em;
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
    content: var(--vaadin-map-icon-compass, '\\\\\\\\2191');
  }

  .ol-full-screen {
    grid-area: fullscreen;
  }

  .ol-full-screen button:empty::before {
    content: var(--vaadin-map-icon-fullscreen, '\\\\\\\\2922');
  }

  .ol-full-screen .ol-full-screen-true:empty::before {
    content: var(--vaadin-map-icon-close, '\\\\\\\\00D7');
  }

  .ol-overviewmap {
    grid-area: overview-map;
    align-self: end;
    width: max-content;
  }

  .ol-overviewmap button span:empty::before {
    content: var(--vaadin-map-icon-overview-map-collapse, '\\\\\\\\25BE');
  }

  .ol-overviewmap.ol-collapsed button span:empty::before {
    content: var(--vaadin-map-icon-overview-map-expand, '\\\\\\\\25B4');
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
    grid-area: zoom-slider;
    height: 8em;
  }

  .ol-zoomslider button {
    display: block;
    position: relative;
    height: 0.5em;
    border-radius: inherit;
  }

  .ol-zoom-extent {
    grid-area: zoom-extent;
    align-self: end;
  }
`;
