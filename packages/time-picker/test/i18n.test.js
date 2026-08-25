import { expect } from '@vaadin/chai-plugins';
import { enter, fixtureSync, nextRender } from '@vaadin/testing-helpers';
import sinon from 'sinon';
import '../src/vaadin-time-picker.js';
import { setInputValue, strictAmPmI18n } from './helpers.js';

describe('i18n', () => {
  let timePicker, inputElement;

  beforeEach(async () => {
    timePicker = fixtureSync(`<vaadin-time-picker></vaadin-time-picker>`);
    await nextRender();
    inputElement = timePicker.inputElement;
  });

  it('should fallback to default functions if none are provided', () => {
    timePicker.i18n = {};

    timePicker.value = '12:00';
    expect(inputElement.value).to.equal('12:00');
    expect(timePicker.value).to.equal('12:00');
  });

  describe('parseTime', () => {
    it('should use custom parser if that exists', () => {
      timePicker.i18n = { parseTime: sinon.stub().returns({ hours: 12, minutes: 0, seconds: 0 }) };
      timePicker.value = '12';
      expect(timePicker.i18n.parseTime.args[0][0]).to.be.equal('12:00');
      expect(timePicker.value).to.be.equal('12:00');
    });

    it('should commit the value when the custom parser returns stripped seconds', () => {
      // The step defaults to minute precision, so the seconds are stripped
      // from the value, while the custom parser keeps returning them.
      timePicker.i18n = { parseTime: () => ({ hours: 12, minutes: 0, seconds: 0 }) };
      setInputValue(timePicker, 'noon');
      enter(inputElement);
      expect(timePicker.value).to.be.equal('12:00');
    });

    it('should not modify the object returned by the custom parser', () => {
      const parsed = { hours: 8, minutes: 0, seconds: 0, milliseconds: 0 };
      timePicker.i18n = { formatTime: strictAmPmI18n.formatTime, parseTime: () => parsed };
      setInputValue(timePicker, '8:00 AM');
      enter(inputElement);
      expect(parsed).to.deep.equal({ hours: 8, minutes: 0, seconds: 0, milliseconds: 0 });
    });

    it('should not fail when the custom parser returns a frozen object', () => {
      timePicker.i18n = {
        formatTime: strictAmPmI18n.formatTime,
        parseTime: () => Object.freeze({ hours: 8, minutes: 0, seconds: 0, milliseconds: 0 }),
      };
      setInputValue(timePicker, '8:00 AM');
      enter(inputElement);
      expect(timePicker.value).to.be.equal('08:00');
    });
  });

  describe('formatTime', () => {
    it('should use custom formatter if that exists', () => {
      timePicker.i18n = {
        formatTime: sinon.stub().withArgs({ hours: 12, minutes: 0 }).returns('12:00 AM'),
        parseTime: sinon.stub().returns({ hours: 12, minutes: 0, seconds: 0 }),
      };
      timePicker.value = '12';
      expect(timePicker.value).to.be.equal('12:00');
      expect(inputElement.value).to.be.equal('12:00 AM');
    });

    it('should accept custom time formatter', () => {
      timePicker.i18n = {
        formatTime: sinon.stub().returns('1200'),
        parseTime: sinon.stub().withArgs('1200').returns({ hours: 12, minutes: 0 }),
      };
      timePicker.value = '12:00';
      expect(inputElement.value).to.equal('1200');
      expect(timePicker.value).to.equal('12:00');
    });
  });

  describe('reassigned', () => {
    it('should align values of dropdown and input when i18n was reassigned', () => {
      timePicker.value = '12';
      timePicker.i18n = {
        formatTime: sinon.stub().withArgs({ hours: 12, minutes: 0 }).returns('12:00 AM'),
        parseTime: sinon.stub().returns({ hours: 12, minutes: 0, seconds: 0 }),
      };
      expect(inputElement.value).to.be.equal('12:00 AM');
      expect(timePicker.value).to.be.equal('12:00');
    });

    it('should keep the value when a custom i18n is set after the value', () => {
      timePicker.value = '08:00';
      timePicker.i18n = strictAmPmI18n;
      expect(timePicker.value).to.be.equal('08:00');
      expect(inputElement.value).to.be.equal('8:00 AM');
    });

    ['min', 'max', 'step'].forEach((property) => {
      const value = property === 'step' ? 1800 : property === 'min' ? '01:00' : '23:00';

      it(`should keep the value on ${property} change with a custom i18n`, () => {
        timePicker.i18n = strictAmPmI18n;
        timePicker.value = '08:00';
        timePicker[property] = value;
        expect(timePicker.value).to.be.equal('08:00');
        expect(inputElement.value).to.be.equal('8:00 AM');
      });
    });
  });
});
