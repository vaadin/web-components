import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-slider.js';
import type { Slider } from '../../src/vaadin-slider.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.sliderComponent = true;

describe('vaadin-slider', () => {
  let slider: Slider;

  beforeEach(async () => {
    slider = fixtureSync('<vaadin-slider></vaadin-slider>');
  });

  describe('host', async () => {
    it('default', async () => {
      await expect(slider).dom.to.equalSnapshot();
    });

    it('value', async () => {
      slider.value = 50;
      await expect(slider).dom.to.equalSnapshot();
    });

    it('min', async () => {
      slider.min = 20;
      slider.value = 80;
      await expect(slider).dom.to.equalSnapshot();
    });

    it('max', async () => {
      slider.max = 80;
      slider.value = 20;
      await expect(slider).dom.to.equalSnapshot();
    });

    it('step', async () => {
      slider.step = 10;
      slider.value = 50;
      await expect(slider).dom.to.equalSnapshot();
    });
  });

  describe('shadow', async () => {
    it('default', async () => {
      await expect(slider).shadowDom.to.equalSnapshot();
    });

    it('value', async () => {
      slider.value = 50;
      await expect(slider).shadowDom.to.equalSnapshot();
    });

    it('min', async () => {
      slider.min = 20;
      slider.value = 80;
      await expect(slider).shadowDom.to.equalSnapshot();
    });

    it('max', async () => {
      slider.max = 80;
      slider.value = 20;
      await expect(slider).shadowDom.to.equalSnapshot();
    });

    it('step', async () => {
      slider.step = 10;
      slider.value = 50;
      await expect(slider).shadowDom.to.equalSnapshot();
    });
  });
});
