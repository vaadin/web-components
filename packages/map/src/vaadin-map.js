/**
 * @license
 * Copyright (c) 2022 - 2022 Vaadin Ltd.
 * This program is available under Commercial Vaadin Developer License 4.0, available at https://vaadin.com/license/cvdl-4.0.
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import Attribution from 'ol/control/Attribution';
import Zoom from 'ol/control/Zoom';
import OpenLayersMap from 'ol/Map.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

function isEnabled() {
  return window.Vaadin && window.Vaadin.featureFlags && !!window.Vaadin.featureFlags.mapComponent;
}

/**
 * `vaadin-map` is a web component for displaying web maps.
 *
 * The component is a light-weight wrapper around the OpenLayers mapping library.
 *
 * ### Basic Usage
 *
 * Add a `<vaadin-map>` element to your HTML:
 *
 * ```html
 * <vaadin-map></vaadin-map>
 * ```
 *
 * Then use the exposed OpenLayers API to configure it:
 * ```html
 * <script type="module">
 *   import "@vaadin/map/enable";
 *   import "@vaadin/map";
 *   import TileLayer from "ol/layer/Tile";
 *   import OSM from "ol/source/OSM";
 *   import View from "ol/View";
 *
 *   const map = document.querySelector("vaadin-map");
 *   customElements.whenDefined("vaadin-map").then(() => {
 *     map.configuration.addLayer(new TileLayer({
 *       source: new OSM()
 *     }));
 *     map.configuration.setView(new View({
 *       center: [0, 0],
 *       zoom: 3
 *     }));
 *   });
 * </script>
 * ```
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes ElementMixin
 */
class Map extends ElementMixin(ThemableMixin(PolymerElement)) {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          width: 100%;
          overflow: hidden;
        }

        :host([hidden]) {
          display: none !important;
        }

        #map {
          width: 100%;
          height: 100%;
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
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }

        .ol-viewport canvas {
          all: unset;
        }

        .ol-selectable {
          -webkit-touch-callout: default;
          -webkit-user-select: text;
          -moz-user-select: text;
          -ms-user-select: text;
          user-select: text;
        }

        .ol-grabbing {
          cursor: -webkit-grabbing;
          cursor: -moz-grabbing;
          cursor: grabbing;
        }

        .ol-grab {
          cursor: move;
          cursor: -webkit-grab;
          cursor: -moz-grab;
          cursor: grab;
        }

        /* Control positioning and styling */

        .ol-overlaycontainer-stopevent {
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
          content: var(--vaadin-map-icon-zoom-out, '–');
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
          content: var(--vaadin-map-icon-attribution-collapse, '▸');
        }

        .ol-attribution.ol-collapsed button span:empty::before {
          content: var(--vaadin-map-icon-attribution-expand, 'ℹ');
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
          content: var(--vaadin-map-icon-compass, '↑');
        }

        .ol-full-screen {
          grid-area: fullscreen;
        }

        .ol-full-screen button:empty::before {
          content: var(--vaadin-map-icon-fullscreen, '⤢');
        }

        .ol-full-screen .ol-full-screen-true:empty::before {
          content: var(--vaadin-map-icon-close, '×');
        }

        .ol-overviewmap {
          grid-area: overview-map;
          align-self: end;
          width: max-content;
        }

        .ol-overviewmap button span:empty::before {
          content: var(--vaadin-map-icon-overview-map-collapse, '▾');
        }

        .ol-overviewmap.ol-collapsed button span:empty::before {
          content: var(--vaadin-map-icon-overview-map-expand, '▴');
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
      </style>
      <div id="map"></div>
    `;
  }

  static get is() {
    return 'vaadin-map';
  }

  /**
   * The internal OpenLayers map instance used to configure the map.
   * See the OpenLayers [API](https://openlayers.org/en/latest/apidoc/) and
   * [examples](https://openlayers.org/en/latest/examples/) for further information.
   * @returns {*}
   */
  get configuration() {
    return this._configuration;
  }

  /** @protected */
  ready() {
    super.ready();

    this.__initMap();
  }

  /** @private */
  __initMap() {
    this._configuration = new OpenLayersMap({
      target: this.$.map
    });
    // Override default controls to remove default labels, which is required to
    // correctly display icons through pseudo-element
    this._configuration.getControls().clear();
    this._configuration.getControls().push(new Zoom({ zoomInLabel: '', zoomOutLabel: '' }));
    this._configuration.getControls().push(new Attribution());
  }
}

if (isEnabled()) {
  customElements.define(Map.is, Map);
} else {
  console.warn(
    'WARNING: The map component is currently an experimental feature and needs to be explicitly enabled. To enable the component, `import "@vaadin/map/enable.js"` *before* importing the map module itself.'
  );
}

export { Map };
