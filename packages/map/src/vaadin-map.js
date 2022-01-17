/**
 * @license
 * Copyright (c) 2022 - 2022 Vaadin Ltd.
 * This program is available under Commercial Vaadin Developer License 4.0, available at https://vaadin.com/license/cvdl-4.0.
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import OpenLayersMap from 'ol/Map.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { synchronize } from './synchronization.js';

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

  /**
   * Synchronize a configuration object into the internal OpenLayers map instance.
   *
   * The target parameter can be left unspecified, in which case the OpenLayers
   * map instance itself is used as synchronization target. This results in a
   * full sync of the map configuration hierarchy.
   * Specifying a target instance allows synchronizing only a part of the
   * configuration. In that case the configuration parameter needs to be for the
   * specific part that should be synchronized. For example, when passing an
   * `ol/View` instance as target, then the configuration parameter should
   * contain a configuration object for a view as well.
   *
   * @param configuration the configuration object to synchronize from
   * @param target the OpenLayers configuration instance to synchronize into, or undefined if the root map instance should be used
   */
  synchronize(configuration, target) {
    if (!this.__initialized) {
      throw new Error('Component is not initialized yet');
    }
    if (!configuration || typeof configuration !== 'object') {
      throw new Error('Configuration must be an object');
    }
    // Assume we want to sync the full map by default
    if (!target) {
      target = this.configuration;
    }

    // We don't want the synchronization to return a new instance (we have no
    // idea where to store it afterwards), so we adopt the ID from the
    // configuration object and assume that the types will be the same
    target.id = configuration.id;

    synchronize(target, configuration);
    // TODO: layers don't render on initialization in some cases, needs investigation
    this.configuration.updateSize();
  }
}

customElements.define(Map.is, Map);

export { Map };
