import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '@vaadin/aura/aura.css';
import '@vaadin/avatar/src/vaadin-avatar.js';

export const props = [
  {
    name: '--vaadin-avatar-background',
    value: 'rgb(255, 0, 0)',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('background-color').trim();
    },
  },
  {
    name: '--vaadin-avatar-text-color',
    value: 'rgb(0, 255, 0)',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-avatar-size',
    value: '100px',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('height').trim();
    },
  },
  {
    name: '--vaadin-avatar-font-size',
    value: '24px',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('font-size').trim();
    },
  },
  {
    name: '--vaadin-avatar-font-weight',
    value: '700',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('font-weight').trim();
    },
  },
  {
    name: '--vaadin-avatar-border-color',
    value: 'rgb(0, 0, 255)',
    compute(element) {
      return getComputedStyle(element, '::before').getPropertyValue('outline-color').trim();
    },
  },
  {
    name: '--vaadin-avatar-border-width',
    value: '5px',
    compute(element) {
      return getComputedStyle(element, '::before').getPropertyValue('outline-width').trim();
    },
  },
];

describe('avatar', () => {
  let element;
  beforeEach(async () => {
    element = fixtureSync('<vaadin-avatar></vaadin-avatar>');
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
