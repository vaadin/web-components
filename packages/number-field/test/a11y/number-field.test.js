import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '../../src/vaadin-number-field.js';

describe('vaadin-number-field', () => {
  let numberField;

  beforeEach(async () => {
    numberField = fixtureSync('<vaadin-number-field label="Quantity"></vaadin-number-field>');
    await nextUpdate(numberField);
  });

  it('default', async () => {
    await expect(numberField).to.equalA11yTreeSnapshot();
    await expect(numberField).to.be.accessible();
  });

  it('value', async () => {
    numberField.value = '5';
    await nextUpdate(numberField);
    await expect(numberField).to.equalA11yTreeSnapshot();
    await expect(numberField).to.be.accessible();
  });

  it('min and max', async () => {
    numberField.min = 1;
    numberField.max = 10;
    numberField.value = '5';
    await nextUpdate(numberField);
    await expect(numberField).to.equalA11yTreeSnapshot();
    await expect(numberField).to.be.accessible();
  });

  it('step buttons visible', async () => {
    numberField.stepButtonsVisible = true;
    numberField.value = '5';
    await nextUpdate(numberField);
    await expect(numberField).to.equalA11yTreeSnapshot();
    await expect(numberField).to.be.accessible();
  });

  it('disabled', async () => {
    numberField.disabled = true;
    await nextUpdate(numberField);
    await expect(numberField).to.equalA11yTreeSnapshot();
    await expect(numberField).to.be.accessible();
  });

  it('readonly', async () => {
    numberField.readonly = true;
    await nextUpdate(numberField);
    await expect(numberField).to.equalA11yTreeSnapshot();
    await expect(numberField).to.be.accessible();
  });

  it('required', async () => {
    numberField.required = true;
    await nextUpdate(numberField);
    await expect(numberField).to.equalA11yTreeSnapshot();
    await expect(numberField).to.be.accessible();
  });

  it('helper', async () => {
    numberField.helperText = 'Helper text';
    await nextUpdate(numberField);
    await expect(numberField).to.equalA11yTreeSnapshot();
    await expect(numberField).to.be.accessible();
  });

  it('error', async () => {
    numberField.errorMessage = 'Error message';
    numberField.invalid = true;
    await aTimeout(0);
    await expect(numberField).to.equalA11yTreeSnapshot();
    await expect(numberField).to.be.accessible();
  });
});
