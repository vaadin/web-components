import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '@vaadin/aura/aura.css';
import '@vaadin/details/src/vaadin-details.js';

export const props = [
  // === Summary ===
  {
    name: '--vaadin-details-summary-background',
    value: 'rgb(255, 0, 0)',
    compute(element) {
      const summary = element.querySelector('vaadin-details-summary');
      return getComputedStyle(summary).getPropertyValue('background-color').trim();
    },
  },
  {
    name: '--vaadin-details-summary-border-color',
    value: 'rgb(0, 255, 0)',
    compute(element) {
      const summary = element.querySelector('vaadin-details-summary');
      return getComputedStyle(summary).getPropertyValue('border-color').trim();
    },
  },
  {
    name: '--vaadin-details-summary-border-radius',
    value: '20px',
    compute(element) {
      const summary = element.querySelector('vaadin-details-summary');
      return getComputedStyle(summary).getPropertyValue('border-radius').trim();
    },
  },
  {
    name: '--vaadin-details-summary-border-width',
    value: '5px',
    compute(element) {
      const summary = element.querySelector('vaadin-details-summary');
      return getComputedStyle(summary).getPropertyValue('border-width').trim();
    },
  },
  {
    name: '--vaadin-details-summary-font-size',
    value: '24px',
    compute(element) {
      const summary = element.querySelector('vaadin-details-summary');
      return getComputedStyle(summary).getPropertyValue('font-size').trim();
    },
  },
  {
    name: '--vaadin-details-summary-font-weight',
    value: '700',
    compute(element) {
      const summary = element.querySelector('vaadin-details-summary');
      return getComputedStyle(summary).getPropertyValue('font-weight').trim();
    },
  },
  {
    name: '--vaadin-details-summary-gap',
    value: '20px',
    compute(element) {
      const summary = element.querySelector('vaadin-details-summary');
      return getComputedStyle(summary).getPropertyValue('gap').trim();
    },
  },
  {
    name: '--vaadin-details-summary-height',
    value: '100px',
    compute(element) {
      const summary = element.querySelector('vaadin-details-summary');
      return getComputedStyle(summary).getPropertyValue('height').trim();
    },
  },
  {
    name: '--vaadin-details-summary-padding',
    value: '20px',
    compute(element) {
      const summary = element.querySelector('vaadin-details-summary');
      return getComputedStyle(summary).getPropertyValue('padding').trim();
    },
  },
  {
    name: '--vaadin-details-summary-text-color',
    value: 'rgb(0, 0, 255)',
    compute(element) {
      const summary = element.querySelector('vaadin-details-summary');
      return getComputedStyle(summary).getPropertyValue('color').trim();
    },
  },
];

describe('details', () => {
  let element;
  beforeEach(async () => {
    element = fixtureSync(`
      <vaadin-details>
        <vaadin-details-summary slot="summary">Details Summary</vaadin-details-summary>
        <div>Content</div>
      </vaadin-details>
    `);
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
