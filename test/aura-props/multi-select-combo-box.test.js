import { expect } from '@vaadin/chai-plugins';
import { fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import '@vaadin/aura/aura.css';
import '@vaadin/multi-select-combo-box/src/vaadin-multi-select-combo-box.js';

// TODO: --vaadin-overlay-shadow fails because Aura theme combines it with
// --aura-overlay-outline-shadow in overlay.css:32, so the computed box-shadow
// doesn't match the custom property value alone.
//
// TODO: --vaadin-icon-visual-size fails because Aura theme sets it to 75% directly on
// ::part(clear-button) in input-container.css:35 and on ::part(checkmark) in
// item-overlay.css:34, which overrides custom values set on the host.
//
// TODO: --vaadin-item-padding fails because Aura theme overrides padding-inline-start
// directly on vaadin-multi-select-combo-box-item in item-overlay.css:29 with
// max(0px, var(--vaadin-padding-inline-container) - var(--aura-item-overlay-padding-inline)),
// so setting --vaadin-item-padding alone results in a different padding-inline-start.
//
// TODO: --vaadin-chip-gap is not documented but is used
// in vaadin-multi-select-combo-box-chip-base-styles.js:16 to set the gap between chip elements.
//
// TODO: --vaadin-chip-background is not documented but is used
// in vaadin-multi-select-combo-box-chip-base-styles.js:17 to set the chip background.
//
// TODO: --vaadin-chip-text-color is not documented but is used
// in vaadin-multi-select-combo-box-chip-base-styles.js:18 to set the chip text color.
//
// TODO: --vaadin-chip-font-size is not documented but is used
// in vaadin-multi-select-combo-box-chip-base-styles.js:19 to set the chip font size.
//
// TODO: --vaadin-chip-font-weight is not documented but is used
// in vaadin-multi-select-combo-box-chip-base-styles.js:20 to set the chip font weight.
//
// TODO: --vaadin-chip-padding is not documented but is used
// in vaadin-multi-select-combo-box-chip-base-styles.js:22 to set the chip padding.
//
// TODO: --vaadin-chip-height is not documented but is used
// in vaadin-multi-select-combo-box-chip-base-styles.js:23 to set the chip height.
//
// TODO: --vaadin-chip-border-radius is not documented but is used
// in vaadin-multi-select-combo-box-chip-base-styles.js:24 to set the chip border radius.
//
// TODO: --vaadin-chip-border-width is not documented but is used
// in vaadin-multi-select-combo-box-chip-base-styles.js:25 to set the chip border width.
//
// TODO: --vaadin-chip-border-color is not documented but is used
// in vaadin-multi-select-combo-box-chip-base-styles.js:26 to set the chip border color.
//
// TODO: --vaadin-chip-remove-button-text-color is not documented but is used
// in vaadin-multi-select-combo-box-chip-base-styles.js:50 to set the chip remove button color.
//
// TODO: --vaadin-multi-select-combo-box-chips-gap is not documented but is used
// in vaadin-multi-select-combo-box-base-styles.js:17 to set the gap between chips.
//
// TODO: --vaadin-input-field-disabled-text-color is not documented but is used
// in input-container-base-styles.js:113 to set --vaadin-input-field-value-color when disabled.

/**
 * Opens the multi-select combo box dropdown and waits for items to render.
 */
async function openDropdown(element) {
  element.opened = true;
  await nextRender();
  await nextRender();
  return element.shadowRoot.querySelector('#overlay');
}

/**
 * Returns the first item in the dropdown.
 */
function getItem(element) {
  return element._scroller.querySelector('vaadin-multi-select-combo-box-item');
}

/**
 * Returns the first chip in the component (requires selectedItems to be set).
 */
function getChip(element) {
  return element.querySelector('vaadin-multi-select-combo-box-chip[slot="chip"]');
}

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
      element.selectedItems = ['Apple'];
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
      element.selectedItems = ['Apple'];
    },
    compute(element) {
      const clearButton = element.shadowRoot.querySelector('[part~="clear-button"]');
      return getComputedStyle(clearButton).getPropertyValue('cursor').trim();
    },
  },
  {
    name: '--vaadin-disabled-cursor',
    value: 'not-allowed',
    setup(element) {
      element.disabled = true;
      element.selectedItems = ['Apple'];
    },
    compute(element) {
      const chip = getChip(element);
      return getComputedStyle(chip).getPropertyValue('cursor').trim();
    },
  },
  {
    name: '--vaadin-icon-size',
    value: '30px',
    setup(element) {
      element.clearButtonVisible = true;
      element.selectedItems = ['Apple'];
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
      element.selectedItems = ['Apple'];
    },
    compute(element) {
      const clearButton = element.shadowRoot.querySelector('[part~="clear-button"]');
      return getComputedStyle(clearButton, '::before').getPropertyValue('mask-size').trim();
    },
  },
  // Note: --vaadin-input-field-icon-size is Lumo-specific
  // Note: --vaadin-input-field-icon-color is Lumo-specific
  // Note: --vaadin-input-field-height is Lumo-specific
  // Note: --vaadin-input-field-disabled-value-color is Lumo-specific

  // === Component-Specific Properties ===
  {
    name: '--vaadin-multi-select-combo-box-chip-min-width',
    value: '60px',
    compute(element) {
      // This property maps to --_chip-min-width on the host element
      return getComputedStyle(element).getPropertyValue('--_chip-min-width').trim();
    },
  },
  {
    name: '--vaadin-multi-select-combo-box-input-min-width',
    value: '200px',
    compute(element) {
      const input = element.inputElement;
      return getComputedStyle(input).getPropertyValue('flex-basis').trim();
    },
  },

  // === Chip Properties (undocumented) ===
  {
    name: '--vaadin-chip-gap',
    value: '8px',
    setup(element) {
      element.selectedItems = ['Apple'];
    },
    compute(element) {
      const chip = getChip(element);
      return getComputedStyle(chip).getPropertyValue('gap').trim();
    },
  },
  {
    name: '--vaadin-chip-background',
    value: 'rgb(255, 0, 0)',
    setup(element) {
      element.selectedItems = ['Apple'];
    },
    compute(element) {
      const chip = getChip(element);
      return getComputedStyle(chip).getPropertyValue('background-color').trim();
    },
  },
  {
    name: '--vaadin-chip-text-color',
    value: 'rgb(0, 255, 0)',
    setup(element) {
      element.selectedItems = ['Apple'];
    },
    compute(element) {
      const chip = getChip(element);
      return getComputedStyle(chip).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-chip-font-size',
    value: '20px',
    setup(element) {
      element.selectedItems = ['Apple'];
    },
    compute(element) {
      const chip = getChip(element);
      return getComputedStyle(chip).getPropertyValue('font-size').trim();
    },
  },
  {
    name: '--vaadin-chip-font-weight',
    value: '800',
    setup(element) {
      element.selectedItems = ['Apple'];
    },
    compute(element) {
      const chip = getChip(element);
      return getComputedStyle(chip).getPropertyValue('font-weight').trim();
    },
  },
  {
    name: '--vaadin-chip-padding',
    value: '10px',
    setup(element) {
      element.selectedItems = ['Apple'];
    },
    compute(element) {
      const chip = getChip(element);
      // Chip uses `padding: 0 var(--vaadin-chip-padding)` so only inline padding is set
      return getComputedStyle(chip).getPropertyValue('padding-inline').trim();
    },
  },
  {
    name: '--vaadin-chip-height',
    value: '40px',
    setup(element) {
      element.selectedItems = ['Apple'];
    },
    compute(element) {
      const chip = getChip(element);
      return getComputedStyle(chip).getPropertyValue('height').trim();
    },
  },
  {
    name: '--vaadin-chip-border-radius',
    value: '20px',
    setup(element) {
      element.selectedItems = ['Apple'];
    },
    compute(element) {
      const chip = getChip(element);
      return getComputedStyle(chip).getPropertyValue('border-radius').trim();
    },
  },
  {
    name: '--vaadin-chip-border-width',
    value: '3px',
    setup(element) {
      element.selectedItems = ['Apple'];
    },
    compute(element) {
      const chip = getChip(element);
      return getComputedStyle(chip).getPropertyValue('border-width').trim();
    },
  },
  {
    name: '--vaadin-chip-border-color',
    value: 'rgb(0, 0, 255)',
    setup(element) {
      element.selectedItems = ['Apple'];
      element.style.setProperty('--vaadin-chip-border-width', '2px');
    },
    compute(element) {
      const chip = getChip(element);
      return getComputedStyle(chip).getPropertyValue('border-color').trim();
    },
  },
  {
    name: '--vaadin-chip-remove-button-text-color',
    value: 'rgb(255, 128, 0)',
    setup(element) {
      element.selectedItems = ['Apple'];
    },
    compute(element) {
      const chip = getChip(element);
      const removeButton = chip.shadowRoot.querySelector('[part="remove-button"]');
      return getComputedStyle(removeButton).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-multi-select-combo-box-chips-gap',
    value: '10px',
    setup(element) {
      element.selectedItems = ['Apple', 'Banana'];
    },
    compute(element) {
      const chips = element.shadowRoot.querySelector('#chips');
      return getComputedStyle(chips).getPropertyValue('gap').trim();
    },
  },

  // === Overlay Properties ===
  {
    name: '--vaadin-multi-select-combo-box-overlay-width',
    value: '500px',
    async setup(element) {
      await openDropdown(element);
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('width').trim();
    },
  },
  {
    name: '--vaadin-multi-select-combo-box-overlay-max-height',
    value: '200px',
    async setup(element) {
      await openDropdown(element);
    },
    compute(element) {
      return getComputedStyle(element._scroller).getPropertyValue('max-height').trim();
    },
  },
  {
    name: '--vaadin-item-overlay-padding',
    value: '20px',
    async setup(element) {
      await openDropdown(element);
    },
    compute(element) {
      // For combo-box overlays, this property is used as border-width on the scroller's #selector
      const selector = element._scroller.shadowRoot.querySelector('#selector');
      return getComputedStyle(selector).getPropertyValue('border-width').trim();
    },
  },
  {
    name: '--vaadin-overlay-background',
    value: 'rgb(255, 0, 0)',
    async setup(element) {
      await openDropdown(element);
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('background-color').trim();
    },
  },
  {
    name: '--vaadin-overlay-border-color',
    value: 'rgb(0, 255, 0)',
    async setup(element) {
      element.style.setProperty('--vaadin-overlay-border-width', '2px');
      await openDropdown(element);
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('border-color').trim();
    },
  },
  {
    name: '--vaadin-overlay-border-radius',
    value: '20px',
    async setup(element) {
      await openDropdown(element);
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('border-radius').trim();
    },
  },
  {
    name: '--vaadin-overlay-border-width',
    value: '5px',
    async setup(element) {
      await openDropdown(element);
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('border-width').trim();
    },
  },
  {
    name: '--vaadin-overlay-shadow',
    value: '0 0 10px rgb(255, 0, 0)',
    async setup(element) {
      await openDropdown(element);
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const overlayPart = overlay.shadowRoot.querySelector('[part="overlay"]');
      return getComputedStyle(overlayPart).getPropertyValue('box-shadow').trim();
    },
  },

  // === Spinner Properties ===
  {
    name: '--vaadin-spinner-color',
    value: 'rgb(255, 0, 0)',
    async setup(element) {
      element.loading = true;
      await openDropdown(element);
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const loader = overlay.shadowRoot.querySelector('[part="loader"]');
      return getComputedStyle(loader).getPropertyValue('--_spinner-color').trim();
    },
  },
  {
    name: '--vaadin-spinner-width',
    value: '5px',
    async setup(element) {
      element.loading = true;
      await openDropdown(element);
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const loader = overlay.shadowRoot.querySelector('[part="loader"]');
      return getComputedStyle(loader).getPropertyValue('border-width').trim();
    },
  },
  {
    name: '--vaadin-spinner-size',
    value: '30px',
    async setup(element) {
      element.loading = true;
      await openDropdown(element);
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const loader = overlay.shadowRoot.querySelector('[part="loader"]');
      return getComputedStyle(loader).getPropertyValue('width').trim();
    },
  },
  {
    name: '--vaadin-spinner-animation-duration',
    value: '2s',
    async setup(element) {
      element.loading = true;
      await openDropdown(element);
    },
    compute(element) {
      const overlay = element.shadowRoot.querySelector('#overlay');
      const loader = overlay.shadowRoot.querySelector('[part="loader"]');
      // animation-duration is the duration of the spin animation (first in the list)
      const duration = getComputedStyle(loader).getPropertyValue('animation-duration').trim();
      return duration.split(',')[0].trim();
    },
  },

  // === Overlay Item Properties ===
  {
    name: '--vaadin-item-border-radius',
    value: '20px',
    async setup(element) {
      await openDropdown(element);
    },
    compute(element) {
      const item = getItem(element);
      return getComputedStyle(item).getPropertyValue('border-radius').trim();
    },
  },
  {
    name: '--vaadin-item-checkmark-color',
    value: 'rgb(0, 0, 255)',
    async setup(element) {
      element.selectedItems = ['Apple'];
      await openDropdown(element);
    },
    compute(element) {
      const item = getItem(element);
      const checkmark = item.shadowRoot.querySelector('[part="checkmark"]');
      return getComputedStyle(checkmark).getPropertyValue('color').trim();
    },
  },
  {
    name: '--vaadin-item-gap',
    value: '30px',
    async setup(element) {
      await openDropdown(element);
    },
    compute(element) {
      const item = getItem(element);
      // Aura sets gap:0 on the host but uses --vaadin-item-gap on ::part(content)
      const content = item.shadowRoot.querySelector('[part="content"]');
      return getComputedStyle(content).getPropertyValue('gap').trim();
    },
  },
  {
    name: '--vaadin-item-height',
    value: '60px',
    async setup(element) {
      await openDropdown(element);
    },
    compute(element) {
      const item = getItem(element);
      return getComputedStyle(item).getPropertyValue('height').trim();
    },
  },
  {
    name: '--vaadin-item-padding',
    value: '20px',
    async setup(element) {
      await openDropdown(element);
    },
    compute(element) {
      const item = getItem(element);
      return getComputedStyle(item).getPropertyValue('padding').trim();
    },
  },
  {
    name: '--vaadin-icon-visual-size',
    value: '80%',
    async setup(element) {
      element.selectedItems = ['Apple'];
      await openDropdown(element);
    },
    compute(element) {
      const item = getItem(element);
      const checkmark = item.shadowRoot.querySelector('[part="checkmark"]');
      return getComputedStyle(checkmark, '::before').getPropertyValue('mask-size').trim();
    },
  },
];

describe('multi-select-combo-box', () => {
  let element;
  beforeEach(async () => {
    element = fixtureSync('<vaadin-multi-select-combo-box></vaadin-multi-select-combo-box>');
    element.items = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];
    await nextUpdate(element);
  });

  afterEach(() => {
    element.opened = false;
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
