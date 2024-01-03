/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { defaults as defaultControls } from 'ol/control';
import { defaults as defaultInteractions } from 'ol/interaction';
import OpenLayersMap from 'ol/Map.js';
import { FocusMixin } from '@vaadin/a11y-base/src/focus-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

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
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes ElementMixin
 * @mixes FocusMixin
 * @mixes ResizeMixin
 */
class Map extends ResizeMixin(FocusMixin(ElementMixin(ThemableMixin(PolymerElement)))) {
  static get template() {
    return html`
      <style>
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
      </style>
    `;
  }

  static get is() {
    return 'vaadin-map';
  }

  static get cvdlName() {
    return 'vaadin-map';
  }

  constructor() {
    super();
    // Create map container element and initialize OL map instance
    this._mapTarget = document.createElement('div');
    this._mapTarget.id = 'map';
    // Ensure accessible keyboard controls are enabled
    this._mapTarget.setAttribute('tabindex', '0');
    const options = {
      // Override default controls to remove default labels, which is required to
      // correctly display icons through pseudo-element
      controls: defaultControls({
        rotate: false,
        zoomOptions: { zoomInLabel: '', zoomOutLabel: '' },
      }),
      // Override default interactions to allow mouse-wheel zoom + drag-pan when not focused
      interactions: defaultInteractions({ onFocusOnly: false }),
      target: this._mapTarget,
    };
    this._configuration = new OpenLayersMap(options);
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
    // Add map container to shadow root, trigger OL resize calculation
    this.shadowRoot.appendChild(this._mapTarget);
    this.__addMapFocusListeners();
  }

  /**
   * Implements resize callback from ResizeMixin to update size of OL map instance
   * @override
   * @protected
   */
  _onResize(_contentRect) {
    this._configuration.updateSize();
  }

  /**
   * Registers focus listeners on the map container to manually manage focus in
   * FocusMixin. FocusMixin currently assumes that the focusable element will
   * be in the light DOM and is available as event target.
   * The map container however is in the shadow DOM and thus focus events will
   * always have the host element as target.
   * @private
   */
  __addMapFocusListeners() {
    this._mapTarget.addEventListener('focusin', (e) => {
      if (e.target === this._mapTarget) {
        this._setFocused(true);
      }
    });
    this._mapTarget.addEventListener('focusout', () => {
      this._setFocused(false);
    });
  }

  /**
   * Overrides method from `FocusMixin` to disable automatic focus management.
   * See custom logic in __addMapFocusListeners
   *
   * @param {FocusEvent} _event
   * @return {boolean}
   * @override
   * @protected
   */
  _shouldSetFocus(_event) {
    return false;
  }
}

defineCustomElement(Map);

export { Map };
