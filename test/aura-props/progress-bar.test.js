import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '@vaadin/aura/aura.css';
import '@vaadin/progress-bar/src/vaadin-progress-bar.js';

export const props = [
  // === Bar Dimensions ===
  {
    name: '--vaadin-progress-bar-height',
    value: '20px',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('height').trim();
    },
  },

  // === Bar Background ===
  {
    name: '--vaadin-progress-bar-background',
    value: 'rgb(255, 0, 0)',
    compute(element) {
      const bar = element.shadowRoot.querySelector('[part="bar"]');
      return getComputedStyle(bar).getPropertyValue('background-color').trim();
    },
  },

  // === Bar Border ===
  {
    name: '--vaadin-progress-bar-border-color',
    value: 'rgb(0, 255, 0)',
    compute(element) {
      const bar = element.shadowRoot.querySelector('[part="bar"]');
      return getComputedStyle(bar).getPropertyValue('border-color').trim();
    },
  },
  {
    name: '--vaadin-progress-bar-border-width',
    value: '3px',
    compute(element) {
      const bar = element.shadowRoot.querySelector('[part="bar"]');
      return getComputedStyle(bar).getPropertyValue('border-width').trim();
    },
  },
  {
    name: '--vaadin-progress-bar-border-radius',
    value: '10px',
    compute(element) {
      const bar = element.shadowRoot.querySelector('[part="bar"]');
      return getComputedStyle(bar).getPropertyValue('border-radius').trim();
    },
  },

  // === Bar Spacing ===
  {
    name: '--vaadin-progress-bar-padding',
    value: '2px',
    compute(element) {
      const bar = element.shadowRoot.querySelector('[part="bar"]');
      return getComputedStyle(bar).getPropertyValue('padding').trim();
    },
  },

  // === Value Indicator ===
  {
    name: '--vaadin-progress-bar-value-background',
    value: 'rgb(0, 0, 255)',
    setup(element) {
      element.value = 0.5;
    },
    compute(element) {
      const value = element.shadowRoot.querySelector('[part="value"]');
      return getComputedStyle(value).getPropertyValue('background-color').trim();
    },
  },

  // === Animation ===
  {
    name: '--vaadin-progress-bar-animation-duration',
    value: '3s',
    setup(element) {
      element.indeterminate = true;
    },
    compute(element) {
      const value = element.shadowRoot.querySelector('[part="value"]');
      return getComputedStyle(value).getPropertyValue('animation-duration').trim();
    },
  },
];

describe('progress-bar', () => {
  let element;
  beforeEach(async () => {
    element = fixtureSync('<vaadin-progress-bar></vaadin-progress-bar>');
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
