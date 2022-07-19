import { fixtureSync } from '@vaadin/testing-helpers';
import { sendKeys } from '@web/test-runner-commands';
import { visualDiff } from '@web/test-runner-visual-regression';
import '../../../theme/material/vaadin-map.js';
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
  });

  describe('theme', () => {
    it('borderless', async () => {
      element.setAttribute('theme', 'borderless');
      await visualDiff(div, 'theme-borderless');
    });
  });

  describe('accessibility', () => {
    it('focus-ring', async () => {
      await sendKeys({ press: 'Tab' });
      await visualDiff(div, 'accessibility-focus-ring');
    });
  });
});
