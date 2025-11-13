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

/**
 * Fired when an element from an external drag source is dropped onto the map.
 */
export type MapDropEvent = CustomEvent<{
  coordinate: number[];
  dragData: Array<{ type: string; data: string }>;
}>;

export interface MapCustomEventMap {
  'map-drop': MapDropEvent;
}

export interface MapEventMap extends HTMLElementEventMap, MapCustomEventMap {}

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

  addEventListener<K extends keyof MapEventMap>(
    type: K,
    listener: (this: Map, ev: MapEventMap[K]) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;

  removeEventListener<K extends keyof MapEventMap>(
    type: K,
    listener: (this: Map, ev: MapEventMap[K]) => void,
    options?: EventListenerOptions | boolean,
  ): void;
}
