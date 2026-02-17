import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '@vaadin/aura/aura.css';
import '@vaadin/button/src/vaadin-button.js';

// TODO: --vaadin-button-shadow is not documented but is used
// in aura/src/components/button.css:22 to set box-shadow on non-tertiary buttons.

export const props = [
  // === Button Surface ===
  {
    name: '--vaadin-button-background',
    value: 'rgb(255, 0, 0)',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('background-color').trim();
    },
  },
  {
    name: '--vaadin-button-border-color',
    value: 'rgb(0, 255, 0)',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('border-color').trim();
    },
  },
  {
    name: '--vaadin-button-border-radius',
    value: '20px',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('border-radius').trim();
    },
  },
  {
    name: '--vaadin-button-border-width',
    value: '5px',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('border-width').trim();
    },
  },

  // === Button Typography ===
  {
    name: '--vaadin-button-font-size',
    value: '20px',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('font-size').trim();
    },
  },
  {
    name: '--vaadin-button-font-weight',
    value: '700',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('font-weight').trim();
    },
  },
  {
    name: '--vaadin-button-line-height',
    value: '30px',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('line-height').trim();
    },
  },
  {
    name: '--vaadin-button-text-color',
    value: 'rgb(50, 100, 150)',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('color').trim();
    },
  },

  // === Button Layout ===
  {
    name: '--vaadin-button-gap',
    value: '20px',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('column-gap').trim();
    },
  },
  {
    name: '--vaadin-button-height',
    value: '50px',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('height').trim();
    },
  },
  {
    name: '--vaadin-button-margin',
    value: '10px',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('margin').trim();
    },
  },
  {
    name: '--vaadin-button-padding',
    value: '20px',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('padding').trim();
    },
  },

  // === Aura-Specific ===
  {
    name: '--vaadin-button-shadow',
    value: 'rgb(255, 0, 0) 0px 0px 0px 5px',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('box-shadow').trim();
    },
  },

  // Note: --vaadin-button-border is Lumo-specific
  // Note: --vaadin-button-min-width is Lumo-specific
  // Note: --vaadin-button-primary-background is Lumo-specific
  // Note: --vaadin-button-primary-text-color is Lumo-specific
  // Note: --vaadin-button-primary-font-weight is Lumo-specific
  // Note: --vaadin-button-primary-border is Lumo-specific
  // Note: --vaadin-button-tertiary-background is Lumo-specific
  // Note: --vaadin-button-tertiary-text-color is Lumo-specific
  // Note: --vaadin-button-tertiary-font-weight is Lumo-specific
  // Note: --vaadin-button-tertiary-border is Lumo-specific
  // Note: --vaadin-button-tertiary-padding is Lumo-specific
];

describe('button', () => {
  let element;
  beforeEach(async () => {
    element = fixtureSync('<vaadin-button></vaadin-button>');
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
