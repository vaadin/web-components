import { sendKeys } from '@vaadin/test-runner-commands';
import { fixtureSync } from '@vaadin/testing-helpers';
import { visualDiff } from '@web/test-runner-visual-regression';
import '@vaadin/vaadin-lumo-styles/src/props/index.css';
import '@vaadin/vaadin-lumo-styles/components/map.css';
import '../../../vaadin-map.js';
import FullScreen from 'ol/control/FullScreen';
import OverviewMap from 'ol/control/OverviewMap';
import Rotate from 'ol/control/Rotate';
import ScaleLine from 'ol/control/ScaleLine';
import View from 'ol/View';

describe('map', () => {
  let div, element;

  beforeEach(() => {
    div = document.createElement('div');
    div.style.width = '400px';
    div.style.height = '400px';
    div.style.position = 'relative';
    div.style.padding = '10px';
    element = fixtureSync('<vaadin-map></vaadin-map>', div);
    element.style.width = '100%';
    element.style.height = '100%';
    // Set non-white background to identify controls more clearly
    element.style.background = '#eadbc8';
    // Force size refresh
    element.configuration.updateSize();
    // Define a viewport
    element.configuration.setView(
      new View({
        center: [0, 0],
        zoom: 3,
      }),
    );
  });

  describe('controls', () => {
    it('all controls', async () => {
      // Add non-default controls
      element.configuration.getControls().push(new FullScreen({ label: '', labelActive: '' }));
      element.configuration.getControls().push(new Rotate({ label: '' }));
      element.configuration.getControls().push(new ScaleLine());
      element.configuration.getControls().push(new OverviewMap({ label: '', collapseLabel: '' }));
      await visualDiff(div, 'controls-all-controls');
    });

    it('scale bar', async () => {
      // Add scale line using bar mode
      element.configuration.getControls().push(new ScaleLine({ bar: true, text: true }));
      await visualDiff(div, 'controls-scale-bar');
    });
  });

  describe('theme', () => {
    it('no-border', async () => {
      element.setAttribute('theme', 'no-border');
      await visualDiff(div, 'theme-no-border');
    });
  });

  describe('accessibility', () => {
    it('focus-ring', async () => {
      await sendKeys({ press: 'Tab' });
      await visualDiff(div, 'accessibility-focus-ring');
    });
  });
});
