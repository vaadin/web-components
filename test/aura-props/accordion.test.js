import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '@vaadin/aura/aura.css';
import '@vaadin/accordion/src/vaadin-accordion.js';

export const props = [
  // === Heading ===
  {
    name: '--vaadin-accordion-heading-background',
    value: 'rgb(255, 0, 0)',
    compute(element) {
      const heading = element.querySelector('vaadin-accordion-heading');
      return getComputedStyle(heading).getPropertyValue('background-color').trim();
    },
  },
  {
    name: '--vaadin-accordion-heading-border-color',
    value: 'rgb(0, 255, 0)',
    compute(element) {
      const heading = element.querySelector('vaadin-accordion-heading');
      return getComputedStyle(heading).getPropertyValue('border-color').trim();
    },
  },
  {
    name: '--vaadin-accordion-heading-border-radius',
    value: '20px',
    compute(element) {
      const heading = element.querySelector('vaadin-accordion-heading');
      return getComputedStyle(heading).getPropertyValue('border-radius').trim();
    },
  },
  {
    name: '--vaadin-accordion-heading-border-width',
    value: '5px',
    compute(element) {
      const heading = element.querySelector('vaadin-accordion-heading');
      return getComputedStyle(heading).getPropertyValue('border-width').trim();
    },
  },
  {
    name: '--vaadin-accordion-heading-font-size',
    value: '24px',
    compute(element) {
      const heading = element.querySelector('vaadin-accordion-heading');
      return getComputedStyle(heading).getPropertyValue('font-size').trim();
    },
  },
  {
    name: '--vaadin-accordion-heading-font-weight',
    value: '700',
    compute(element) {
      const heading = element.querySelector('vaadin-accordion-heading');
      return getComputedStyle(heading).getPropertyValue('font-weight').trim();
    },
  },
  {
    name: '--vaadin-accordion-heading-gap',
    value: '20px',
    compute(element) {
      const heading = element.querySelector('vaadin-accordion-heading');
      return getComputedStyle(heading).getPropertyValue('gap').trim();
    },
  },
  {
    name: '--vaadin-accordion-heading-height',
    value: '100px',
    compute(element) {
      const heading = element.querySelector('vaadin-accordion-heading');
      return getComputedStyle(heading).getPropertyValue('height').trim();
    },
  },
  {
    name: '--vaadin-accordion-heading-padding',
    value: '20px',
    compute(element) {
      const heading = element.querySelector('vaadin-accordion-heading');
      return getComputedStyle(heading).getPropertyValue('padding').trim();
    },
  },
  {
    name: '--vaadin-accordion-heading-text-color',
    value: 'rgb(0, 0, 255)',
    compute(element) {
      const heading = element.querySelector('vaadin-accordion-heading');
      return getComputedStyle(heading).getPropertyValue('color').trim();
    },
  },
];

describe('accordion', () => {
  let element;
  beforeEach(async () => {
    element = fixtureSync(`
      <vaadin-accordion>
        <vaadin-accordion-panel>
          <vaadin-accordion-heading slot="summary">Panel 1</vaadin-accordion-heading>
          <div>Content 1</div>
        </vaadin-accordion-panel>
      </vaadin-accordion>
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
