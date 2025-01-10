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
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { defaults as defaultControls } from 'ol/control';
import { defaults as defaultInteractions } from 'ol/interaction';
import OpenLayersMap from 'ol/Map.js';
import { FocusMixin } from '@vaadin/a11y-base/src/focus-mixin.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { mapStyles } from './vaadin-map-styles.js';

registerStyles('vaadin-map', mapStyles, { moduleId: 'vaadin-map-styles' });

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
    return html``;
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
