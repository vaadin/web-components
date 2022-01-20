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
  return window.Vaadin && window.Vaadin.experimental && !!window.Vaadin.experimental.enableMapComponent;
}

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
      </style>
      <div id="map"></div>
    `;
  }

  static get is() {
    return 'vaadin-map';
  }

  get configuration() {
    return this._configuration;
  }

  constructor() {
    super();
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();

    this.__initMap();
  }

  /** @private */
  __initMap() {
    if (this.__initialized) {
      return;
    }

    this._configuration = new OpenLayersMap({
      target: this.$.map
    });
    this.__initialized = true;
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
