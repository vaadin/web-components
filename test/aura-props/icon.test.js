import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '@vaadin/aura/aura.css';
import '@vaadin/icon/src/vaadin-icon.js';

// TODO: --vaadin-icon-visual-size fails because getComputedStyle resolves the
// percentage value to pixels on the svg element, making exact comparison impossible.

export const props = [
  // === Icon Dimensions ===
  {
    name: '--vaadin-icon-size',
    value: '48px',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('width').trim();
    },
  },
  {
    name: '--vaadin-icon-visual-size',
    value: '60%',
    compute(element) {
      const svg = element.shadowRoot.querySelector('svg');
      return getComputedStyle(svg).getPropertyValue('width').trim();
    },
  },

  // === Icon Color ===
  {
    name: '--vaadin-icon-color',
    value: 'rgb(255, 0, 0)',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('fill').trim();
    },
  },
];

describe('icon', () => {
  let element;
  beforeEach(async () => {
    element = fixtureSync('<vaadin-icon></vaadin-icon>');
    await nextUpdate(element);
  });

  props.forEach(({ name, value, setup, compute }) => {
    it(`should apply ${name} property`, async () => {
      element.style.setProperty(name, value);
      await nextUpdate(element);
      if (setup) {
        await setup(element);
        await nextUpdate(element);
      }
      const actual = await compute(element);
      expect(actual).to.equal(value);
    });
  });
});
