import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '@vaadin/aura/aura.css';
import '@vaadin/form-layout/src/vaadin-form-layout.js';
import '@vaadin/form-layout/src/vaadin-form-item.js';

// TODO: --vaadin-form-item-label-color is not documented but is used
// in vaadin-form-item-base-styles.js:31 to set label color.
//
// TODO: --vaadin-form-item-label-font-size is not documented but is used
// in vaadin-form-item-base-styles.js:33 to set label font-size.
//
// TODO: --vaadin-form-item-label-font-weight is not documented but is used
// in vaadin-form-item-base-styles.js:34 to set label font-weight.
//
// TODO: --vaadin-form-item-label-line-height is not documented but is used
// in vaadin-form-item-base-styles.js:35 to set label line-height.

export const props = [
  // === Form Layout Spacing ===
  {
    name: '--vaadin-form-layout-column-spacing',
    value: '40px',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('--vaadin-form-layout-column-spacing').trim();
    },
  },
  {
    name: '--vaadin-form-layout-row-spacing',
    value: '30px',
    compute(element) {
      return getComputedStyle(element).getPropertyValue('--vaadin-form-layout-row-spacing').trim();
    },
  },
  {
    name: '--vaadin-form-layout-label-spacing',
    value: '20px',
    compute(element) {
      const item = element.querySelector('vaadin-form-item');
      return getComputedStyle(item.shadowRoot.querySelector('#spacing')).getPropertyValue('width').trim();
    },
  },

  // === Form Layout Sizing ===
  {
    name: '--vaadin-form-layout-label-width',
    value: '100px',
    compute(element) {
      const item = element.querySelector('vaadin-form-item');
      return getComputedStyle(item.shadowRoot.querySelector('[part="label"]')).getPropertyValue('width').trim();
    },
  },

  // === Form Item Label (undocumented) ===
  {
    name: '--vaadin-form-item-label-color',
    value: 'rgb(255, 0, 0)',
    compute(element) {
      const item = element.querySelector('vaadin-form-item');
      return getComputedStyle(item.shadowRoot.querySelector('[part="label"]')).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-form-item-label-font-size',
    value: '24px',
    compute(element) {
      const item = element.querySelector('vaadin-form-item');
      return getComputedStyle(item.shadowRoot.querySelector('[part="label"]')).getPropertyValue('font-size').trim();
    },
  },
  {
    name: '--vaadin-form-item-label-font-weight',
    value: '700',
    compute(element) {
      const item = element.querySelector('vaadin-form-item');
      return getComputedStyle(item.shadowRoot.querySelector('[part="label"]')).getPropertyValue('font-weight').trim();
    },
  },
  {
    name: '--vaadin-form-item-label-line-height',
    value: '30px',
    compute(element) {
      const item = element.querySelector('vaadin-form-item');
      return getComputedStyle(item.shadowRoot.querySelector('[part="label"]')).getPropertyValue('line-height').trim();
    },
  },
];

describe('form-layout', () => {
  let element;
  beforeEach(async () => {
    element = fixtureSync(`
      <vaadin-form-layout>
        <vaadin-form-item>
          <label slot="label">Label</label>
          <input />
        </vaadin-form-item>
        <vaadin-form-item>
          <label slot="label">Label 2</label>
          <input />
        </vaadin-form-item>
      </vaadin-form-layout>
    `);
    element.responsiveSteps = [{ columns: 2 }];
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
