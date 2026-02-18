import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '@vaadin/aura/aura.css';
import '@vaadin/horizontal-layout/src/vaadin-horizontal-layout.js';

export const props = [
  // === Layout Spacing & Sizing ===
  {
    name: '--vaadin-horizontal-layout-margin',
    value: '30px',
    setup(element) {
      element.setAttribute('theme', 'margin');
    },
    compute(element) {
      return getComputedStyle(element).getPropertyValue('margin').trim();
    },
  },
  {
    name: '--vaadin-horizontal-layout-padding',
    value: '25px',
    setup(element) {
      element.setAttribute('theme', 'padding');
    },
    compute(element) {
      return getComputedStyle(element).getPropertyValue('padding').trim();
    },
  },
  {
    name: '--vaadin-horizontal-layout-gap',
    value: '20px',
    setup(element) {
      element.setAttribute('theme', 'spacing');
    },
    compute(element) {
      return getComputedStyle(element).getPropertyValue('gap').trim();
    },
  },
];

describe('horizontal-layout', () => {
  let element;
  beforeEach(async () => {
    element = fixtureSync('<vaadin-horizontal-layout></vaadin-horizontal-layout>');
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
