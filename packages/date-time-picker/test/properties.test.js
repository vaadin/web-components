import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../vaadin-date-time-picker.js';
import { dispatchChange } from './helpers.js';

const fixtures = {
  default: '<vaadin-date-time-picker></vaadin-date-time-picker>',
  slotted: `
    <vaadin-date-time-picker>
      <vaadin-date-picker slot="date-picker"></vaadin-date-picker>
      <vaadin-time-picker slot="time-picker"></vaadin-time-picker>
    </vaadin-date-time-picker>
  `,
  'default-initial': `
    <vaadin-date-time-picker
      value="2019-09-16T15:00"
      min="2019-09-01T08:00"
      max="2019-09-30T22:00"
      date-placeholder="Pick a date"
      time-placeholder="Pick a time"
      step="1800"
      initial-position="1980-01-01"
      show-week-numbers
      label="Birth date and time"
      error-message="error-message"
      required
      disabled
      readonly
      auto-open-disabled
    ></vaadin-date-time-picker>
  `,
  'slotted-initial': `
    <vaadin-date-time-picker
      label="Birth date and time"
      error-message="error-message"
      required
      disabled
      readonly
      auto-open-disabled
      min="2019-09-01T08:00"
      max="2019-09-30T22:00"
    >
      <vaadin-date-picker
        slot="date-picker"
        value="2019-09-16"
        placeholder="Pick a date"
        initial-position="1980-01-01"
        show-week-numbers
      ></vaadin-date-picker>
      <vaadin-time-picker
        slot="time-picker"
        value="15:00"
        placeholder="Pick a time"
        step="1800"
      ></vaadin-time-picker>
    </vaadin-date-time-picker>
  `,
};

function getDatePicker(dateTimePicker) {
  return dateTimePicker.querySelector('[slot="date-picker"]');
}

function getTimePicker(dateTimePicker) {
  return dateTimePicker.querySelector('[slot="time-picker"]');
}

['default', 'slotted'].forEach((set) => {
  describe(`Property propagation (${set})`, () => {
    let dateTimePicker;
    let datePicker;
    let timePicker;

    beforeEach(() => {
      dateTimePicker = fixtureSync(fixtures[set]);
      datePicker = getDatePicker(dateTimePicker);
      timePicker = getTimePicker(dateTimePicker);
    });

    it('should propagate value to date and time pickers', () => {
      dateTimePicker.value = '2019-09-16T15:00';
      expect(datePicker.value).to.equal('2019-09-16');
      expect(timePicker.value).to.equal('15:00');

      dateTimePicker.value = '';
      expect(datePicker.value).to.equal('');
      expect(timePicker.value).to.equal('');
    });

    it('should propagate min to date and time pickers', () => {
      expect(datePicker.min).to.equal(dateTimePicker.__defaultDateMinMaxValue);
      expect(timePicker.min).to.equal(dateTimePicker.__defaultTimeMinValue);

      dateTimePicker.min = '2019-09-01T08:00';
      expect(datePicker.min).to.equal('2019-09-01');
      expect(timePicker.min).to.equal('00:00:00.000');

      dateTimePicker.value = '2019-09-01T12:00';
      expect(timePicker.min).to.equal('08:00');

      dateTimePicker.value = '2019-09-10T12:00';
      expect(timePicker.min).to.equal('00:00:00.000');
    });

    it('should propagate max to date and time pickers', () => {
      expect(datePicker.max).to.equal(dateTimePicker.__defaultDateMinMaxValue);
      expect(timePicker.max).to.equal(dateTimePicker.__defaultTimeMaxValue);
      dateTimePicker.max = '2019-09-30T22:00';
      expect(datePicker.max).to.equal('2019-09-30');
      expect(timePicker.max).to.equal('23:59:59.999');
      dateTimePicker.value = '2019-09-30T12:00';
      expect(timePicker.max).to.equal('22:00');
      dateTimePicker.value = '2019-09-20T12:00';
      expect(timePicker.max).to.equal('23:59:59.999');
    });

    it('should ignore value change from time picker when date change affects min of time picker', () => {
      const valueChangedSpy = sinon.spy();
      dateTimePicker.addEventListener('value-changed', valueChangedSpy);

      dateTimePicker.min = '2019-12-16T20:00';
      timePicker.value = '01:00';
      dispatchChange(timePicker);
      expect(timePicker.value).to.equal('01:00');
      expect(dateTimePicker.value).to.equal('');

      datePicker.value = '2019-12-16';
      dispatchChange(datePicker);
      expect(timePicker.value).to.equal('01:00');
      expect(dateTimePicker.value).to.equal('2019-12-16T01:00');
      expect(valueChangedSpy.calledOnce).to.be.true;
    });

    it('should ignore value change from time picker when date change affects max of time picker', () => {
      const valueChangedSpy = sinon.spy();
      dateTimePicker.addEventListener('value-changed', valueChangedSpy);

      dateTimePicker.max = '2019-12-20T10:00';
      timePicker.value = '12:00';
      dispatchChange(timePicker);
      expect(timePicker.value).to.equal('12:00');
      expect(dateTimePicker.value).to.equal('');

      datePicker.value = '2019-12-20';
      dispatchChange(datePicker);
      expect(timePicker.value).to.equal('12:00');
      expect(dateTimePicker.value).to.equal('2019-12-20T12:00');
      expect(valueChangedSpy.calledOnce).to.be.true;
    });

    it('should always propagate same day min and max to time picker (min first)', () => {
      dateTimePicker.min = '2019-09-10T08:00';
      dateTimePicker.max = '2019-09-30T22:00';

      // Default min and max when date has not been selected and min/max are on different days
      expect(timePicker.min).to.equal('00:00:00.000');
      expect(timePicker.max).to.equal('23:59:59.999');

      // Time picker always constrained by min/max when they are on the same day
      dateTimePicker.max = '2019-09-10T22:00';
      expect(timePicker.min).to.equal('08:00');
      expect(timePicker.max).to.equal('22:00');
    });

    it('should always propagate same day min and max to time picker (max first)', () => {
      // Same as previous test but setting min and max in different order so that both
      // __minChanged and __maxChanged get covered
      dateTimePicker.max = '2019-09-30T22:00';
      dateTimePicker.min = '2019-09-10T08:00';

      // Default min and max when date has not been selected and min/max are on different days
      expect(timePicker.min).to.equal('00:00:00.000');
      expect(timePicker.max).to.equal('23:59:59.999');

      // Time picker always constrained by min/max when they are on the same day
      dateTimePicker.min = '2019-09-30T08:00';
      expect(timePicker.min).to.equal('08:00');
      expect(timePicker.max).to.equal('22:00');
    });

    it('should propagate datePlaceholder to date picker', () => {
      dateTimePicker.datePlaceholder = 'Pick a date';
      expect(datePicker.placeholder).to.equal('Pick a date');
    });

    it('should propagate timePlaceholder to time picker', () => {
      dateTimePicker.timePlaceholder = 'Pick a time';
      expect(timePicker.placeholder).to.equal('Pick a time');
    });

    it('should propagate step to time picker', () => {
      dateTimePicker.step = 1800;
      expect(timePicker.step).to.equal(1800);
    });

    it('should propagate initialPosition to date picker', () => {
      dateTimePicker.initialPosition = '1980-01-01';
      expect(datePicker.initialPosition).to.equal('1980-01-01');
    });

    it('should propagate showWeekNumbers to date picker', () => {
      expect(datePicker.showWeekNumbers).to.be.not.ok;
      dateTimePicker.showWeekNumbers = true;
      expect(datePicker.showWeekNumbers).to.be.true;
    });

    it('should handle label', () => {
      dateTimePicker.label = 'Birth date and time';
      const label = dateTimePicker.querySelector(':scope > label');
      expect(label.textContent).to.equal('Birth date and time');
    });

    it('should propagate invalid to date and time pickers', () => {
      dateTimePicker.invalid = true;
      expect(datePicker.invalid).to.be.true;
      expect(timePicker.invalid).to.be.true;
    });

    it('should propagate required to date and time pickers', () => {
      dateTimePicker.required = true;
      expect(datePicker.required).to.be.true;
      expect(timePicker.required).to.be.true;
    });

    it('should handle error-message', () => {
      dateTimePicker.errorMessage = 'error-message';
      dateTimePicker.invalid = true;
      const errorMessage = dateTimePicker.querySelector(':scope > [slot=error-message]');
      expect(errorMessage.textContent).to.equal('error-message');
    });

    it('should propagate disabled to date and time pickers', () => {
      expect(datePicker.disabled).to.be.false;
      expect(timePicker.disabled).to.be.false;
      dateTimePicker.disabled = true;
      expect(datePicker.disabled).to.be.true;
      expect(timePicker.disabled).to.be.true;
    });

    it('should propagate readonly to date and time pickers', () => {
      expect(datePicker.readonly).to.be.false;
      expect(timePicker.readonly).to.be.false;
      dateTimePicker.readonly = true;
      expect(datePicker.readonly).to.be.true;
      expect(timePicker.readonly).to.be.true;
    });

    it('should propagate auto-open-disabled to date and time pickers', () => {
      expect(datePicker.autoOpenDisabled).to.be.undefined;
      expect(timePicker.autoOpenDisabled).to.be.undefined;
      dateTimePicker.autoOpenDisabled = true;
      expect(datePicker.autoOpenDisabled).to.be.true;
      expect(timePicker.autoOpenDisabled).to.be.true;
    });

    it('should have default i18n properties coming from date and time pickers', () => {
      // From date picker
      expect(dateTimePicker.i18n).to.have.property('formatDate').that.is.a('function');
      expect(dateTimePicker.i18n).to.have.property('parseDate').that.is.a('function');
      expect(dateTimePicker.i18n).to.have.property('cancel').that.is.a('string');
      // From time picker
      expect(dateTimePicker.i18n).to.have.property('formatTime').that.is.a('function');
      expect(dateTimePicker.i18n).to.have.property('parseTime').that.is.a('function');
    });

    it('should propagate i18n properties observably to date picker', () => {
      dateTimePicker.set('i18n.cancel', 'Peruuta');
      expect(datePicker.i18n.cancel).to.equal('Peruuta');
    });
  });

  describe(`Initial property values (${set})`, () => {
    let dateTimePicker;
    let datePicker;
    let timePicker;

    // No need for "beforeEach" to recreate the fixture before every test since
    // these tests do not modify the state but only check the initial state.
    before(() => {
      dateTimePicker = fixtureSync(fixtures[`${set}-initial`]);
      datePicker = getDatePicker(dateTimePicker);
      timePicker = getTimePicker(dateTimePicker);
    });

    it('should have initial value for errorMessage', () => {
      expect(dateTimePicker.errorMessage).to.equal('error-message');
    });

    it('should have initial value for required', () => {
      expect(dateTimePicker.required).to.be.true;
      expect(datePicker.required).to.be.true;
      expect(timePicker.required).to.be.true;
    });

    it('should have initial value for disabled', () => {
      expect(dateTimePicker.disabled).to.be.true;
      expect(datePicker.disabled).to.be.true;
      expect(timePicker.disabled).to.be.true;
    });

    it('should have initial value for readonly', () => {
      expect(dateTimePicker.readonly).to.be.true;
      expect(datePicker.readonly).to.be.true;
      expect(timePicker.readonly).to.be.true;
    });

    it('should have initial value for auto-open-disabled', () => {
      expect(dateTimePicker.autoOpenDisabled).to.be.true;
      expect(datePicker.autoOpenDisabled).to.be.true;
      expect(timePicker.autoOpenDisabled).to.be.true;
    });

    it('should have initial value for value property', () => {
      expect(dateTimePicker.value).to.equal('2019-09-16T15:00');
      expect(datePicker.value).to.equal('2019-09-16');
      expect(timePicker.value).to.equal('15:00');
    });

    it('should have initial value for min', () => {
      expect(dateTimePicker.min).to.equal('2019-09-01T08:00');
      expect(datePicker.min).to.equal('2019-09-01');
      expect(timePicker.min).to.equal('00:00:00.000');
    });

    it('should have initial value for max', () => {
      expect(dateTimePicker.max).to.equal('2019-09-30T22:00');
      expect(datePicker.max).to.equal('2019-09-30');
      expect(timePicker.max).to.equal('23:59:59.999');
    });

    it('should have initial value for datePlaceholder', () => {
      expect(dateTimePicker.datePlaceholder).to.equal('Pick a date');
      expect(datePicker.placeholder).to.equal('Pick a date');
    });

    it('should have initial value for timePlaceholder', () => {
      expect(dateTimePicker.timePlaceholder).to.equal('Pick a time');
      expect(timePicker.placeholder).to.equal('Pick a time');
    });

    it('should have initial value for step', () => {
      expect(dateTimePicker.step).to.equal(1800);
      expect(timePicker.step).to.equal(1800);
    });

    it('should have initial value for initialPosition', () => {
      expect(dateTimePicker.initialPosition).to.equal('1980-01-01');
      expect(datePicker.initialPosition).to.equal('1980-01-01');
    });

    it('should have initial value for showWeekNumbers', () => {
      expect(dateTimePicker.showWeekNumbers).to.be.true;
      expect(datePicker.showWeekNumbers).to.be.true;
    });

    it('should have initial value for label', () => {
      expect(dateTimePicker.label).to.equal('Birth date and time');
    });
  });
});
