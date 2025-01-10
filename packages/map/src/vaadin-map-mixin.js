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
import { defaults as defaultControls } from 'ol/control';
import { defaults as defaultInteractions } from 'ol/interaction';
import OpenLayersMap from 'ol/Map.js';
import { FocusMixin } from '@vaadin/a11y-base/src/focus-mixin.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';

/**
 * @polymerMixin
 * @mixes ResizeMixin
 * @mixes FocusMixin
 */
export const MapMixin = (superClass) =>
  class extends FocusMixin(ResizeMixin(superClass)) {
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
  };
