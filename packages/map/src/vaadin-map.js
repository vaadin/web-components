/**
 * @license
 * Copyright (c) 2022 - 2022 Vaadin Ltd.
 * This program is available under Commercial Vaadin Developer License 4.0, available at https://vaadin.com/license/cvdl-4.0.
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
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

        #map {
          width: 100%;
          height: 100%;
        }

        :host([hidden]) {
          display: none !important;
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
