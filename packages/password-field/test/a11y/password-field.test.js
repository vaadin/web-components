import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '../../src/vaadin-password-field.js';

describe('vaadin-password-field', () => {
  let passwordField;

  beforeEach(async () => {
    passwordField = fixtureSync('<vaadin-password-field label="Password"></vaadin-password-field>');
    await nextUpdate(passwordField);
  });

  it('default', async () => {
    await expect(passwordField).to.equalAriaSnapshot();
    await expect(passwordField).to.be.accessible();
  });

  it('value', async () => {
    passwordField.value = 'secret';
    await nextUpdate(passwordField);
    await expect(passwordField).to.equalAriaSnapshot();
    await expect(passwordField).to.be.accessible();
  });

  it('password visible', async () => {
    passwordField.value = 'secret';
    passwordField.querySelector('[slot="reveal"]').click();
    await nextUpdate(passwordField);
    await expect(passwordField).to.equalAriaSnapshot();
    await expect(passwordField).to.be.accessible();
  });

  it('reveal button hidden', async () => {
    passwordField.revealButtonHidden = true;
    await nextUpdate(passwordField);
    await expect(passwordField).to.equalAriaSnapshot();
    await expect(passwordField).to.be.accessible();
  });

  it('disabled', async () => {
    passwordField.disabled = true;
    await nextUpdate(passwordField);
    await expect(passwordField).to.equalAriaSnapshot();
    await expect(passwordField).to.be.accessible();
  });

  it('readonly', async () => {
    passwordField.readonly = true;
    await nextUpdate(passwordField);
    await expect(passwordField).to.equalAriaSnapshot();
    await expect(passwordField).to.be.accessible();
  });

  it('required', async () => {
    passwordField.required = true;
    await nextUpdate(passwordField);
    await expect(passwordField).to.equalAriaSnapshot();
    await expect(passwordField).to.be.accessible();
  });

  it('helper', async () => {
    passwordField.helperText = 'At least 8 characters';
    await nextUpdate(passwordField);
    await expect(passwordField).to.equalAriaSnapshot();
    await expect(passwordField).to.be.accessible();
  });

  it('error', async () => {
    passwordField.errorMessage = 'Error message';
    passwordField.invalid = true;
    await aTimeout(0);
    await expect(passwordField).to.equalAriaSnapshot();
    await expect(passwordField).to.be.accessible();
  });
});
