import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '../../src/vaadin-text-field.js';

describe('vaadin-text-field', () => {
  let textField;

  beforeEach(async () => {
    textField = fixtureSync('<vaadin-text-field label="Name"></vaadin-text-field>');
    await nextUpdate(textField);
  });

  it('default', async () => {
    await expect(textField).to.equalA11yTreeSnapshot();
    await expect(textField).to.be.accessible();
  });

  it('value', async () => {
    textField.value = 'John';
    await nextUpdate(textField);
    await expect(textField).to.equalA11yTreeSnapshot();
    await expect(textField).to.be.accessible();
  });

  it('placeholder', async () => {
    textField.placeholder = 'Type here';
    await nextUpdate(textField);
    await expect(textField).to.equalA11yTreeSnapshot();
    await expect(textField).to.be.accessible();
  });

  it('disabled', async () => {
    textField.disabled = true;
    await nextUpdate(textField);
    await expect(textField).to.equalA11yTreeSnapshot();
    await expect(textField).to.be.accessible();
  });

  it('readonly', async () => {
    textField.readonly = true;
    await nextUpdate(textField);
    await expect(textField).to.equalA11yTreeSnapshot();
    await expect(textField).to.be.accessible();
  });

  it('required', async () => {
    textField.required = true;
    await nextUpdate(textField);
    await expect(textField).to.equalA11yTreeSnapshot();
    await expect(textField).to.be.accessible();
  });

  it('helper', async () => {
    textField.helperText = 'Helper text';
    await nextUpdate(textField);
    await expect(textField).to.equalA11yTreeSnapshot();
    await expect(textField).to.be.accessible();
  });

  it('error', async () => {
    textField.errorMessage = 'Error message';
    textField.invalid = true;
    await aTimeout(0);
    await expect(textField).to.equalA11yTreeSnapshot();
    await expect(textField).to.be.accessible();
  });

  it('clear button', async () => {
    textField.clearButtonVisible = true;
    textField.value = 'John';
    await nextUpdate(textField);
    await expect(textField).to.equalA11yTreeSnapshot();
    await expect(textField).to.be.accessible();
  });

  it('prefix and suffix', async () => {
    textField = fixtureSync(`
      <vaadin-text-field label="Price">
        <span slot="prefix">$</span>
        <span slot="suffix">USD</span>
      </vaadin-text-field>
    `);
    await nextUpdate(textField);
    await expect(textField).to.equalA11yTreeSnapshot();
    await expect(textField).to.be.accessible();
  });
});
