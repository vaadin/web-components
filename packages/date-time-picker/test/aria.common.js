import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextFrame, nextRender } from '@vaadin/testing-helpers';

describe('ARIA', () => {
  let dateTimePicker, error, label, helper;

  beforeEach(async () => {
    dateTimePicker = fixtureSync(
      `<vaadin-date-time-picker helper-text="Helper text" label="Date and time"></vaadin-date-time-picker>`,
    );
    await nextRender();
    label = dateTimePicker.querySelector(':scope > [slot=label]');
    helper = dateTimePicker.querySelector(':scope > [slot=helper]');
    error = dateTimePicker.querySelector(':scope > [slot=error-message]');
  });

  it('should set role attribute to group', () => {
    expect(dateTimePicker.getAttribute('role')).to.equal('group');
  });

  it('should add label text to aria-labelledby when field is valid', () => {
    const aria = dateTimePicker.getAttribute('aria-labelledby');
    expect(aria).to.not.include(helper.id);
    expect(aria).to.not.include(error.id);
    expect(aria).to.include(label.id);
  });

  it('should add helper text to aria-describedby when field is valid', () => {
    const aria = dateTimePicker.getAttribute('aria-describedby');
    expect(aria).to.include(helper.id);
    expect(aria).to.not.include(error.id);
    expect(aria).to.not.include(label.id);
  });

  it('should add error message to aria-describedby when field is invalid', async () => {
    dateTimePicker.invalid = true;
    await nextFrame();
    await aTimeout(0);
    const aria = dateTimePicker.getAttribute('aria-describedby');
    expect(aria).to.include(helper.id);
    expect(aria).to.include(error.id);
    expect(aria).to.not.include(label.id);
  });
});
