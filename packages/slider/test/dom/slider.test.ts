import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-slider.js';
import type { Slider } from '../../src/vaadin-slider.js';

describe('vaadin-slider', () => {
  let slider: Slider;

  beforeEach(async () => {
    slider = fixtureSync('<vaadin-slider></vaadin-slider>');
  });

  it('host', async () => {
    await expect(slider).dom.to.equalSnapshot();
  });

  describe('shadow', async () => {
    it('default', async () => {
      await expect(slider).shadowDom.to.equalSnapshot();
    });

    it('value', async () => {
      slider.value = 50;
      await expect(slider).shadowDom.to.equalSnapshot();
    });
  });
});
