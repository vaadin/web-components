import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '@vaadin/aura/aura.css';
import '@vaadin/checkbox/src/vaadin-checkbox.js';

// TODO: --vaadin-checkbox-label-font-weight fails because the code uses
// --vaadin-checkbox-font-weight (without "label-") in checkable-base-styles.js:40.
//
// TODO: --vaadin-checkbox-marker-color fails because Aura theme sets it directly
// on ::part(checkbox) in checked state (checkbox-radio.css:41), which overrides
// the inherited value from the host.

export const props = [
  // === Checkbox ===
  {
    name: '--vaadin-checkbox-size',
    value: '30px',
    compute(element) {
      const checkbox = element.shadowRoot.querySelector('[part="checkbox"]');
      return getComputedStyle(checkbox).getPropertyValue('width').trim();
    },
  },
  {
    name: '--vaadin-checkbox-background',
    value: 'rgb(255, 0, 0)',
    compute(element) {
      const checkbox = element.shadowRoot.querySelector('[part="checkbox"]');
      return getComputedStyle(checkbox).getPropertyValue('background-color').trim();
    },
  },
  {
    name: '--vaadin-checkbox-border-color',
    value: 'rgb(0, 255, 0)',
    compute(element) {
      const checkbox = element.shadowRoot.querySelector('[part="checkbox"]');
      return getComputedStyle(checkbox).getPropertyValue('border-color').trim();
    },
  },
  {
    name: '--vaadin-checkbox-border-radius',
    value: '8px',
    compute(element) {
      const checkbox = element.shadowRoot.querySelector('[part="checkbox"]');
      return getComputedStyle(checkbox).getPropertyValue('border-radius').trim();
    },
  },
  {
    name: '--vaadin-checkbox-border-width',
    value: '3px',
    compute(element) {
      const checkbox = element.shadowRoot.querySelector('[part="checkbox"]');
      return getComputedStyle(checkbox).getPropertyValue('border-width').trim();
    },
  },

  // === Layout ===
  {
    name: '--vaadin-checkbox-gap',
    value: '20px',
    setup(element) {
      element.label = 'Test';
    },
    compute(element) {
      return getComputedStyle(element).getPropertyValue('column-gap').trim();
    },
  },

  // === Label ===
  {
    name: '--vaadin-checkbox-label-color',
    value: 'rgb(50, 100, 150)',
    setup(element) {
      element.label = 'Test';
    },
    compute(element) {
      const label = element.shadowRoot.querySelector('[part="label"]');
      return getComputedStyle(label).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-checkbox-label-font-size',
    value: '20px',
    setup(element) {
      element.label = 'Test';
    },
    compute(element) {
      const label = element.shadowRoot.querySelector('[part="label"]');
      return getComputedStyle(label).getPropertyValue('font-size').trim();
    },
  },
  {
    name: '--vaadin-checkbox-label-font-weight',
    value: '700',
    setup(element) {
      element.label = 'Test';
    },
    compute(element) {
      const label = element.shadowRoot.querySelector('[part="label"]');
      return getComputedStyle(label).getPropertyValue('font-weight').trim();
    },
  },
  {
    name: '--vaadin-checkbox-label-line-height',
    value: '30px',
    setup(element) {
      element.label = 'Test';
    },
    compute(element) {
      const label = element.shadowRoot.querySelector('[part="label"]');
      return getComputedStyle(label).getPropertyValue('line-height').trim();
    },
  },

  // === Marker ===
  {
    name: '--vaadin-checkbox-marker-color',
    value: 'rgb(0, 0, 255)',
    setup(element) {
      element.checked = true;
    },
    compute(element) {
      const checkbox = element.shadowRoot.querySelector('[part="checkbox"]');
      return getComputedStyle(checkbox).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-checkbox-marker-size',
    value: '80%',
    setup(element) {
      element.checked = true;
    },
    compute(element) {
      const checkbox = element.shadowRoot.querySelector('[part="checkbox"]');
      return getComputedStyle(checkbox, '::after').getPropertyValue('mask-size').trim();
    },
  },

  // === Shared Label ===
  {
    name: '--vaadin-input-field-label-color',
    value: 'rgb(50, 100, 150)',
    setup(element) {
      element.label = 'Test Label';
    },
    compute(element) {
      const label = element.shadowRoot.querySelector('[part="label"]');
      return getComputedStyle(label).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-input-field-label-font-size',
    value: '20px',
    setup(element) {
      element.label = 'Test Label';
    },
    compute(element) {
      const label = element.shadowRoot.querySelector('[part="label"]');
      return getComputedStyle(label).getPropertyValue('font-size').trim();
    },
  },
  {
    name: '--vaadin-input-field-label-font-weight',
    value: '800',
    setup(element) {
      element.label = 'Test Label';
    },
    compute(element) {
      const label = element.shadowRoot.querySelector('[part="label"]');
      return getComputedStyle(label).getPropertyValue('font-weight').trim();
    },
  },
  {
    name: '--vaadin-input-field-label-line-height',
    value: '30px',
    setup(element) {
      element.label = 'Test Label';
    },
    compute(element) {
      const label = element.shadowRoot.querySelector('[part="label"]');
      return getComputedStyle(label).getPropertyValue('line-height').trim();
    },
  },
  {
    name: '--vaadin-input-field-required-indicator-color',
    value: 'rgb(255, 0, 255)',
    setup(element) {
      element.label = 'Test Label';
      element.required = true;
    },
    compute(element) {
      const indicator = element.shadowRoot.querySelector('[part="required-indicator"]');
      return getComputedStyle(indicator).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-input-field-required-indicator',
    value: '"!"',
    setup(element) {
      element.label = 'Test Label';
      element.required = true;
    },
    compute(element) {
      const indicator = element.shadowRoot.querySelector('[part="required-indicator"]');
      return getComputedStyle(indicator, '::after').getPropertyValue('content').trim();
    },
  },

  // === Shared Helper Text ===
  {
    name: '--vaadin-input-field-helper-color',
    value: 'rgb(100, 150, 200)',
    setup(element) {
      element.helperText = 'Helper text';
    },
    compute(element) {
      const helper = element.shadowRoot.querySelector('[part="helper-text"]');
      return getComputedStyle(helper).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-input-field-helper-font-size',
    value: '14px',
    setup(element) {
      element.helperText = 'Helper text';
    },
    compute(element) {
      const helper = element.shadowRoot.querySelector('[part="helper-text"]');
      return getComputedStyle(helper).getPropertyValue('font-size').trim();
    },
  },
  {
    name: '--vaadin-input-field-helper-font-weight',
    value: '600',
    setup(element) {
      element.helperText = 'Helper text';
    },
    compute(element) {
      const helper = element.shadowRoot.querySelector('[part="helper-text"]');
      return getComputedStyle(helper).getPropertyValue('font-weight').trim();
    },
  },
  {
    name: '--vaadin-input-field-helper-line-height',
    value: '22px',
    setup(element) {
      element.helperText = 'Helper text';
    },
    compute(element) {
      const helper = element.shadowRoot.querySelector('[part="helper-text"]');
      return getComputedStyle(helper).getPropertyValue('line-height').trim();
    },
  },

  // === Shared Error Message ===
  {
    name: '--vaadin-input-field-error-color',
    value: 'rgb(200, 50, 50)',
    setup(element) {
      element.errorMessage = 'Error message';
      element.invalid = true;
    },
    compute(element) {
      const error = element.shadowRoot.querySelector('[part="error-message"]');
      return getComputedStyle(error).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-input-field-error-font-size',
    value: '12px',
    setup(element) {
      element.errorMessage = 'Error message';
      element.invalid = true;
    },
    compute(element) {
      const error = element.shadowRoot.querySelector('[part="error-message"]');
      return getComputedStyle(error).getPropertyValue('font-size').trim();
    },
  },
  {
    name: '--vaadin-input-field-error-font-weight',
    value: '500',
    setup(element) {
      element.errorMessage = 'Error message';
      element.invalid = true;
    },
    compute(element) {
      const error = element.shadowRoot.querySelector('[part="error-message"]');
      return getComputedStyle(error).getPropertyValue('font-weight').trim();
    },
  },
  {
    name: '--vaadin-input-field-error-line-height',
    value: '18px',
    setup(element) {
      element.errorMessage = 'Error message';
      element.invalid = true;
    },
    compute(element) {
      const error = element.shadowRoot.querySelector('[part="error-message"]');
      return getComputedStyle(error).getPropertyValue('line-height').trim();
    },
  },
];

describe('checkbox', () => {
  let element;
  beforeEach(async () => {
    element = fixtureSync('<vaadin-checkbox></vaadin-checkbox>');
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
