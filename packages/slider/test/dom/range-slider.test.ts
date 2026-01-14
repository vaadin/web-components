import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-range-slider.js';
import type { RangeSlider } from '../../src/vaadin-range-slider.js';

describe('vaadin-range-slider', () => {
  let slider: RangeSlider;

  beforeEach(async () => {
    slider = fixtureSync('<vaadin-range-slider></vaadin-range-slider>');
  });

  it('host', async () => {
    await expect(slider).dom.to.equalSnapshot();
  });

  it('shadow', async () => {
    await expect(slider).shadowDom.to.equalSnapshot();
  });
});
