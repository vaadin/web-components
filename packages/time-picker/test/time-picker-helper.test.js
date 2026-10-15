import { expect } from '@vaadin/chai-plugins';
import { formatISOTime, parseISOTime, validateTime } from '../src/vaadin-time-picker-helper.js';

describe('time-picker helper', () => {
  describe('parseISOTime', () => {
    [
      { text: '7', time: { hours: '7', minutes: undefined, seconds: undefined, milliseconds: undefined } },
      { text: '07', time: { hours: '07', minutes: undefined, seconds: undefined, milliseconds: undefined } },
      { text: '7:5', time: { hours: '7', minutes: '5', seconds: undefined, milliseconds: undefined } },
      { text: '07:40', time: { hours: '07', minutes: '40', seconds: undefined, milliseconds: undefined } },
      { text: '23:59', time: { hours: '23', minutes: '59', seconds: undefined, milliseconds: undefined } },
      { text: '07:40:25', time: { hours: '07', minutes: '40', seconds: '25', milliseconds: undefined } },
      { text: '07:40:25.500', time: { hours: '07', minutes: '40', seconds: '25', milliseconds: '500' } },
    ].forEach(({ text, time }) => {
      it(`should parse ${text}`, () => {
        expect(parseISOTime(text)).to.deep.equal(time);
      });
    });

    it('should pad milliseconds with fewer than three digits', () => {
      expect(parseISOTime('07:40:25.5').milliseconds).to.equal('500');
      expect(parseISOTime('07:40:25.05').milliseconds).to.equal('050');
    });

    ['', 'foo', '24:00', '07:60', '07:40:60', '07:40:25.1234', '07-40', '7:40 PM'].forEach((text) => {
      it(`should return undefined for "${text}"`, () => {
        expect(parseISOTime(text)).to.be.undefined;
      });
    });
  });

  describe('formatISOTime', () => {
    it('should return an empty string for undefined time', () => {
      expect(formatISOTime(undefined)).to.equal('');
    });

    it('should format hours and minutes with zero padding', () => {
      expect(formatISOTime({ hours: 7, minutes: 5 })).to.equal('07:05');
    });

    it('should format string parts', () => {
      expect(formatISOTime({ hours: '7', minutes: '5' })).to.equal('07:05');
    });

    it('should default missing minutes to zero', () => {
      expect(formatISOTime({ hours: 7 })).to.equal('07:00');
    });

    it('should include seconds when defined', () => {
      expect(formatISOTime({ hours: 7, minutes: 5, seconds: 0 })).to.equal('07:05:00');
      expect(formatISOTime({ hours: 7, minutes: 5, seconds: 25 })).to.equal('07:05:25');
    });

    it('should include milliseconds with three digits when defined', () => {
      expect(formatISOTime({ hours: 7, minutes: 5, seconds: 25, milliseconds: 0 })).to.equal('07:05:25.000');
      expect(formatISOTime({ hours: 7, minutes: 5, seconds: 25, milliseconds: 5 })).to.equal('07:05:25.005');
      expect(formatISOTime({ hours: 7, minutes: 5, seconds: 25, milliseconds: 500 })).to.equal('07:05:25.500');
    });
  });

  describe('validateTime', () => {
    const time = { hours: '07', minutes: '40', seconds: '25', milliseconds: '500' };

    it('should return undefined for undefined time', () => {
      expect(validateTime(undefined, 1)).to.be.undefined;
    });

    [undefined, null, 0, NaN, 60, 1800, 3600, 7200].forEach((step) => {
      it(`should truncate to minutes for step ${step}`, () => {
        expect(validateTime(time, step)).to.deep.equal({
          hours: 7,
          minutes: 40,
          seconds: undefined,
          milliseconds: undefined,
        });
      });
    });

    [1, 20, 90].forEach((step) => {
      it(`should truncate to seconds for step ${step}`, () => {
        expect(validateTime(time, step)).to.deep.equal({
          hours: 7,
          minutes: 40,
          seconds: 25,
          milliseconds: undefined,
        });
      });
    });

    [0.001, 0.5, 1.5].forEach((step) => {
      it(`should keep milliseconds for step ${step}`, () => {
        expect(validateTime(time, step)).to.deep.equal({
          hours: 7,
          minutes: 40,
          seconds: 25,
          milliseconds: 500,
        });
      });
    });

    it('should default missing parts to zero', () => {
      expect(validateTime({ hours: '7' }, 0.5)).to.deep.equal({
        hours: 7,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      });
    });

    it('should not modify the given time object', () => {
      validateTime(time, 3600);
      expect(time).to.deep.equal({ hours: '07', minutes: '40', seconds: '25', milliseconds: '500' });
    });
  });
});
