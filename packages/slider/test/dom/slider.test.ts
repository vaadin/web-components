import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '../../src/vaadin-slider.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';
import type { Slider } from '../../src/vaadin-slider.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.sliderComponent = true;

describe('vaadin-slider', () => {
  let slider: Slider;

  beforeEach(async () => {
    resetUniqueId();
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

    it('disabled', async () => {
      slider.disabled = true;
      await expect(slider).dom.to.equalSnapshot();
    });

    it('label', async () => {
      slider.label = 'Label';
      await nextUpdate(slider);
      await expect(slider).dom.to.equalSnapshot();
    });

    it('disabled', async () => {
      slider.disabled = true;
      await expect(slider).dom.to.equalSnapshot();
    });

    it('helper', async () => {
      slider.helperText = 'Helper';
      await nextUpdate(slider);
      await expect(slider).dom.to.equalSnapshot();
    });

    it('required', async () => {
      slider.required = true;
      await expect(slider).dom.to.equalSnapshot();
    });

    it('error', async () => {
      slider.errorMessage = 'Error';
      slider.invalid = true;
      await aTimeout(0);
      await expect(slider).dom.to.equalSnapshot();
    });

    it('value always visible', async () => {
      slider.valueAlwaysVisible = true;
      await nextUpdate(slider);
      await expect(slider).dom.to.equalSnapshot();
    });

    it('min max visible', async () => {
      slider.minMaxVisible = true;
      await nextUpdate(slider);
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

    it('negative', async () => {
      slider.min = -80;
      slider.max = -20;
      slider.value = -50;
      await expect(slider).shadowDom.to.equalSnapshot();
    });

    it('min > value', async () => {
      slider.min = 10;
      await expect(slider).shadowDom.to.equalSnapshot();
    });

    it('max < value', async () => {
      slider.min = -80;
      slider.max = -20;
      slider.value = 0;
      await expect(slider).shadowDom.to.equalSnapshot();
    });
  });
});
