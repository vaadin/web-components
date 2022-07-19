import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import '../vaadin-map.js';
import TileLayer from 'ol/layer/Tile';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import View from 'ol/View';

function nextMapRender(map) {
  return new Promise((resolve) => {
    map.configuration.on('rendercomplete', resolve);
  });
}

describe('focus', () => {
  let map;

  beforeEach(() => {
    map = fixtureSync(`<vaadin-map></vaadin-map>`);
  });

  it('should not add focus-ring to the host on programmatic focus', () => {
    map.focus();
    expect(map.hasAttribute('focus-ring')).to.be.false;
  });

  it('should add focus-ring to the host on keyboard focus', async () => {
    await sendKeys({ press: 'Tab' });
    expect(map.hasAttribute('focus-ring')).to.be.true;
  });

  it('should remove focus-ring when a child node is focused', async () => {
    await sendKeys({ press: 'Tab' });
    // Moves focus to one of the buttons created by the OL controls
    await sendKeys({ press: 'Tab' });
    expect(map.hasAttribute('focus-ring')).to.be.false;
  });
});

describe('configuration in detached state', () => {
  let map;

  beforeEach(() => {
    map = document.createElement('vaadin-map');
  });

  afterEach(() => {
    map.remove();
  });

  it('should be configurable when detached', async () => {
    // OL instance should be initialized
    expect(map.configuration).to.be.instanceOf(Map);
    // Configure map
    map.configuration.addLayer(new TileLayer({ source: new OSM() }));
    map.configuration.setView(new View({ center: [0, 0], zoom: 3 }));
    // Attach and wait for layer to be rendered
    document.body.appendChild(map);
    await nextMapRender(map);
    // Verify layer is set up
    const layers = map.shadowRoot.querySelectorAll('.ol-layer');
    expect(layers.length).to.equal(1);
  });
});

describe('resize', () => {
  let map;

  beforeEach(async () => {
    map = fixtureSync('<vaadin-map></vaadin-map>');
    map.style.width = '100px';
    map.style.height = '100px';
    // Configure map
    map.configuration.addLayer(new TileLayer({ source: new OSM() }));
    map.configuration.setView(new View({ center: [0, 0], zoom: 3 }));
    await nextMapRender(map);
  });

  it('should update size of internal OL instance on resize', async () => {
    // Verify initial size of canvas for the configured layer
    const layerCanvas = map.shadowRoot.querySelector('.ol-layer canvas');
    expect(layerCanvas).not.to.be.undefined;
    const initialRect = layerCanvas.getBoundingClientRect();
    expect(initialRect.width).to.equal(100);
    expect(initialRect.width).to.equal(100);
    // Update size of host element
    map.style.width = '200px';
    map.style.height = '200px';
    await nextMapRender(map);
    // Verify updated size
    const updatedRect = layerCanvas.getBoundingClientRect();
    expect(updatedRect.width).to.equal(200);
    expect(updatedRect.width).to.equal(200);
  });
});
