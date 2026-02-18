import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '@vaadin/aura/aura.css';
import '@vaadin/number-field/src/vaadin-number-field.js';

// TODO: --vaadin-input-field-disabled-text-color is not documented but is used
// in input-container-base-styles.js:113 to set --vaadin-input-field-value-color when disabled.
//
// TODO: --vaadin-icon-visual-size fails because Aura theme sets it to 90% on
// ::part(field-button) and 75% on ::part(clear-button) in input-container.css:31-35,
// which overrides custom values set on the host.

export const props = [
  // === Field Surface ===
  {
    name: '--vaadin-input-field-background',
    value: 'rgb(255, 0, 0)',
    compute(element) {
      const container = element.shadowRoot.querySelector('[part="input-field"]');
      return getComputedStyle(container).getPropertyValue('background-color').trim();
    },
  },
  {
    name: '--vaadin-input-field-border-color',
    value: 'rgb(0, 255, 0)',
    compute(element) {
      const container = element.shadowRoot.querySelector('[part="input-field"]');
      return getComputedStyle(container).getPropertyValue('border-color').trim();
    },
  },
  {
    name: '--vaadin-input-field-border-radius',
    value: '20px',
    compute(element) {
      const container = element.shadowRoot.querySelector('[part="input-field"]');
      return getComputedStyle(container).getPropertyValue('border-radius').trim();
    },
  },
  {
    name: '--vaadin-input-field-border-width',
    value: '5px',
    compute(element) {
      const container = element.shadowRoot.querySelector('[part="input-field"]');
      return getComputedStyle(container).getPropertyValue('border-width').trim();
    },
  },
  {
    name: '--vaadin-input-field-top-start-radius',
    value: '15px',
    compute(element) {
      const container = element.shadowRoot.querySelector('[part="input-field"]');
      return getComputedStyle(container).getPropertyValue('border-top-left-radius').trim();
    },
  },
  {
    name: '--vaadin-input-field-top-end-radius',
    value: '16px',
    compute(element) {
      const container = element.shadowRoot.querySelector('[part="input-field"]');
      return getComputedStyle(container).getPropertyValue('border-top-right-radius').trim();
    },
  },
  {
    name: '--vaadin-input-field-bottom-start-radius',
    value: '17px',
    compute(element) {
      const container = element.shadowRoot.querySelector('[part="input-field"]');
      return getComputedStyle(container).getPropertyValue('border-bottom-left-radius').trim();
    },
  },
  {
    name: '--vaadin-input-field-bottom-end-radius',
    value: '18px',
    compute(element) {
      const container = element.shadowRoot.querySelector('[part="input-field"]');
      return getComputedStyle(container).getPropertyValue('border-bottom-right-radius').trim();
    },
  },
  {
    name: '--vaadin-input-field-padding',
    value: '20px',
    compute(element) {
      const container = element.shadowRoot.querySelector('[part="input-field"]');
      return getComputedStyle(container).getPropertyValue('padding').trim();
    },
  },
  {
    name: '--vaadin-input-field-value-color',
    value: 'rgb(100, 100, 100)',
    compute(element) {
      const container = element.shadowRoot.querySelector('[part="input-field"]');
      return getComputedStyle(container).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-input-field-value-font-size',
    value: '24px',
    compute(element) {
      const container = element.shadowRoot.querySelector('[part="input-field"]');
      return getComputedStyle(container).getPropertyValue('font-size').trim();
    },
  },
  {
    name: '--vaadin-input-field-value-font-weight',
    value: '700',
    compute(element) {
      const container = element.shadowRoot.querySelector('[part="input-field"]');
      return getComputedStyle(container).getPropertyValue('font-weight').trim();
    },
  },
  {
    name: '--vaadin-input-field-value-line-height',
    value: '40px',
    compute(element) {
      const container = element.shadowRoot.querySelector('[part="input-field"]');
      return getComputedStyle(container).getPropertyValue('line-height').trim();
    },
  },
  {
    name: '--vaadin-input-field-placeholder-color',
    value: 'rgb(200, 100, 50)',
    setup(element) {
      element.placeholder = 'Placeholder text';
    },
    compute(element) {
      const input = element.inputElement;
      return getComputedStyle(input).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-input-field-container-gap',
    value: '20px',
    compute(element) {
      // This property affects --_gap on the host
      return getComputedStyle(element).getPropertyValue('--_gap').trim();
    },
  },

  // === Field States ===
  {
    name: '--vaadin-focus-ring-width',
    value: '5px',
    setup(element) {
      element.focus();
    },
    compute(element) {
      const container = element.shadowRoot.querySelector('[part="input-field"]');
      return getComputedStyle(container).getPropertyValue('outline-width').trim();
    },
  },
  {
    name: '--vaadin-focus-ring-color',
    value: 'rgb(255, 100, 0)',
    setup(element) {
      element.focus();
    },
    compute(element) {
      const container = element.shadowRoot.querySelector('[part="input-field"]');
      return getComputedStyle(container).getPropertyValue('outline-color').trim();
    },
  },
  {
    name: '--vaadin-input-field-disabled-background',
    value: 'rgb(200, 200, 200)',
    setup(element) {
      element.disabled = true;
    },
    compute(element) {
      const container = element.shadowRoot.querySelector('[part="input-field"]');
      return getComputedStyle(container).getPropertyValue('background-color').trim();
    },
  },
  {
    name: '--vaadin-input-field-disabled-text-color',
    value: 'rgb(150, 150, 150)',
    setup(element) {
      element.disabled = true;
    },
    compute(element) {
      const container = element.shadowRoot.querySelector('[part="input-field"]');
      return getComputedStyle(container).getPropertyValue('color').trim();
    },
  },
  // Note: --vaadin-input-field-hover-highlight is Lumo-specific
  // Note: --vaadin-input-field-hover-highlight-opacity is Lumo-specific
  // Note: --vaadin-input-field-invalid-background is Lumo-specific
  // Note: --vaadin-input-field-invalid-hover-highlight is Lumo-specific
  // Note: --vaadin-input-field-readonly-border is Lumo-specific
  // Note: --vaadin-input-field-disabled-value-color is Lumo-specific

  // === Label ===
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
  // Note: --vaadin-input-field-focused-label-color is Lumo-specific
  // Note: --vaadin-input-field-hovered-label-color is Lumo-specific

  // === Helper Text ===
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
  // Note: --vaadin-input-field-helper-spacing is Lumo-specific

  // === Error Message ===
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

  // === Field Buttons & Icons ===
  {
    name: '--vaadin-input-field-button-text-color',
    value: 'rgb(150, 75, 0)',
    setup(element) {
      element.clearButtonVisible = true;
      element.value = '42';
    },
    compute(element) {
      const clearButton = element.shadowRoot.querySelector('[part~="clear-button"]');
      return getComputedStyle(clearButton).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-clickable-cursor',
    value: 'pointer',
    setup(element) {
      element.clearButtonVisible = true;
      element.value = '42';
    },
    compute(element) {
      const clearButton = element.shadowRoot.querySelector('[part~="clear-button"]');
      return getComputedStyle(clearButton).getPropertyValue('cursor').trim();
    },
  },
  {
    name: '--vaadin-icon-size',
    value: '30px',
    setup(element) {
      element.clearButtonVisible = true;
      element.value = '42';
    },
    compute(element) {
      const clearButton = element.shadowRoot.querySelector('[part~="clear-button"]');
      return getComputedStyle(clearButton, '::before').getPropertyValue('width').trim();
    },
  },
  {
    name: '--vaadin-icon-visual-size',
    value: '80%',
    setup(element) {
      element.clearButtonVisible = true;
      element.value = '42';
    },
    compute(element) {
      const clearButton = element.shadowRoot.querySelector('[part~="clear-button"]');
      return getComputedStyle(clearButton, '::before').getPropertyValue('mask-size').trim();
    },
  },
  {
    name: '--vaadin-disabled-cursor',
    value: 'not-allowed',
    setup(element) {
      element.disabled = true;
    },
    compute(element) {
      const container = element.shadowRoot.querySelector('[part="input-field"]');
      return getComputedStyle(container).getPropertyValue('cursor').trim();
    },
  },
  // Note: --vaadin-input-field-icon-size is Lumo-specific
  // Note: --vaadin-input-field-icon-color is Lumo-specific
  // Note: --vaadin-input-field-height is Lumo-specific
];

describe('number-field', () => {
  let element;
  beforeEach(async () => {
    element = fixtureSync('<vaadin-number-field></vaadin-number-field>');
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
