import { expect } from '@vaadin/chai-plugins';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../../src/vaadin-slider-bubble.js';
import type { SliderBubble } from '../../src/vaadin-slider-bubble.js';

describe('vaadin-slider-bubble', () => {
  let bubble: SliderBubble;

  beforeEach(async () => {
    bubble = fixtureSync('<vaadin-slider-bubble></vaadin-slider-bubble>');
  });

  it('host', async () => {
    await expect(bubble).dom.to.equalSnapshot();
  });

  it('shadow', async () => {
    await expect(bubble).shadowDom.to.equalSnapshot();
  });
});
