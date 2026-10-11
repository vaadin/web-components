import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '../../src/vaadin-checkbox.js';

describe('vaadin-checkbox', () => {
  let checkbox;

  beforeEach(async () => {
    checkbox = fixtureSync('<vaadin-checkbox label="Accept terms"></vaadin-checkbox>');
    await nextUpdate(checkbox);
  });

  it('default', async () => {
    await expect(checkbox).to.equalA11yTreeSnapshot();
    await expect(checkbox).to.be.accessible();
  });

  it('checked', async () => {
    checkbox.checked = true;
    await nextUpdate(checkbox);
    await expect(checkbox).to.equalA11yTreeSnapshot();
    await expect(checkbox).to.be.accessible();
  });

  it('indeterminate', async () => {
    checkbox.indeterminate = true;
    await nextUpdate(checkbox);
    await expect(checkbox).to.equalA11yTreeSnapshot();
    await expect(checkbox).to.be.accessible();
  });

  it('disabled', async () => {
    checkbox.disabled = true;
    await nextUpdate(checkbox);
    await expect(checkbox).to.equalA11yTreeSnapshot();
    await expect(checkbox).to.be.accessible();
  });

  it('readonly', async () => {
    checkbox.readonly = true;
    await nextUpdate(checkbox);
    await expect(checkbox).to.equalA11yTreeSnapshot();
    await expect(checkbox).to.be.accessible();
  });

  it('required', async () => {
    checkbox.required = true;
    await nextUpdate(checkbox);
    await expect(checkbox).to.equalA11yTreeSnapshot();
    await expect(checkbox).to.be.accessible();
  });

  it('helper', async () => {
    checkbox.helperText = 'Read the terms first';
    await nextUpdate(checkbox);
    await expect(checkbox).to.equalA11yTreeSnapshot();
    await expect(checkbox).to.be.accessible();
  });

  it('error', async () => {
    checkbox.errorMessage = 'You must accept the terms';
    checkbox.invalid = true;
    await aTimeout(0);
    await expect(checkbox).to.equalA11yTreeSnapshot();
    await expect(checkbox).to.be.accessible();
  });
});
