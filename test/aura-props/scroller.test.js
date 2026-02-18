import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '@vaadin/aura/aura.css';
import '@vaadin/scroller/src/vaadin-scroller.js';

// TODO: --vaadin-scroller-overflow-indicator-height is not documented but is used
// in vaadin-scroller-base-styles.js:11 to set the overflow indicator border height.

export const props = [
  // === Padding ===
  {
    name: '--vaadin-scroller-padding-block',
    value: '20px',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('padding-block').trim();
    },
  },
  {
    name: '--vaadin-scroller-padding-inline',
    value: '30px',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('padding-inline').trim();
    },
  },

  // === Focus Ring ===
  {
    name: '--vaadin-focus-ring-width',
    value: '5px',
    setup(element) {
      element.focus();
    },
    compute(element) {
      return getComputedStyle(element).getPropertyValue('outline-width').trim();
    },
  },
  {
    name: '--vaadin-focus-ring-color',
    value: 'rgb(255, 100, 0)',
    setup(element) {
      element.focus();
    },
    compute(element) {
      return getComputedStyle(element).getPropertyValue('outline-color').trim();
    },
  },

  // === Undocumented ===
  {
    name: '--vaadin-scroller-overflow-indicator-height',
    value: '5px',
    compute(element) {
      return getComputedStyle(element, '::before').getPropertyValue('height').trim();
    },
  },
];

describe('scroller', () => {
  let element;
  beforeEach(async () => {
    element = fixtureSync('<vaadin-scroller></vaadin-scroller>');
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
