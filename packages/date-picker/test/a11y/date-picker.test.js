import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextUpdate } from '@vaadin/testing-helpers';
import '../not-animated-styles.css';
import '../../src/vaadin-date-picker.js';
import { open } from '../helpers.js';

describe('vaadin-date-picker', () => {
  let datePicker;

  beforeEach(async () => {
    datePicker = fixtureSync('<vaadin-date-picker label="Start date"></vaadin-date-picker>');
    await nextUpdate(datePicker);
  });

  it('default', async () => {
    await expect(datePicker).to.equalA11yTreeSnapshot();
    await expect(datePicker).to.be.accessible();
  });

  it('value', async () => {
    datePicker.value = '2020-02-15';
    await nextUpdate(datePicker);
    await expect(datePicker).to.equalA11yTreeSnapshot();
    await expect(datePicker).to.be.accessible();
  });

  it('placeholder', async () => {
    datePicker.placeholder = 'Pick a date';
    await nextUpdate(datePicker);
    await expect(datePicker).to.equalA11yTreeSnapshot();
    await expect(datePicker).to.be.accessible();
  });

  it('disabled', async () => {
    datePicker.disabled = true;
    await nextUpdate(datePicker);
    await expect(datePicker).to.equalA11yTreeSnapshot();
    await expect(datePicker).to.be.accessible();
  });

  it('readonly', async () => {
    datePicker.readonly = true;
    await nextUpdate(datePicker);
    await expect(datePicker).to.equalA11yTreeSnapshot();
    await expect(datePicker).to.be.accessible();
  });

  it('required', async () => {
    datePicker.required = true;
    await nextUpdate(datePicker);
    await expect(datePicker).to.equalA11yTreeSnapshot();
    await expect(datePicker).to.be.accessible();
  });

  it('helper', async () => {
    datePicker.helperText = 'Format: DD/MM/YYYY';
    await nextUpdate(datePicker);
    await expect(datePicker).to.equalA11yTreeSnapshot();
    await expect(datePicker).to.be.accessible();
  });

  it('error', async () => {
    datePicker.errorMessage = 'Error message';
    datePicker.invalid = true;
    await aTimeout(0);
    await expect(datePicker).to.equalA11yTreeSnapshot();
    await expect(datePicker).to.be.accessible();
  });

  it('opened', async () => {
    // A value in the past, so that the visible month does not include today.
    datePicker.value = '2020-02-15';
    await open(datePicker);
    await expect(datePicker).to.equalA11yTreeSnapshot();
    await expect(datePicker).to.be.accessible({
      // The weekday headers are hidden from assistive technologies on purpose,
      // because the date cells have full labels, so axe reports an empty header row.
      ignoredRules: ['aria-required-children'],
      // Known issue: the expanded combobox input has no `aria-controls`.
      expectedViolations: ['aria-required-attr'],
    });
  });
});
