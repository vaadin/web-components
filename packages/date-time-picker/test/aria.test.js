import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../vaadin-date-time-picker.js';

describe('ARIA', () => {
  let dateTimePicker, label, helper;

  beforeEach(() => {
    dateTimePicker = fixtureSync(
      `<vaadin-date-time-picker helper-text="Helper text" label="Date and time"></vaadin-date-time-picker>`
    );
    label = dateTimePicker.querySelector(':scope > [slot=label]');
    helper = dateTimePicker.querySelector(':scope > [slot=helper]');
  });

  it('should set role attribute to group', () => {
    expect(dateTimePicker.getAttribute('role')).to.equal('group');
  });

  it('should set aria-labelledby attribute on the host', () => {
    expect(dateTimePicker.getAttribute('aria-labelledby')).to.equal([label.id, helper.id].join(' '));
  });
});
