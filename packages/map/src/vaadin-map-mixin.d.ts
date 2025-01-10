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
import type { Constructor } from '@open-wc/dedupe-mixin';
import type OpenLayersMap from 'ol/Map.js';
import type { FocusMixinClass } from '@vaadin/a11y-base/src/focus-mixin.js';
import type { ResizeMixinClass } from '@vaadin/component-base/src/resize-mixin.js';

export declare function MapMixin<T extends Constructor<HTMLElement>>(
  base: T,
): Constructor<MapMixinClass> & Constructor<ResizeMixinClass> & Constructor<FocusMixinClass> & T;

export declare class MapMixinClass {
  /**
   * The internal OpenLayers map instance used to configure the map.
   * See the OpenLayers [API](https://openlayers.org/en/latest/apidoc/) and
   * [examples](https://openlayers.org/en/latest/examples/) for further information.
   * @returns {*}
   */
  get configuration(): OpenLayersMap;
}
