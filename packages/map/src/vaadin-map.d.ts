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
import type OpenLayersMap from 'ol/Map.js';
import { FocusMixin } from '@vaadin/a11y-base/src/focus-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin';

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
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes ElementMixin
 * @mixes FocusMixin
 * @mixes ResizeMixin
 */
declare class Map extends ResizeMixin(FocusMixin(ThemableMixin(ElementMixin(HTMLElement)))) {
  /**
   * The internal OpenLayers map instance used to configure the map.
   * See the OpenLayers [API](https://openlayers.org/en/latest/apidoc/) and
   * [examples](https://openlayers.org/en/latest/examples/) for further information.
   * @returns {*}
   */
  get configuration(): OpenLayersMap;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-map': Map;
  }
}

export { Map };
