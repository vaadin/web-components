import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '@vaadin/aura/aura.css';
import '@vaadin/virtual-list/src/vaadin-virtual-list.js';

// TODO: --vaadin-virtual-list-overflow-indicator-height is not documented but is used
// in vaadin-virtual-list-base-styles.js:23 to set the overflow indicator border height.

export const props = [
  // === Padding ===
  {
    name: '--vaadin-virtual-list-padding-block',
    value: '20px',
    compute(element) {
      // This property is used in ::before margin-bottom as calc(padding-block - indicator-height).
      // Set indicator height to 0 so that margin-bottom equals the padding-block value.
      element.style.setProperty('--vaadin-virtual-list-overflow-indicator-height', '0px');
      return getComputedStyle(element, '::before').getPropertyValue('margin-bottom').trim();
    },
  },
  {
    name: '--vaadin-virtual-list-padding-inline',
    value: '30px',
    compute(element) {
      // This property is used as inset-inline on ::slotted(*) items, which are light DOM children.
      // Read the custom property value from the host to verify it resolves correctly.
      return getComputedStyle(element).getPropertyValue('--vaadin-virtual-list-padding-inline').trim();
    },
  },

  // === Undocumented ===
  {
    name: '--vaadin-virtual-list-overflow-indicator-height',
    value: '5px',
    compute(element) {
      return getComputedStyle(element, '::before').getPropertyValue('height').trim();
    },
  },
];

describe('virtual-list', () => {
  let element;
  beforeEach(async () => {
    element = fixtureSync('<vaadin-virtual-list></vaadin-virtual-list>');
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
