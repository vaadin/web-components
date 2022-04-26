import { expect } from '@esm-bundle/chai';
import { aTimeout, fixtureSync } from '@vaadin/testing-helpers';
import '../vaadin-date-time-picker.js';

describe('ARIA', () => {
  let dateTimePicker, error, label, helper;

  beforeEach(() => {
    dateTimePicker = fixtureSync(
      `<vaadin-date-time-picker helper-text="Helper text" label="Date and time"></vaadin-date-time-picker>`,
    );
    label = dateTimePicker.querySelector(':scope > [slot=label]');
    helper = dateTimePicker.querySelector(':scope > [slot=helper]');
    error = dateTimePicker.querySelector(':scope > [slot=error-message]');
  });

  it('should set role attribute to group', () => {
    expect(dateTimePicker.getAttribute('role')).to.equal('group');
  });

  it('should add label and helper text to aria-labelledby when field is valid', () => {
    const aria = dateTimePicker.getAttribute('aria-labelledby');
    expect(aria).to.include(helper.id);
    expect(aria).to.not.include(error.id);
    expect(aria).to.include(label.id);
  });

  it('should add error message to aria-labelledby when field is invalid', async () => {
    dateTimePicker.invalid = true;
    await aTimeout(0);
    const aria = dateTimePicker.getAttribute('aria-labelledby');
    expect(aria).to.include(helper.id);
    expect(aria).to.include(error.id);
    expect(aria).to.include(label.id);
  });
});
