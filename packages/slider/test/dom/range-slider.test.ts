import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-range-slider.js';
import type { RangeSlider } from '../../src/vaadin-range-slider.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.sliderComponent = true;

describe('vaadin-range-slider', () => {
  let slider: RangeSlider;

  beforeEach(async () => {
    slider = fixtureSync('<vaadin-range-slider></vaadin-range-slider>');
  });

  describe('host', async () => {
    it('default', async () => {
      await expect(slider).dom.to.equalSnapshot();
    });

    it('value', async () => {
      slider.value = [10, 20];
      await expect(slider).dom.to.equalSnapshot();
    });

    it('min', async () => {
      slider.min = 20;
      slider.value = [40, 80];
      await expect(slider).dom.to.equalSnapshot();
    });

    it('max', async () => {
      slider.max = 80;
      slider.value = [20, 60];
      await expect(slider).dom.to.equalSnapshot();
    });
  });

  describe('shadow', async () => {
    it('default', async () => {
      await expect(slider).shadowDom.to.equalSnapshot();
    });

    it('value', async () => {
      slider.value = [10, 20];
      await expect(slider).shadowDom.to.equalSnapshot();
    });

    it('min', async () => {
      slider.min = 20;
      slider.value = [40, 80];
      await expect(slider).shadowDom.to.equalSnapshot();
    });

    it('max', async () => {
      slider.max = 80;
      slider.value = [20, 60];
      await expect(slider).shadowDom.to.equalSnapshot();
    });
  });
});
