import { expect } from '@vaadin/chai-plugins';
import { getStepResolution, truncateTime, validateTime } from '../src/vaadin-time-picker-helper.js';

describe('time-picker helper', () => {
  describe('getStepResolution', () => {
    [
      { step: undefined, resolution: 'minutes' },
      { step: null, resolution: 'minutes' },
      { step: 0, resolution: 'minutes' },
      { step: NaN, resolution: 'minutes' },
      { step: 60, resolution: 'minutes' },
      { step: 1800, resolution: 'minutes' },
      { step: 3600, resolution: 'minutes' },
      { step: '3600', resolution: 'minutes' },
      { step: 1, resolution: 'seconds' },
      { step: 20, resolution: 'seconds' },
      { step: 90, resolution: 'seconds' },
      { step: 0.001, resolution: 'milliseconds' },
      { step: 0.5, resolution: 'milliseconds' },
      { step: '0.5', resolution: 'milliseconds' },
      { step: 1.5, resolution: 'milliseconds' },
    ].forEach(({ step, resolution }) => {
      it(`should return ${resolution} for step ${step}`, () => {
        expect(getStepResolution(step)).to.equal(resolution);
      });
    });
  });

  describe('truncateTime', () => {
    const time = { hours: '07', minutes: '40', seconds: '25', milliseconds: '500' };

    it('should return undefined for undefined time', () => {
      expect(truncateTime(undefined, 'seconds')).to.be.undefined;
    });

    it('should drop seconds and milliseconds for minutes resolution', () => {
      expect(truncateTime(time, 'minutes')).to.deep.equal({
        hours: 7,
        minutes: 40,
        seconds: undefined,
        milliseconds: undefined,
      });
    });

    it('should drop milliseconds for seconds resolution', () => {
      expect(truncateTime(time, 'seconds')).to.deep.equal({
        hours: 7,
        minutes: 40,
        seconds: 25,
        milliseconds: undefined,
      });
    });

    it('should keep all parts for milliseconds resolution', () => {
      expect(truncateTime(time, 'milliseconds')).to.deep.equal({
        hours: 7,
        minutes: 40,
        seconds: 25,
        milliseconds: 500,
      });
    });

    it('should default missing parts to zero', () => {
      expect(truncateTime({ hours: '7' }, 'milliseconds')).to.deep.equal({
        hours: 7,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      });
    });

    it('should truncate to minutes for unknown resolution', () => {
      expect(truncateTime(time, 'hours')).to.deep.equal({
        hours: 7,
        minutes: 40,
        seconds: undefined,
        milliseconds: undefined,
      });
    });

    it('should not modify the given time object', () => {
      truncateTime(time, 'minutes');
      expect(time).to.deep.equal({ hours: '07', minutes: '40', seconds: '25', milliseconds: '500' });
    });
  });

  describe('validateTime', () => {
    const time = { hours: '07', minutes: '40', seconds: '25', milliseconds: '500' };

    it('should truncate to the resolution of the step', () => {
      expect(validateTime(time, 3600).seconds).to.be.undefined;
      expect(validateTime(time, 1).seconds).to.equal(25);
      expect(validateTime(time, 1).milliseconds).to.be.undefined;
      expect(validateTime(time, 0.5).milliseconds).to.equal(500);
    });
  });
});
