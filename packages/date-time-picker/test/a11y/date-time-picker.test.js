import { expect } from '@vaadin/chai-plugins';
import { aTimeout, fixtureSync, nextRender, nextUpdate } from '@vaadin/testing-helpers';
import '../../src/vaadin-date-time-picker.js';

describe('vaadin-date-time-picker', () => {
  let dateTimePicker;

  beforeEach(async () => {
    dateTimePicker = fixtureSync('<vaadin-date-time-picker label="Meeting"></vaadin-date-time-picker>');
    await nextRender();
  });

  it('default', async () => {
    await expect(dateTimePicker).to.equalA11yTreeSnapshot();
    await expect(dateTimePicker).to.be.accessible();
  });

  it('value', async () => {
    dateTimePicker.value = '2020-02-15T10:30';
    await nextUpdate(dateTimePicker);
    await expect(dateTimePicker).to.equalA11yTreeSnapshot();
    await expect(dateTimePicker).to.be.accessible();
  });

  it('placeholder', async () => {
    dateTimePicker.datePlaceholder = 'Date';
    dateTimePicker.timePlaceholder = 'Time';
    await nextUpdate(dateTimePicker);
    await expect(dateTimePicker).to.equalA11yTreeSnapshot();
    await expect(dateTimePicker).to.be.accessible();
  });

  it('date and time labels', async () => {
    dateTimePicker.i18n = { dateLabel: 'Date', timeLabel: 'Time' };
    await nextUpdate(dateTimePicker);
    await expect(dateTimePicker).to.equalA11yTreeSnapshot();
    await expect(dateTimePicker).to.be.accessible();
  });

  it('disabled', async () => {
    dateTimePicker.disabled = true;
    await nextUpdate(dateTimePicker);
    await expect(dateTimePicker).to.equalA11yTreeSnapshot();
    await expect(dateTimePicker).to.be.accessible();
  });

  it('readonly', async () => {
    dateTimePicker.readonly = true;
    await nextUpdate(dateTimePicker);
    await expect(dateTimePicker).to.equalA11yTreeSnapshot();
    await expect(dateTimePicker).to.be.accessible();
  });

  it('required', async () => {
    dateTimePicker.required = true;
    await nextUpdate(dateTimePicker);
    await expect(dateTimePicker).to.equalA11yTreeSnapshot();
    // `role="group"` does not support `aria-required`, but the group keeps it on purpose,
    // because VoiceOver and JAWS announce it.
    // See https://github.com/vaadin/web-components/issues/2931
    await expect(dateTimePicker).to.be.accessible({ ignoredRules: ['aria-allowed-attr'] });
  });

  it('helper', async () => {
    dateTimePicker.helperText = 'Pick a date and time';
    await nextUpdate(dateTimePicker);
    await expect(dateTimePicker).to.equalA11yTreeSnapshot();
    await expect(dateTimePicker).to.be.accessible();
  });

  it('error', async () => {
    dateTimePicker.errorMessage = 'Error message';
    dateTimePicker.invalid = true;
    await aTimeout(0);
    await expect(dateTimePicker).to.equalA11yTreeSnapshot();
    await expect(dateTimePicker).to.be.accessible();
  });
});
