import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '../../src/vaadin-range-slider.js';
import { resetUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';
import type { RangeSlider } from '../../src/vaadin-range-slider.js';

window.Vaadin ??= {};
window.Vaadin.featureFlags ??= {};
window.Vaadin.featureFlags.sliderComponent = true;

describe('vaadin-range-slider', () => {
  let slider: RangeSlider;

  beforeEach(async () => {
    resetUniqueId();
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

    it('step', async () => {
      slider.step = 10;
      slider.value = [20, 60];
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

    it('step', async () => {
      slider.step = 10;
      slider.value = [20, 60];
      await expect(slider).shadowDom.to.equalSnapshot();
    });
  });
});
