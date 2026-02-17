import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '@vaadin/aura/aura.css';
import '@vaadin/radio-group/src/vaadin-radio-group.js';

// TODO: --vaadin-radio-button-label-font-weight fails because the code uses
// --vaadin-radio-button-font-weight (without "label-") in checkable-base-styles.js:40.
//
// TODO: --vaadin-radio-button-marker-color fails because Aura theme sets it directly
// on ::part(radio) in checked state (checkbox-radio.css:46-49), which overrides
// the inherited value from the host.

export const props = [
  // === Radio Button ===
  {
    name: '--vaadin-radio-button-size',
    value: '30px',
    compute(element) {
      const radioButton = element.querySelector('vaadin-radio-button');
      const radio = radioButton.shadowRoot.querySelector('[part="radio"]');
      return getComputedStyle(radio).getPropertyValue('width').trim();
    },
  },
  {
    name: '--vaadin-radio-button-background',
    value: 'rgb(255, 0, 0)',
    compute(element) {
      const radioButton = element.querySelector('vaadin-radio-button');
      const radio = radioButton.shadowRoot.querySelector('[part="radio"]');
      return getComputedStyle(radio).getPropertyValue('background-color').trim();
    },
  },
  {
    name: '--vaadin-radio-button-border-color',
    value: 'rgb(0, 255, 0)',
    compute(element) {
      const radioButton = element.querySelector('vaadin-radio-button');
      const radio = radioButton.shadowRoot.querySelector('[part="radio"]');
      return getComputedStyle(radio).getPropertyValue('border-color').trim();
    },
  },
  {
    name: '--vaadin-radio-button-border-width',
    value: '3px',
    compute(element) {
      const radioButton = element.querySelector('vaadin-radio-button');
      const radio = radioButton.shadowRoot.querySelector('[part="radio"]');
      return getComputedStyle(radio).getPropertyValue('border-width').trim();
    },
  },

  // === Radio Button Layout ===
  {
    name: '--vaadin-radio-button-gap',
    value: '20px',
    compute(element) {
      const radioButton = element.querySelector('vaadin-radio-button');
      return getComputedStyle(radioButton).getPropertyValue('column-gap').trim();
    },
  },

  // === Radio Button Label ===
  {
    name: '--vaadin-radio-button-label-color',
    value: 'rgb(50, 100, 150)',
    compute(element) {
      const radioButton = element.querySelector('vaadin-radio-button');
      const label = radioButton.querySelector('[slot=label]');
      return getComputedStyle(label).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-radio-button-label-font-size',
    value: '20px',
    compute(element) {
      const radioButton = element.querySelector('vaadin-radio-button');
      const label = radioButton.querySelector('[slot=label]');
      return getComputedStyle(label).getPropertyValue('font-size').trim();
    },
  },
  {
    name: '--vaadin-radio-button-label-font-weight',
    value: '700',
    compute(element) {
      const radioButton = element.querySelector('vaadin-radio-button');
      const label = radioButton.querySelector('[slot=label]');
      return getComputedStyle(label).getPropertyValue('font-weight').trim();
    },
  },
  {
    name: '--vaadin-radio-button-label-line-height',
    value: '30px',
    compute(element) {
      const radioButton = element.querySelector('vaadin-radio-button');
      const label = radioButton.querySelector('[slot=label]');
      return getComputedStyle(label).getPropertyValue('line-height').trim();
    },
  },

  // === Radio Button Marker ===
  {
    name: '--vaadin-radio-button-marker-color',
    value: 'rgb(0, 0, 255)',
    setup(element) {
      const radioButton = element.querySelector('vaadin-radio-button');
      radioButton.checked = true;
    },
    compute(element) {
      const radioButton = element.querySelector('vaadin-radio-button');
      const radio = radioButton.shadowRoot.querySelector('[part="radio"]');
      return getComputedStyle(radio).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-radio-button-marker-size',
    value: '10px',
    setup(element) {
      const radioButton = element.querySelector('vaadin-radio-button');
      radioButton.checked = true;
    },
    compute(element) {
      const radioButton = element.querySelector('vaadin-radio-button');
      const radio = radioButton.shadowRoot.querySelector('[part="radio"]');
      return getComputedStyle(radio, '::after').getPropertyValue('width').trim();
    },
  },

  // === Radio Group Label ===
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

  // === Radio Group Helper Text ===
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

  // === Radio Group Error Message ===
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

  // Note: --vaadin-radio-button-background-hover is Lumo-specific
  // Note: --vaadin-radio-button-disabled-background is Lumo-specific
  // Note: --vaadin-radio-button-disabled-dot-color is Lumo-specific
  // Note: --vaadin-radio-button-dot-color is Lumo-specific
  // Note: --vaadin-radio-button-dot-size is Lumo-specific
  // Note: --vaadin-radio-button-label-padding is Lumo-specific
];

describe('radio-group', () => {
  let element;
  beforeEach(async () => {
    element = fixtureSync(`
      <vaadin-radio-group>
        <vaadin-radio-button label="Option 1" value="1"></vaadin-radio-button>
        <vaadin-radio-button label="Option 2" value="2"></vaadin-radio-button>
      </vaadin-radio-group>
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
