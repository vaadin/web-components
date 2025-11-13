import '../../vaadin-map.js';
import type Map from 'ol/Map.js';
import type { MapDropEvent } from '../../src/vaadin-map-mixin.js';

const assertType = <TExpected>(actual: TExpected) => actual;

const map = document.createElement('vaadin-map');

// Should expose OL map instance
assertType<Map>(map.configuration);

// map-drop event
map.addEventListener('map-drop', (event) => {
  assertType<MapDropEvent>(event);
  assertType<number[]>(event.detail.coordinate);
  assertType<Array<{ type: string; data: string }>>(event.detail.dragData);
});
