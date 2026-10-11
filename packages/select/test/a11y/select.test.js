import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextUpdate, oneEvent } from '@vaadin/testing-helpers';
import '../../src/vaadin-select.js';

describe('vaadin-select', () => {
  let select;

  beforeEach(async () => {
    select = fixtureSync('<vaadin-select label="Size"></vaadin-select>');
    select.items = [
      { label: 'Small', value: 's' },
      { label: 'Medium', value: 'm' },
      { label: 'Large', value: 'l', disabled: true },
    ];
    await nextUpdate(select);
  });

  it('default', async () => {
    await expect(select).to.equalAriaSnapshot();
    await expect(select).to.be.accessible();
  });

  it('value', async () => {
    select.value = 'm';
    await nextUpdate(select);
    await expect(select).to.equalAriaSnapshot();
    await expect(select).to.be.accessible();
  });

  it('placeholder', async () => {
    select.placeholder = 'Choose a size';
    await nextUpdate(select);
    await expect(select).to.equalAriaSnapshot();
    await expect(select).to.be.accessible();
  });

  it('disabled', async () => {
    select.disabled = true;
    await nextUpdate(select);
    await expect(select).to.equalAriaSnapshot();
    await expect(select).to.be.accessible();
  });

  it('readonly', async () => {
    select.readonly = true;
    await nextUpdate(select);
    await expect(select).to.equalAriaSnapshot();
    await expect(select).to.be.accessible();
  });

  it('required', async () => {
    select.required = true;
    await nextUpdate(select);
    await expect(select).to.equalAriaSnapshot();
    // Known issue: `aria-required` is set on the value button, but `role="button"` does not support it.
    // See https://github.com/vaadin/web-components/issues/7337
    await expect(select).to.be.accessible({ ignoredRules: ['aria-allowed-attr'] });
  });

  it('error', async () => {
    select.errorMessage = 'Error message';
    select.invalid = true;
    await aTimeout(0);
    await expect(select).to.equalAriaSnapshot();
    await expect(select).to.be.accessible();
  });

  it('opened', async () => {
    select.value = 'm';
    const overlay = select.shadowRoot.querySelector('vaadin-select-overlay');
    select.opened = true;
    await oneEvent(overlay, 'vaadin-overlay-open');
    await expect(select).to.equalAriaSnapshot();
    // The list box in the overlay has no accessible name.
    await expect(select).to.be.accessible({ ignoredRules: ['aria-input-field-name'] });
  });
});
