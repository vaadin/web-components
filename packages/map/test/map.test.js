import { expect } from '@esm-bundle/chai';
import '../enable.js';
import '../vaadin-map.js';
import TileLayer from 'ol/layer/Tile';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import View from 'ol/View';

async function nextMapRender(map) {
  return new Promise((resolve) => {
    map.configuration.on('rendercomplete', resolve);
  });
}

describe('configuration in detached state', () => {
  let mapElement;

  beforeEach(() => {
    mapElement = document.createElement('vaadin-map');
    mapElement.style.width = '100px';
    mapElement.style.height = '100px';
  });

  afterEach(() => {
    mapElement.remove();
  });

  it('should be configurable when detached', async () => {
    // OL instance should be initialized
    expect(mapElement.configuration).to.be.instanceOf(Map);
    // Configure map
    mapElement.configuration.addLayer(new TileLayer({ source: new OSM() }));
    mapElement.configuration.setView(new View({ center: [0, 0], zoom: 3 }));
    // Attach and wait for layer to be rendered
    document.body.appendChild(mapElement);
    await nextMapRender(mapElement);
    // Verify layer is set up
    const layers = mapElement.shadowRoot.querySelectorAll('.ol-layer');
    expect(layers.length).to.equal(1);
  });
});
