import '../../vaadin-map.js';
import type Map from 'ol/Map';

const assertType = <TExpected>(actual: TExpected) => actual;

const map = document.createElement('vaadin-map');

// Should expose OL map instance
assertType<Map>(map.configuration);
